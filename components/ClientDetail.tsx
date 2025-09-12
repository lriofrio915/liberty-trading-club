// src/components/ClientDetail.tsx

import React from "react";
import { Client, Position } from "../types/interfaces";

interface ClientDetailProps {
  client: Client;
}

const ClientDetail: React.FC<ClientDetailProps> = ({ client }) => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-gray-800">
        Detalle de Cliente: {client.name}
      </h1>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Resumen Financiero
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Capital Inicial</p>
            <p className="text-lg font-bold text-gray-900">
              ${client.initialCapital.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Capital Actual</p>
            <p className="text-lg font-bold text-gray-900">
              ${client.currentCapital.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Ganancia/Pérdida</p>
            <p
              className={`text-lg font-bold ${
                client.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${client.totalGainLoss.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Rendimiento</p>
            <p
              className={`text-lg font-bold ${
                client.totalGainLossPercentage >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {client.totalGainLossPercentage.toFixed(2)}%
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Detalle del Portafolio
        </h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio de Compra
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor Actual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ganancia/Pérdida ($)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rendimiento (%)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {client.portfolio.map((position: Position, index: number) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {position.asset} ({position.ticker})
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {position.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${position.averageBuyPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${position.currentMarketPrice.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ${position.value.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`${
                        position.gainLoss >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${position.gainLoss.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`${
                        position.gainLossPercentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {position.gainLossPercentage.toFixed(2)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClientDetail;
