// components/IntrinsicValueResults/IntrinsicValueResults.tsx
import React from "react";
// Usamos el tipo renombrado para evitar conflictos
import { ValuationDashboardData, ValuationResult } from "@/types/valuation";

// *** CORRECCIÓN: Añadimos 'currentPrice' a la interfaz de Props ***
interface Props {
  results: ValuationDashboardData["valuationResults"];
  marginOfSafety: number | string;
  cagrResults: ValuationDashboardData["cagrResults"];
  currentPrice: number | string; // Prop ahora requerido
}

const IntrinsicValueResults: React.FC<Props> = ({
  results,
  marginOfSafety,
  cagrResults,
  currentPrice, // Recibimos el nuevo prop aquí
}) => {
  const years = Object.keys(results) as (keyof typeof results)[];
  const metrics = Object.keys(results[years[0]]) as (keyof ValuationResult)[];

  // Calculamos el precio objetivo promedio para el último año proyectado (2026e)
  const finalAvgPrice =
    Object.values(results["2026e"]).reduce(
      (sum: number, value: number) => sum + value,
      0
    ) / metrics.length;

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg mt-8 border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Precio objetivo</th>
              {years.map((year) => (
                <th key={year} className="py-2">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric} className="border-b border-gray-200">
                <td className="py-2 font-semibold uppercase">
                  {metric.replace("_", " / ")}
                </td>
                {years.map((year) => (
                  <td key={year} className="py-2">
                    ${results[year][metric].toFixed(2)}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b border-gray-200 bg-gray-100">
              <td className="py-2 font-bold">Promedio</td>
              {years.map((year) => {
                const yearResults = results[year];
                const avg =
                  Object.values(yearResults).reduce(
                    (sum: number, value: number) => sum + value,
                    0
                  ) / metrics.length;
                return (
                  <td key={year} className="py-2 font-bold">
                    ${avg.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        {/* *** MEJORA: Mostramos una comparación clara del precio actual vs. el objetivo *** */}
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px] text-center">
          <p className="text-gray-500 text-sm">
            Precio Actual vs. Objetivo 2026e
          </p>
          <p className="font-bold text-2xl">
            <span className="text-green-600">
              $
              {typeof currentPrice === "number"
                ? currentPrice.toFixed(2)
                : currentPrice}
            </span>
            <span className="text-gray-400 mx-2">→</span>
            <span className="text-blue-600">${finalAvgPrice.toFixed(2)}</span>
          </p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px] text-center">
          <p className="text-gray-500 text-sm">Margen de seguridad</p>
          <p className="font-bold text-2xl text-green-600">{marginOfSafety}%</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px] text-center">
          <p className="text-gray-500 text-sm">
            Retorno Anualizado (CAGR 5 años)
          </p>
          <p className="font-bold text-2xl text-green-600">
            {cagrResults.ev_fcf}%
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntrinsicValueResults;
