"use client";

import React, { useState, useMemo } from "react";

// Definición de tipos para los datos de la tabla
interface MacroEconomicData {
  category: string;
  variable: string;
  actualValue: number;
  forecastValue: number;
  unit: string;
  source: string;
  isNegativeForNasdaq: boolean; // Indica si un valor actual > prevision es negativo para el Nasdaq (ej: inflación, desempleo)
}

// Componente para una fila de la tabla
const TableRow: React.FC<{
  data: MacroEconomicData;
  calculateScore: (data: MacroEconomicData) => number;
}> = ({ data, calculateScore }) => {
  const score = useMemo(() => calculateScore(data), [data, calculateScore]);

  // Determina el color de la puntuación
  const scoreColorClass = useMemo(() => {
    if (score === 1) return "bg-green-200 text-green-800";
    if (score === -1) return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  }, [score]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-4 text-sm font-medium text-gray-900">
        {data.category}
      </td>
      <td className="py-2 px-4 text-sm text-gray-700">{data.variable}</td>
      <td className="py-2 px-4 text-sm text-gray-700">{`${data.actualValue}${data.unit}`}</td>
      <td className="py-2 px-4 text-sm text-gray-700">{`${data.forecastValue}${data.unit}`}</td>
      <td
        className={`py-2 px-4 text-sm font-bold text-center rounded-md ${scoreColorClass}`}
      >
        {score}
      </td>
      <td className="py-2 px-4 text-sm text-blue-600 hover:underline">
        <a href={data.source} target="_blank" rel="noopener noreferrer">
          Fuente
        </a>
      </td>
    </tr>
  );
};

