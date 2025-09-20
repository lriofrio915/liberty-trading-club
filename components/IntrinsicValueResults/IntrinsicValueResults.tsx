import React from "react";
import { ValuationResult, ValuationDataType } from "@/types/valuation";

interface Props {
  results: ValuationDataType["valuationResults"];
  marginOfSafety: number | string;
  cagrResults: ValuationDataType["cagrResults"];
  currentPrice: number;
}

const IntrinsicValueResults: React.FC<Props> = ({
  results,
  marginOfSafety,
  cagrResults,
  currentPrice,
}) => {
  const years = Object.keys(results) as (keyof typeof results)[];
  if (years.length === 0) return null;

  const metrics = Object.keys(results[years[0]]) as (keyof ValuationResult)[];
  if (metrics.length === 0) return null;

  // Calcula el promedio del precio objetivo para 2026e
  const avg2026 =
    Object.values(results["2026e"]).reduce((a, b) => a + b, 0) / 4;

  // Calcula el CAGR a 2 años (desde el precio actual hasta el objetivo de 2026)
  const cagr =
    currentPrice > 0 && avg2026 > 0
      ? ((Math.pow(avg2026 / currentPrice, 1 / 2) - 1) * 100).toFixed(2)
      : "N/A";

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg mt-8 border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2 px-4">Precio objetivo</th>
              {years.map((year) => (
                <th key={year} className="py-2 px-4 text-right font-semibold">
                  {year}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric} className="border-b border-gray-200">
                <td className="py-2 px-4 font-semibold uppercase text-gray-700">
                  {metric.replace(/_/g, " / ").replace("per / ex", "PER / ex")}
                </td>
                {years.map((year) => (
                  <td
                    key={`${year}-${metric}`}
                    className="py-2 px-4 text-right text-gray-600"
                  >
                    {results[year][metric] > 0
                      ? `$${results[year][metric].toFixed(2)}`
                      : "$0.00"}
                  </td>
                ))}
              </tr>
            ))}
            <tr className="border-b-0 bg-gray-100">
              <td className="py-2 px-4 font-bold text-gray-800">Promedio</td>
              {years.map((year) => {
                const yearResults = results[year];
                const validValues = Object.values(yearResults).filter(
                  (v) => v > 0
                );
                const avg =
                  validValues.length > 0
                    ? validValues.reduce((sum, value) => sum + value, 0) /
                      validValues.length
                    : 0;
                return (
                  <td
                    key={`${year}-avg`}
                    className="py-2 px-4 font-bold text-gray-800 text-right"
                  >
                    ${avg.toFixed(2)}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px] text-center">
          <p className="text-gray-500 text-sm">Margen de seguridad</p>
          <p className="font-bold text-2xl text-green-600">{marginOfSafety}%</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-lg flex-1 min-w-[200px] text-center">
          <p className="text-gray-500 text-sm">
            Retorno Anualizado (CAGR 2 años)
          </p>
          <p className="font-bold text-2xl text-green-600">{cagr}%</p>
        </div>
      </div>
    </div>
  );
};

export default IntrinsicValueResults;
