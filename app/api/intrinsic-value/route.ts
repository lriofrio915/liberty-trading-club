// app/api/intrinsic-value/route.ts

import { NextResponse } from "next/server";

// Interfaces para los datos que esperamos de nuestras APIs de scraping
interface KeyStatisticsData {
  metrics: {
    forwardPE?: number[];
    enterpriseValue?: number[];
    [key: string]: number[] | undefined;
  };
}
interface IncomeStatementData {
  metrics: {
    totalRevenue: number[];
    ebitda: number[];
    ebit: number[];
    netIncome: number[];
  };
}
interface FreeCashFlowData {
  metrics: { freeCashFlow: number[] };
}
interface BalanceSheetData {
  metrics: {
    totalDebt: number[];
    cashAndCashEquivalents: number[];
    ordinarySharesNumber: number[];
    netDebt: number[];
  };
}

// Interfaz para el cuerpo de la petición POST que enviaremos desde el frontend
interface IntrinsicValueRequestBody {
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

export async function POST(request: Request) {
  try {
    const body: IntrinsicValueRequestBody = await request.json();
    const { ticker, targets, estimates } = body;

    const baseUrl = new URL(request.url).origin;

    // 1. Obtener todos los datos base LTM y NTM necesarios en paralelo
    const [keyStatsRes, incomeStatementRes, freeCashFlowRes, balanceSheetRes] =
      await Promise.all([
        fetch(`${baseUrl}/api/key-statistics?ticker=${ticker}`),
        fetch(`${baseUrl}/api/income-statement?ticker=${ticker}`),
        fetch(`${baseUrl}/api/free-cash-flow?ticker=${ticker}`),
        fetch(`${baseUrl}/api/balance-sheet?ticker=${ticker}`),
      ]);

    if (
      !keyStatsRes.ok ||
      !incomeStatementRes.ok ||
      !freeCashFlowRes.ok ||
      !balanceSheetRes.ok
    ) {
      throw new Error(
        "No se pudieron obtener todos los datos financieros base."
      );
    }

    const keyStatsData: KeyStatisticsData = await keyStatsRes.json();
    const incomeStatementData: IncomeStatementData =
      await incomeStatementRes.json();
    const freeCashFlowData: FreeCashFlowData = await freeCashFlowRes.json();
    const balanceSheetData: BalanceSheetData = await balanceSheetRes.json();

    // 2. Extraer y calcular valores LTM (base para 2025e)
    const ltmNetIncome = (incomeStatementData.metrics.netIncome || [])[0] || 0;
    const ltmRevenue = (incomeStatementData.metrics.totalRevenue || [])[0] || 0;
    const ltmEBITDA = (incomeStatementData.metrics.ebitda || [])[0] || 0;
    const ltmEBIT = (incomeStatementData.metrics.ebit || [])[0] || 0;
    const ltmFCF = (freeCashFlowData.metrics.freeCashFlow || [])[0] || 0;
    const sharesOutstanding =
      (balanceSheetData.metrics.ordinarySharesNumber || [])[0] || 1;
    const ltmNetDebt = (balanceSheetData.metrics.netDebt || [])[0] || 0;
    const ltmEPS = sharesOutstanding > 0 ? ltmNetIncome / sharesOutstanding : 0;

    // --- AÑADIDO: Extraer y calcular valores NTM ---
    const forwardEPS = (keyStatsData.metrics.forwardPE || [])[0] || 0;

    // 3. Proyectar métricas para 2026e usando las estimaciones del usuario
    const projectedRevenue2026 = ltmRevenue * (1 + estimates.salesGrowth / 100);
    const projectedEBIT2026 =
      projectedRevenue2026 * (estimates.ebitMargin / 100);

    const ebitdaToEbitRatio = ltmEBIT > 0 ? ltmEBITDA / ltmEBIT : 1.1;
    const fcfToEbitRatio = ltmEBIT > 0 ? ltmFCF / ltmEBIT : 0.8;

    const projectedEBITDA2026 = projectedEBIT2026 * ebitdaToEbitRatio;
    const projectedFCF2026 = projectedEBIT2026 * fcfToEbitRatio;
    const projectedShares2026 =
      sharesOutstanding * (1 + estimates.sharesIncrease / 100);
    const projectedEPS2026 =
      projectedShares2026 > 0
        ? (projectedEBIT2026 * (ltmEBIT > 0 ? ltmNetIncome / ltmEBIT : 0.7)) /
          projectedShares2026
        : 0;

    // --- AÑADIDO: Proyectar métricas para NTM ---
    const projectedRevenueNTM =
      ltmRevenue * (1 + estimates.salesGrowth / 100 / 2); // Crecimiento a 6 meses
    const projectedEBITNTM = projectedRevenueNTM * (estimates.ebitMargin / 100);
    const projectedEBITDANTM = projectedEBITNTM * ebitdaToEbitRatio;
    const projectedFCFNTM = projectedEBITNTM * fcfToEbitRatio;

    // 4. Construir la respuesta final
    const zeroYear = { per_ex_cash: 0, ev_fcf: 0, ev_ebitda: 0, ev_ebit: 0 };

    const price2025e = {
      per_ex_cash: targets.per * ltmEPS,
      ev_ebitda:
        sharesOutstanding > 0
          ? (targets.ev_ebitda * ltmEBITDA - ltmNetDebt) / sharesOutstanding
          : 0,
      ev_ebit:
        sharesOutstanding > 0
          ? (targets.ev_ebit * ltmEBIT - ltmNetDebt) / sharesOutstanding
          : 0,
      ev_fcf:
        sharesOutstanding > 0
          ? (targets.ev_fcf * ltmFCF - ltmNetDebt) / sharesOutstanding
          : 0,
    };

    const price2026e = {
      per_ex_cash: targets.per * projectedEPS2026,
      ev_ebitda:
        projectedShares2026 > 0
          ? (targets.ev_ebitda * projectedEBITDA2026 - ltmNetDebt) /
            projectedShares2026
          : 0,
      ev_ebit:
        projectedShares2026 > 0
          ? (targets.ev_ebit * projectedEBIT2026 - ltmNetDebt) /
            projectedShares2026
          : 0,
      ev_fcf:
        projectedShares2026 > 0
          ? (targets.ev_fcf * projectedFCF2026 - ltmNetDebt) /
            projectedShares2026
          : 0,
    };

    const ntmPrice = {
      per_ex_cash: targets.per * forwardEPS,
      ev_ebitda:
        sharesOutstanding > 0
          ? (targets.ev_ebitda * projectedEBITDANTM - ltmNetDebt) /
            sharesOutstanding
          : 0,
      ev_ebit:
        sharesOutstanding > 0
          ? (targets.ev_ebit * projectedEBITNTM - ltmNetDebt) /
            sharesOutstanding
          : 0,
      ev_fcf:
        sharesOutstanding > 0
          ? (targets.ev_fcf * projectedFCFNTM - ltmNetDebt) / sharesOutstanding
          : 0,
    };

    const finalResponse = {
      "2022e": zeroYear,
      "2023e": zeroYear,
      "2024e": zeroYear,
      "2025e": price2025e,
      "2026e": price2026e,
      ntm: ntmPrice,
    };

    return NextResponse.json({ success: true, results: finalResponse });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Un error desconocido ocurrió.";
    console.error("Error en API /intrinsic-value:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
