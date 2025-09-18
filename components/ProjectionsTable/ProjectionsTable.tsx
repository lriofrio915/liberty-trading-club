// components/ProjectionsTable/ProjectionsTable.tsx
"use client";

import React, { useState } from "react";
import Tooltip from "../Shared/Tooltips";
import { RawYahooFinanceIncomeStatementItem } from "@/types/api";
// Importamos las funciones de cálculo desde nuestro módulo de lógica
import {
  calculateAverageSalesGrowth,
  calculateAverageEbitMargin,
} from "@/lib/valuationCalculations";

interface Props {
  incomeStatementHistory: RawYahooFinanceIncomeStatementItem[];
}

const ProjectionsTable: React.FC<Props> = ({ incomeStatementHistory }) => {
  // Estado local solo para los inputs del usuario
  const [estimates, setEstimates] = useState({
    salesGrowth: "12.0",
    ebitMargin: "28.0",
    taxRate: "21.0",
    sharesIncrease: "0.5",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstimates((prev) => ({ ...prev, [name]: value }));
  };

  const projectionDescriptions: { [key: string]: string } = {
    salesGrowth:
      "La tasa de crecimiento anual promedio esperada en las ventas de la compañía.",
    ebitMargin: "La rentabilidad operativa de la empresa.",
    taxRate:
      "La tasa de impuestos corporativos que se espera que pague la empresa.",
    sharesIncrease:
      "El cambio proyectado en el número de acciones en circulación.",
  };

  // Usamos las funciones de cálculo importadas
  const averageData = {
    salesGrowth: calculateAverageSalesGrowth(incomeStatementHistory),
    ebitMargin: calculateAverageEbitMargin(incomeStatementHistory),
    taxRate: "21.00%", // Placeholder - puedes crear la función de cálculo
    sharesIncrease: "0.50%", // Placeholder - puedes crear la función de cálculo
  };

  const projectionsToDisplay = [
    { key: "salesGrowth", name: "Sales Growth" },
    { key: "ebitMargin", name: "EBIT Margin" },
    { key: "taxRate", name: "Tax Rate" },
    { key: "sharesIncrease", name: "Shares Increase" },
  ];

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Proyección a futuro</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Métrica</th>
            <th className="py-2 text-center">Promedio Histórico</th>
            <th className="py-2 text-center">Estimación 2026e</th>
          </tr>
        </thead>
        <tbody>
          {projectionsToDisplay.map((proj) => (
            <tr key={proj.key} className="border-b border-gray-200">
              <td className="py-2">
                <Tooltip text={projectionDescriptions[proj.key] || ""}>
                  {proj.name}
                </Tooltip>
              </td>
              <td className="py-2 text-center font-semibold">
                {averageData[proj.key as keyof typeof averageData]}
              </td>
              <td className="py-2 text-center text-red-600 font-bold">
                <div className="flex justify-center items-center">
                  <input
                    type="number"
                    name={proj.key}
                    value={estimates[proj.key as keyof typeof estimates]}
                    onChange={handleInputChange}
                    className="w-20 text-center bg-transparent border-none focus:outline-none focus:ring-0"
                    step="0.1"
                  />
                  %
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
