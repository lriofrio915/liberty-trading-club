// types/valuation.ts

export interface MultiplesData {
  ltm: number | string;
  ntm: number | string;
  target: number | string;
}

export interface ValuationMetrics {
  per: { ltm: number; ntm: number };
  ev_ebitda: { ltm: number; ntm: string };
  ev_ebit: { ltm: number; ntm: string };
  ev_fcf: { ltm: number; ntm: string };
}

export interface ProjectionsData {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

export interface ValuationResult {
  per_ex_cash: number;
  ev_fcf: number;
  ev_ebitda: number;
  ev_ebit: number;
  [key: string]: number; // Firma de índice para acceso dinámico
}

// CORRECCIÓN: Renombrado de 'ValuationDashboardData' a 'AssetData' para consistencia
export interface AssetData {
  ticker: string;
  currentPrice: number;
  multiples: {
    per: MultiplesData;
    ev_fcf: MultiplesData;
    ev_ebitda: MultiplesData;
    ev_ebit: MultiplesData;
  };
  projections: ProjectionsData;
  valuationResults: {
    "2022e": ValuationResult;
    "2023e": ValuationResult;
    "2024e": ValuationResult;
    "2025e": ValuationResult;
    "2026e": ValuationResult;
    ntm: ValuationResult;
  };
  marginOfSafety: number | string;
  cagrResults: {
    per: number;
    ev_fcf: number;
    ev_ebitda: number;
    ev_ebit: number;
  };
}
