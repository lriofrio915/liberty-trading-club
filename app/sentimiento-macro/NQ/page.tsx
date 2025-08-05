"use client";

import React, { useState, useEffect, useMemo, useCallback } from 'react';

// Definición de tipos para los datos de la tabla
interface MacroEconomicData {
  category: string;
  variable: string;
  actualValue: number | null; // Puede ser null mientras se carga o si hay error
  forecastValue: number | null; // Puede ser null mientras se carga o si hay error
  unit: string;
  source: string;
  isNegativeForNasdaq: boolean; // Indica si un valor actual > prevision es negativo para el Nasdaq (ej: inflación, desempleo)
}

// Componente para una fila de la tabla
const TableRow: React.FC<{ data: MacroEconomicData; calculateScore: (data: MacroEconomicData) => number }> = ({ data, calculateScore }) => {
  const score = useMemo(() => calculateScore(data), [data, calculateScore]);

  // Determina el color de la puntuación
  const scoreColorClass = useMemo(() => {
    if (score === 1) return 'bg-green-200 text-green-800';
    if (score === -1) return 'bg-red-200 text-red-800';
    return 'bg-gray-200 text-gray-800';
  }, [score]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-4 text-sm font-medium text-gray-900">{data.category}</td>
      <td className="py-2 px-4 text-sm text-gray-700">{data.variable}</td>
      <td className="py-2 px-4 text-sm text-gray-700">
        {data.actualValue !== null ? `${data.actualValue}${data.unit}` : 'Cargando...'}
      </td>
      <td className="py-2 px-4 text-sm text-gray-700">
        {data.forecastValue !== null ? `${data.forecastValue}${data.unit}` : 'Cargando...'}
      </td>
      <td className={`py-2 px-4 text-sm font-bold text-center rounded-md ${scoreColorClass}`}>
        {data.actualValue !== null && data.forecastValue !== null ? score : '-'}
      </td>
      <td className="py-2 px-4 text-sm text-blue-600 hover:underline">
        <a href={data.source} target="_blank" rel="noopener noreferrer">Fuente</a>
      </td>
    </tr>
  );
};

