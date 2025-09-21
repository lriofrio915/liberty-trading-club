// components/ValuationDashboard/ValuationDashboard.tsx
"use client";
import React, { useState } from "react";
import ProjectionsTable from "../ProjectionsTable/ProjectionsTable";
import ValuationMultiplesTable from "../ValuationMultiplesTable/ValuationMultiplesTable";
import IntrinsicValueResults from "../IntrinsicValueResults/IntrinsicValueResults";
import { QuoteSummaryResult } from "@/types/api";
import {
  ValuationResult,
  AssetData as ValuationDashboardData,
  ValuationMetrics,
} from "@/types/valuation";

interface FinancialAverages {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

const getRawValue = (value: any): number => {
  if (typeof value === "object" && value !== null && "raw" in value) {
    return value.raw;
  }
  return typeof value === "number" ? value : 0;
};

// Interfaz para las Props del componente
interface Props {
  ticker: string;
  apiData: QuoteSummaryResult;
  financialAverages: FinancialAverages;
  valuationMultiples: ValuationMetrics | null;
  loadingMultiples: boolean;
}

const ValuationDashboard: React.FC<Props> = ({
  ticker,
  apiData,
  financialAverages,
  valuationMultiples,
  loadingMultiples,
}) => {
  const [valuationData, setValuationData] =
    useState<ValuationDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [targets, setTargets] = useState({
    per: 20,
    ev_ebitda: 16,
    ev_ebit: 16,
    ev_fcf: 20,
  });

  const [estimates, setEstimates] = useState({
    salesGrowth: 12,
    ebitMargin: 28,
    taxRate: 21,
    sharesIncrease: 0.05,
  });

  const handleCalculation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/intrinsic-value", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker, targets, estimates }),
      });

      if (!response.ok)
        throw new Error("Error al calcular el valor intrínseco");
      const data = await response.json();

      if (data.success && valuationMultiples) {
        const finalAvgPrice2026 =
          Object.values(data.results["2026e"] as ValuationResult).reduce(
            (sum: number, value: number) => sum + value,
            0
          ) / 4;
        const currentPriceVal = getRawValue(apiData.price?.regularMarketPrice);
        const marginOfSafety =
          currentPriceVal > 0
            ? ((finalAvgPrice2026 - currentPriceVal) / currentPriceVal) * 100
            : 0;
        const cagr =
          currentPriceVal > 0
            ? (Math.pow(finalAvgPrice2026 / currentPriceVal, 1 / 5) - 1) * 100
            : 0;

        setValuationData({
          valuationResults: data.results,
          marginOfSafety: marginOfSafety.toFixed(2),
          cagrResults: {
            per: cagr,
            ev_fcf: cagr,
            ev_ebitda: cagr,
            ev_ebit: cagr,
          },
          ticker: ticker,
          currentPrice: currentPriceVal,
          multiples: {
            per: {
              ltm: valuationMultiples.per.ltm,
              ntm: valuationMultiples.per.ntm,
              target: targets.per,
            },
            ev_fcf: {
              ltm: valuationMultiples.ev_fcf.ltm,
              ntm: valuationMultiples.ev_fcf.ntm,
              target: targets.ev_fcf,
            },
            ev_ebitda: {
              ltm: valuationMultiples.ev_ebitda.ltm,
              ntm: valuationMultiples.ev_ebitda.ntm,
              target: targets.ev_ebitda,
            },
            ev_ebit: {
              ltm: valuationMultiples.ev_ebit.ltm,
              ntm: valuationMultiples.ev_ebit.ntm,
              target: targets.ev_ebit,
            },
          },
          projections: {
            salesGrowth: `${estimates.salesGrowth}%`,
            ebitMargin: `${estimates.ebitMargin}%`,
            taxRate: `${estimates.taxRate}%`,
            sharesIncrease: `${estimates.sharesIncrease}%`,
          },
        });
      } else {
        setError(data.error || "Error desconocido");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPrice = getRawValue(apiData.price?.regularMarketPrice);

  return (
    <div className="bg-white text-gray-800 p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Análisis de Valoración: {ticker}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <ProjectionsTable
            estimates={estimates}
            setEstimates={setEstimates}
            financialAverages={financialAverages}
          />
          <ValuationMultiplesTable
            currentPrice={currentPrice}
            metrics={valuationMultiples}
            loading={loadingMultiples}
            targets={targets}
            setTargets={setTargets}
          />
        </div>
        <div className="text-center my-8">
          <button
            onClick={handleCalculation}
            disabled={isLoading}
            className="bg-blue-600 text-white font-bold py-3 px-8 rounded-full text-lg hover:bg-blue-700 transition-colors duration-300 shadow-lg disabled:bg-gray-400 cursor-pointer disabled:cursor-not-allowed"
          >
            {isLoading ? "Calculando..." : "Calcular Valor Intrínseco"}
          </button>
        </div>
        {error && <div className="text-red-500 text-center my-4">{error}</div>}
        {valuationData && (
          <IntrinsicValueResults
            results={valuationData.valuationResults}
            marginOfSafety={valuationData.marginOfSafety}
            cagrResults={valuationData.cagrResults}
            currentPrice={currentPrice}
            multiples={valuationData.multiples}
          />
        )}
      </div>
    </div>
  );
};

export default ValuationDashboard;
