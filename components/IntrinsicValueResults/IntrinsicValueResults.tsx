// components/IntrinsicValueResults/IntrinsicValueResults.tsx
import React from "react";
import {
  AssetData,
  ValuationResult,
} from "@/types/valuation";

interface Props {
  results: AssetData["valuationResults"];
  marginOfSafety: number | string;
  cagrResults: AssetData["cagrResults"];
  currentPrice: number | string;
  multiples: AssetData["multiples"];
}

const IntrinsicValueResults: React.FC<Props> = ({
  results,
  marginOfSafety,
  cagrResults,
  currentPrice,
}) => {
  const metrics = Object.keys(results["2022e"]) as Array<keyof ValuationResult>;
  const finalAvgPrice =
    Object.values(results["2026e"]).reduce(
      (sum: number, value: number) => sum + value,
      0
    ) / metrics.length;

  // Nombres descriptivos para las métricas
  const metricNames: Record<string, string> = {
    per: "Precio/Beneficios (P/E)",
    ev_ebitda: "Empresa/EBITDA (EV/EBITDA)",
    ev_ebit: "Empresa/EBIT (EV/EBIT)",
    ev_fcf: "Empresa/FCF (EV/FCF)",
  };

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg mt-8 border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">
        Valoración Intrínseca por Múltiplos
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-left whitespace-nowrap">
          <thead>
            <tr className="border-b border-gray-200 text-gray-500">
              <th className="py-2">Métrica</th>
              <th className="py-2 text-center">2025e</th>
              <th className="py-2 text-center">2026e</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric) => (
              <tr key={metric} className="border-b border-gray-200">
                <td className="py-2 font-semibold">
                  {metricNames[metric] || String(metric).replace(/_/g, " / ")}
                </td>
                <td className="py-2 text-center font-bold text-blue-600">
                  ${results["2025e"][metric].toFixed(2)}
                </td>
                <td className="py-2 text-center font-bold text-blue-600">
                  ${results["2026e"][metric].toFixed(2)}
                </td>
              </tr>
            ))}
            <tr className="border-b border-gray-200 bg-gray-100">
              <td className="py-2 font-bold">Promedio</td>
              <td className="py-2 font-bold text-center text-green-600">
                $
                {(
                  Object.values(results["2025e"]).reduce(
                    (sum, val) => sum + val,
                    0
                  ) / metrics.length
                ).toFixed(2)}
              </td>
              <td className="py-2 font-bold text-center text-green-600">
                ${finalAvgPrice.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">
          ¿Cómo calculamos el valor intrínseco?
        </h4>
        <p className="text-sm text-blue-700 mb-3">
          Utilizamos proyecciones financieras para 2025 y 2026 aplicando
          múltiplos de valoración objetivo. Cada métrica combina estimaciones de
          crecimiento con múltiplos de referencia de la industria para
          determinar el precio teórico justo de la acción.
        </p>

        <div className="text-sm text-blue-700">
          <p className="font-medium mb-1">Fórmulas utilizadas:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">P/E Ratio:</span> Precio = EPS
              estimado × Múltiplo P/E objetivo
            </li>
            <li>
              <span className="font-medium">EV/EBITDA:</span> Precio = (EBITDA
              estimado × Múltiplo EV/EBITDA - Deuda Neta + Efectivo) / Acciones
            </li>
            <li>
              <span className="font-medium">EV/EBIT:</span> Precio = (EBIT
              estimado × Múltiplo EV/EBIT - Deuda Neta + Efectivo) / Acciones
            </li>
            <li>
              <span className="font-medium">EV/FCF:</span> Precio = (FCF
              estimado × Múltiplo EV/FCF - Deuda Neta + Efectivo) / Acciones
            </li>
          </ul>

          <p className="font-medium mt-3 mb-1">Variables clave:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">EPS:</span> Ganancias por Acción (
              Earnings per Share)
            </li>
            <li>
              <span className="font-medium">EBITDA:</span> Ganancias antes de
              Intereses, Impuestos, Depreciación y Amortización
            </li>
            <li>
              <span className="font-medium">EBIT:</span> Ganancias antes de
              Intereses e Impuestos
            </li>
            <li>
              <span className="font-medium">FCF:</span> Flujo de Caja Libre
              (Free Cash Flow)
            </li>
            <li>
              <span className="font-medium">Deuda Neta:</span> Deuda total menos
              efectivo y equivalentes
            </li>
          </ul>
        </div>
      </div>

      <div className="flex justify-between items-center mt-4 flex-wrap gap-4">
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
            {typeof cagrResults.ev_fcf === "number"
              ? cagrResults.ev_fcf.toFixed(2)
              : "N/A"}
            %
          </p>
        </div>
      </div>
    </div>
  );
};

export default IntrinsicValueResults;
