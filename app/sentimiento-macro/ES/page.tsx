"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";

// Definición de tipos para los datos de la tabla
interface MacroEconomicData {
  category: string;
  variable: string;
  actualValue: number | null; // Puede ser null mientras se carga o si hay error
  forecastValue: number | null | undefined; // Puede ser null, undefined o number
  unit: string;
  source: string;
  isNegativeForNasdaq: boolean; // Indica si un valor actual > prevision es negativo para el índice (ej: inflación, desempleo)
}

// Componente para una fila de la tabla
const TableRow: React.FC<{
  data: MacroEconomicData;
  calculateScore: (data: MacroEconomicData) => number;
  // Nuevas props para la entrada manual de Gráfica Diaria
  dailyChartManualInput: "Alcista" | "Neutro" | "Bajista" | null;
  setDailyChartManualInput: React.Dispatch<
    React.SetStateAction<"Alcista" | "Neutro" | "Bajista" | null>
  >;
}> = ({
  data,
  calculateScore,
  dailyChartManualInput,
  setDailyChartManualInput,
}) => {
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
      {/* Lógica para unificar celdas de Valor Actual y Previsión para Sentimiento COT, Estacionalidad y Gráfica Diaria */}
      {data.variable === "Sentimiento COT Large Speculators" ||
      data.variable === "Sentimiento COT Small Traders" ||
      data.variable === "Estacionalidad" ||
      data.variable === "Gráfica Diaria" ? (
        <td className="py-2 px-4 text-sm text-gray-700 text-center" colSpan={2}>
          {/* Renderizar el select para Gráfica Diaria */}
          {data.variable === "Gráfica Diaria" ? (
            <select
              id="dailyChartSentiment"
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
            // Renderizado normal para otras variables unificadas
            data.actualValue !== null ? (
              `${data.actualValue}${data.unit}`
            ) : (
              "Cargando..."
            )
          )}
        </td>
      ) : (
        <>
          <td className="py-2 px-4 text-sm text-gray-700">
            {data.actualValue !== null
              ? `${data.actualValue}${data.unit}`
              : "Cargando..."}
          </td>
          <td className="py-2 px-4 text-sm text-gray-700">
            {data.forecastValue !== null && data.forecastValue !== undefined
              ? `${data.forecastValue}${data.unit}`
              : "N/A"}
          </td>
        </>
      )}
      <td
        className={`py-2 px-4 text-sm font-bold text-center rounded-md ${scoreColorClass}`}
      >
        {/* La puntuación se muestra si hay actualValue y (forecastValue o si es Sentimiento COT/Estacionalidad/Gráfica Diaria) */}
        {data.actualValue !== null &&
        ((data.forecastValue !== null && data.forecastValue !== undefined) ||
          data.variable === "Sentimiento COT Large Speculators" ||
          data.variable === "Sentimiento COT Small Traders" ||
          data.variable === "Estacionalidad" ||
          data.variable === "Gráfica Diaria")
          ? score
          : "-"}
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
const SP500SentimentTable: React.FC = () => {
  // Datos de estacionalidad harcodeados para S&P 500 (ejemplos, ajustar si se tienen datos reales)
  // Fuente: https://www.forex.com/en/news-and-analysis/nasdaq-100-sandp-500-seasonality-analysis-for-july/ (se menciona en el texto)
  // O buscar en Investtech para S&P 500 (CompanyID=10500001 para S&P 500 en Investtech)
  const seasonalityData = useMemo(
    () => ({
      Jan: 1.41, Feb: -0.54, Mar: 0.18, Apr: 1.11, May: 1.46, Jun: 1.85,
      Jul: 3.37, Aug: 0.11, Sep: -1.96, Oct: 1.26, Nov: 4.14, Dec: -0.12,
    }),
    []
  );

  // Función para obtener el valor de estacionalidad del mes actual
  const getSeasonalityForCurrentMonth = useCallback(() => {
    const currentMonth = new Date().toLocaleString("en-us", { month: "short" }); // Ej: 'Aug'
    const monthKey =
      currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1); // Ej: 'Aug'
    return seasonalityData[monthKey as keyof typeof seasonalityData] || 0; // Devuelve 0 si no se encuentra
  }, [seasonalityData]);

  // Definición de los datos iniciales de la tabla.
  // Usamos useMemo para asegurar que este array solo se cree una vez.
  const initialMacroEconomicData: MacroEconomicData[] = useMemo(
    () => [
      {
        category: "MACROECONÓMICOS",
        variable: "Crecimiento del PIB",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "%",
        source: "https://tradingeconomics.com/united-states/gdp-growth",
        isNegativeForNasdaq: false,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "PMI Manufacturero",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "",
        source: "https://tradingeconomics.com/united-states/manufacturing-pmi",
        isNegativeForNasdaq: false,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "PMI de Servicios",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "",
        source: "https://tradingeconomics.com/united-states/services-cpi",
        isNegativeForNasdaq: false,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Ventas Minoristas",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "%",
        source: "https://tradingeconomics.com/united-states/retail-sales",
        isNegativeForNasdaq: false,
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Inflación",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "%",
        source: "https://tradingeconomics.com/united-states/inflation-cpi",
        isNegativeForNasdaq: true, // Inflación alta es negativa para el índice
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Tasa de Desempleo",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "%",
        source: "https://tradingeconomics.com/united-states/unemployment-rate",
        isNegativeForNasdaq: true, // Desempleo alto es negativo para el índice
      },
      {
        category: "MACROECONÓMICOS",
        variable: "Tasa de Interés",
        actualValue: null, // Valor temporal, se actualizará
        forecastValue: null, // Valor temporal, se actualizará
        unit: "%",
        source: "https://tradingeconomics.com/united-states/interest-rate",
        isNegativeForNasdaq: false,
      },
      // Datos de Sentimiento
      {
        category: "SENTIMIENTO",
        variable: "Sentimiento COT Large Speculators",
        actualValue: null, // Se actualizará con el porcentaje de sesgo profesional
        forecastValue: undefined,
        unit: "%",
        source: "https://insider-week.com/en/cot/", // Fuente para S&P 500 COT
        isNegativeForNasdaq: false,
      },
      {
        category: "SENTIMIENTO",
        variable: "Sentimiento COT Small Traders",
        actualValue: null, // Se actualizará con el porcentaje de sesgo
        forecastValue: undefined,
        unit: "%",
        source: "https://insider-week.com/en/cot/", // Fuente para S&P 500 COT
        isNegativeForNasdaq: false,
      },
      // Datos Técnicos
      {
        category: "TÉCNICOS",
        variable: "Estacionalidad",
        actualValue: null, // Se llenará con el valor del mes actual
        forecastValue: undefined, // No hay previsión
        unit: "%", // Es un porcentaje
        source: "Investtech.com (últimos 10 años)", // Fuente hardcodeada
        isNegativeForNasdaq: false, // Positivo si el rendimiento es positivo
      },
      {
        category: "TÉCNICOS",
        variable: "Gráfica Diaria",
        actualValue: null, // Valor inicial null, se llenará con la entrada manual
        forecastValue: undefined, // No hay previsión
        unit: "", // No hay unidad, es un texto/score
        source: "Entrada Manual", // Fuente de entrada manual
        isNegativeForNasdaq: false, // El score ya indica el sesgo
      },
    ],
    []
  );

  const [macroEconomicData, setMacroEconomicData] = useState<
    MacroEconomicData[]
  >(initialMacroEconomicData);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Nuevo estado para la entrada manual de Gráfica Diaria
  const [dailyChartManualInput, setDailyChartManualInput] = useState<
    "Alcista" | "Neutro" | "Bajista" | null
  >(null);

  // Función para calcular la puntuación de una variable
  const calculateScore = useCallback((data: MacroEconomicData): number => {
    // Lógica especial para Sentimiento COT (Large Speculators)
    if (data.variable === "Sentimiento COT Large Speculators") {
      if (data.actualValue === null) return 0;
      if (data.actualValue > 10) return 1;
      if (data.actualValue < -10) return -1;
      return 0;
    }

    // Lógica especial para Sentimiento COT Small Traders
    if (data.variable === "Sentimiento COT Small Traders") {
      if (data.actualValue === null) return 0;
      // Tus criterios: 1 si < -10%, -1 si > 10%, 0 si entre -10% y +10%
      if (data.actualValue < -10) return 1; // Bajista Small Traders -> Alcista para índice (contrario)
      if (data.actualValue > 10) return -1; // Alcista Small Traders -> Bajista para índice (contrario)
      return 0; // Neutral
    }

    // Lógica especial para Estacionalidad
    if (data.variable === "Estacionalidad") {
      if (data.actualValue === null) return 0;
      if (data.actualValue > 0) return 1; // Positivo si el rendimiento promedio es positivo
      if (data.actualValue < 0) return -1; // Negativo si el rendimiento promedio es negativo
      return 0; // Neutral si es cero
    }

    // Lógica especial para Gráfica Diaria (entrada manual)
    if (data.variable === "Gráfica Diaria") {
      if (data.actualValue === null) return 0; // Si no hay valor, es 0
      if (data.actualValue === 1) return 1; // Alcista
      if (data.actualValue === -1) return -1; // Bajista
      if (data.actualValue === 0) return 0; // Neutro
      return 0; // Fallback
    }

    // Para otras variables que requieren forecastValue
    if (
      data.actualValue === null ||
      data.forecastValue === null ||
      data.forecastValue === undefined
    ) {
      return 0;
    }

    const { actualValue, forecastValue, isNegativeForNasdaq } = data;

    // Lógica estándar para otras variables
    if (actualValue > forecastValue) {
      return isNegativeForNasdaq ? -1 : 1;
    } else if (actualValue < forecastValue) {
      return isNegativeForNasdaq ? 1 : -1;
    } else {
      return 0; // Neutral
    }
  }, []);

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
        return data;
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

      const currentDataMap = new Map(
        initialMacroEconomicData.map((item) => [item.variable, { ...item }])
      );

      const apiCalls = [
        fetchData("/api/scrape-gdp", "Crecimiento del PIB"),
        fetchData("/api/scrape-pmi-manufacturing", "PMI Manufacturero"),
        fetchData("/api/scrape-pmi-services", "PMI de Servicios"),
        fetchData("/api/scrape-retail-sales", "Ventas Minoristas"),
        fetchData("/api/scrape-inflation", "Inflación"),
        fetchData("/api/scrape-unemployment-rate", "Tasa de Desempleo"),
        fetchData("/api/scrape-interest-rate", "Tasa de Interés"),
        fetchData("/api/scrape-cot-sp500", "Sentimiento COT Large Speculators"), // CAMBIO AQUÍ: API para Large Speculators S&P 500
        fetchData("/api/scrape-cot-sp500-small-traders", "Sentimiento COT Small Traders"), // CAMBIO AQUÍ: API para Small Traders S&P 500
      ];

      const results = await Promise.allSettled(apiCalls);

      results.forEach((result) => {
        if (result.status === "fulfilled" && result.value) {
          const { variable, actualValue, forecastValue } = result.value;

          if (currentDataMap.has(variable)) {
            currentDataMap.set(variable, {
              ...currentDataMap.get(variable)!,
              actualValue: actualValue,
              forecastValue:
                forecastValue !== undefined
                  ? forecastValue
                  : currentDataMap.get(variable)!.forecastValue,
            });
          }
        } else if (result.status === "rejected") {
          console.error(
            `Una API call falló en Promise.allSettled: ${result.reason}`
          );
        }
      });

      // Actualizar los valores hardcodeados directamente en el mapa
      // Estacionalidad
      if (currentDataMap.has("Estacionalidad")) {
        currentDataMap.set("Estacionalidad", {
          ...currentDataMap.get("Estacionalidad")!,
          actualValue: getSeasonalityForCurrentMonth(),
          forecastValue: undefined,
        });
      }
      // Gráfica Diaria (entrada manual)
      if (currentDataMap.has("Gráfica Diaria") && dailyChartManualInput !== null) {
        let scoreValue: number | null = null;
        if (dailyChartManualInput === 'Alcista') scoreValue = 1;
        else if (dailyChartManualInput === 'Neutro') scoreValue = 0;
        else if (dailyChartManualInput === 'Bajista') scoreValue = -1;

        currentDataMap.set("Gráfica Diaria", {
          ...currentDataMap.get("Gráfica Diaria")!,
          actualValue: scoreValue,
          forecastValue: undefined,
        });
      }
      
      setMacroEconomicData(Array.from(currentDataMap.values()));
      setIsLoading(false);
    };

    loadAllData();
  }, [fetchData, initialMacroEconomicData, getSeasonalityForCurrentMonth, dailyChartManualInput]);

  // Calcula el total de la puntuación
  const totalScore = useMemo(() => {
    return macroEconomicData.reduce((sum, data) => {
      // Para Sentimiento COT Large Speculators, Sentimiento COT Small Traders, Estacionalidad y Gráfica Diaria, usa la lógica de puntuación especial
      if (
        data.variable === "Sentimiento COT Large Speculators" ||
        data.variable === "Sentimiento COT Small Traders" ||
        data.variable === "Estacionalidad" ||
        data.variable === "Gráfica Diaria"
      ) {
        if (data.actualValue !== null) {
          return sum + calculateScore(data);
        }
        return sum;
      }

      // Para otras variables, se requiere actualValue y forecastValue
      if (
        data.actualValue !== null &&
        data.forecastValue !== null &&
        data.forecastValue !== undefined
      ) {
        return sum + calculateScore(data);
      }
      return sum;
    }, 0);
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
    return "Indefinido";
  }, [totalScore]);

  // Genera el análisis del sesgo de forma profesional
  const generateProfessionalAnalysis = useCallback(() => {
    const scoresMap: { [key: string]: number | null } = {};
    const relevantVariables = macroEconomicData.filter(item => 
        item.category === 'MACROECONÓMICOS' || 
        item.category === 'SENTIMIENTO' || 
        item.category === 'TÉCNICOS'
    );

    relevantVariables.forEach(item => {
      if (item.actualValue !== null) {
        scoresMap[item.variable] = calculateScore(item);
      }
    });

    const positiveFactors = relevantVariables.filter(item => scoresMap[item.variable] === 1).map(item => item.variable);
    const negativeFactors = relevantVariables.filter(item => scoresMap[item.variable] === -1).map(item => item.variable);
    const neutralFactors = relevantVariables.filter(item => scoresMap[item.variable] === 0).map(item => item.variable);

    let analysisText = "";
    let actionMessage = "";
    let emoji = "";

    if (bias === "Alcista") {
        emoji = "📈";
        actionMessage = "Se sugiere <strong>procurar oportunidades de compra técnica.</strong> 🟢";
        const contributingFactors = positiveFactors.length > 0 ? positiveFactors.join(', ') : 'diversos indicadores clave';
        analysisText = `El sesgo macro-fundamental para el S&P 500 se posiciona en <span class="font-bold text-green-600">Alcista</span> ${emoji}. Este posicionamiento se sustenta en la fortaleza observada en ${contributingFactors}. ${actionMessage}`;
    } else if (bias === "Bajista") {
        emoji = "📉";
        actionMessage = "Se recomienda <strong>procurar tomar ventas o gestionar el riesgo.</strong> 🔴";
        const contributingFactors = negativeFactors.length > 0 ? negativeFactors.length === relevantVariables.length ? 'todos los indicadores' : negativeFactors.join(', ') : 'múltiples indicadores críticos';
        analysisText = `El sesgo macro-fundamental para el S&P 500 se inclina hacia <span class="font-bold text-red-600">Bajista</span> ${emoji}. Esta perspectiva se fundamenta en la debilidad evidenciada en ${contributingFactors}. ${actionMessage}`;
    } else if (bias === "Neutro") {
        emoji = "⚖️";
        actionMessage = "La prudencia aconseja <strong>abstenerse de operar o esperar una mayor definición en las tendencias del mercado.</strong> 🟡";
        const contributingFactors = neutralFactors.length > 0 ? neutralFactors.join(', ') : 'varios indicadores clave';
        analysisText = `El sesgo macro-fundamental para el S&P 500 se mantiene <span class="font-bold text-gray-600">Neutro</span> ${emoji}. Esta neutralidad refleja un equilibrio de fuerzas en el mercado, donde ${contributingFactors} no muestran una dirección definida. ${actionMessage}`;
    } else {
        analysisText = "Análisis del sesgo no disponible debido a datos insuficientes o indefinidos.";
        actionMessage = "";
    }
    return <span dangerouslySetInnerHTML={{ __html: analysisText }} />;
  }, [bias, macroEconomicData, calculateScore]);


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
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="container mx-auto p-4 font-inter">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
          SENTIMIENTO MACRO-FUNDAMENTAL DEL S&P 500
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
                  {items.map((data) => (
                    <TableRow
                      key={data.variable}
                      data={data}
                      calculateScore={calculateScore}
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
            TOTAL: <span className="text-blue-600">{totalScore}</span>
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

        {/* Contenedor flex para las dos columnas */}
        <div className="mt-4 flex flex-wrap lg:flex-nowrap gap-4 items-center">
          {/* Columna de Rangos de Sesgo */}
          <div className="w-full lg:w-1/2 p-4 bg-white shadow-lg rounded-lg text-center flex flex-col justify-center">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Rangos de Sesgo:
            </h3>
            <ul className="list-disc list-inside text-gray-700 inline-block">
              <li className="mb-1">
                <span className="font-medium text-green-700">Alcista:</span> De
                +4 a +12 📈
              </li>
              <li className="mb-1">
                <span className="font-medium text-gray-600">Neutro:</span> Entre
                -3 y +3 ⚖️
              </li>
              <li className="mb-1">
                <span className="font-medium text-red-700">Bajista:</span> De
                -12 a -4 📉
              </li>
            </ul>
          </div>

          {/* Columna de Análisis del Sesgo */}
          <div className="w-full lg:w-1/2 p-4 bg-white shadow-lg rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-gray-800">
              Análisis del Sesgo del S&P 500
            </h3>
            <p className="text-gray-700">{generateProfessionalAnalysis()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SP500SentimentTable;
