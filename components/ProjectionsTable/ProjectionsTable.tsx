// components/ProjectionsTable/ProjectionsTable.tsx
import React from "react";
import { ProjectionsData } from "@/types/valuation";
import Tooltip from "../Shared/Tooltips"; // Importamos el componente Tooltip

interface Props {
  data: ProjectionsData;
}

const ProjectionsTable: React.FC<Props> = ({ data }) => {
  const projectionDescriptions: { [key: string]: string } = {
    salesGrowth:
      "La tasa de crecimiento anual promedio esperada en las ventas de la empresa.",
    ebitMargin:
      "La rentabilidad operativa de la empresa. Mide el porcentaje de las ventas que se convierte en ganancias antes de intereses e impuestos.",
    taxRate:
      "La tasa de impuestos corporativos que se espera que pague la empresa.",
    sharesIncrease:
      "El cambio proyectado en el número de acciones en circulación, lo cual afecta el valor por acción.",
  };

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Proyección a futuro</h3>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Métrica</th>
            <th className="py-2">Promedio 2015 - 2021</th>
            <th className="py-2">Estimaciones 2022e - 2026e</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="py-2">
                <Tooltip
                  text={
                    projectionDescriptions[key] || "Descripción no disponible."
                  }
                >
                  {key.charAt(0).toUpperCase() +
                    key.slice(1).replace(/([A-Z])/g, " $1")}
                </Tooltip>
              </td>
              <td className="py-2">
                {key === "sharesIncrease" ? "0%" : "N/A"}
              </td>
              {/* Valores simulados */}
              <td className="py-2 text-red-600 font-bold">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectionsTable;
