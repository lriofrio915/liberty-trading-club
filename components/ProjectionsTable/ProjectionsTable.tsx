// components/ProjectionsTable/ProjectionsTable.tsx
"use client";

import React, { Dispatch, SetStateAction } from "react";
import Tooltip from "../Shared/Tooltips";

// Interfaz para los datos que se obtienen de la API
interface FinancialAverages {
  salesGrowth: number | string;
  ebitMargin: number | string;
  taxRate: number | string;
  sharesIncrease: number | string;
}

interface EstimatesState {
  salesGrowth: number;
  ebitMargin: number;
  taxRate: number;
  sharesIncrease: number;
}

// Interfaz actualizada para las Props del componente
interface Props {
  estimates: EstimatesState;
  setEstimates: Dispatch<SetStateAction<EstimatesState>>;
  financialAverages: FinancialAverages;
}

const ProjectionsTable: React.FC<Props> = ({
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
            <th className="py-2 text-center">
              <div className="flex flex-col items-center">
                <span>Promedio</span>
                <span className="text-sm font-normal">2022 - 2025</span>
              </div>
            </th>
            <th className="py-2 text-center">
              <div className="flex flex-col items-center">
                <span>Estimaciones</span>
                <span className="text-sm font-normal">2026e</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {projectionsToDisplay.map((projection) => (
            <tr key={projection.key} className="border-b border-gray-200">
              <td className="py-2">
                <Tooltip text={metricDescriptions[projection.key] || ""}>
                  {projection.name}
                </Tooltip>
              </td>
              <td className="py-2 text-center font-semibold">
                {`${
                  financialAverages[projection.key as keyof FinancialAverages]
                }%`}
              </td>
              <td className="py-2 text-center text-red-600 font-bold">
                <div className="flex justify-center items-center">
                  <input
                    type="number"
                    name={projection.key}
                    value={estimates[projection.key as keyof EstimatesState]}
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
