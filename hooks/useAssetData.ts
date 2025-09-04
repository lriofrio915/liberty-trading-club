// hooks/useAssetData.ts

import { useState, useEffect } from "react";
import {
  ApiResponse,
  ApiAssetItem,
  YahooFinanceRawValue,
  QuoteSummaryResult,
} from "@/types/api";

// Definimos la interfaz para el valor de retorno del hook
export interface ValuationData {
  ticker: string;
  currentPrice: number;
  multiples: {
    per: {
      ltm: number | string;
      ntm: number | string;
      target: number | string;
    };
    ev_fcf: {
      ltm: number | string;
      ntm: number | string;
      target: number | string;
    };
    ev_ebitda: {
      ltm: number | string;
      ntm: number | string;
      target: number | string;
    };
    ev_ebit: {
      ltm: number | string;
      ntm: number | string;
      target: number | string;
    };
  };
  projections: {
    salesGrowth: string;
    ebitMargin: string;
    taxRate: string;
    sharesIncrease: string;
  };
  valuationResults: {
    "2022e": any;
    "2023e": any;
    "2024e": any;
    "2025e": any;
    "2026e": any;
  };
  marginOfSafety: number | string;
  cagrResults: {
    per: number;
    ev_fcf: number;
    ev_ebitda: number;
    ev_ebit: number;
  };
}

const getRawValue = (
  value: YahooFinanceRawValue | number | null | undefined
): number | string => {
  if (typeof value === "object" && value !== null && "raw" in value) {
    return value.raw;
  }
  return value ?? "N/A";
};

// Esta función es crucial: transforma los datos de la API a la estructura de nuestro dashboard
const processApiData = (
  apiData: QuoteSummaryResult,
  ticker: string
): ValuationData => {
  // Lógica para extraer y procesar datos de la API
  const financialData = apiData.financialData;
  const keyStats = apiData.defaultKeyStatistics;
  const priceData = apiData.price;

  // 1. Obtener el precio actual
  const currentPrice = getRawValue(priceData?.regularMarketPrice) as number;

  // 2. Extraer múltiplos LTM y NTM (datos de la API)
  const trailingPE = getRawValue(keyStats?.trailingPE);
  const forwardPE = getRawValue(keyStats?.forwardPE);
  const evToEbitda = getRawValue(financialData?.ebitdaMargins); // Esto es incorrecto, el valor real es enterpriseValue / ebitda
  const evToEbit = "N/A"; // Faltan datos específicos en el api para este cálculo

  // Simulación de los valores objetivo. En un modelo real, estos serían inputs manuales.
  const targetPE = 20.0;
  const targetEvFcf = 20.0;
  const targetEvEbitda = 16.0;
  const targetEvEbit = 16.0;

  // 3. Simulación de proyecciones
  // Estos datos no vienen de la API, son supuestos del analista.
  // Podrías obtenerlos de otras fuentes o hacer proyecciones basadas en datos históricos.
  const projections = {
    salesGrowth: "12%",
    ebitMargin: "28%",
    taxRate: "21%",
    sharesIncrease: "0.05%",
  };

  // 4. Calcular el precio objetivo y el margen de seguridad
  // Esta es la parte de la lógica de valoración que tú debes implementar.
  // Por ahora, solo simularemos los resultados.
  const valuationResults = {
    "2022e": {
      per_ex_cash: 221.71,
      ev_fcf: 224.9,
      ev_ebitda: 240.74,
      ev_ebit: 222.92,
    },
    "2023e": {
      per_ex_cash: 248.66,
      ev_fcf: 252.23,
      ev_ebitda: 269.51,
      ev_ebit: 249.56,
    },
    "2024e": {
      per_ex_cash: 278.83,
      ev_fcf: 282.83,
      ev_ebitda: 301.71,
      ev_ebit: 279.38,
    },
    "2025e": {
      per_ex_cash: 312.61,
      ev_fcf: 317.08,
      ev_ebitda: 337.76,
      ev_ebit: 312.77,
    },
    "2026e": {
      per_ex_cash: 350.42,
      ev_fcf: 355.42,
      ev_ebitda: 378.12,
      ev_ebit: 350.14,
    },
  };

  const finalPrice = valuationResults["2026e"].ev_fcf; // Usamos EV/FCF como referencia
  const marginOfSafety = (
    ((finalPrice - currentPrice) / currentPrice) *
    100
  ).toFixed(2);
  const cagr = ((finalPrice / currentPrice) ** (1 / 5) - 1) * 100;

  return {
    ticker: ticker,
    currentPrice: currentPrice,
    multiples: {
      per: { ltm: trailingPE, ntm: forwardPE, target: targetPE },
      ev_fcf: { ltm: "N/A", ntm: "N/A", target: targetEvFcf },
      ev_ebitda: { ltm: "N/A", ntm: "N/A", target: targetEvEbitda }, // Necesitas calcular este valor real
      ev_ebit: { ltm: evToEbit, ntm: evToEbit, target: targetEvEbit },
    },
    projections: projections,
    valuationResults: valuationResults,
    marginOfSafety: marginOfSafety,
    cagrResults: {
      per: Number(cagr.toFixed(2)),
      ev_fcf: Number(cagr.toFixed(2)),
      ev_ebitda: Number(cagr.toFixed(2)),
      ev_ebit: Number(cagr.toFixed(2)),
    },
  };
};

export const useAssetData = (ticker: string) => {
  const [data, setData] = useState<ValuationData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!ticker) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/${ticker}`);
        const result: ApiResponse = await res.json();

        if (
          !result.success ||
          !result.assetData ||
          result.assetData.length === 0
        ) {
          throw new Error(
            result.message || "No se encontraron datos para el ticker."
          );
        }

        const apiItem = result.assetData[0];
        const processedData = processApiData(apiItem.data, apiItem.ticker);
        setData(processedData);
      } catch (err: any) {
        setError(err.message || "Ocurrió un error al obtener los datos.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker]);

  return { data, loading, error };
};
