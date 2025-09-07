"use client";

import { useState, useEffect } from "react";

// Define la interfaz para la estructura de los datos financieros
interface FinancialData {
  headers: string[];
  metrics: {
    totalRevenue: number[];
    costOfRevenue: number[];
    grossProfit: number[];
    ebit: number[];
    ebitda: number[];
    netIncome: number[];
    basicEps: number[];
    dilutedEps: number[];
    basicAverageShares: number[];
    dilutedAverageShares: number[];
    taxRateForCalcs: number[];
    taxEffectOfUnusualItems: number[];
  };
}

// Define la interfaz para los datos de la tabla
interface TableRow {
  name: string;
  values: number[];
}

export default function FutureFinancialTable() {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para obtener los datos de la nueva API Route
  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Llamada directa a la API, que ahora no requiere un ticker
      const response = await fetch(`/api/proyecciones-futuras`);
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API");
      }
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []); // Se ejecuta solo una vez al cargar el componente

  // Prepara los datos para renderizar la tabla
  const tableRows: TableRow[] = data
    ? [
        { name: "Total Revenue", values: data.metrics.totalRevenue },
        { name: "Cost of Revenue", values: data.metrics.costOfRevenue },
        { name: "Gross Profit", values: data.metrics.grossProfit },
        { name: "EBIT", values: data.metrics.ebit },
        { name: "EBITDA", values: data.metrics.ebitda },
        { name: "Net Income", values: data.metrics.netIncome },
        { name: "Basic EPS", values: data.metrics.basicEps },
        { name: "Diluted EPS", values: data.metrics.dilutedEps },
        {
          name: "Basic Average Shares",
          values: data.metrics.basicAverageShares,
        },
        {
          name: "Diluted Average Shares",
          values: data.metrics.dilutedAverageShares,
        },
        { name: "Tax Rate for Calcs", values: data.metrics.taxRateForCalcs },
        {
          name: "Tax Effect of Unusual Items",
          values: data.metrics.taxEffectOfUnusualItems,
        },
      ]
    : [];

  return (
    <div className="container mx-auto p-4 md:p-8 bg-gray-950 text-white min-h-screen font-sans">
      <div className="flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 text-center text-teal-400">
          Datos Financieros de ROAD
        </h1>
        <p className="text-lg md:text-xl text-gray-400 text-center mb-6">
          Obtén datos financieros de Yahoo Finance
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-500"></div>
          <p className="ml-4 text-xl text-teal-400">Cargando...</p>
        </div>
      )}

      {error && (
        <div className="text-center p-8 bg-red-900 rounded-lg shadow-lg">
          <p className="text-red-300 text-lg">Error: {error}</p>
        </div>
      )}

      {data && !loading && (
        <div className="overflow-x-auto rounded-xl shadow-2xl bg-gray-800">
          <table className="min-w-full divide-y divide-gray-700">
            {/* Encabezados de la tabla */}
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Métrica
                </th>
                {data.headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody className="bg-gray-800 divide-y divide-gray-700">
              {tableRows.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-gray-700 transition-colors duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-200">
                    {row.name}
                  </td>
                  {row.values.map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-400"
                    >
                      {value.toLocaleString()}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
