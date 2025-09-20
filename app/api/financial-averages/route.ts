// app/api/financial-averages/route.ts
import { NextResponse } from "next/server";

interface IncomeStatementData {
  metrics: {
    totalRevenue: number[];
    ebit: number[];
    pretaxIncome: number[];
    taxRateForCalcs: number[]; // Este es 'Tax Provision'
    basicAverageShares: number[];
  };
}

// --- FUNCIONES DE CÁLCULO REFACTORIZADAS Y CON LOGS ---

const calculateAverageEbitMargin = (
  ebits: number[],
  revenues: number[]
): string => {
  console.log("\n--- Calculando Margen EBIT Promedio ---");
  console.log("EBITs recibidos:", ebits);
  console.log("Revenues recibidos:", revenues);

  // Ignoramos el TTM que es el primer elemento
  const fiscalYearEbits = ebits.slice(1);
  const fiscalYearRevenues = revenues.slice(1);
  console.log("Datos de EBIT (solo años fiscales):", fiscalYearEbits);
  console.log("Datos de Revenue (solo años fiscales):", fiscalYearRevenues);

  if (fiscalYearEbits.length === 0 || fiscalYearRevenues.length === 0) {
    console.log(
      "No hay suficientes datos para calcular el margen EBIT. Saliendo."
    );
    return "N/A";
  }

  const ebitMargins: number[] = [];
  const relevantDataLength = Math.min(
    fiscalYearEbits.length,
    fiscalYearRevenues.length,
    4
  ); // Usamos hasta 4 años

  for (let i = 0; i < relevantDataLength; i++) {
    const ebit = fiscalYearEbits[i];
    const revenue = fiscalYearRevenues[i];
    if (revenue && revenue !== 0) {
      const margin = (ebit / revenue) * 100;
      ebitMargins.push(margin);
    }
  }

  console.log("Márgenes EBIT calculados por año:", ebitMargins);

  if (ebitMargins.length === 0) {
    console.log("No se pudieron calcular márgenes. Saliendo.");
    return "N/A";
  }

  const averageMargin =
    ebitMargins.reduce((sum, margin) => sum + margin, 0) / ebitMargins.length;
  const result = `${averageMargin.toFixed(2)}%`;
  console.log("Resultado final Margen EBIT:", result);
  return result;
};

// Repetimos la misma lógica robusta para las otras funciones

const calculateAverageSalesGrowth = (revenues: number[]): string => {
  console.log("\n--- Calculando Crecimiento de Ventas Promedio ---");
  console.log("Revenues recibidos:", revenues);
  const fiscalYearRevenues = revenues.slice(1);
  console.log("Datos de Revenue (solo años fiscales):", fiscalYearRevenues);

  if (fiscalYearRevenues.length < 2) {
    console.log(
      "No hay suficientes datos para calcular crecimiento. Saliendo."
    );
    return "N/A";
  }

  const growthRates: number[] = [];
  for (let i = 0; i < fiscalYearRevenues.length - 1; i++) {
    const currentYearRevenue = fiscalYearRevenues[i];
    const previousYearRevenue = fiscalYearRevenues[i + 1];
    if (previousYearRevenue && previousYearRevenue !== 0) {
      const growth =
        ((currentYearRevenue - previousYearRevenue) / previousYearRevenue) *
        100;
      growthRates.push(growth);
    }
  }
  console.log("Tasas de crecimiento calculadas:", growthRates);

  if (growthRates.length === 0) return "N/A";
  const averageGrowth =
    growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  const result = `${averageGrowth.toFixed(2)}%`;
  console.log("Resultado final Crecimiento de Ventas:", result);
  return result;
};

