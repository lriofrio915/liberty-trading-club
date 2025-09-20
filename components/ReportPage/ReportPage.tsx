"use client";

import { useState, useEffect, useCallback } from "react";
import { ApiAssetItem } from "@/types/api";
import CompanyOverview from "../CompanyOverview/CompanyOverview";
import MarketAnalysis from "../MarketAnalysis/MarketAnalysis";
import PerformanceChart from "../PerformanceChart/PerformanceChart";
import DividendsSection from "../DividendsSection/DividendsSection";
import FinancialHealth from "../FinancialHealth/FinancialHealth";
import Profitability from "../Profitability/Profitability";
import AnalystPerspectives from "../AnalystPerspectives/AnalystPerspectives";
import Conclusion from "../Conclusion/Conclusion";
import LoadingSpinner from "../Shared/LoadingSpinner";
import ErrorDisplay from "../Shared/ErrorDisplay";
import ValuationDashboard from "../ValuationDashboard/ValuationDashboard";
import ScrollToTopButton from "../ScrollToTopButton";
import GeminiAnalysis from "../GeminiAnalysis/GeminiAnalysis";

// Interfaz para los promedios que vienen de nuestra nueva API
interface FinancialAverages {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

interface ReportPageProps {
  ticker: string;
}

export default function ReportPage({ ticker }: ReportPageProps) {
  const [assetData, setAssetData] = useState<ApiAssetItem | null>(null);
  const [financialAverages, setFinancialAverages] =
    useState<FinancialAverages | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Hacemos las dos llamadas a la API en paralelo y sin caché
      const [assetResponse, averagesResponse] = await Promise.all([
        fetch(`/api/stocks?tickers=${ticker}&fullData=true`, {
          cache: "no-store",
        }),
        fetch(`/api/financial-averages?ticker=${ticker}`, {
          cache: "no-store",
        }),
      ]);

      if (!assetResponse.ok)
        throw new Error(`Fallo al obtener los datos de ${ticker}.`);
      if (!averagesResponse.ok)
        throw new Error(
          `Fallo al obtener los promedios financieros de ${ticker}.`
        );

      const assetApiResponse = await assetResponse.json();
      const averagesApiResponse = await averagesResponse.json();

      if (assetApiResponse.success === false)
        throw new Error(
          assetApiResponse.message ||
            "Error desconocido al obtener datos del activo."
        );
      if (averagesApiResponse.success === false)
        throw new Error(
          averagesApiResponse.error ||
            "Error desconocido al calcular los promedios."
        );

      if (assetApiResponse.data && assetApiResponse.data.length > 0) {
        setAssetData(assetApiResponse.data[0]);
        setFinancialAverages(averagesApiResponse.averages);
      } else {
        setError(`No se encontraron datos para ${ticker}.`);
      }
    } catch (err: unknown) {
      console.error(`Error al obtener datos de ${ticker}:`, err);
      setError(
        err instanceof Error
          ? err.message
          : `No se pudieron cargar los datos de ${ticker}.`
      );
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker) {
      fetchAllData();
    }
  }, [fetchAllData, ticker]);

  if (loading) return <LoadingSpinner ticker={ticker} />;
  if (error) return <ErrorDisplay error={error} />;
  if (!assetData || !financialAverages) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-xl font-semibold text-center text-gray-700">
          No se pudieron cargar los datos del activo {ticker}.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-2 font-inter">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] mb-4">
            Informe de Portafolio - {assetData.data.price?.longName || ticker} (
            {ticker})
          </h1>
          <p className="text-lg md:text-xl text-[#849E8F]">
            Análisis detallado para inversores de{" "}
            {assetData.data.price?.longName || ticker}.
          </p>
        </header>

        <ScrollToTopButton />

        <ValuationDashboard
          ticker={ticker}
          apiData={assetData.data}
          financialAverages={financialAverages}
        />

        <CompanyOverview assetData={assetData} />
        <MarketAnalysis assetData={assetData} />
        <PerformanceChart assetData={assetData} />
        <DividendsSection assetData={assetData} />
        <FinancialHealth assetData={assetData} />
        <Profitability assetData={assetData} />
        <AnalystPerspectives assetData={assetData} />
        <Conclusion assetData={assetData} />
        <GeminiAnalysis assetData={assetData}/>

        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold mb-2 text-[#0A2342]">Aviso Legal</h3>
          <p className="text-xs text-[#849E8F] max-w-4xl mx-auto">
            El contenido de este informe tiene fines puramente educativos e
            informativos y no constituye en ningún caso asesoramiento de
            inversión...
          </p>
        </footer>
      </div>
    </div>
  );
}
