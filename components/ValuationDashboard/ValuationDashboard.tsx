// components/ValuationDashboard/ValuationDashboard.tsx
"use client";

import React from "react";
import ProjectionsTable from "../ProjectionsTable/ProjectionsTable";
import ValuationMultiplesTable from "../ValuationMultiplesTable/ValuationMultiplesTable";
import IntrinsicValueResults from "../IntrinsicValueResults/IntrinsicValueResults";
import { ApiAssetItem } from "@/types/api";
import { processValuationData } from "@/lib/valuationCalculations"; // Importamos nuestra lógica

interface Props {
  assetData: ApiAssetItem;
}

const ValuationDashboard: React.FC<Props> = ({ assetData }) => {
  // 1. Toda la lógica de procesamiento ahora está en una función externa.
  const processedData = processValuationData(assetData.data);

  // 2. Los datos financieros (income statement, etc.) se pasan como props a los hijos.
  const incomeStatementHistory =
    assetData.data.incomeStatementHistory?.incomeStatementHistory || [];

  return (
    <div className="bg-white text-gray-800 p-8 rounded-lg shadow-xl mb-12">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
          Análisis de Valoración: {assetData.ticker}
        </h2>
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* 3. Pasamos los datos necesarios a los componentes hijos */}
          <ProjectionsTable incomeStatementHistory={incomeStatementHistory} />
          <ValuationMultiplesTable
            multiples={processedData.multiples}
            currentPrice={processedData.currentPrice}
          />
        </div>
        <IntrinsicValueResults
          results={processedData.valuationResults}
          marginOfSafety={processedData.marginOfSafety}
          cagrResults={processedData.cagrResults}
        />
      </div>
    </div>
  );
};

export default ValuationDashboard;
