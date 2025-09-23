// components/ProjectionsTable/ProjectionsTable.tsx
"use client";

import React, { Dispatch, SetStateAction, useMemo } from "react";
import Tooltip from "../Shared/Tooltips";
import { QuoteSummaryResult } from "@/types/api";

// --- INICIO: Lógica de Cálculo Movida al Frontend ---

const getRawValue = (value: any): number => {
  if (typeof value === "object" && value !== null && "raw" in value) {
    return typeof value.raw === "number" ? value.raw : 0;
  }
  return typeof value === "number" ? value : 0;
};

const calculateAverageSalesGrowth = (history: any[]): string => {
  if (!history || history.length < 2) return "N/A";
  const growthRates: number[] = [];
  for (let i = 0; i < history.length - 1; i++) {
    const currentRevenue = getRawValue(history[i].totalRevenue);
    const previousRevenue = getRawValue(history[i + 1].totalRevenue);
    if (previousRevenue && previousRevenue !== 0) {
      growthRates.push(
        ((currentRevenue - previousRevenue) / previousRevenue) * 100
      );
    }
  }
  if (growthRates.length === 0) return "N/A";
  const averageGrowth =
    growthRates.reduce((sum, rate) => sum + rate, 0) / growthRates.length;
  return averageGrowth.toFixed(2);
};

const calculateAverageEbitMargin = (history: any[]): string => {
  if (!history || history.length === 0) return "N/A";
  const margins: number[] = [];
  for (const item of history) {
    const ebit = getRawValue(item.ebit);
    const revenue = getRawValue(item.totalRevenue);
    if (revenue !== 0) {
      margins.push((ebit / revenue) * 100);
    }
  }
  if (margins.length === 0) return "N/A";
  const averageMargin =
    margins.reduce((sum, margin) => sum + margin, 0) / margins.length;
  return averageMargin.toFixed(2);
};

// --- FIN: Lógica de Cálculo ---

interface EstimatesState {
  salesGrowth: number;
  ebitMargin: number;
  taxRate: number;
  sharesIncrease: number;
}

// Interfaz para los promedios calculados
interface FinancialAverages {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
}

interface Props {
  apiData: QuoteSummaryResult; // Recibimos el objeto completo de datos
  estimates: EstimatesState;
  setEstimates: Dispatch<SetStateAction<EstimatesState>>;
  financialAverages: FinancialAverages | null; // Aceptamos que pueda ser null
}

const ProjectionsTable: React.FC<Props> = ({
  apiData,
  estimates,
  setEstimates,
  financialAverages,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstimates((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  const metricDescriptions: { [key: string]: string } = {
    salesGrowth:
      "La tasa de crecimiento anual promedio esperada en las ventas de la compañía.",
    ebitMargin:
      "La rentabilidad operativa de la empresa. Mide el porcentaje de las ventas que se convierte en ganancias antes de intereses e impuestos.",
    taxRate:
      "La tasa de impuestos corporativos que se espera que pague la empresa.",
    sharesIncrease:
      "El cambio proyectado en el número de acciones en circulación, que afecta el valor por acción.",
  };

  const projectionsToDisplay = [
    { key: "salesGrowth", name: "Crecimiento de Ventas" },
    { key: "ebitMargin", name: "Margen EBIT" },
    { key: "taxRate", name: "Tasa de Impuestos" },
    { key: "sharesIncrease", name: "Aumento de Acciones" },
  ];

  // Hacemos el encabezado de la tabla dinámico
  const currentYear = new Date().getFullYear();

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Proyecciones Futuras</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500 text-sm">
            <th className="py-2">Métrica</th>
            <th className="py-2 text-center">
              <span>Promedio Histórico</span>
            </th>
            <th className="py-2 text-center">
              <span>Estimación {currentYear + 1}e</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {projectionsToDisplay.map((projection) => (
            <tr
              key={projection.key}
              className="border-b border-gray-200 last:border-b-0"
            >
              <td className="py-2">
                <Tooltip text={metricDescriptions[projection.key] || ""}>
                  {projection.name}
                </Tooltip>
              </td>
              <td className="py-2 text-center font-semibold">
                {financialAverages
                  ? `${
                      financialAverages[
                        projection.key as keyof FinancialAverages
                      ]
                    }%`
                  : "Cargando..."}
              </td>
              <td className="py-2 text-center text-red-600 font-bold">
                <div className="flex justify-center items-center">
                  <input
                    type="number"
                    name={projection.key}
                    value={estimates[projection.key as keyof EstimatesState]}
                    onChange={handleInputChange}
                    className="w-24 text-center text-red-600 font-bold bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    step="0.01"
                  />
                  <span className="ml-1">%</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectionsTable;
