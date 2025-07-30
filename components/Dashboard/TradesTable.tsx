// components/Dashboard/TradesTable.tsx
"use client"; // Necesitamos que sea un Client Component para manejar el estado de paginación

import { useState, useMemo } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"; // Importamos iconos de Heroicons

interface Trade {
  id: number;
  asset: string;
  side: "Compra" | "Venta";
  date: string;
  time: string;
  duration: string;
  entryPrice: number;
  netProfit: number;
  // Si planeas usar 'sentiment' y 'strategy', asegúrate de que estén en los datos detailedTradesData
  // y añade sus respectivas columnas y celdas en la tabla.
}

interface TradesTableProps {
  trades: Trade[];
}

export default function TradesTable({ trades }: TradesTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(7); // Valor por defecto de filas por página, como en tu imagen

  const totalTrades = trades.length;
  const totalPages = Math.ceil(totalTrades / rowsPerPage);

  // Calcula los trades a mostrar en la página actual
  const currentTrades = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return trades.slice(startIndex, endIndex);
  }, [currentPage, rowsPerPage, trades]);

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };

  const handleRowsPerPageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setRowsPerPage(Number(event.target.value));
    setCurrentPage(1); // Volver a la primera página al cambiar filas por página
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0A2342] mb-6">
        Información Detallada
      </h2>
      <div className="overflow-x-auto rounded-lg shadow-md border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {/* Nueva columna para el número */}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N°
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Activo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Lado
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha Apertura
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Duración
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Precio Entrada
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Beneficio Neto
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentTrades.map(
              (
                trade,
                index // Añadir 'index' al map
              ) => (
                <tr key={trade.id}>
                  {/* Celda para el número de fila */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {(currentPage - 1) * rowsPerPage + index + 1}{" "}
                    {/* Calcula el número de la fila */}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {trade.asset}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trade.side}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trade.date} <br /> {trade.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trade.duration}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {trade.entryPrice}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold">
                    <span
                      className={
                        trade.netProfit > 0
                          ? "text-[#2CA58D]"
                          : "text-[#D9534F]"
                      }
                    >
                      {trade.netProfit > 0
                        ? `$${trade.netProfit.toLocaleString("en-US", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 2,
                          })}`
                        : `-$${Math.abs(trade.netProfit).toLocaleString(
                            "en-US",
                            {
                              minimumFractionDigits: 0,
                              maximumFractionDigits: 2,
                            }
                          )}`}
                    </span>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Controles de Paginación */}
      <div className="flex justify-between items-center mt-4 text-sm text-gray-700">
        {/* "Rows per page" */}
        <div className="flex items-center space-x-2">
          <span>Filas por página:</span>
          <select
            value={rowsPerPage}
            onChange={handleRowsPerPageChange}
            className="p-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value={5}>5</option>
            <option value={7}>7</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
            <option value={20}>20</option>
          </select>
        </div>

        {/* Conteo de filas y botones de navegación */}
        <div className="flex items-center space-x-4">
          <span>
            {(currentPage - 1) * rowsPerPage + 1}-
            {Math.min(currentPage * rowsPerPage, totalTrades)} de {totalTrades}
          </span>
          <div className="flex space-x-2">
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className={`p-2 rounded-md transition-colors duration-200
                ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              <ChevronLeftIcon className="h-5 w-5" />
            </button>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-md transition-colors duration-200
                ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }
              `}
            >
              <ChevronRightIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
