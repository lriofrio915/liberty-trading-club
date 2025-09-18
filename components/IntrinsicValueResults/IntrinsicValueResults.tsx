// components/IntrinsicValueResults/IntrinsicValueResults.tsx
import React from "react";
// Importamos los tipos corregidos
import { ValuationResult, ValuationDataType } from "@/types/valuation";

interface Props {
  results: ValuationDataType["valuationResults"];
  marginOfSafety: number | string;
  cagrResults: ValuationDataType["cagrResults"];
}

const IntrinsicValueResults: React.FC<Props> = ({
  results,
  marginOfSafety,
  cagrResults,
}) => {
  // --- ✨ CORRECCIÓN CLAVE AQUÍ ---
  const years = Object.keys(results) as (keyof typeof results)[];
  if (years.length === 0) return null; // Guarda contra un objeto vacío

  // Le decimos a TypeScript que las métricas son las claves de un objeto ValuationResult
  const metrics = Object.keys(results[years[0]]) as (keyof ValuationResult)[];

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
                  {/* 'metric' ahora es un string garantizado, por lo que '.replace' es seguro */}
                  {metric.replace("_", " / ")}
                </td>
                {years.map((year) => (
                  <td key={`${year}-${metric}`} className="py-2">
                    {/* TypeScript ahora sabe que results[year][metric] es un acceso válido */}
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
                    (sum, value) => sum + value,
                    0
                  ) / metrics.length;
                return (
                  <td key={`${year}-avg`} className="py-2 font-bold">
                    ${avg.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px]">
          <p className="text-gray-500 text-sm">Margen de seguridad</p>
          <p className="font-bold text-2xl text-green-600">{marginOfSafety}%</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px]">
          <p className="text-gray-500 text-sm">
            Retorno Anualizado (CAGR 5 años)
          </p>
          <p className="font-bold text-2xl text-green-600">
            {/* 'metric' ya no existe en este scope, accedemos directamente a cagrResults */}
            {typeof cagrResults.ev_fcf === "number"
              ? `${cagrResults.ev_fcf.toFixed(2)}%`
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntrinsicValueResults;
