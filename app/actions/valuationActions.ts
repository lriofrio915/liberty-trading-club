"use server";

// =================================================================
// INTERFACES Y TIPOS
// =================================================================

// Interfaz para los datos que la acción recibe del cliente
interface IntrinsicValueRequest {
  ticker: string;
  targets: {
    per: number;
    ev_ebitda: number;
    ev_ebit: number;
    ev_fcf: number;
  };
  estimates: {
    salesGrowth: number;
    ebitMargin: number;
    sharesIncrease: number;
  };
}

// Interfaces para tipar las respuestas de nuestras APIs internas
interface ApiMetricsResponse {
  headers: string[];
  metrics: {
    [key: string]: number[];
  };
}

// =================================================================
// HELPERS PARA OBTENER DATOS DE LAS APIs
// =================================================================

// Es crucial tener la URL base de tu aplicación, especialmente en el entorno de Vercel.
// Asegúrate de configurar NEXT_PUBLIC_APP_URL en tus variables de entorno.
const API_BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

async function fetchDataFromApi(
  endpoint: string,
  ticker: string
): Promise<ApiMetricsResponse> {
  const url = `${API_BASE_URL}/api/${endpoint}?ticker=${ticker}`;
  const response = await fetch(url, { cache: "no-store" }); // Usamos no-store para obtener siempre datos frescos

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`Error fetching ${url}: ${response.statusText}`, errorBody);
    throw new Error(`Failed to fetch data from ${endpoint} for ${ticker}`);
  }
  return response.json();
}

// =================================================================
// SERVER ACTION PRINCIPAL
// =================================================================