const calculateAverageTaxRate = (
  taxProvisions: number[],
  pretaxIncomes: number[]
): string => {
  console.log("\n--- Calculando Tasa de Impuestos Promedio ---");
  console.log("Provisiones de Impuestos recibidas:", taxProvisions);
  console.log("Ingresos Pre-Impuestos recibidos:", pretaxIncomes);

  const fiscalYearTaxes = taxProvisions.slice(1);
  const fiscalYearIncomes = pretaxIncomes.slice(1);

  if (fiscalYearTaxes.length === 0 || fiscalYearIncomes.length === 0)
    return "N/A";

  const taxRates: number[] = [];
  const relevantDataLength = Math.min(
    fiscalYearTaxes.length,
    fiscalYearIncomes.length,
    4
  );

  for (let i = 0; i < relevantDataLength; i++) {
    const taxProvision = fiscalYearTaxes[i];
    const pretaxIncome = fiscalYearIncomes[i];
    if (pretaxIncome && pretaxIncome !== 0) {
      const rate = (taxProvision / pretaxIncome) * 100;
      if (isFinite(rate)) {
        taxRates.push(rate);
      }
    }
  }
  console.log("Tasas de impuestos calculadas por año:", taxRates);

  if (taxRates.length === 0) return "N/A";
  const averageRate =
    taxRates.reduce((sum, rate) => sum + rate, 0) / taxRates.length;
  const result = `${averageRate.toFixed(2)}%`;
  console.log("Resultado final Tasa de Impuestos:", result);
  return result;
};

const calculateAverageSharesIncrease = (shares: number[]): string => {
  console.log("\n--- Calculando Aumento de Acciones Promedio ---");
  console.log("Acciones recibidas:", shares);
  const fiscalYearShares = shares.slice(1);
  console.log("Datos de Acciones (solo años fiscales):", fiscalYearShares);

  if (fiscalYearShares.length < 2) return "N/A";

  const sharesIncreases: number[] = [];
  for (let i = 0; i < fiscalYearShares.length - 1; i++) {
    const currentShares = fiscalYearShares[i];
    const previousShares = fiscalYearShares[i + 1];
    if (previousShares && previousShares !== 0) {
      const increase =
        ((currentShares - previousShares) / previousShares) * 100;
      sharesIncreases.push(increase);
    }
  }
  console.log("Aumentos de acciones calculados:", sharesIncreases);

  if (sharesIncreases.length === 0) return "N/A";
  const averageIncrease =
    sharesIncreases.reduce((sum, rate) => sum + rate, 0) /
    sharesIncreases.length;
  const result = `${averageIncrease.toFixed(2)}%`;
  console.log("Resultado final Aumento de Acciones:", result);
  return result;
};

// --- RUTA DE LA API ---

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        { error: 'Falta el parámetro "ticker".' },
        { status: 400 }
      );
    }

    const host = request.headers.get("host");
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    const incomeResponse = await fetch(
      `${baseUrl}/api/income-statement?ticker=${ticker}`
    );
    if (!incomeResponse.ok) {
      throw new Error(
        "No se pudieron obtener los datos del estado de resultados."
      );
    }
    const incomeData: IncomeStatementData = await incomeResponse.json();

    console.log(
      "DATOS RECIBIDOS DESDE /api/income-statement:",
      JSON.stringify(incomeData, null, 2)
    );

    const avgSalesGrowth = calculateAverageSalesGrowth(
      incomeData.metrics.totalRevenue
    );
    const avgEbitMargin = calculateAverageEbitMargin(
      incomeData.metrics.ebit,
      incomeData.metrics.totalRevenue
    );
    const avgTaxRate = calculateAverageTaxRate(
      incomeData.metrics.taxRateForCalcs,
      incomeData.metrics.pretaxIncome
    );
    const avgSharesIncrease = calculateAverageSharesIncrease(
      incomeData.metrics.basicAverageShares
    );

    const finalAverages = {
      salesGrowth: avgSalesGrowth,
      ebitMargin: avgEbitMargin,
      taxRate: avgTaxRate,
      sharesIncrease: avgSharesIncrease,
    };

    console.log(
      "PROMEDIOS FINALES CALCULADOS:",
      JSON.stringify(finalAverages, null, 2)
    );

    return NextResponse.json({
      success: true,
      averages: finalAverages,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error
        ? error.message
        : "Error desconocido en el servidor";
    console.error("Error al calcular promedios financieros:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
