"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

// Definición de tipos para los datos de la tabla
interface MacroEconomicData {
  category: string;
  variable: string;
  // Datos para EE. UU.
  usActualValue: number | string | null;
  usForecastValue: number | null | undefined;
  usUnit: string;
  usSource: string;
  usScore: number | null; // Puntuación del impacto en USD
  // Datos para Japón
  jpActualValue: number | string | null;
  jpForecastValue: number | null | undefined;
  jpUnit: string;
  jpSource: string;
  jpScore: number | null; // Puntuación del impacto en JPY
  // Sesgo combinado para el par USDJPY
  pairBias: number | null;
}

// Interfaz para la respuesta esperada de la API /api/scrape-cot-data
interface PositionData {
    long: number;
    longChange: number;
    short: number;
    shortChange: number;
}

interface OpenInterestData {
    value: number;
    changePercent: number;
}

interface AssetData {
    assetName: string;
    priceChange: number;
    largeSpeculators: PositionData;
    smallTraders: PositionData;
    openInterest: OpenInterestData;
}

interface CategoryData {
    [category: string]: AssetData[];
}

interface CotApiResponse {
    reportDate: string; // Nueva propiedad para la fecha del reporte
    data: CategoryData;
    error?: string;
}

// Props para el componente TableRow
interface TableRowProps {
  data: MacroEconomicData;
  dailyChartManualInput: "Alcista" | "Neutro" | "Bajista" | null;
  setDailyChartManualInput: React.Dispatch<
    React.SetStateAction<"Alcista" | "Neutro" | "Bajista" | null>
  >;
  onManualInputChange: (score: number) => void;
}

// Componente para una fila de la tabla
const TableRow: React.FC<TableRowProps> = ({
  data,
  dailyChartManualInput,
  setDailyChartManualInput,
  onManualInputChange,
}) => {
  // Determina el color de la puntuación individual de EE. UU.
  const usScoreColorClass = useMemo(() => {
    if (data.usScore === 1) return "bg-green-200 text-green-800";
    if (data.usScore === -1) return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  }, [data.usScore]);

  // Determina el color de la puntuación individual de Japón
  const jpScoreColorClass = useMemo(() => {
    if (data.jpScore === 1) return "bg-green-200 text-green-800";
    if (data.jpScore === -1) return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  }, [data.jpScore]);

  // Determina el color del sesgo del par
  const pairBiasColorClass = useMemo(() => {
    if (data.pairBias === 1) return "bg-green-200 text-green-800";
    if (data.pairBias === -1) return "bg-red-200 text-red-800";
    return "bg-gray-200 text-gray-800";
  }, [data.pairBias]);

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-50">
      <td className="py-2 px-4 text-sm font-medium text-gray-900">
        {data.category}
      </td>
      <td className="py-2 px-4 text-sm text-gray-700">{data.variable}</td>

      {/* Columnas de EE. UU. */}
      {data.variable.includes("Estacionalidad") ? (
        <td className="py-2 px-4 text-sm text-gray-700 text-center" colSpan={8}>
          {`${data.usActualValue !== null ? data.usActualValue : 'Cargando...'}${data.usUnit}`}
        </td>
      ) : (
        data.variable === "Sentimiento COT" ||
        data.variable === "Sentimiento Retail" ||
        data.variable === "Gráfica Diaria" ? (
          <td className="py-2 px-4 text-sm text-gray-700 text-center" colSpan={data.variable === "Gráfica Diaria" ? 8 : 2}>
            {data.variable === "Gráfica Diaria" ? (
              <select
                id="dailyChartSentimentUS"
                className="p-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
                value={dailyChartManualInput || ""}
                onChange={(e) => {
                  const newValue = e.target.value as "Alcista" | "Neutro" | "Bajista";
                  setDailyChartManualInput(newValue);
                  const newScore = newValue === "Alcista" ? 1 : newValue === "Bajista" ? -1 : 0;
                  onManualInputChange(newScore);
                }}
              >
                <option value="" disabled>
                  Selecciona...
                </option>
                <option value="Alcista">Alcista - Precio sobre las 3 EMAS (20, 50 y 200)</option>
                <option value="Neutro">Neutro - Precio en medio de las EMAS</option>
                <option value="Bajista">Bajista - Precio debajo de las 3 EMAS</option>
              </select>
            ) : (
              `${data.usActualValue !== null ? data.usActualValue : 'Cargando...'}${data.usUnit}`
            )}
          </td>
        ) : (
          <>
            <td className="py-2 px-4 text-sm text-gray-700">
              {data.usActualValue !== null
                ? `${data.usActualValue}${data.usUnit}`
                : "Cargando..."}
            </td>
            <td className="py-2 px-4 text-sm text-gray-700">
              {data.usForecastValue !== null && data.usForecastValue !== undefined
                ? `${data.usForecastValue}${data.usUnit}`
                : "N/A"}
            </td>
          </>
        )
      )}
      {data.variable.includes("Estacionalidad") || data.variable === "Gráfica Diaria" ? null : (
        <td
          className={`py-2 px-4 text-sm font-bold text-center rounded-md ${usScoreColorClass}`}
        >
          {data.usScore !== null ? data.usScore : "-"}
        </td>
      )}
      {data.variable.includes("Estacionalidad") || data.variable === "Gráfica Diaria" ? null : (
        <td className="py-2 px-4 text-sm text-blue-600 hover:underline">
          <a href={data.usSource} target="_blank" rel="noopener noreferrer">
            Fuente
          </a>
        </td>
      )}

      {/* Columnas de Japón - Se ocultan completamente para Estacionalidad y Gráfica Diaria */}
      {data.variable.includes("Estacionalidad") || data.variable === "Gráfica Diaria" ? null : (
        data.variable === "Sentimiento COT" ||
        data.variable === "Sentimiento Retail" ? (
          <td className="py-2 px-4 text-sm text-gray-700 text-center" colSpan={2}>
            {`${data.jpActualValue !== null ? data.jpActualValue : 'Cargando...'}${data.jpUnit}`}
          </td>
        ) : (
          <>
            <td className="py-2 px-4 text-sm text-gray-700">
              {data.jpActualValue !== null
                ? `${data.jpActualValue}${data.jpUnit}`
                : "Cargando..."}
            </td>
            <td className="py-2 px-4 text-sm text-gray-700">
              {data.jpForecastValue !== null && data.jpForecastValue !== undefined
                ? `${data.jpForecastValue}${data.jpUnit}`
                : "N/A"}
            </td>
          </>
        )
      )}
      {data.variable.includes("Estacionalidad") || data.variable === "Gráfica Diaria" ? null : (
        <>
          <td
            className={`py-2 px-4 text-sm font-bold text-center rounded-md ${jpScoreColorClass}`}
          >
            {data.jpScore !== null ? data.jpScore : "-"}
          </td>
          <td className="py-2 px-4 text-sm text-blue-600 hover:underline">
            <a href={data.jpSource} target="_blank" rel="noopener noreferrer">
              Fuente
            </a>
          </td>
        </>
      )}

      {/* Columna de Sesgo del Par */}
      <td
        className={`py-2 px-4 text-sm font-bold text-center rounded-md ${pairBiasColorClass}`}
      >
        {data.pairBias !== null ? data.pairBias : "-"}
      </td>
    </tr>
  );
};

