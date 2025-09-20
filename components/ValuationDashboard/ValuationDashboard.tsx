// components/ValuationDashboard/ValuationDashboard.tsx
import React from "react";
import ProjectionsTable from "../ProjectionsTable/ProjectionsTable";
import ValuationMultiplesTable from "../ValuationMultiplesTable/ValuationMultiplesTable";
import IntrinsicValueResults from "../IntrinsicValueResults/IntrinsicValueResults";
import { QuoteSummaryResult, YahooFinanceRawValue } from "@/types/api";

interface FinancialAverages {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

interface Props {
  ticker: string;
  apiData: QuoteSummaryResult;
  financialAverages: FinancialAverages;
}

const getRawValue = (
  value: number | YahooFinanceRawValue | undefined | null
): number | string => {
  if (typeof value === "object" && value !== null && "raw" in value) {
    return value.raw;
  }
  return typeof value === "number" ? value : "N/A";
};

const ValuationDashboard: React.FC<Props> = ({
  ticker,
  apiData,
  financialAverages,
}) => {
  const currentPrice = getRawValue(apiData.price?.regularMarketPrice);

  // La lógica interna para procesar datos simulados permanece igual por ahora
  const processedData = {
    valuationResults: {
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
    },
    marginOfSafety: 185,
    cagrResults: { per: 33, ev_fcf: 33, ev_ebitda: 33, ev_ebit: 33 },
  };

  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl font-sans mb-12">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Análisis de Valoración: {ticker}
      </h2>
      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <ProjectionsTable averages={financialAverages} />
        <ValuationMultiplesTable
          ticker={ticker}
          currentPrice={typeof currentPrice === "number" ? currentPrice : 0}
        />
      </div>

      {/* *** CORRECCIÓN: Pasamos el prop 'currentPrice' que faltaba *** */}
      <IntrinsicValueResults
        results={processedData.valuationResults}
        marginOfSafety={processedData.marginOfSafety}
        cagrResults={processedData.cagrResults}
        currentPrice={currentPrice}
      />
    </div>
  );
};

export default ValuationDashboard;
