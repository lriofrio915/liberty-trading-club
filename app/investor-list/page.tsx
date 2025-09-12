"use client";

import React, { useState } from "react";

// Interfaces de TypeScript para definir la estructura de los datos
interface Transaction {
  date: string;
  type: "Aporte" | "Retiro";
  amount: number;
}

interface Position {
  asset: string;
  ticker: string;
  quantity: number;
  averageBuyPrice: number;
  currentMarketPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercentage: number;
}

interface Client {
  id: string;
  name: string;
  initialCapital: number;
  currentCapital: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  transactions: Transaction[];
  portfolio: Position[];
}

// Datos de ejemplo hardcodeados
const calculateClientData = (
  client: Omit<
    Client,
    "currentCapital" | "totalGainLoss" | "totalGainLossPercentage"
  >
): Client => {
  const currentCapital = client.portfolio.reduce(
    (sum, pos) => sum + pos.value,
    client.initialCapital
  );
  const totalGainLoss = currentCapital - client.initialCapital;
  const totalGainLossPercentage = (totalGainLoss / client.initialCapital) * 100;

  return {
    ...client,
    currentCapital,
    totalGainLoss,
    totalGainLossPercentage,
  };
};

const clientsData: Client[] = [
  calculateClientData({
    id: "001",
    name: "Stefanny Medrano",
    initialCapital: 4000,
    transactions: [{ date: "2025-09-10", type: "Aporte", amount: 4000 }],
    portfolio: [
      {
        asset: "Acciones de Apple",
        ticker: "AAPL",
        quantity: 10,
        averageBuyPrice: 170.0,
        currentMarketPrice: 175.0,
        value: 1750,
        gainLoss: 50,
        gainLossPercentage: 2.94,
      },
      {
        asset: "ETF SPY",
        ticker: "SPY",
        quantity: 5,
        averageBuyPrice: 450.0,
        currentMarketPrice: 460.0,
        value: 2300,
        gainLoss: 50,
        gainLossPercentage: 2.22,
      },
    ],
  }),
  calculateClientData({
    id: "002",
    name: "Luis Riofrio",
    initialCapital: 1000,
    transactions: [{ date: "2025-09-10", type: "Aporte", amount: 1000 }],
    portfolio: [
      {
        asset: "Acciones de Microsoft",
        ticker: "MSFT",
        quantity: 3,
        averageBuyPrice: 280.0,
        currentMarketPrice: 285.0,
        value: 855,
        gainLoss: 15,
        gainLossPercentage: 1.78,
      },
      {
        asset: "Bonos del Tesoro",
        ticker: "TLT",
        quantity: 2,
        averageBuyPrice: 110.0,
        currentMarketPrice: 105.0,
        value: 210,
        gainLoss: -10,
        gainLossPercentage: -4.55,
      },
    ],
  }),
];

// Componente para el resumen de clientes
const ClientSummary: React.FC<{ onSelectClient: (client: Client) => void }> = ({
  onSelectClient,
}) => {
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 text-center">
        Resumen de Clientes
      </h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-4xl mx-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capital Inicial
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Capital Actual
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
            {clientsData.map((client: Client) => (
              <tr
                key={client.id}
                className="hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                onClick={() => onSelectClient(client)}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {client.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {client.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $
                  {client.initialCapital.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  $
                  {client.currentCapital.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`${
                      client.totalGainLoss >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    $
                    {client.totalGainLoss.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                      signDisplay: "always",
                    })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <span
                    className={`${
                      client.totalGainLossPercentage >= 0
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {client.totalGainLossPercentage.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Componente para el detalle del cliente
const ClientDetail: React.FC<{ client: Client | null }> = ({ client }) => {
  if (!client) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>Selecciona un cliente de la lista para ver su detalle.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-gray-800 text-center">
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
                $
                {client.initialCapital.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Capital Actual</p>
              <p className="text-lg font-bold text-gray-900">
                $
                {client.currentCapital.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ganancia/Pérdida</p>
              <p
                className={`text-lg font-bold ${
                  client.totalGainLoss >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                $
                {client.totalGainLoss.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                  signDisplay: "always",
                })}
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
                      $
                      {position.averageBuyPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $
                      {position.currentMarketPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      $
                      {position.value.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span
                        className={`${
                          position.gainLoss >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        $
                        {position.gainLoss.toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                          signDisplay: "always",
                        })}
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
    </div>
  );
};

// Componente principal de la página
export default function InvestorListPage() {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <ClientSummary onSelectClient={setSelectedClient} />
      <ClientDetail client={selectedClient} />
    </div>
  );
}
