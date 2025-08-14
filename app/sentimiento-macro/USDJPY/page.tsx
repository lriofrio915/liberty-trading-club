"use client";

import CotDataTable from "@/components/CotDataTable";
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

// Componente para una fila de la tabla
const TableRow: React.FC<{
  data: MacroEconomicData;
  // calculateIndividualScore y calculatePairBias se eliminan de las props
  // porque ya no se usan directamente en TableRow.
  dailyChartManualInput: "Alcista" | "Neutro" | "Bajista" | null;
  setDailyChartManualInput: React.Dispatch<
    React.SetStateAction<"Alcista" | "Neutro" | "Bajista" | null>
  >;
}> = ({
  data,
  // Se eliminan de la desestructuración
  dailyChartManualInput,
  setDailyChartManualInput,
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
      {data.variable === "Sentimiento COT" ||
      data.variable === "Sentimiento Retail" ||
      data.variable === "Estacionalidad" ||
      data.variable === "Gráfica Diaria" ? (
        <td className="py-2 px-4 text-sm text-gray-700 text-center" colSpan={2}>
          {data.variable === "Gráfica Diaria" ? (
            <select
              id="dailyChartSentimentUS"
              className="p-1 border border-gray-300 rounded-md text-sm focus:ring-blue-500 focus:border-blue-500 w-full"
              value={dailyChartManualInput || ""}
              onChange={(e) =>
                setDailyChartManualInput(
                  e.target.value as "Alcista" | "Neutro" | "Bajista"
                )
              }
            >
              <option value="" disabled>
                Selecciona...
              </option>
              <option value="Alcista">Alcista</option>
              <option value="Neutro">Neutro</option>
              <option value="Bajista">Bajista</option>
            </select>
          ) : (
            `${data.usActualValue}${data.usUnit}`
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
      )}
      <td
        className={`py-2 px-4 text-sm font-bold text-center rounded-md ${usScoreColorClass}`}
      >
        {data.usScore !== null ? data.usScore : "-"}
      </td>
      <td className="py-2 px-4 text-sm text-blue-600 hover:underline">
        <a href={data.usSource} target="_blank" rel="noopener noreferrer">
          Fuente
        </a>
      </td>

      {/* Columnas de Japón */}
      {data.variable === "Sentimiento COT" ||
      data.variable === "Sentimiento Retail" ||
      data.variable === "Estacionalidad" ||
      data.variable === "Gráfica Diaria" ? (
        <td className="py-2 px-4 text-sm text-gray-700 text-center" colSpan={2}>
          {data.variable === "Gráfica Diaria" ? (
            // No hay select para Japón en Gráfica Diaria, solo se muestra el valor
            `${data.jpActualValue}${data.jpUnit}`
          ) : (
            `${data.jpActualValue}${data.jpUnit}`
          )}
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
      )}
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
  // Datos de estacionalidad hardcodeados para EE. UU. (Nasdaq) y Japón (Nikkei)
  const seasonalityData = useMemo(
    () => ({
      us: {
        Jan: 2.13, Feb: -0.37, Mar: 0.2, Apr: 0.92, May: 2.89, Jun: 2.72,
        Jul: 4.16, Aug: 0.59, Sep: -2.48, Oct: 1.07, Nov: 4.4, Dec: -0.28,
      },
      jp: {
        Jan: 0.8, Feb: 0.5, Mar: 1.2, Apr: 0.9, May: 0.7, Jun: -0.1,
        Jul: 0.3, Aug: 0.2, Sep: -0.5, Oct: 0.6, Nov: 1.0, Dec: 0.4,
      }, // Datos ficticios para Japón
    }),
    []
  );

  // Función para obtener el valor de estacionalidad del mes actual
  const getSeasonalityForCurrentMonth = useCallback((country: 'US' | 'JP') => {
    const currentMonth = new Date().toLocaleString("en-us", { month: "short" }); // Ej: 'Aug'
    const monthKey =
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1); // Ej: 'Aug'
    // Usar las claves en minúsculas 'us' y 'jp' para acceder a seasonalityData
    const key = country === 'US' ? 'us' : 'jp';
    return seasonalityData[key]?.[monthKey as keyof typeof seasonalityData.us] || 0;
  }, [seasonalityData]);

  // Definición de los datos iniciales de la tabla.
  // Usamos useMemo para asegurar que este array solo se cree una vez.
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
        variable: "Sentimiento COT", // Unificado para ambos países, el valor hardcodeado es el mismo en la imagen
        usActualValue: 67, usForecastValue: undefined, usUnit: "%", usSource: "https://www.insider-week.com/", usScore: null,
        jpActualValue: 67, jpForecastValue: undefined, jpUnit: "%", jpSource: "https://www.insider-week.com/", jpScore: null,
        pairBias: null,
      },
      {
        category: "SENTIMIENTO",
        variable: "Sentimiento Retail", // Unificado para ambos países
        usActualValue: -58, usForecastValue: undefined, usUnit: "%", usSource: "https://www.forex.com/en-us/markets/sentiment/", usScore: null,
        jpActualValue: -58, jpForecastValue: undefined, jpUnit: "%", jpSource: "https://www.forex.com/en-us/markets/sentiment/", jpScore: null,
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
        usActualValue: "Precio sobre las 3 emas", usForecastValue: undefined, usUnit: "", usSource: "Entrada Manual", usScore: null,
        jpActualValue: "Precio sobre las 3 emas", jpForecastValue: undefined, jpUnit: "", jpSource: "Entrada Manual", jpScore: null,
        pairBias: null,
      },
    ],
    []
  );

  const [macroEconomicData, setMacroEconomicData] = useState<MacroEconomicData[]>(initialMacroEconomicData);
  const [isLoading, setIsLoading] = useState(true); // Se inicia en true porque ahora hay APIs que cargar
  const [error, setError] = useState<string | null>(null);

  // Nuevo estado para la entrada manual de Gráfica Diaria (solo para EE. UU. / USD)
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
      if (actual === null) return 0; // Si no hay valor actual, es neutral

      // Lógica especial para Sentimiento COT
      if (variableName === "Sentimiento COT") {
        if (typeof actual !== 'number') return 0; // Debe ser numérico
        if (actual > 10) return 1; // Alcista
        if (actual < -10) return -1; // Bajista
        return 0; // Neutral
      }

      // Lógica especial para Sentimiento Retail (contrario al índice)
      if (variableName === "Sentimiento Retail") {
        if (typeof actual !== 'number') return 0;
        if (actual < -10) return 1; // Retail bajista -> Alcista para índice (contrario)
        if (actual > 10) return -1; // Retail alcista -> Bajista para índice (contrario)
        return 0; // Neutral
      }

      // Lógica especial para Estacionalidad
      if (variableName === "Estacionalidad") {
        if (typeof actual !== 'number') return 0;
        if (actual > 0) return 1; // Positivo si el rendimiento promedio es positivo
        if (actual < 0) return -1; // Negativo si el rendimiento promedio es negativo
        return 0; // Neutral si es cero
      }

      // Lógica especial para Gráfica Diaria (entrada manual)
      if (variableName === "Gráfica Diaria") {
        // Para USD, usamos la entrada manual
        if (country === 'US') {
          if (dailyChartInput === "Alcista") return 1;
          if (dailyChartInput === "Neutro") return 0;
          if (dailyChartInput === "Bajista") return -1;
          return 0; // Por defecto si no hay entrada manual
        } else { // Para JP, el valor es hardcodeado "Precio sobre las 3 emas"
          // Asumimos que "Precio sobre las 3 emas" es Alcista (1)
          // El usuario puede ajustar esto si la lógica es diferente para JP
          return 1; // Hardcodeado a Alcista para JP según la imagen
        }
      }

      // Para variables que requieren comparación actual vs. forecast
      if (typeof actual !== 'number' || typeof forecast !== 'number') return 0; // Necesitan ser números

      // Lógica para Inflación y Tasa de Interés: mayor que forecast es positivo para la moneda
      if (variableName === "Inflación" || variableName === "Tasa de Interés") {
        if (actual > forecast) return 1;
        if (actual < forecast) return -1;
        return 0;
      }

      // Lógica para Tasa de Desempleo: menor que forecast es positivo para la moneda
      if (variableName === "Tasa de Desempleo") {
        if (actual < forecast) return 1;
        if (actual > forecast) return -1;
        return 0;
      }

      // Lógica estándar para Crecimiento del PIB, PMI, Ventas Minoristas: mayor que forecast es positivo para la moneda
      if (actual > forecast) return 1;
      if (actual < forecast) return -1;
      return 0; // Neutral
    },
    []
  );

  // Función para calcular el sesgo del par USDJPY basado en las puntuaciones individuales
  const calculatePairBias = useCallback(
    (usScore: number | null, jpScore: number | null): number => {
      if (usScore === null || jpScore === null) return 0; // Si falta alguna puntuación, es neutral

      // Lógica: USD (primera moneda) vs JPY (segunda moneda)
      // +1 para USD, -1 para JPY (favorece el par alcista)
      // -1 para USD, +1 para JPY (favorece el par bajista)

      // Escenario 1: USD fuerte, JPY débil (Alcista para USDJPY)
      if (usScore === 1 && jpScore === -1) return 1;
      // Escenario 2: USD débil, JPY fuerte (Bajista para USDJPY)
      if (usScore === -1 && jpScore === 1) return -1;

      // Escenario 3: Ambos fuertes o ambos débiles (Neutral para el par)
      if ((usScore === 1 && jpScore === 1) || (usScore === -1 && jpScore === -1)) return 0;

      // Escenario 4: Uno neutral, el otro define
      if (usScore === 0) return -jpScore; // Si USD es neutral, JPY score inverso define (JPY fuerte -> par baja, JPY débil -> par sube)
      if (jpScore === 0) return usScore; // Si JPY es neutral, USD score define (USD fuerte -> par sube, USD débil -> par baja)

      return 0; // Por defecto, neutral
    },
    []
  );

  // Función para cargar los datos de una API Route específica
  const fetchData = useCallback(
    async (apiPath: string, variableName: string) => {
      try {
        const response = await fetch(apiPath);
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

  // Efecto para cargar los datos al montar el componente
  useEffect(() => {
    const loadAllData = async () => {
      setIsLoading(true);
      setError(null); // Resetear errores al inicio de una nueva carga

      // Crear un mapa mutable para actualizar los datos
      const currentDataMap = new Map(
        initialMacroEconomicData.map((item) => [item.variable, { ...item }])
      );

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

      const resultsUS = await Promise.allSettled(apiCallsUS);
      const resultsJP = await Promise.allSettled(apiCallsJP); // Ejecutar llamadas a API de Japón

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


      // Actualizar los valores hardcodeados directamente en el mapa
      // Estacionalidad (EE. UU. y Japón)
      if (currentDataMap.has("Estacionalidad")) {
        currentDataMap.set("Estacionalidad", {
          ...currentDataMap.get("Estacionalidad")!,
          usActualValue: getSeasonalityForCurrentMonth('US'),
          jpActualValue: getSeasonalityForCurrentMonth('JP'),
          usForecastValue: undefined, // No hay previsión para estacionalidad
          jpForecastValue: undefined, // No hay previsión para estacionalidad
        });
      }
      // Gráfica Diaria (EE. UU. y Japón) - solo el US es manual input
      if (currentDataMap.has("Gráfica Diaria")) {
        let usScoreValue: number | string | null = null;
        if (dailyChartManualInput === "Alcista") usScoreValue = "Alcista";
        else if (dailyChartManualInput === "Neutro") usScoreValue = "Neutro";
        else if (dailyChartManualInput === "Bajista") usScoreValue = "Bajista";
        else usScoreValue = "Precio sobre las 3 emas"; // Mantener el hardcodeado si no hay input

        currentDataMap.set("Gráfica Diaria", {
          ...currentDataMap.get("Gráfica Diaria")!,
          usActualValue: usScoreValue,
          jpActualValue: "Precio sobre las 3 emas", // Mantener hardcodeado para Japón
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
        const jpScore = calculateIndividualScore(
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
    initialMacroEconomicData,
    getSeasonalityForCurrentMonth,
    dailyChartManualInput,
    calculateIndividualScore, // Añadir como dependencia
    calculatePairBias, // Añadir como dependencia
  ]);


  // Calcula el total de la puntuación del par
  const totalPairBiasScore = useMemo(() => {
    return macroEconomicData.reduce((sum, data) => {
      return sum + (data.pairBias !== null ? data.pairBias : 0);
    }, 0);
  }, [macroEconomicData]);

  // Determina el sesgo general basado en la puntuación total del par
  const bias = useMemo(() => {
    if (totalPairBiasScore >= 4) { // Ajustar rangos según lo necesites para el par
      return "Alcista";
    } else if (totalPairBiasScore <= -4) {
      return "Bajista";
    } else {
      return "Neutro";
    }
  }, [totalPairBiasScore]);

  // Genera el análisis del sesgo de forma profesional
  const generateProfessionalAnalysis = useCallback(() => {
    const positiveFactors: string[] = [];
    const negativeFactors: string[] = [];
    const neutralFactors: string[] = [];

    macroEconomicData.forEach((item) => {
      if (item.pairBias === 1) {
        positiveFactors.push(item.variable);
      } else if (item.pairBias === -1) {
        negativeFactors.push(item.variable);
      } else {
        neutralFactors.push(item.variable);
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
    return analysisText; // Devuelve la cadena HTML directamente
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
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-lg shadow-md flex justify-between items-center">
        <div className="text-lg font-semibold text-gray-800">
          TOTAL: <span className="text-blue-600">{totalPairBiasScore}</span>
        </div>
        <div className="text-lg font-semibold">
          SESGO:{" "}
          <span
            className={
              bias === "Alcista"
                ? "text-green-600"
                : bias === "Bajista"
                ? "text-red-600"
                : "text-gray-600"
            }
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
              <span className="font-medium text-green-700">Alcista:</span> De +4
              a +12 📈
            </li>
            <li className="mb-1">
              <span className="font-medium text-gray-600">Neutro:</span> Entre
              -3 y +3 ⚖️
            </li>
            <li className="mb-1">
              <span className="font-medium text-red-700">Bajista:</span> De -12
              a -4 📉
            </li>
          </ul>
        </div>

        <div className="w-full lg:w-1/2 p-4 bg-white shadow-lg rounded-lg">
          <h3 className="text-xl font-semibold mb-3 text-gray-800">
            Análisis del Sesgo del USDJPY
          </h3>
          {/* Se usa dangerouslySetInnerHTML para renderizar el HTML de la cadena */}
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
