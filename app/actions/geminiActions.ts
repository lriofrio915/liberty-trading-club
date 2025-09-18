"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiAssetItem } from "@/types/api"; // Importamos la interfaz de datos del activo

/**
 * Genera un análisis de inversión de valor y perfil de riesgo para un activo específico.
 *
 * @param assetData - El objeto completo con los datos financieros del activo.
 * @returns Una promesa que se resuelve en un string con el análisis de la IA.
 */
export async function generateValueInvestingAnalysis(
  assetData: ApiAssetItem
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "La clave de API de Gemini no está configurada en el servidor."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const dataString = JSON.stringify(
    assetData,
    (key, value) => (value === undefined ? null : value),
    2
  );

  // --- ✨ PROMPT ACTUALIZADO CON LA SECCIÓN DE PERFIL DE RIESGO ---
  const prompt = `
    Eres un analista financiero de élite, especializado en "value investing" y gestión de riesgos, entrenado con las filosofías de Warren Buffett, Charlie Munger y Peter Lynch. Tu tarea es analizar los datos de la empresa con ticker "${assetData.ticker}" y redactar un informe fundamental conciso y profundo para un gestor de portafolios.

    El informe debe tener dos secciones claras:

    **SECCIÓN 1: ANÁLISIS DE INVERSIÓN DE VALOR**
    Adopta el siguiente enfoque, combinando las fortalezas de los tres maestros:

    1.  **Comprensión del Negocio (Buffett/Munger/Lynch):**
        * Basado en 'sector', 'industria' y 'longBusinessSummary', describe en una o dos frases a qué se dedica la empresa. ¿Es un negocio simple y comprensible?
        * Identifica su "foso económico" (Economic Moat). ¿Tiene ventajas competitivas duraderas?

    2.  **Salud Financiera y Gestión (Buffett/Munger):**
        * Analiza la deuda ('totalDebt', 'debtToEquity'). ¿Es manejable? Los grandes inversores prefieren empresas con poca deuda.
        * Observa la rentabilidad ('returnOnEquity', 'profitMargins'). ¿Es consistentemente alta?
        * Evalúa el flujo de caja ('freeCashflow', 'operatingCashflow'). ¿Genera la empresa más efectivo del que gasta?

    3.  **Crecimiento y Categoría (Peter Lynch):**
        * Analiza el crecimiento de ingresos ('revenueGrowth') y ganancias ('earningsGrowth').
        * Clasifica la empresa en una de las categorías de Peter Lynch (ej: "Stalwart", "Fast Grower", "Cyclical", "Turnaround"). Justifica tu elección.

    4.  **Valoración (Buffett):**
        * Compara el precio actual ('regularMarketPrice') con sus múltiplos de valoración ('trailingPE', 'forwardPE'). ¿Parece la acción estar infravalorada, a un precio justo o sobrevalorada?
        * Considera el "margen de seguridad". ¿Es una compra atractiva al precio actual?

    5.  **Veredicto de Inversión de Valor:**
        * Sintetiza tu análisis en un párrafo.
        * Concluye con un veredicto claro: ¿Es esta una acción candidata para un portafolio de "value investing" a largo plazo? ¿Sí o no y por qué?

    **SECCIÓN 2: PERFIL DE RIESGO DEL ACTIVO**
    Independientemente de si es una buena inversión de valor o no, ahora evalúa el perfil de riesgo de la acción para un gestor de portafolios.

    1.  **Análisis de Volatilidad y Sensibilidad:**
        * Considera el indicador 'beta'. Un beta > 1 indica mayor volatilidad que el mercado; < 1 menor volatilidad.
        * Observa el 'sector' y la 'industria'. ¿Son típicamente volátiles (ej. tecnología, biotecnología) o estables (ej. consumo básico, utilities)?

    2.  **Conclusión de Riesgo:**
        * Clasifica la acción en una de estas tres categorías: **Riesgo Bajo**, **Riesgo Moderado**, o **Riesgo Alto**.
        * Justifica tu clasificación en una frase, indicando para qué tipo de inversor (conservador, equilibrado, agresivo) sería más adecuada esta acción.

    **Datos a analizar:**
    ${dataString}
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    return text;
  } catch (error) {
    console.error("Error al llamar a la API de Gemini:", error);
    throw new Error(
      "No se pudo generar el análisis de inversión. Inténtalo de nuevo."
    );
  }
}
