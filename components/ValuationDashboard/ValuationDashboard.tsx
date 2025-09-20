// components/ValuationDashboard/ValuationDashboard.tsx
"use client";
import React, { useState } from "react";
import ProjectionsTable from "../ProjectionsTable/ProjectionsTable";
import ValuationMultiplesTable from "../ValuationMultiplesTable/ValuationMultiplesTable";
import IntrinsicValueResults from "../IntrinsicValueResults/IntrinsicValueResults";
import { QuoteSummaryResult } from "@/types/api";
import { ValuationResult, ValuationDashboardData } from "@/types/valuation";

// Interfaz para los promedios que vienen de nuestra nueva API
interface FinancialAverages {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

// Función auxiliar para obtener el valor 'raw' de forma segura
const getRawValue = (value: any): number => {
  if (typeof value === "object" && value !== null && "raw" in value) {
    return value.raw;
  }
  return typeof value === "number" ? value : 0;
};

// Interfaz actualizada para las Props del componente
interface Props {
  ticker: string;
  apiData: QuoteSummaryResult;
  financialAverages: FinancialAverages;
}

const ValuationDashboard: React.FC<Props> = ({
  ticker,
  apiData,
  financialAverages,
}) => {
  // Estado para los resultados de la valoración
  const [valuationData, setValuationData] =
    useState<ValuationDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Estado para los inputs del usuario (múltiplos y estimaciones)
  const [targets, setTargets] = useState({
    per: 20,
    ev_ebitda: 16,
    ev_ebit: 16,
    ev_fcf: 20,
  });

  // *** CORRECCIÓN AQUÍ: Se añade taxRate al estado de las estimaciones ***
  const [estimates, setEstimates] = useState({
    salesGrowth: 12,
    ebitMargin: 28,
    taxRate: 21, // Añadido
    sharesIncrease: 0.05,
  });

  const handleCalculation = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/intrinsic-value", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ticker,
          targets,
          estimates, // Ahora se enviará también taxRate
        }),
      });

      if (!response.ok) {
        throw new Error("Error al calcular el valor intrínseco");
      }

      const data = await response.json();
      if (data.success) {
        // Calcular promedios y CAGR aquí, en el cliente
        const finalAvgPrice2026 =
          Object.values(data.results["2026e"] as ValuationResult).reduce(
            (sum: number, value: number) => sum + value,
            0
          ) / 4;

        const currentPrice = getRawValue(apiData.price?.regularMarketPrice);

        const marginOfSafety =
          currentPrice > 0
            ? ((finalAvgPrice2026 - currentPrice) / currentPrice) * 100
            : 0;
        const cagr =
          currentPrice > 0
            ? (Math.pow(finalAvgPrice2026 / currentPrice, 1 / 5) - 1) * 100
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
    <div className="bg-white text-gray-800 min-h-screen p-8 font-sans">
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
            ticker={ticker}
            currentPrice={currentPrice}
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
          />
        )}
      </div>
    </div>
  );
};

export default ValuationDashboard;
