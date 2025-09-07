// Componente de frontend para mostrar datos financieros de cualquier ticker
"use client";

import React, { useState, useEffect } from "react";

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
    pretaxIncome: number[]; // Agregado para el cálculo de la tasa impositiva
  };
}

// Define la interfaz para los datos de la tabla
interface TableRow {
  name: string;
  values: (number | string)[];
}

interface FutureFinancialTableProps {
  ticker: string;
}

const formatNumber = (num: number) => {
  if (num === 0) return "0";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

// Función para calcular el crecimiento de ventas en porcentaje
const calculateSalesGrowth = (revenues: number[]): (number | string)[] => {
  const salesGrowth: (number | string)[] = [];
  salesGrowth.push("N/A"); // El primer valor (TTM) no tiene crecimiento anual
  for (let i = 1; i < revenues.length; i++) {
    const currentRevenue = revenues[i];
    const previousRevenue = revenues[i + 1];
    if (previousRevenue === 0 || previousRevenue === undefined) {
      salesGrowth.push("N/A");
    } else {
      const growth =
        ((currentRevenue - previousRevenue) / previousRevenue) * 100;
      salesGrowth.push(parseFloat(growth.toFixed(2)));
    }
  }
  return salesGrowth;
};

// Función para calcular el margen EBIT
const calculateEbitMargin = (
  ebits: number[],
  revenues: number[]
): (number | string)[] => {
  const ebitMargins: (number | string)[] = [];
  for (let i = 0; i < ebits.length; i++) {
    const ebit = ebits[i];
    const revenue = revenues[i];
    if (revenue === 0) {
      ebitMargins.push("N/A");
    } else {
      const margin = (ebit / revenue) * 100;
      ebitMargins.push(parseFloat(margin.toFixed(2)));
    }
  }
  return ebitMargins;
};

// Función para calcular la tasa impositiva real
const calculateTaxRate = (
  taxProvisions: number[],
  pretaxIncomes: number[]
): (number | string)[] => {
  const taxRates: (number | string)[] = [];
  for (let i = 0; i < taxProvisions.length; i++) {
    const taxProvision = taxProvisions[i];
    const pretaxIncome = pretaxIncomes[i];
    if (pretaxIncome === 0) {
      taxRates.push("N/A");
    } else {
      const rate = (taxProvision / pretaxIncome) * 100;
      taxRates.push(parseFloat(rate.toFixed(2)));
    }
  }
  return taxRates;
};

// Función para calcular el aumento de acciones
const calculateSharesIncrease = (shares: number[]): (number | string)[] => {
  const sharesIncrease: (number | string)[] = [];
  sharesIncrease.push("N/A"); // El primer valor (TTM) no tiene un aumento anual
  for (let i = 1; i < shares.length; i++) {
    const currentShares = shares[i];
    const previousShares = shares[i + 1];
    if (previousShares === 0 || previousShares === undefined) {
      sharesIncrease.push("N/A");
    } else {
      const increase =
        ((currentShares - previousShares) / previousShares) * 100;
      sharesIncrease.push(parseFloat(increase.toFixed(2)));
    }
  }
  return sharesIncrease;
};

export default function FutureFinancialTable({
  ticker,
}: FutureFinancialTableProps) {
  const [data, setData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (currentTicker: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/proyecciones-futuras?ticker=${currentTicker}`
      );
      if (!response.ok) {
        throw new Error("No se pudo obtener la respuesta de la API");
      }
      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setData(result);
    } catch (err: any) {
      setError(err.message);
      console.error(err);
      setData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (ticker) {
      fetchData(ticker);
    }
  }, [ticker]); // Se ejecuta cada vez que el ticker cambia

  const tableRows: TableRow[] = data
    ? [
        { name: "Total Revenue", values: data.metrics.totalRevenue },
        {
          name: "Sales Growth (%)",
          values: calculateSalesGrowth(data.metrics.totalRevenue),
        },
        { name: "Cost of Revenue", values: data.metrics.costOfRevenue },
        { name: "Gross Profit", values: data.metrics.grossProfit },
        { name: "EBIT", values: data.metrics.ebit },
        {
          name: "EBIT Margin (%)",
          values: calculateEbitMargin(
            data.metrics.ebit,
            data.metrics.totalRevenue
          ),
        },
        { name: "EBITDA", values: data.metrics.ebitda },
        { name: "Net Income", values: data.metrics.netIncome },
        { name: "Basic EPS", values: data.metrics.basicEps },
        { name: "Diluted EPS", values: data.metrics.dilutedEps },
        {
          name: "Basic Average Shares",
          values: data.metrics.basicAverageShares,
        },
        {
          name: "Shares Increase (%)",
          values: calculateSharesIncrease(data.metrics.basicAverageShares),
        },
        {
          name: "Diluted Average Shares",
          values: data.metrics.dilutedAverageShares,
        },
        { name: "Tax Rate for Calcs", values: data.metrics.taxRateForCalcs },
        {
          name: "Real Tax Rate (%)",
          values: calculateTaxRate(
            data.metrics.taxRateForCalcs,
            data.metrics.netIncome
          ),
        },
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
          Datos Financieros de {ticker}
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
                      {typeof value === "number" ? formatNumber(value) : value}
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
