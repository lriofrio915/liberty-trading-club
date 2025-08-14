// components/CotDataTable.tsx
"use client";

import React, { useState, useEffect, useCallback } from 'react';

// Definición de tipos para los datos COT que la API devolverá, ahora más detallada
interface CotData {
  asset: string; // Ej: "NASDAQ"
  // Large Speculators
  largeSpeculatorsLong: number | null;
  largeSpeculatorsLongChange: number | null;
  largeSpeculatorsShort: number | null;
  largeSpeculatorsShortChange: number | null;
  // Small Traders
  smallTradersLong: number | null;
  smallTradersLongChange: number | null;
  smallTradersShort: number | null;
  smallTradersShortChange: number | null;
  // Open Interest
  openInterestValue: number | null;
  openInterestChange: number | null; // Cambio porcentual del Open Interest
  // Price Change (ya estaba, pero ahora es más claro que no es parte de Open Interest en la tabla)
  priceChange: number | null; // Cambio de precio del activo
  error?: string;
}

const CotDataTable: React.FC = () => {
  const [cotData, setCotData] = useState<CotData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los datos COT del NASDAQ.
  // Esta función llama directamente a la API específica del NASDAQ.
  const fetchNasdaqCotData = useCallback(async (): Promise<CotData | null> => {
    try {
      const response = await fetch('/api/scrape-cot-nasdaq'); // Llama directamente a la API del NASDAQ
      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.error || `Error desconocido al obtener datos COT del NASDAQ.`;
        throw new Error(errorMessage);
      }
      // La API actual devuelve { variable, longChange, shortChange, actualValue }
      // Necesitamos mapear esto a la nueva interfaz CotData.
      const apiData = await response.json();

      // Mapeo de la respuesta actual de la API a la nueva interfaz CotData
      // Los campos que la API no proporciona aún serán null.
      const mappedData: CotData = {
        asset: apiData.variable || 'NASDAQ', // Usamos 'variable' de la API como 'asset'
        priceChange: apiData.priceChange !== undefined ? apiData.priceChange : null, // Si la API ya lo devuelve
        largeSpeculatorsLong: null, // API no lo proporciona aún
        largeSpeculatorsLongChange: null, // API no lo proporciona aún
        largeSpeculatorsShort: null, // API no lo proporciona aún
        largeSpeculatorsShortChange: apiData.longChange !== undefined ? apiData.longChange : null, // Mapeado de longChange
        smallTradersLong: null, // API no lo proporciona aún
        smallTradersLongChange: apiData.shortChange !== undefined ? apiData.shortChange : null, // Mapeado de shortChange
        smallTradersShort: null, // API no lo proporciona aún
        smallTradersShortChange: null, // API no lo proporciona aún
        openInterestValue: null, // API no lo proporciona aún
        openInterestChange: null, // API no lo proporciona aún
        error: apiData.error,
      };

      return mappedData;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error fetching NASDAQ COT data:`, errorMessage);
      return {
        asset: 'NASDAQ', // Fallback en caso de error
        priceChange: null,
        largeSpeculatorsLong: null,
        largeSpeculatorsLongChange: null,
        largeSpeculatorsShort: null,
        largeSpeculatorsShortChange: null,
        smallTradersLong: null,
        smallTradersLongChange: null,
        smallTradersShort: null,
        smallTradersShortChange: null,
        openInterestValue: null,
        openInterestChange: null,
        error: errorMessage,
      };
    }
  }, []);

  // Efecto para cargar los datos COT del NASDAQ al montar el componente
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null); // Resetear errores

      const nasdaqData = await fetchNasdaqCotData();
      
      if (nasdaqData) {
        setCotData([nasdaqData]); // Almacenar el resultado como un array con un solo elemento
      } else {
        setCotData([]); // Si hay un error y no se pudo obtener data, dejar vacío
      }
      setIsLoading(false);
    };

    loadData();
  }, [fetchNasdaqCotData]);

  return (
    <div className="container mx-auto p-4 font-inter">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Análisis de Posiciones COT (Commitment of Traders) - NASDAQ
      </h1>

      {isLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">
          Cargando datos COT del NASDAQ... Esto puede tomar un momento.
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 text-lg mb-4">
          Error: {error}
        </div>
      )}

      {!isLoading && cotData.length === 0 && !error && (
        <div className="text-center text-gray-600 text-lg mb-4">
          No se encontraron datos COT para el NASDAQ.
        </div>
      )}

      {!isLoading && cotData.length > 0 && (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th rowSpan={2} scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activo
                </th>
                <th rowSpan={2} scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Price Change, %
                </th>
                <th colSpan={4} scope="col" className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Large Speculators
                </th>
                <th colSpan={4} scope="col" className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Small Traders
                </th>
                <th colSpan={2} scope="col" className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200">
                  Open Interest
                </th>
                <th rowSpan={2} scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
              <tr>
                {/* Headers para Large Speculators */}
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Long
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Short
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Change
                </th>
                {/* Headers para Small Traders */}
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Long
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Change
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Short
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Change
                </th>
                {/* Headers para Open Interest */}
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Value
                </th>
                <th scope="col" className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Change,%
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {cotData.map((dataItem) => (
                <tr key={dataItem.asset} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm font-medium text-gray-900 capitalize">
                    {dataItem.asset}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.priceChange !== null ? `${dataItem.priceChange.toFixed(2)}%` : '-'}
                  </td>
                  {/* Large Speculators */}
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.largeSpeculatorsLong !== null ? dataItem.largeSpeculatorsLong.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.largeSpeculatorsLongChange !== null ? dataItem.largeSpeculatorsLongChange.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.largeSpeculatorsShort !== null ? dataItem.largeSpeculatorsShort.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.largeSpeculatorsShortChange !== null ? dataItem.largeSpeculatorsShortChange.toLocaleString() : '-'}
                  </td>
                  {/* Small Traders */}
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.smallTradersLong !== null ? dataItem.smallTradersLong.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.smallTradersLongChange !== null ? dataItem.smallTradersLongChange.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.smallTradersShort !== null ? dataItem.smallTradersShort.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.smallTradersShortChange !== null ? dataItem.smallTradersShortChange.toLocaleString() : '-'}
                  </td>
                  {/* Open Interest */}
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.openInterestValue !== null ? dataItem.openInterestValue.toLocaleString() : '-'}
                  </td>
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.openInterestChange !== null ? `${dataItem.openInterestChange.toFixed(2)}%` : '-'}
                  </td>
                  {/* Estado/Error */}
                  <td className="py-2 px-4 text-sm text-gray-700">
                    {dataItem.error ? <span className="text-red-500 text-xs">{dataItem.error}</span> : 'OK'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default CotDataTable;
