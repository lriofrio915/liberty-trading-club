// components/ValuationMultiplesTable/ValuationMultiplesTable.tsx
import React from "react";
import { ValuationMetrics } from "@/types/valuation";

interface Props {
  multiples: ValuationMetrics;
  currentPrice: number;
}

const ValuationMultiplesTable: React.FC<Props> = ({
  multiples,
  currentPrice,
}) => {
  // CAMBIOS AQUI: bg-white y text-gray-800
  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Múltiplos de valoración</h3>
        <div className="text-right">
          {/* CAMBIO AQUI: text-gray-500 y text-green-600 */}
          <p className="text-sm text-gray-500">Precio por acción actual</p>
          <p className="text-2xl font-bold text-green-600">
            ${currentPrice.toFixed(2)}
          </p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          {/* CAMBIO AQUI: border-gray-200 y text-gray-500 */}
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2"></th>
            <th className="py-2">LTM</th>
            <th className="py-2">NTM</th>
            <th className="py-2">Objetivo</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(multiples).map(([key, value]) => (
            // CAMBIO AQUI: border-gray-200
            <tr key={key} className="border-b border-gray-200">
              <td className="py-2 font-semibold uppercase">
                {key.replace("_", " / ")}
              </td>
              <td className="py-2">{value.ltm}</td>
              <td className="py-2">{value.ntm}</td>
              {/* CAMBIO AQUI: text-red-600 */}
              <td className="py-2 text-red-600 font-bold">{value.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationMultiplesTable;
