// types/valuation.ts

export interface MultiplesData {
  ltm: number | string;
  ntm: number | string;
  target: number;
}

export interface ValuationMetrics {
  per: MultiplesData;
  ev_fcf: MultiplesData;
  ev_ebitda: MultiplesData;
  ev_ebit: MultiplesData;
}

export interface ProjectionsData {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

export interface ValuationResult {
  per: number;
  ev_fcf: number;
  ev_ebitda: number;
  ev_ebit: number;
}

// CORREGIDO: Se exporta esta interfaz para que pueda ser utilizada en otros archivos.
export interface ValuationResults {
  [year: string]: ValuationResult;
}

export interface AssetData {
  ticker: string;
  currentPrice: number;
  multiples: ValuationMetrics;
  projections: ProjectionsData;
  valuationResults: ValuationResults;
  marginOfSafety: number | string;
  cagrResults: {
    per: number;
    ev_fcf: number;
    ev_ebitda: number;
    ev_ebit: number;
  };
}
