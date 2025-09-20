// components/ProjectionsTable/ProjectionsTable.tsx
"use client";

import React, { Dispatch, SetStateAction } from "react";
import Tooltip from "../Shared/Tooltips";

// Interfaz para el estado de las estimaciones
interface EstimatesState {
  salesGrowth: number;
  ebitMargin: number;
  taxRate: number; // Añadido
  sharesIncrease: number;
}

// Interfaz para los promedios recibidos como props
interface FinancialAverages {
  salesGrowth: string;
  ebitMargin: string;
  taxRate: string;
  sharesIncrease: string;
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
  const projectionDescriptions: { [key: string]: string } = {
    salesGrowth:
      "Tasa de crecimiento anual promedio esperada en las ventas de la empresa.",
    ebitMargin:
      "La rentabilidad operativa de la empresa. Mide el porcentaje de ventas que se convierte en ganancias antes de intereses e impuestos.",
    taxRate:
      "La tasa de impuestos corporativos que se espera que pague la empresa.",
    sharesIncrease:
      "El cambio proyectado en el número de acciones en circulación, que afecta el valor por acción.",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstimates((prevEstimates) => ({
      ...prevEstimates,
      [name]: parseFloat(value) || 0,
    }));
  };

  // *** CORRECCIÓN AQUÍ: Se añade Tax Rate a la lista de proyecciones a mostrar ***
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
            <th className="py-2 text-center">Promedio Hist.</th>
            <th className="py-2 text-center">Estimación (2026e)</th>
          </tr>
        </thead>
        <tbody>
          {projectionsToDisplay.map((projection) => (
            <tr key={projection.key} className="border-b border-gray-200">
              <td className="py-2">
                <Tooltip text={projectionDescriptions[projection.key] || ""}>
                  {projection.name}
                </Tooltip>
              </td>
              <td className="py-2 text-center font-semibold">
                {`${
                  financialAverages[projection.key as keyof FinancialAverages]
                }%`}
              </td>
              <td className="py-2 text-red-600 font-bold">
                <div className="flex justify-center items-center">
                  <input
                    type="number"
                    name={projection.key}
                    value={estimates[projection.key as keyof EstimatesState]}
                    onChange={handleInputChange}
                    className="w-24 text-center bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    step="0.01"
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
