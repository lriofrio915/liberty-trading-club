// types/valuation.ts

// Describe un único múltiplo con sus valores LTM, NTM y objetivo
export interface MultipleData {
  ltm: number | string;
  ntm: number | string;
  target?: number | string; // El objetivo puede ser opcional
}

// Define la estructura del objeto de múltiplos
export interface ValuationMultiples {
  per: MultipleData;
  ev_fcf: MultipleData;
  ev_ebitda: MultipleData;
  ev_ebit: MultipleData;
}

// Describe un resultado de valoración para un año específico
export interface ValuationResult {
  per_ex_cash: number;
  ev_fcf: number;
  ev_ebitda: number;
  ev_ebit: number;
}

// --- ✨ INTERFAZ EXPORTADA Y CORREGIDA ---
// Esta es la interfaz principal que faltaba exportar.
// La renombramos a `ValuationDataType` para evitar confusiones con nombres de componentes.
export interface ValuationDataType {
  currentPrice: number;
  multiples: ValuationMultiples;
  valuationResults: {
    [year: string]: ValuationResult; // Permite años dinámicos
  };
  marginOfSafety: number | string;
  cagrResults: {
    per: number;
    ev_fcf: number;
    ev_ebitda: number;
    ev_ebit: number;
  };
}
