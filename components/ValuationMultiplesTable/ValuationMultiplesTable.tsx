// components/ValuationMultiplesTable/ValuationMultiplesTable.tsx
"use client";
import React, { Dispatch, SetStateAction } from "react";
import Tooltip from "../Shared/Tooltips";

// Interfaz para la estructura de datos que esperamos de la API
interface ValuationMetricsData {
  per: { ltm: number; ntm: number };
  ev_ebitda: { ltm: number; ntm: string };
  ev_ebit: { ltm: number; ntm: string };
  ev_fcf: { ltm: number; ntm: string };
}

// Interfaz para el estado de los múltiplos objetivo
interface TargetsState {
  per: number;
  ev_ebitda: number;
  ev_ebit: number;
  ev_fcf: number;
}

// Interfaz para las Props del componente
interface Props {
  metrics: ValuationMetricsData | null;
  loading: boolean;
  currentPrice: number;
  targets: TargetsState;
  setTargets: Dispatch<SetStateAction<TargetsState>>;
}

const ValuationMultiplesTable: React.FC<Props> = ({
  metrics,
  loading,
  currentPrice,
  targets,
  setTargets,
}) => {
  const metricDescriptions: { [key: string]: string } = {
    per: "Price-to-Earnings: Mide cuánto pagan los inversores por cada dólar de ganancias.",
    ev_ebitda:
      "Enterprise Value to EBITDA: Compara el valor total de la empresa con sus ganancias operativas.",
    ev_ebit:
      "Enterprise Value to EBIT: Similar a EV/EBITDA, pero considera la depreciación y amortización.",
    ev_fcf:
      "Enterprise Value to Free Cash Flow: Mide el valor de la empresa en relación con el efectivo que genera.",
  };

  const handleTargetChange = (key: keyof TargetsState, value: string) => {
    setTargets((prevTargets) => ({
      ...prevTargets,
      [key]: parseFloat(value) || 0,
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Múltiplos de valoración</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Precio actual</p>
          <p className="text-2xl font-bold text-green-600">
            ${currentPrice.toFixed(2)}
          </p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Métrica</th>
            <th className="py-2 text-center">LTM</th>
            <th className="py-2 text-center">NTM</th>
            <th className="py-2 text-center">Objetivo</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(targets).map((key) => {
            const metricKey = key as keyof TargetsState;
            return (
              <tr key={key} className="border-b border-gray-200">
                <td className="py-2 font-semibold uppercase">
                  <Tooltip
                    text={
                      metricDescriptions[metricKey] ||
                      "Descripción no disponible."
                    }
                  >
                    {key.replace(/_/g, " / ")}
                  </Tooltip>
                </td>
                <td className="py-2 text-center">
                  {typeof metrics?.[metricKey]?.ltm === "number"
                    ? metrics[metricKey].ltm.toFixed(2)
                    : "N/A"}
                </td>
                <td className="py-2 text-center">
                  {typeof metrics?.[metricKey]?.ntm === "number"
                    ? metrics[metricKey].ntm.toFixed(2)
                    : metrics?.[metricKey]?.ntm || "N/A"}
                </td>
                <td className="py-2 text-red-600 font-bold flex justify-center items-center">
                  <input
                    type="number"
                    value={targets[metricKey]}
                    onChange={(e) =>
                      handleTargetChange(metricKey, e.target.value)
                    }
                    className="w-24 text-center bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationMultiplesTable;
