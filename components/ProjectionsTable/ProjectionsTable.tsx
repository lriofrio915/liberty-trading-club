"use client";

import React, { useState } from "react";
import Tooltip from "../Shared/Tooltips";

// La interfaz ahora espera los promedios calculados como props
interface Props {
  averages: {
    salesGrowth: string;
    ebitMargin: string;
    taxRate: string;
    sharesIncrease: string;
  };
}

const ProjectionsTable: React.FC<Props> = ({ averages }) => {
  // El estado ahora solo maneja las estimaciones del usuario
  const [estimates, setEstimates] = useState({
    salesGrowth: "12.00", // Valor inicial de ejemplo
    ebitMargin: "28.00",
    taxRate: "21.00",
    sharesIncrease: "0.05",
  });

  const projectionDescriptions: { [key: string]: string } = {
    salesGrowth:
      "Tasa de crecimiento anual promedio esperada en las ventas de la empresa.",
    ebitMargin:
      "La rentabilidad operativa de la empresa. Mide el porcentaje de las ventas que se convierte en ganancias antes de intereses e impuestos.",
    taxRate:
      "La tasa de impuestos corporativos que se espera que pague la empresa.",
    sharesIncrease:
      "El cambio proyectado en el número de acciones en circulación, que afecta el valor por acción.",
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEstimates((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // La data ahora se construye directamente a partir de las props y el estado
  const projectionsToDisplay = [
    {
      key: "salesGrowth",
      name: "Crecimiento de Ventas",
      average: averages.salesGrowth,
    },
    { key: "ebitMargin", name: "Margen EBIT", average: averages.ebitMargin },
    {
      key: "taxRate",
      name: "Tasa de Impuestos",
      average: averages.taxRate,
    },
    {
      key: "sharesIncrease",
      name: "Aumento de Acciones",
      average: averages.sharesIncrease,
    },
  ];

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200 h-full">
      <h3 className="text-xl font-semibold mb-4">Proyección a futuro</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Métrica</th>
            <th className="py-2 text-center">
              <div className="flex flex-col items-center">
                <span>Promedio</span>
                <span className="text-xs font-normal">2021-2024</span>
              </div>
            </th>
            <th className="py-2 text-center">
              <div className="flex flex-col items-center">
                <span>Estimaciones</span>
                <span className="text-xs font-normal">2025e-2026e</span>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {projectionsToDisplay.map((proj) => (
            <tr
              key={proj.key}
              className="border-b border-gray-200 last:border-b-0"
            >
              <td className="py-2">
                <Tooltip text={projectionDescriptions[proj.key] || ""}>
                  {proj.name}
                </Tooltip>
              </td>
              <td className="py-2 text-center font-semibold text-gray-600">
                {proj.average}
              </td>
              <td className="py-2 text-center text-red-600 font-bold">
                <div className="flex justify-center items-center">
                  <input
                    type="number"
                    name={proj.key}
                    value={estimates[proj.key as keyof typeof estimates]}
                    onChange={handleInputChange}
                    className="w-20 text-center bg-transparent border-none focus:outline-none focus:ring-0"
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
