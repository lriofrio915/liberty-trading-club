// components/ReportPage/ReportPage.tsx
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
import FutureFinancialTable from "../FutureFinancialTable/FutureFinancialTable";
import GeminiAnalysis from "../GeminiAnalysis/GeminiAnalysis";
import ScrollToTopButton from "../ScrollToTopButton";

interface ReportPageProps {
  ticker: string;
}

export default function ReportPage({ ticker }: ReportPageProps) {
  const [assetData, setAssetData] = useState<ApiAssetItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssetData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // ÚNICA LLAMADA A LA API PARA OBTENER TODOS LOS DATOS
      const apiUrl = `/api/stocks?tickers=${ticker}&fullData=true`;
      const response = await fetch(apiUrl);
      if (!response.ok) {
        throw new Error(`Fallo al obtener los datos de ${ticker}.`);
      }
      const apiResponse = await response.json();

      if (apiResponse.success === false) {
        setError(apiResponse.message || "Error desconocido al obtener datos.");
        setLoading(false);
        return;
      }

      if (apiResponse.data && apiResponse.data.length > 0) {
        setAssetData(apiResponse.data[0]);
      } else {
        setError(`No se encontraron datos para ${ticker}.`);
      }
    } catch (err: unknown) {
      console.error(`Error al obtener datos de ${ticker}:`, err);
      setError(
        err instanceof Error
          ? err.message
          : `No se pudieron cargar los datos de ${ticker}. Por favor, inténtalo de nuevo más tarde.`
      );
    } finally {
      setLoading(false);
    }
  }, [ticker]);

  useEffect(() => {
    if (ticker) {
      fetchAssetData();
    }
  }, [fetchAssetData, ticker]);

  if (loading) return <LoadingSpinner ticker={ticker} />;
  if (error) return <ErrorDisplay error={error} />;
  if (!assetData)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-xl font-semibold text-center text-gray-700">
          No se pudieron cargar los datos del activo {ticker}.
        </p>
      </div>
    );

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

        {/* TODOS LOS COMPONENTES AHORA RECIBEN LOS DATOS YA CARGADOS */}
        <ScrollToTopButton />
        <ValuationDashboard assetData={assetData} />
        <CompanyOverview assetData={assetData} />
        <MarketAnalysis assetData={assetData} />
        <PerformanceChart assetData={assetData} />
        <DividendsSection assetData={assetData} />
        <FinancialHealth assetData={assetData} />
        <Profitability assetData={assetData} />
        <AnalystPerspectives assetData={assetData} />
        <Conclusion assetData={assetData} />
        {/* <FutureFinancialTable assetData={assetData} /> */}
        <GeminiAnalysis assetData={assetData} />

        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold mb-2 text-[#0A2342]">Aviso Legal</h3>
          <p className="text-xs text-[#849E8F] max-w-4xl mx-auto">
            El contenido de este informe tiene fines puramente educativos e
            informativos y no constituye en ningún caso asesoramiento de
            inversión. La operativa con activos financieros implica un alto
            grado de riesgo y puede no ser adecuada para todos los inversores.
            Existe la posibilidad de que se incurra en pérdidas que superen la
            inversión inicial. Los resultados pasados no son indicativos de
            resultados futuros.
          </p>
        </footer>
      </div>
    </div>
  );
}