// Componente principal de la tabla de sentimiento USDJPY
const USDJPYSentimentTable: React.FC = () => {
  // Datos de estacionalidad hardcodeados para el par USDJPY
  const seasonalityData = useMemo(
    () => ({
      usdjpy: {
        Jan: -0.4, Feb: 0.6, Mar: 0.9, Apr: 0.3, May: 0.4, Jun: 0.5,
        Jul: -1.2, Aug: -0.1, Sep: 0.5, Oct: 0.7, Nov: 0.4, Dec: 0.1,
      },
    }),
    []
  );

  // Función para obtener el valor de estacionalidad del mes actual para el par USDJPY
  const getSeasonalityForCurrentMonth = useCallback(() => {
    const currentMonth = new Date().toLocaleString("en-us", { month: "short" });
    const monthKey =
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);
    return seasonalityData.usdjpy?.[monthKey as keyof typeof seasonalityData.usdjpy] || 0;
  }, [seasonalityData]);

  // Definición de los datos iniciales de la tabla.
  const initialMacroEconomicData: MacroEconomicData[] = useMemo(
    () => [
      {
        category: "MACROECONÓMICOS",
        variable: "Crecimiento del PIB",
        usActualValue: null, usForecastValue: null, usUnit: "%", usSource: "https://tradingeconomics.com/united-states/gdp-growth", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "%", jpSource: "https://tradingeconomics.com/japan/gdp-growth", jpScore: null,
        pairBias: null,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "PMI Manufacturero",
        usActualValue: null, usForecastValue: null, usUnit: "", usSource: "https://tradingeconomics.com/united-states/manufacturing-pmi", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "", jpSource: "https://tradingeconomics.com/japan/manufacturing-pmi", jpScore: null,
        pairBias: null,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "PMI de Servicios",
        usActualValue: null, usForecastValue: null, usUnit: "", usSource: "https://tradingeconomics.com/united-states/services-pmi", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "", jpSource: "https://tradingeconomics.com/japan/services-pmi", jpScore: null,
        pairBias: null,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Ventas Minoristas",
        usActualValue: null, usForecastValue: null, usUnit: "%", usSource: "https://tradingeconomics.com/united-states/retail-sales", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "%", jpSource: "https://tradingeconomics.com/japan/retail-sales", jpScore: null,
        pairBias: null,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Inflación",
        usActualValue: null, usForecastValue: null, usUnit: "%", usSource: "https://tradingeconomics.com/united-states/inflation-cpi", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "%", jpSource: "https://tradingeconomics.com/japan/inflation-cpi", jpScore: null,
        pairBias: null,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Tasa de Desempleo",
        usActualValue: null, usForecastValue: null, usUnit: "%", usSource: "https://tradingeconomics.com/united-states/unemployment-rate", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "%", jpSource: "https://tradingeconomics.com/japan/unemployment-rate", jpScore: null,
        pairBias: null,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Tasa de Interés",
        usActualValue: null, usForecastValue: null, usUnit: "%", usSource: "https://tradingeconomics.com/united-states/interest-rate", usScore: null,
        jpActualValue: null, jpForecastValue: null, jpUnit: "%", jpSource: "https://tradingeconomics.com/japan/interest-rate", jpScore: null,
        pairBias: null,
      },
      // Datos de Sentimiento
      {
        category: "SENTIMIENTO",
        variable: "Sentimiento COT",
        usActualValue: null, usForecastValue: undefined, usUnit: "%", usSource: "https://www.insider-week.com/", usScore: null,
        jpActualValue: null, jpForecastValue: undefined, jpUnit: "%", jpSource: "https://www.insider-week.com/", jpScore: null,
        pairBias: null,
      },
      {
        category: "SENTIMIENTO",
        variable: "Sentimiento Retail",
        usActualValue: null, usForecastValue: undefined, usUnit: "%", usSource: "https://www.forex.com/en-us/markets/sentiment/", usScore: null,
        jpActualValue: null, jpForecastValue: undefined, jpUnit: "%", jpSource: "https://www.forex.com/en-us/markets/sentiment/", jpScore: null,
        pairBias: null,
      },
      // Datos Técnicos
      {
        category: "TÉCNICOS",
        variable: "Estacionalidad",
        usActualValue: null, usForecastValue: undefined, usUnit: "%", usSource: "https://www.investtech.com/", usScore: null,
        jpActualValue: null, jpForecastValue: undefined, jpUnit: "%", jpSource: "https://www.investtech.com/", jpScore: null,
        pairBias: null,
      },
      {
        category: "TÉCNICOS",
        variable: "Gráfica Diaria",
        usActualValue: null,
        usForecastValue: undefined, usUnit: "", usSource: "Entrada Manual", usScore: null,
        jpActualValue: null,
        jpForecastValue: undefined, jpUnit: "", jpSource: "Entrada Manual", jpScore: null,
        pairBias: null,
      },
    ],
    []
  );

  const [macroEconomicData, setMacroEconomicData] = useState<MacroEconomicData[]>(initialMacroEconomicData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyChartManualInput, setDailyChartManualInput] = useState<
    "Alcista" | "Neutro" | "Bajista" | null
  >(null);

  // Función para calcular la puntuación individual de un dato (1, 0, -1)
  const calculateIndividualScore = useCallback(
    (
      actual: number | string | null,
      forecast: number | null | undefined,
      variableName: string,
      country: 'US' | 'JP',
      dailyChartInput: "Alcista" | "Neutro" | "Bajista" | null
    ): number => {
      if (actual === null) return 0;

      // Lógica especial para Sentimiento COT
      if (variableName === "Sentimiento COT") {
        if (typeof actual !== 'number') return 0;
        if (actual > 10) return 1;
        if (actual < -10) return -1;
        return 0;
      }

      // Lógica especial para Sentimiento Retail (contrario al índice)
      if (variableName === "Sentimiento Retail") {
        if (typeof actual !== 'number') return 0;
        if (actual < -10) return 1;
        if (actual > 10) return -1;
        return 0;
      }

      // Lógica especial para Estacionalidad
      if (variableName.includes("Estacionalidad")) {
        if (typeof actual !== 'number') return 0;
        if (actual > 0) return 1;
        if (actual < 0) return -1;
        return 0;
      }

      // Lógica especial para Gráfica Diaria (entrada manual)
      if (variableName === "Gráfica Diaria") {
        if (country === 'US') {
          if (dailyChartInput === "Alcista") return 1;
          if (dailyChartInput === "Neutro") return 0;
          if (dailyChartInput === "Bajista") return -1;
          return 0;
        } else {
          return 1; // Para Japón, asume un valor fijo, podrías cambiarlo si es necesario
        }
      }

      // Para variables que requieren comparación actual vs. forecast
      if (typeof actual !== 'number' || typeof forecast !== 'number') return 0;

      // Lógica para Inflación y Tasa de Interés
      if (variableName === "Inflación" || variableName === "Tasa de Interés") {
        if (actual > forecast) return 1;
        if (actual < forecast) return -1;
        return 0;
      }

      // Lógica para Tasa de Desempleo
      if (variableName === "Tasa de Desempleo") {
        if (actual < forecast) return 1;
        if (actual > forecast) return -1;
        return 0;
      }

      // Lógica estándar para otras variables
      if (actual > forecast) return 1;
      if (actual < forecast) return -1;
      return 0;
    },
    []
  );

  // Función para calcular el sesgo del par USDJPY
  const calculatePairBias = useCallback(
    (usScore: number | null, jpScore: number | null): number => {
      if (usScore === null || jpScore === null) return 0;

      if (usScore === 1 && jpScore === -1) return 1;
      if (usScore === -1 && jpScore === 1) return -1;
      if ((usScore === 1 && jpScore === 1) || (usScore === -1 && jpScore === -1)) return 0;
      if (usScore === 0) return -jpScore;
      if (jpScore === 0) return usScore;

      return 0;
    },
    []
  );

  // Función para manejar el cambio manual en la Gráfica Diaria
  const handleDailyChartManualInputChange = useCallback((newScore: number) => {
    setMacroEconomicData(prevData => {
      return prevData.map(item => {
        if (item.variable === "Gráfica Diaria") {
          const usScore = newScore;
          const jpScore = 0; // Japón sigue siendo 0 (neutral) para este caso manual
          const pairBias = calculatePairBias(usScore, jpScore); // Dependency added here

          return {
            ...item,
            usScore,
            jpScore,
            pairBias,
            usActualValue: newScore === 1 ? "Alcista" : newScore === -1 ? "Bajista" : "Neutro"
          };
        }
        return item;
      });
    });
  }, [calculatePairBias]); // Added calculatePairBias to dependency array

  // Función para cargar los datos de una API Route específica
  const fetchData = useCallback(
    async (apiPath: string, variableName: string) => {
      try {
        const urlToFetch = new URL(apiPath, window.location.origin).toString();
        const response = await fetch(urlToFetch);

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          throw new Error(`La API '${apiPath}' no devolvió JSON. Content-Type: ${contentType}. Respuesta: ${text.substring(0, 100)}...`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          const errorMessage =
            typeof errorData.error === "string"
              ? errorData.error
              : `Error desconocido al obtener datos de ${variableName}`;
          throw new Error(errorMessage);
        }
        const data = await response.json();
        return { variable: variableName, actualValue: data.actualValue, forecastValue: data.forecastValue };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        console.error(`Error fetching ${variableName} data:`, errorMessage);
        setError((prev) => (prev ? `${prev}\n${errorMessage}` : errorMessage));
        return null;
      }
    },
    []
  );

  // Función para cargar datos COT
  const fetchCotData = useCallback(async () => {
    try {
      const urlToFetch = new URL("/api/scrape-cot-data", window.location.origin).toString();
      const response = await fetch(urlToFetch);

      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`La API '/api/scrape-cot-data' no devolvió JSON. Content-Type: ${contentType}. Respuesta: ${text.substring(0, 100)}...`);
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al obtener datos COT");
      }
      const apiData: CotApiResponse = await response.json();
      console.log("Respuesta completa de la API COT:", apiData);

      let usLargeSpeculatorsLongs: number | null = null;
      let usLargeSpeculatorsShorts: number | null = null;
      let jpLargeSpeculatorsLongs: number | null = null;
      let jpLargeSpeculatorsShorts: number | null = null;
      let usSmallTradersLongs: number | null = null;
      let usSmallTradersShorts: number | null = null;
      let jpSmallTradersLongs: number | null = null;
      let jpSmallTradersShorts: number | null = null;

      for (const category in apiData.data) {
        if (Object.prototype.hasOwnProperty.call(apiData.data, category)) {
          for (const asset of apiData.data[category]) {
            const normalizedAssetName = asset.assetName.trim().toUpperCase();
            console.log(`Verificando activo: '${asset.assetName}' (Normalizado: '${normalizedAssetName}')`);

            if (normalizedAssetName.includes("DOLLAR INDEX")) {
              usLargeSpeculatorsLongs = asset.largeSpeculators.long;
              usLargeSpeculatorsShorts = asset.largeSpeculators.short;
              usSmallTradersLongs = asset.smallTraders.long;
              usSmallTradersShorts = asset.smallTraders.short;
              console.log(`USD COT - Nombre de activo encontrado: '${asset.assetName}', Large Longs: ${usLargeSpeculatorsLongs}, Large Shorts: ${usLargeSpeculatorsShorts}, Small Longs: ${usSmallTradersLongs}, Small Shorts: ${usSmallTradersShorts}`);
            } else if (normalizedAssetName.includes("JAPANESE YEN")) {
              jpLargeSpeculatorsLongs = asset.largeSpeculators.long;
              jpLargeSpeculatorsShorts = asset.largeSpeculators.short;
              jpSmallTradersLongs = asset.smallTraders.long;
              jpSmallTradersShorts = asset.smallTraders.short;
              console.log(`JPY COT - Nombre de activo encontrado: '${asset.assetName}', Large Longs: ${jpLargeSpeculatorsLongs}, Large Shorts: ${jpLargeSpeculatorsShorts}, Small Longs: ${jpSmallTradersLongs}, Small Shorts: ${jpSmallTradersShorts}`);
            }
            if (usLargeSpeculatorsLongs !== null && usLargeSpeculatorsShorts !== null &&
                jpLargeSpeculatorsLongs !== null && jpLargeSpeculatorsShorts !== null &&
                usSmallTradersLongs !== null && usSmallTradersShorts !== null &&
                jpSmallTradersLongs !== null && jpSmallTradersShorts !== null) {
                break;
            }
          }
        }
          if (usLargeSpeculatorsLongs !== null && usLargeSpeculatorsShorts !== null &&
              jpLargeSpeculatorsLongs !== null && jpLargeSpeculatorsShorts !== null &&
              usSmallTradersLongs !== null && usSmallTradersShorts !== null &&
              jpSmallTradersLongs !== null && jpSmallTradersShorts !== null) {
              break;
          }
      }

      if (usLargeSpeculatorsLongs === null || usLargeSpeculatorsShorts === null) {
          console.warn("Advertencia: No se encontraron los datos de Large Speculators Longs/Shorts para 'DOLLAR INDEX' en la respuesta de la API COT.");
      }
      if (usSmallTradersLongs === null || usSmallTradersShorts === null) {
        console.warn("Advertencia: No se encontraron los datos de Small Traders Longs/Shorts para 'DOLLAR INDEX' en la respuesta de la API COT.");
      }

      return {
        us: {
            largeLongs: usLargeSpeculatorsLongs,
            largeShorts: usLargeSpeculatorsShorts,
            smallLongs: usSmallTradersLongs,
            smallShorts: usSmallTradersShorts
        },
        jp: {
            largeLongs: jpLargeSpeculatorsLongs,
            largeShorts: jpLargeSpeculatorsShorts,
            smallLongs: jpSmallTradersLongs,
            smallShorts: jpSmallTradersShorts
        }
      };

    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      console.error(`Error fetching COT data:`, errorMessage);
      setError((prev) => (prev ? `${prev}\n${errorMessage}` : errorMessage));
      return null;
    }
  }, []);

  // Efecto para cargar todos los datos al montar el componente
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setError(null);

      const currentDataMap = new Map(
        initialMacroEconomicData.map((item) => [item.variable, { ...item }])
      );

      // Definir todas las llamadas a la API para datos macroeconómicos
      const apiCallsUS = [
        fetchData("/api/scrape-gdp", "Crecimiento del PIB"),
        fetchData("/api/scrape-pmi-manufacturing", "PMI Manufacturero"),
        fetchData("/api/scrape-pmi-services", "PMI de Servicios"),
        fetchData("/api/scrape-retail-sales", "Ventas Minoristas"),
        fetchData("/api/scrape-inflation", "Inflación"),
        fetchData("/api/scrape-unemployment-rate", "Tasa de Desempleo"),
        fetchData("/api/scrape-interest-rate", "Tasa de Interés"),
      ];

      const apiCallsJP = [
        fetchData("/api/scrape-gdp-japan", "Crecimiento del PIB"),
        fetchData("/api/scrape-pmi-manufacturing-japan", "PMI Manufacturero"),
        fetchData("/api/scrape-pmi-services-japan", "PMI de Servicios"),
        fetchData("/api/scrape-retail-sales-japan", "Ventas Minoristas"),
        fetchData("/api/scrape-inflation-japan", "Inflación"),
        fetchData("/api/scrape-unemployment-rate-japan", "Tasa de Desempleo"),
        fetchData("/api/scrape-interest-rate-japan", "Tasa de Interés"),
      ];

      // Ejecutar todas las llamadas a la API en paralelo
      const resultsUS = await Promise.allSettled(apiCallsUS);
      const resultsJP = await Promise.allSettled(apiCallsJP);

      // Procesar resultados de EE. UU.
      resultsUS.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { variable, actualValue, forecastValue } = result.value;
          if (currentDataMap.has(variable)) {
            currentDataMap.set(variable, {
              ...currentDataMap.get(variable)!,
              usActualValue: actualValue,
              usForecastValue: forecastValue,
            });
          }
        } else if (result.status === "rejected") {
          console.error(
            `Una API call de EE. UU. falló en Promise.allSettled: ${result.reason}`
          );
        }
      });

      // Procesar resultados de Japón
      resultsJP.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { variable, actualValue, forecastValue } = result.value;
          if (currentDataMap.has(variable)) {
            currentDataMap.set(variable, {
              ...currentDataMap.get(variable)!,
              jpActualValue: actualValue,
              jpForecastValue: forecastValue,
            });
          }
        } else if (result.status === "rejected") {
          console.error(
            `Una API call de Japón falló en Promise.allSettled: ${result.reason}`
          );
        }
      });

      // Obtener y calcular el Sentimiento COT y Sentimiento Retail
      const cotData = await fetchCotData();
      if (cotData && cotData.us && cotData.jp) {
          // Calcular Sentimiento COT (Large Speculators)
          let usCotSentiment: number | null = null;
          if (cotData.us.largeLongs !== null && cotData.us.largeShorts !== null) {
              const sum = cotData.us.largeLongs + cotData.us.largeShorts;
              if (sum !== 0) {
                  usCotSentiment = ((cotData.us.largeLongs - cotData.us.largeShorts) / sum) * 100;
              }
          }

          let jpCotSentiment: number | null = null;
          if (cotData.jp.largeLongs !== null && cotData.jp.largeShorts !== null) {
              const sum = cotData.jp.largeLongs + cotData.jp.largeShorts;
              if (sum !== 0) {
                  jpCotSentiment = ((cotData.jp.largeLongs - cotData.jp.largeShorts) / sum) * 100;
              }
          }

          if (currentDataMap.has("Sentimiento COT")) {
              currentDataMap.set("Sentimiento COT", {
                  ...currentDataMap.get("Sentimiento COT")!,
                  usActualValue: usCotSentiment !== null ? parseFloat(usCotSentiment.toFixed(2)) : null,
                  jpActualValue: jpCotSentiment !== null ? parseFloat(jpCotSentiment.toFixed(2)) : null,
                  usForecastValue: undefined,
                  jpForecastValue: undefined,
              });
          }

          // Calcular Sentimiento Retail (Small Traders)
          let usRetailSentiment: number | null = null;
          if (cotData.us.smallLongs !== null && cotData.us.smallShorts !== null) {
              const sum = cotData.us.smallLongs + cotData.us.smallShorts;
              if (sum !== 0) {
                  usRetailSentiment = ((cotData.us.smallLongs - cotData.us.smallShorts) / sum) * 100;
              }
          }

          let jpRetailSentiment: number | null = null;
          if (cotData.jp.smallLongs !== null && cotData.jp.smallShorts !== null) {
              const sum = cotData.jp.smallLongs + cotData.jp.smallShorts;
              if (sum !== 0) {
                  jpRetailSentiment = ((cotData.jp.smallLongs - cotData.jp.smallShorts) / sum) * 100;
              }
          }

          if (currentDataMap.has("Sentimiento Retail")) {
              currentDataMap.set("Sentimiento Retail", {
                  ...currentDataMap.get("Sentimiento Retail")!,
                  usActualValue: usRetailSentiment !== null ? parseFloat(usRetailSentiment.toFixed(2)) : null,
                  jpActualValue: jpRetailSentiment !== null ? parseFloat(jpRetailSentiment.toFixed(2)) : null,
                  usForecastValue: undefined,
                  jpForecastValue: undefined,
              });
          }
      }

      // Actualizar los valores hardcodeados directamente en el mapa
      // Estacionalidad (par USDJPY)
      if (currentDataMap.has("Estacionalidad")) {
        const usdjpySeasonality = getSeasonalityForCurrentMonth();
        const currentMonthName = new Date().toLocaleString("es-ES", { month: "long" });
        const formattedMonthName = currentMonthName.charAt(0).toUpperCase() + currentMonthName.slice(1);

        currentDataMap.set("Estacionalidad", {
          ...currentDataMap.get("Estacionalidad")!,
          variable: `Estacionalidad (USDJPY - ${formattedMonthName})`,
          usActualValue: usdjpySeasonality,
          usUnit: "%",
          usScore: calculateIndividualScore(usdjpySeasonality, undefined, "Estacionalidad", 'US', null),
          jpActualValue: null,
          jpScore: null,
          usForecastValue: undefined,
          jpForecastValue: undefined,
        });
      }

      // Gráfica Diaria (EE. UU. y Japón) - solo el US es manual input
      if (currentDataMap.has("Gráfica Diaria")) {
        let usChartActualValue: string | null = null;
        if (dailyChartManualInput === "Alcista") usChartActualValue = "Alcista";
        else if (dailyChartManualInput === "Neutro") usChartActualValue = "Neutro";
        else if (dailyChartManualInput === "Bajista") usChartActualValue = "Bajista";

        currentDataMap.set("Gráfica Diaria", {
          ...currentDataMap.get("Gráfica Diaria")!,
          usActualValue: usChartActualValue,
          jpActualValue: "Precio sobre las 3 emas", // Mantener el valor fijo o ajustarlo según necesidad
          usForecastValue: undefined,
          jpForecastValue: undefined,
        });
      }

      // Recalcular las puntuaciones y el sesgo del par para todos los datos actualizados
      const finalData = Array.from(currentDataMap.values()).map(item => {
        const usScore = calculateIndividualScore(
          item.usActualValue,
          item.usForecastValue,
          item.variable,
          'US',
          item.variable === "Gráfica Diaria" ? dailyChartManualInput : null
        );
        // JP Score para Gráfica Diaria es 0, no se calcula con calculateIndividualScore si es "Gráfica Diaria" o "Estacionalidad"
        const jpScore = (item.variable.includes("Estacionalidad") || item.variable === "Gráfica Diaria") ? 0 : calculateIndividualScore(
          item.jpActualValue,
          item.jpForecastValue,
          item.variable,
          'JP',
          null
        );
        const pairBias = calculatePairBias(usScore, jpScore);
        return { ...item, usScore, jpScore, pairBias };
      });

      setMacroEconomicData(finalData);
      setIsLoading(false);
    };

    loadAllData();
  }, [
    fetchData,
    fetchCotData,
    initialMacroEconomicData,
    getSeasonalityForCurrentMonth,
    dailyChartManualInput,
    calculateIndividualScore,
    calculatePairBias, // This dependency is already here, no change needed.
    handleDailyChartManualInputChange // Ensure this is also a dependency
  ]);

  // Calcula el total de la puntuación del par
  const totalPairBiasScore = useMemo(() => {
    return macroEconomicData.reduce((sum, data) => {
      return sum + (data.pairBias !== null ? data.pairBias : 0);
    }, 0);
  }, [macroEconomicData]);

  // Determina el sesgo general basado en la puntuación total del par
  const bias = useMemo(() => {
    // Primero verificamos el rango del total
    if (totalPairBiasScore > 3) {
      return "Alcista";
    } else if (totalPairBiasScore < -3) {
      return "Bajista";
    } else {
      return "Neutro";
    }
  }, [totalPairBiasScore]);

    // Determina el color basado en el valor numérico del total
  const totalScoreColorClass = useMemo(() => {
    if (totalPairBiasScore > 3) return "text-green-600";     // Alcista (verde)
    if (totalPairBiasScore < -3) return "text-red-600";      // Bajista (rojo)
    return "text-gray-600";                                  // Neutro (gris)
  }, [totalPairBiasScore]);

  // Genera el análisis del sesgo de forma profesional
  const generateProfessionalAnalysis = useCallback(() => {
    const positiveFactors: string[] = [];
    const negativeFactors: string[] = [];
    const neutralFactors: string[] = [];

    macroEconomicData.forEach((item) => {
      if (item.variable === "Gráfica Diaria") {
        const graficaDiariaScore = item.pairBias;
        if (graficaDiariaScore === 1) positiveFactors.push(item.variable);
        else if (graficaDiariaScore === -1) negativeFactors.push(item.variable);
        else neutralFactors.push(item.variable);
      } else {
        if (item.pairBias === 1) {
          positiveFactors.push(item.variable);
        } else if (item.pairBias === -1) {
          negativeFactors.push(item.variable);
        } else {
          neutralFactors.push(item.variable);
        }
      }
    });

    let analysisText = "";
    let actionMessage = "";
    let emoji = "";

    if (bias === "Alcista") {
      emoji = "📈";
      actionMessage =
        "Se sugiere <strong>procurar oportunidades de compra técnica</strong>🟢.";
      const contributingFactors =
        positiveFactors.length > 0
          ? positiveFactors.join(", ")
          : "diversos indicadores clave";
      analysisText = `El sesgo macro-fundamental para el par USDJPY se posiciona en <span class="font-bold text-green-600">Alcista</span> ${emoji}. Este posicionamiento se sustenta en la fortaleza observada en ${contributingFactors}. ${actionMessage}`;
    } else if (bias === "Bajista") {
      emoji = "📉";
      actionMessage =
        "Se recomienda <strong>procurar tomar ventas o gestionar el riesgo</strong>🔴.";
      const contributingFactors =
        negativeFactors.length > 0
          ? negativeFactors.length === macroEconomicData.length
            ? "todos los indicadores"
            : negativeFactors.join(", ")
          : "múltiples indicadores críticos";
      analysisText = `El sesgo macro-fundamental para el par USDJPY se inclina hacia <span class="font-bold text-red-600">Bajista</span> ${emoji}. Esta perspectiva se fundamenta en la debilidad evidenciada en ${contributingFactors}. ${actionMessage}`;
    } else if (bias === "Neutro") {
      emoji = "⚖️";
      actionMessage =
        "La prudencia aconseja <strong>abstenerse de operar o esperar una mayor definición en las tendencias del mercado.</strong> 🟡";
      const contributingFactors =
        neutralFactors.length > 0
          ? neutralFactors.join(", ")
          : "varios indicadores clave";
      analysisText = `El sesgo macro-fundamental para el par USDJPY se mantiene <span class="font-bold text-gray-600">Neutro</span> ${emoji}. Esta neutralidad refleja un equilibrio de fuerzas en el mercado, donde ${contributingFactors} no muestran una dirección definida. ${actionMessage}`;
    } else {
      analysisText =
        "Análisis del sesgo no disponible debido a datos insuficientes o indefinidos.";
      actionMessage = "";
    }
    return analysisText;
  }, [bias, macroEconomicData]);

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
        SENTIMIENTO MACRO-FUNDAMENTAL DEL USDJPY
      </h1>

      {isLoading && (
        <div className="text-center text-blue-600 text-lg mb-4">
          Cargando datos macroeconómicos...
        </div>
      )}
      {error && (
        <div className="text-center text-red-600 text-lg mb-4">
          Error: {error}
        </div>
      )}

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th rowSpan={2}
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Datos
              </th>
              <th rowSpan={2}
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Variables
              </th>
              <th colSpan={4}
                scope="col"
                className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
              >
                EEUU
              </th>
              <th colSpan={4}
                scope="col"
                className="py-3 px-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider border-b border-gray-200"
              >
                JAPÓN
              </th>
              <th rowSpan={2}
                scope="col"
                className="py-3 px-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
              >
                Sesgo
              </th>
            </tr>
            <tr>
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
                {items.map((data) => (
                  <TableRow
                    key={data.variable}
                    data={data}
                    dailyChartManualInput={dailyChartManualInput}
                    setDailyChartManualInput={setDailyChartManualInput}
                    onManualInputChange={handleDailyChartManualInputChange}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-800">
          TOTAL: <span className={totalScoreColorClass}>{totalPairBiasScore}</span>
        </div>
        <div className="text-lg font-semibold">
          SESGO:{" "}
          <span
            className={totalScoreColorClass}
          >
            {bias}
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap lg:flex-nowrap gap-4 items-center">
        <div className="w-full lg:w-1/2 p-4 bg-white shadow-lg rounded-lg text-center flex flex-col justify-center">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Rangos de Sesgo:
          </h3>
          <ul className="list-disc list-inside text-gray-700 inline-block">
            <li className="mb-1">
              <span className="font-medium text-green-700">Alcista:</span> De +3
              a +12 📈
            </li>
            <li className="mb-1">
              <span className="font-medium text-gray-600">Neutro:</span> Entre
              -3 y +3 ⚖️
            </li>
            <li className="mb-1">
              <span className="font-medium text-red-700">Bajista:</span> De -12
              a -3 📉
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-1/2 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Análisis del Sesgo del USDJPY
          </h3>
          <p className="text-gray-700" dangerouslySetInnerHTML={{ __html: generateProfessionalAnalysis() }}></p>
        </div>
      </div>
    </div>
  );
};

// Componente de página principal (Next.js)
const Page: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10">
      <USDJPYSentimentTable />
    </div>
  );
};

export default Page;