// Componente principal de la tabla
const NasdaqSentimentTable: React.FC = () => {
  // Definición de los datos iniciales de la tabla.
  // Usamos useMemo para asegurar que este array solo se cree una vez.
  const initialMacroEconomicData: MacroEconomicData[] = useMemo(() => ([
    {
      category: 'MACROECONÓMICOS',
      variable: 'Crecimiento del PIB',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '%',
      source: 'https://tradingeconomics.com/united-states/gdp-growth',
      isNegativeForNasdaq: false,
    },
    {
      category: 'MACROECONÓMICOS',
      variable: 'PMI Manufacturero',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '',
      source: 'https://tradingeconomics.com/united-states/manufacturing-pmi',
      isNegativeForNasdaq: false,
    },
    {
      category: 'MACROECONÓMICOS',
      variable: 'PMI de Servicios',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '',
      source: 'https://tradingeconomics.com/united-states/services-pmi',
      isNegativeForNasdaq: false,
    },
    {
      category: 'MACROECONÓMICOS',
      variable: 'Ventas Minoristas',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '%',
      source: 'https://tradingeconomics.com/united-states/retail-sales',
      isNegativeForNasdaq: false,
    },
    {
      category: 'MACROECONÓMICOS',
      variable: 'Inflación',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '%',
      source: 'https://tradingeconomics.com/united-states/inflation-cpi',
      isNegativeForNasdaq: true, // Inflación alta es negativa para el Nasdaq
    },
    {
      category: 'MACROECONÓMICOS',
      variable: 'Tasa de Desempleo',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '%',
      source: 'https://tradingeconomics.com/united-states/unemployment-rate',
      isNegativeForNasdaq: true, // Desempleo alto es negativo para el Nasdaq
    },
    {
      category: 'MACROECONÓMICOS',
      variable: 'Tasa de Interés',
      actualValue: null, // Valor temporal, se actualizará
      forecastValue: null, // Valor temporal, se actualizará
      unit: '%',
      source: 'https://tradingeconomics.com/united-states/interest-rate',
      isNegativeForNasdaq: false,
    },
    // Datos de Sentimiento y Técnicos (harcodeados, no se scrapean por ahora)
    {
      category: 'SENTIMIENTO',
      variable: 'Sentimiento de Investing.com',
      actualValue: 59,
      forecastValue: 0,
      unit: '%',
      source: 'https://es.investing.com/indices/nq-100-futures-scoreboard',
      isNegativeForNasdaq: false,
    },
    {
      category: 'SENTIMIENTO',
      variable: 'Sentimiento Retail',
      actualValue: 51,
      forecastValue: 0,
      unit: '%',
      source: 'https://forexclientsentiment.com/forex-sentiment',
      isNegativeForNasdaq: false,
    },
    {
      category: 'SENTIMIENTO',
      variable: 'Sentimiento de las 7 Magníficas',
      actualValue: 1,
      forecastValue: 0,
      unit: '',
      source: '',
      isNegativeForNasdaq: false,
    },
    {
      category: 'TÉCNICOS',
      variable: 'Estacionalidad',
      actualValue: 0,
      forecastValue: 0,
      unit: '',
      source: 'https://www.forex.com/en-us/news-and-analysis/nasdaq-100-sandp-500-seasonality-analysis-for-july/',
      isNegativeForNasdaq: false,
    },
    {
      category: 'TÉCNICOS',
      variable: 'Gráfica Diaria',
      actualValue: 1,
      forecastValue: 0,
      unit: '',
      source: '',
      isNegativeForNasdaq: false,
    },
  ]), []);

  const [macroEconomicData, setMacroEconomicData] = useState<MacroEconomicData[]>(initialMacroEconomicData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para calcular la puntuación de una variable
  const calculateScore = useCallback((data: MacroEconomicData): number => {
    // Solo calcula la puntuación si ambos valores no son null
    if (data.actualValue === null || data.forecastValue === null) {
      return 0; // O algún otro valor por defecto si los datos no están disponibles
    }

    const { actualValue, forecastValue, isNegativeForNasdaq } = data;

    if (actualValue > forecastValue) {
      return isNegativeForNasdaq ? -1 : 1;
    } else if (actualValue < forecastValue) {
      return isNegativeForNasdaq ? 1 : -1;
    } else {
      return 0; // Neutral
    }
  }, []);

  // Función para cargar los datos de una API Route específica
  const fetchData = useCallback(async (apiPath: string, variableName: string) => {
    try {
      const response = await fetch(apiPath);
      if (!response.ok) {
        const errorData = await response.json();
        // Asegúrate de que errorData.error sea un string
        const errorMessage = typeof errorData.error === 'string' ? errorData.error : `Error desconocido al obtener datos de ${variableName}`;
        throw new Error(errorMessage);
      }
      const data = await response.json();
      return data;
    } catch (err: unknown) { // CAMBIO AQUÍ: 'any' a 'unknown'
      const errorMessage = err instanceof Error ? err.message : String(err); // CAMBIO AQUÍ: Manejo seguro del tipo 'unknown'
      console.error(`Error fetching ${variableName} data:`, errorMessage);
      setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
      return null;
    }
  }, []);

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const loadAllMacroData = async () => {
      setIsLoading(true);
      setError(null); // Resetear errores al inicio de una nueva carga

      // Crear un mapa para actualizar los datos de manera eficiente
      // Se usa initialMacroEconomicData para tener la base de datos completa,
      // incluyendo las variables no scrapeadas y las propiedades necesarias.
      const currentDataMap = new Map(initialMacroEconomicData.map(item => [item.variable, item]));

      const apiCalls = [
        fetchData('/api/scrape-gdp', 'Crecimiento del PIB'),
        fetchData('/api/scrape-pmi-manufacturing', 'PMI Manufacturero'),
        fetchData('/api/scrape-pmi-services', 'PMI de Servicios'),
        fetchData('/api/scrape-retail-sales', 'Ventas Minoristas'),
        fetchData('/api/scrape-inflation', 'Inflación'),
        fetchData('/api/scrape-unemployment-rate', 'Tasa de Desempleo'),
        fetchData('/api/scrape-interest-rate', 'Tasa de Interés'),
      ];

      const results = await Promise.allSettled(apiCalls); // Espera que todas las promesas se resuelvan (o fallen)

      results.forEach((result) => {
        if (result.status === 'fulfilled' && result.value) {
          const { variable, actualValue, forecastValue } = result.value;
          if (currentDataMap.has(variable)) {
            currentDataMap.set(variable, {
              ...currentDataMap.get(variable)!, // Usar el objeto base del mapa
              actualValue: actualValue,
              forecastValue: forecastValue,
            });
          }
        } else if (result.status === 'rejected') {
          // El error ya se manejó dentro de fetchData, pero puedes loggearlo aquí también si lo necesitas
          console.error(`Una API call falló en Promise.allSettled: ${result.reason}`);
        }
      });

      // Convertir el mapa de nuevo a un array para actualizar el estado
      setMacroEconomicData(Array.from(currentDataMap.values()));
      setIsLoading(false);
    };

    loadAllMacroData();
  }, [fetchData, initialMacroEconomicData]); // CAMBIO AQUÍ: 'initialMacroEconomicData' como dependencia

  // Calcula el total de la puntuación
  const totalScore = useMemo(() => {
    // Asegúrate de que solo sumas puntuaciones de variables con datos válidos
    return macroEconomicData.reduce((sum, data) => {
      if (data.actualValue !== null && data.forecastValue !== null) {
        return sum + calculateScore(data);
      }
      return sum;
    }, 0);
  }, [macroEconomicData, calculateScore]);

  // Determina el sesgo basado en la puntuación total
  const bias = useMemo(() => {
    if (totalScore >= 4 && totalScore <= 12) {
      return 'Alcista';
    } else if (totalScore >= -3 && totalScore <= 3) {
      return 'Neutro';
    } else if (totalScore >= -12 && totalScore <= -4) {
      return 'Bajista';
    }
    return 'Indefinido'; // En caso de que el total no caiga en ningún rango
  }, [totalScore]);

  // Agrupar datos por categoría para mostrar "Datos" y "Variables" correctamente
  const groupedData = useMemo(() => {
    const groups: { [key: string]: MacroEconomicData[] } = {};
    macroEconomicData.forEach(item => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [macroEconomicData]);

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">SENTIMIENTO MACRO-FUNDAMENTAL DEL NASDAQ</h1>

      {isLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">Cargando datos macroeconómicos...</div>
      )}
      {error && (
        <div className="text-center text-red-600 text-lg mb-4">Error: {error}</div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Datos
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Variables
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Valor Actual
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Previsión
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Puntuación
              </th>
              <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fuente
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {Object.entries(groupedData).map(([category, items]) => (
              <React.Fragment key={category}>
                {items.map((data) => (
                  <TableRow
                    key={data.variable}
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
        <h3 className="text-xl font-semibold mb-3 text-gray-800">Rangos de Sesgo:</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li className="mb-1">
            <span className="font-medium text-green-700">Alcista:</span> De +4 a +12
          </li>
          <li className="mb-1">
            <span className="font-medium text-gray-600">Neutro:</span> Entre -3 y +3
          </li>
          <li className="mb-1">
            <span className="font-medium text-gray-700">Bajista:</span> De -12 a -4
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
