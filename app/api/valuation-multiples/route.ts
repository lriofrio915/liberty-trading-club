// app/api/valuation-multiples/route.ts

import { NextResponse } from "next/server";

// Interfaz para la respuesta final de esta API
interface ValuationMultiplesResponse {
  PER: number;
  EV_EBITDA: number;
  EV_EBIT: number;
  EV_FCF: number;
}

// Interfaces para los datos que esperamos de nuestras APIs de scraping
interface KeyStatisticsData {
  metrics: { [key: string]: number[] };
}
interface IncomeStatementData {
  metrics: { ebitda: number[]; ebit: number[] };
}
interface FreeCashFlowData {
  metrics: { freeCashFlow: number[] };
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        { success: false, error: 'Falta el parámetro "ticker".' },
        { status: 400 }
      );
    }

    const baseUrl = new URL(request.url).origin;

    // 1. Hacemos las llamadas a las 3 APIs de scraping en paralelo
    const [
      keyStatisticsResponse,
      incomeStatementResponse,
      freeCashFlowResponse,
    ] = await Promise.all([
      fetch(`${baseUrl}/api/key-statistics?ticker=${ticker}`),
      fetch(`${baseUrl}/api/income-statement?ticker=${ticker}`),
      fetch(`${baseUrl}/api/free-cash-flow?ticker=${ticker}`),
    ]);

    if (
      !keyStatisticsResponse.ok ||
      !incomeStatementResponse.ok ||
      !freeCashFlowResponse.ok
    ) {
      throw new Error(
        "No se pudieron obtener todos los datos financieros necesarios."
      );
    }

    // 2. Parseamos los datos JSON
    const keyStatisticsData: KeyStatisticsData =
      await keyStatisticsResponse.json();
    const incomeStatementData: IncomeStatementData =
      await incomeStatementResponse.json();
    const freeCashFlowData: FreeCashFlowData =
      await freeCashFlowResponse.json();

    // 3. Extraemos los valores LTM (Last Twelve Months)
    const trailingPE = (keyStatisticsData.metrics["trailingPE"] || [])[0] || 0;
    const enterpriseValue =
      (keyStatisticsData.metrics["enterpriseValue"] || [])[0] || 0;
    const ltmEBITDA = (incomeStatementData.metrics.ebitda || [])[0] || 0;
    const ltmEBIT = (incomeStatementData.metrics.ebit || [])[0] || 0;
    const ltmFCF = (freeCashFlowData.metrics.freeCashFlow || [])[0] || 0;

    // --- CONSOLE LOGS DE VALORES EXTRAÍDOS ---

    // 4. Realizamos los cálculos
    const calculatedMetrics: ValuationMultiplesResponse = {
      PER: trailingPE,
      EV_EBITDA: ltmEBITDA !== 0 ? enterpriseValue / ltmEBITDA : 0,
      EV_EBIT: ltmEBIT !== 0 ? enterpriseValue / ltmEBIT : 0,
      EV_FCF: ltmFCF !== 0 ? enterpriseValue / ltmFCF : 0,
    };

    // 5. Devolvemos la respuesta
    return NextResponse.json(calculatedMetrics);
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Un error desconocido ocurrió.";
    console.error("Error en API /valuation-multiples:", errorMessage);
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