// Componente principal de la tabla
const NasdaqSentimentTable: React.FC = () => {
  // Datos harcodeados para simular los valores de Excel
  const [macroEconomicData, setMacroEconomicData] = useState<
    MacroEconomicData[]
  >([
    {
      category: "MACROECONÓMICOS",
      variable: "Crecimiento del PIB",
      actualValue: 3.0,
      forecastValue: 2.4,
      unit: "%",
      source: "https://tradingeconomics.com/united-states/gdp-growth",
      isNegativeForNasdaq: false,
    },
    {
      category: "MACROECONÓMICOS",
      variable: "PMI Manufacturero",
      actualValue: 49.8,
      forecastValue: 49.5,
      unit: "",
      source: "https://tradingeconomics.com/united-states/manufacturing-pmi",
      isNegativeForNasdaq: false,
    },
    {
      category: "MACROECONÓMICOS",
      variable: "PMI de Servicios",
      actualValue: 55.2,
      forecastValue: 53,
      unit: "",
      source: "https://tradingeconomics.com/united-states/services-pmi",
      isNegativeForNasdaq: false,
    },
    {
      category: "MACROECONÓMICOS",
      variable: "Ventas Minoristas",
      actualValue: 0.6,
      forecastValue: 0.1,
      unit: "%",
      source: "https://tradingeconomics.com/united-states/retail-sales",
      isNegativeForNasdaq: false,
    },
    {
      category: "MACROECONÓMICOS",
      variable: "Inflación",
      actualValue: 2.7,
      forecastValue: 2.7,
      unit: "%",
      source: "https://tradingeconomics.com/united-states/inflation-cpi",
      isNegativeForNasdaq: true, // Inflación alta es negativa para el Nasdaq
    },
    {
      category: "MACROECONÓMICOS",
      variable: "Tasa de Desempleo",
      actualValue: 4.2,
      forecastValue: 4.2,
      unit: "%",
      source: "https://tradingeconomics.com/united-states/unemployment-rate",
      isNegativeForNasdaq: true, // Desempleo alto es negativo para el Nasdaq
    },
    {
      category: "MACROECONÓMICOS",
      variable: "Tasa de Interés",
      actualValue: 4.5,
      forecastValue: 4.5,
      unit: "%",
      source: "https://tradingeconomics.com/united-states/interest-rate",
      isNegativeForNasdaq: false, // Depende del contexto, pero para este ejemplo lo consideramos neutral si es igual
    },
    {
      category: "SENTIMIENTO",
      variable: "Sentimiento de Investing.com",
      actualValue: 59,
      forecastValue: 0, // No hay previsión en la imagen, se asume 0 o no aplicable
      unit: "%",
      source: "https://es.investing.com/indices/nq-100-futures-scoreboard",
      isNegativeForNasdaq: false,
    },
    {
      category: "SENTIMIENTO",
      variable: "Sentimiento Retail",
      actualValue: 51,
      forecastValue: 0, // No hay previsión en la imagen
      unit: "%",
      source: "https://forexclientsentiment.com/forex-sentiment",
      isNegativeForNasdaq: false,
    },
    {
      category: "SENTIMIENTO",
      variable: "Sentimiento de las 7 Magníficas",
      actualValue: 1, // 1 para Alcista, -1 para Bajista, 0 para Neutral
      forecastValue: 0, // No hay previsión en la imagen
      unit: "",
      source: "", // No hay fuente en la imagen
      isNegativeForNasdaq: false,
    },
    {
      category: "TÉCNICOS",
      variable: "Estacionalidad",
      actualValue: 0, // 1 para Alcista, -1 para Bajista, 0 para Neutral (Neutro en agosto)
      forecastValue: 0, // No hay previsión en la imagen
      unit: "",
      source:
        "https://www.forex.com/en-us/news-and-analysis/nasdaq-100-sandp-500-seasonality-analysis-for-july/",
      isNegativeForNasdaq: false,
    },
    {
      category: "TÉCNICOS",
      variable: "Gráfica Diaria",
      actualValue: 1, // 1 para Alcista, -1 para Bajista, 0 para Neutral (Precio sobre las 3 emas)
      forecastValue: 0, // No hay previsión en la imagen
      unit: "",
      source: "", // No hay fuente en la imagen
      isNegativeForNasdaq: false,
    },
  ]);

  // Función para calcular la puntuación de una variable
  const calculateScore = (data: MacroEconomicData): number => {
    const { actualValue, forecastValue, isNegativeForNasdaq } = data;

    if (actualValue > forecastValue) {
      return isNegativeForNasdaq ? -1 : 1;
    } else if (actualValue < forecastValue) {
      return isNegativeForNasdaq ? 1 : -1;
    } else {
      return 0; // Neutral
    }
  };

  // Calcula el total de la puntuación
  const totalScore = useMemo(() => {
    return macroEconomicData.reduce(
      (sum, data) => sum + calculateScore(data),
      0
    );
  }, [macroEconomicData, calculateScore]);

  // Determina el sesgo basado en la puntuación total
  const bias = useMemo(() => {
    if (totalScore >= 4 && totalScore <= 12) {
      return "Alcista";
    } else if (totalScore >= -3 && totalScore <= 3) {
      return "Neutro";
    } else if (totalScore >= -12 && totalScore <= -4) {
      return "Bajista";
    }
    return "Indefinido"; // En caso de que el total no caiga en ningún rango
  }, [totalScore]);

  // Agrupar datos por categoría para mostrar "Datos" y "Variables" correctamente
  const groupedData = useMemo(() => {
    const groups: { [key: string]: MacroEconomicData[] } = {};
    macroEconomicData.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [macroEconomicData]);

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        SENTIMIENTO MACRO-FUNDAMENTAL DEL NASDAQ
      </h1>
      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Datos
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Variables
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Valor Actual
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Previsión
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Puntuación
              </th>
              <th
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Fuente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([category, items]) => (
              <React.Fragment key={category}>
                {items.map((data, index) => (
                  <TableRow
                    key={data.variable} // Usar una clave única para cada fila
                    data={data}
                    calculateScore={calculateScore}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-800">
          TOTAL: <span className="text-blue-600">{totalScore}</span>
        </div>
        <div className="text-lg font-semibold text-gray-800">
          SESGO: <span className="text-blue-600">{bias}</span>
        </div>
      </div>

      <div className="mt-4 p-4 bg-white rounded-lg shadow-md">
        <h3 className="text-xl font-semibold mb-3 text-gray-800">
          Rangos de Sesgo:
        </h3>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-1">
            <span className="font-medium text-green-700">Alcista:</span> De +4 a
            +12
          </li>
          <li className="mb-1">
            <span className="font-medium text-gray-600">Neutro:</span> Entre -3
            y +3
          </li>
          <li className="mb-1">
            <span className="font-medium text-red-700">Bajista:</span> De -12 a
            -4
          </li>
        </ul>
      </div>
    </div>
  );
};

// Componente de página principal (Next.js)
const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <NasdaqSentimentTable />
    </div>
  );
};

export default Page;
