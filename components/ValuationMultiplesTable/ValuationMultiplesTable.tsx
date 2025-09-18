// components/ValuationMultiplesTable/ValuationMultiplesTable.tsx
"use client";
import React, { useState } from "react";
import Tooltip from "../Shared/Tooltips";
// Importamos los tipos corregidos
import { ValuationMultiples } from "@/types/valuation";

interface Props {
  currentPrice: number;
  multiples: ValuationMultiples;
}

const ValuationMultiplesTable: React.FC<Props> = ({
  currentPrice,
  multiples,
}) => {
  const [targets, setTargets] = useState({
    per: 20,
    ev_fcf: 20,
    ev_ebitda: 16,
    ev_ebit: 16,
  });

  const handleTargetChange = (key: keyof typeof targets, value: string) => {
    setTargets((prev) => ({
      ...prev,
      [key]: parseFloat(value) || 0,
    }));
  };

  const metricDescriptions: { [key: string]: string } = {
    per: "Price-to-Earnings: Compara el precio de la acción con sus ganancias por acción.",
    ev_ebitda: "Enterprise Value to EBITDA: Mide la rentabilidad operativa.",
    ev_ebit:
      "Enterprise Value to EBIT: Similar a EV/EBITDA, excluye depreciación.",
    ev_fcf:
      "Enterprise Value to Free Cash Flow: Mide la capacidad de generar efectivo.",
  };

  // --- ✨ CORRECCIÓN CLAVE AQUÍ ---
  // Le decimos a TypeScript que las claves de 'multiples' son del tipo 'keyof ValuationMultiples'
  const metricKeys = Object.keys(multiples) as Array<keyof ValuationMultiples>;

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
            <th className="py-2">LTM</th>
            <th className="py-2">Objetivo</th>
          </tr>
        </thead>
        <tbody>
          {/* Usamos las claves ya tipadas para iterar */}
          {metricKeys.map((key) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="py-2 font-semibold uppercase">
                <Tooltip text={metricDescriptions[key] || ""}>
                  {/* El error de 'replace' se soluciona porque 'key' es ahora un string garantizado */}
                  {key.replace("_", " / ")}
                </Tooltip>
              </td>
              <td className="py-2">
                {/* Ahora TypeScript sabe que multiples[key] es válido */}
                {typeof multiples[key].ltm === "number"
                  ? (multiples[key].ltm as number).toFixed(2)
                  : multiples[key].ltm}
              </td>
              <td className="py-2 text-red-600 font-bold">
                <input
                  type="number"
                  value={targets[key]}
                  onChange={(e) => handleTargetChange(key, e.target.value)}
                  className="w-20 text-right bg-transparent border-none outline-none focus:ring-0"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationMultiplesTable;
