"use client";

import React from "react";
import ProjectionsTable from "../ProjectionsTable/ProjectionsTable";
import ValuationMultiplesTable from "../ValuationMultiplesTable/ValuationMultiplesTable";
import IntrinsicValueResults from "../IntrinsicValueResults/IntrinsicValueResults";
import { ApiAssetItem } from "@/types/api";
import { processValuationData } from "@/lib/valuationCalculations";

interface Props {
  assetData: ApiAssetItem;
}

const ValuationDashboard: React.FC<Props> = ({ assetData }) => {
  // La lógica de procesamiento ahora devuelve todo lo que necesitamos,
  // incluidos los promedios para la tabla de proyecciones.
  const processedData = processValuationData(assetData.data);

  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl mb-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Análisis de Valoración: {assetData.ticker}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Pasamos los promedios calculados a ProjectionsTable */}
          <ProjectionsTable averages={processedData.averages} />

          <ValuationMultiplesTable
            multiples={processedData.multiples}
            currentPrice={processedData.currentPrice}
          />
        </div>
        <IntrinsicValueResults
          results={processedData.valuationResults}
          marginOfSafety={processedData.marginOfSafety}
          cagrResults={processedData.cagrResults}
          currentPrice={processedData.currentPrice} // Pasamos el precio actual
        />
      </div>
    </div>
  );
};

export default ValuationDashboard;
