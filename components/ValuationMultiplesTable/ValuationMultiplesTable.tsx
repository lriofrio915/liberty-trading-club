// components/ValuationMultiplesTable/ValuationMultiplesTable.tsx
import React from "react";
import { ValuationMetrics } from "@/types/valuation";
import Tooltip from "../Shared/Tooltips"; // Importamos el componente Tooltip

interface Props {
  multiples: ValuationMetrics;
  currentPrice: number;
}

const ValuationMultiplesTable: React.FC<Props> = ({
  multiples,
  currentPrice,
}) => {
  const metricDescriptions: { [key: string]: string } = {
    per: "Mide cuánto están los inversores dispuestos a pagar por cada dólar de ganancias de una empresa.",
    ev_fcf:
      "Compara el valor total de la empresa con el flujo de caja libre. Es útil porque se enfoca en la caja real que la empresa produce.",
    ev_ebitda:
      "Compara el valor total de la empresa con las ganancias antes de intereses, impuestos, depreciación y amortización. Es una medida de la rentabilidad operativa.",
    ev_ebit:
      "Similar al EV/EBITDA, pero excluye la depreciación y amortización. Útil para comparar empresas con diferentes estructuras de capital.",
  };

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Múltiplos de valoración</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Precio por acción actual</p>
          <p className="text-2xl font-bold text-green-600">
            ${currentPrice.toFixed(2)}
          </p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Métrica</th>
            <th className="py-2">LTM</th>
            <th className="py-2">NTM</th>
            <th className="py-2">Objetivo</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(multiples).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="py-2 font-semibold uppercase">
                <Tooltip
                  text={metricDescriptions[key] || "Descripción no disponible."}
                >
                  {key.replace("_", " / ")}
                </Tooltip>
              </td>
              <td className="py-2">{value.ltm}</td>
              <td className="py-2">{value.ntm}</td>
              <td className="py-2 text-red-600 font-bold">{value.target}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationMultiplesTable;
