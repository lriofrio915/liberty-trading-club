// components/ProjectionsTable/ProjectionsTable.tsx
import React from "react";
import { ProjectionsData } from "@/types/valuation";

interface Props {
  data: ProjectionsData;
}

const ProjectionsTable: React.FC<Props> = ({ data }) => {
  // CAMBIOS AQUI: bg-white y text-gray-800
  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <h3 className="text-xl font-semibold mb-4">Proyección a futuro</h3>
      <table className="w-full text-left">
        <thead>
          {/* CAMBIO AQUI: border-gray-200 y text-gray-500 */}
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2"></th>
            <th className="py-2">Promedio 2015 - 2021</th>
            <th className="py-2">Estimaciones 2022e - 2026e</th>
          </tr>
        </thead>
        <tbody>
          {/* CAMBIO AQUI: border-gray-200 */}
          <tr className="border-b border-gray-200">
            <td className="py-2">Crecimiento en Ventas</td>
            <td className="py-2">37%</td>
            <td className="py-2 text-red-600 font-bold">{data.salesGrowth}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2">Margen EBIT</td>
            <td className="py-2">42%</td>
            <td className="py-2 text-red-600 font-bold">{data.ebitMargin}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2">Tax Rate</td>
            <td className="py-2">21%</td>
            <td className="py-2 text-red-600 font-bold">{data.taxRate}</td>
          </tr>
          <tr className="border-b border-gray-200">
            <td className="py-2">Aumento n° acciones</td>
            <td className="py-2">0%</td>
            <td className="py-2 text-red-600 font-bold">
              {data.sharesIncrease}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProjectionsTable;
