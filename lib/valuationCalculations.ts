// lib/valuationCalculations.ts
import {
  QuoteSummaryResult,
  YahooFinanceRawValue,
  RawYahooFinanceIncomeStatementItem,
  YahooFinanceDateValue,
} from "@/types/api";

// --- Función de Ayuda Exportable ---
// Esta función es clave. La usaremos en toda la app para manejar este tipo de dato.
export const getRawValue = (
  value: number | YahooFinanceRawValue | undefined | null
): number => {
  if (typeof value === "object" && value !== null && "raw" in value) {
    return value.raw;
  }
  return typeof value === "number" ? value : 0;
};

// Esta función se encarga de obtener el timestamp (en segundos) desde un objeto de fecha.
export const getTimestampFromDate = (
  date: Date | YahooFinanceDateValue | undefined | null
): number => {
  if (date instanceof Date) {
    // .getTime() devuelve milisegundos, lo dividimos para obtener segundos
    return Math.floor(date.getTime() / 1000);
  }
  if (typeof date === "object" && date !== null && "raw" in date) {
    // La API ya nos da el timestamp en segundos
    return date.raw;
  }
  // Si no hay fecha, devolvemos 0 o un valor por defecto
  return 0;
};

// --- Funciones de Cálculo para Proyecciones ---

export const calculateAverageSalesGrowth = (
  statements: RawYahooFinanceIncomeStatementItem[]
): string => {
  if (statements.length < 2) return "N/A";
  // Usamos getRawValue para extraer el número de forma segura
  const revenues = statements.map((s) => getRawValue(s.totalRevenue)).reverse(); // Revertimos para ir del más antiguo al más nuevo

  const growthRates: number[] = [];
  for (let i = 1; i < revenues.length; i++) {
    if (revenues[i - 1] !== 0) {
      const growth =
        ((revenues[i] - revenues[i - 1]) / Math.abs(revenues[i - 1])) * 100;
      growthRates.push(growth);
    }
  }

  if (growthRates.length === 0) return "N/A";
  const averageGrowth =
    growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  return `${averageGrowth.toFixed(2)}%`;
};

export const calculateAverageEbitMargin = (
  statements: RawYahooFinanceIncomeStatementItem[]
): string => {
  if (statements.length === 0) return "N/A";
  const margins = statements
    .map((s) => {
      const ebit = getRawValue(s.ebit);
      const revenue = getRawValue(s.totalRevenue);
      return revenue !== 0 ? (ebit / revenue) * 100 : 0;
    })
    .filter((margin) => margin !== 0);

  if (margins.length === 0) return "N/A";
  const averageMargin =
    margins.reduce((sum, margin) => sum + margin, 0) / margins.length;
  return `${averageMargin.toFixed(2)}%`;
};

// --- Función Principal de Procesamiento (la mantendremos aquí por ahora) ---
export const processValuationData = (apiData: QuoteSummaryResult) => {
  // ... (El resto de la lógica de processValuationData que ya teníamos)
  const currentPrice = getRawValue(apiData.price?.regularMarketPrice);
  const enterpriseValue = getRawValue(
    apiData.defaultKeyStatistics?.enterpriseValue
  );
  const ebitda = getRawValue(apiData.financialData?.ebitda);

  const evToEbitda = ebitda !== 0 ? enterpriseValue / ebitda : 0;

  const multiples = {
    per: {
      ltm: getRawValue(apiData.summaryDetail?.trailingPE),
      ntm: getRawValue(apiData.summaryDetail?.forwardPE),
    },
    ev_ebitda: { ltm: evToEbitda, ntm: evToEbitda },
    ev_fcf: { ltm: "N/A", ntm: "N/A" },
    ev_ebit: { ltm: "N/A", ntm: "N/A" },
  };

  // Placeholder para resultados de valoración
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

  const finalPrice = valuationResults["2026e"].ev_fcf;
  const marginOfSafety =
    currentPrice > 0 ? ((finalPrice - currentPrice) / currentPrice) * 100 : 0;
  const cagr =
    currentPrice > 0 ? ((finalPrice / currentPrice) ** (1 / 5) - 1) * 100 : 0;

  return {
    currentPrice,
    multiples,
    valuationResults,
    marginOfSafety,
    cagrResults: {
      per: cagr,
      ev_fcf: cagr,
      ev_ebitda: cagr,
      ev_ebit: cagr,
    },
  };
};