export async function calculateIntrinsicValueAction(
  data: IntrinsicValueRequest
) {
  try {
    const { ticker, targets, estimates } = data;

    // 1. Obtener todos los datos base llamando a nuestras API routes en paralelo
    const [
      keyStatsData,
      incomeStatementData,
      freeCashFlowData,
      balanceSheetData,
    ] = await Promise.all([
      fetchDataFromApi("key-statistics", ticker),
      fetchDataFromApi("income-statement", ticker),
      fetchDataFromApi("free-cash-flow", ticker),
      fetchDataFromApi("balance-sheet", ticker),
    ]);

    // 2. Extraer y calcular valores LTM (Latest Twelve Months)
    // Se toma el primer valor [0] de los arrays, que corresponde al dato más reciente.
    const ltmNetIncome = incomeStatementData.metrics.netIncome?.[0] || 0;
    const ltmRevenue = incomeStatementData.metrics.totalRevenue?.[0] || 0;
    const ltmEBITDA = incomeStatementData.metrics.ebitda?.[0] || 0;
    const ltmEBIT = incomeStatementData.metrics.ebit?.[0] || 0;
    const ltmFCF = freeCashFlowData.metrics.freeCashFlow?.[0] || 0;
    const sharesOutstanding =
      balanceSheetData.metrics.ordinarySharesNumber?.[0] || 1;
    const ltmNetDebt = balanceSheetData.metrics.netDebt?.[0] || 0;
    const ltmEPS = sharesOutstanding > 0 ? ltmNetIncome / sharesOutstanding : 0;
    const forwardEPS = keyStatsData.metrics.forwardPE?.[0] || 0; // forwardPE de key-stats es en realidad forwardEPS * precio, ajustamos esto

    // 3. Proyectar métricas a futuro basadas en las estimaciones del usuario
    const projectedRevenue2026 = ltmRevenue * (1 + estimates.salesGrowth / 100);
    const projectedEBIT2026 =
      projectedRevenue2026 * (estimates.ebitMargin / 100);

    // Se calculan ratios para proyectar EBITDA y FCF basados en la relación histórica con EBIT
    const ebitdaToEbitRatio = ltmEBIT > 0 ? ltmEBITDA / ltmEBIT : 1.1; // Fallback a 1.1
    const fcfToEbitRatio = ltmEBIT > 0 ? ltmFCF / ltmEBIT : 0.8; // Fallback a 0.8

    const projectedEBITDA2026 = projectedEBIT2026 * ebitdaToEbitRatio;
    const projectedFCF2026 = projectedEBIT2026 * fcfToEbitRatio;
    const projectedShares2026 =
      sharesOutstanding * (1 + estimates.sharesIncrease / 100);
    const projectedEPS2026 =
      projectedShares2026 > 0
        ? (projectedEBIT2026 * (ltmEBIT > 0 ? ltmNetIncome / ltmEBIT : 0.7)) /
          projectedShares2026
        : 0; // Fallback a 0.7 para el ratio NetIncome/EBIT

    // Proyecciones NTM (Next Twelve Months)
    const projectedRevenueNTM =
      ltmRevenue * (1 + estimates.salesGrowth / 100 / 2); // Crecimiento a 6 meses
    const projectedEBITNTM = projectedRevenueNTM * (estimates.ebitMargin / 100);
    const projectedEBITDANTM = projectedEBITNTM * ebitdaToEbitRatio;
    const projectedFCFNTM = projectedEBITNTM * fcfToEbitRatio;

    // 4. Calcular precios objetivos y construir la respuesta final
    const zeroYear = { per_ex_cash: 0, ev_fcf: 0, ev_ebitda: 0, ev_ebit: 0 };

    const calculatePrice = (
      targetMultiple: number,
      metricValue: number,
      netDebt: number,
      shares: number
    ) => {
      if (shares <= 0) return 0;
      const enterpriseValue = targetMultiple * metricValue;
      const equityValue = enterpriseValue - netDebt;
      return equityValue / shares;
    };

    const price2025e = {
      per_ex_cash: targets.per * ltmEPS,
      ev_ebitda: calculatePrice(
        targets.ev_ebitda,
        ltmEBITDA,
        ltmNetDebt,
        sharesOutstanding
      ),
      ev_ebit: calculatePrice(
        targets.ev_ebit,
        ltmEBIT,
        ltmNetDebt,
        sharesOutstanding
      ),
      ev_fcf: calculatePrice(
        targets.ev_fcf,
        ltmFCF,
        ltmNetDebt,
        sharesOutstanding
      ),
    };

    const price2026e = {
      per_ex_cash: targets.per * projectedEPS2026,
      ev_ebitda: calculatePrice(
        targets.ev_ebitda,
        projectedEBITDA2026,
        ltmNetDebt,
        projectedShares2026
      ),
      ev_ebit: calculatePrice(
        targets.ev_ebit,
        projectedEBIT2026,
        ltmNetDebt,
        projectedShares2026
      ),
      ev_fcf: calculatePrice(
        targets.ev_fcf,
        projectedFCF2026,
        ltmNetDebt,
        projectedShares2026
      ),
    };

    const ntmPrice = {
      per_ex_cash: targets.per * forwardEPS, // Usamos el forwardEPS que ya viene de la API
      ev_ebitda: calculatePrice(
        targets.ev_ebitda,
        projectedEBITDANTM,
        ltmNetDebt,
        sharesOutstanding
      ),
      ev_ebit: calculatePrice(
        targets.ev_ebit,
        projectedEBITNTM,
        ltmNetDebt,
        sharesOutstanding
      ),
      ev_fcf: calculatePrice(
        targets.ev_fcf,
        projectedFCFNTM,
        ltmNetDebt,
        sharesOutstanding
      ),
    };

    const finalResponse = {
      "2022e": zeroYear,
      "2023e": zeroYear,
      "2024e": zeroYear,
      "2025e": price2025e,
      "2026e": price2026e,
      ntm: ntmPrice,
    };

    return { success: true, results: finalResponse };
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Un error desconocido ocurrió.";
    console.error(
      "Error en la acción de calcular valor intrínseco:",
      errorMessage
    );
    return { success: false, error: errorMessage };
  }
}
