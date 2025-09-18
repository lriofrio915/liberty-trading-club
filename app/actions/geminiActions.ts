"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiAssetItem } from "@/types/api"; // Importamos la interfaz de datos del activo

/**
 * Genera un análisis de inversión de valor para un activo específico utilizando la IA de Gemini,
 * basándose en los principios de Warren Buffett, Peter Lynch y Charlie Munger.
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

  // Convertimos los datos del activo en un string JSON para el prompt.
  // Usamos replacer para evitar valores circulares y limitamos la profundidad.
  const dataString = JSON.stringify(
    assetData,
    (key, value) => (value === undefined ? null : value),
    2
  );

  const prompt = `
    Eres un analista financiero de élite, especializado en "value investing" (inversión en valor), y has sido entrenado directamente con las filosofías de Warren Buffett, Charlie Munger y Peter Lynch. Tu tarea es analizar los siguientes datos financieros de la empresa con ticker "${assetData.ticker}" y redactar un informe de análisis fundamental conciso y profundo para un inversor.

    Adopta el siguiente enfoque, combinando las fortalezas de los tres maestros:

    1.  **Comprensión del Negocio (Buffett/Munger/Lynch):**
        * Basado en el 'sector', 'industria' y 'longBusinessSummary', describe en una o dos frases a qué se dedica la empresa. ¿Es un negocio simple y comprensible?
        * Identifica su "foso económico" (Economic Moat). ¿Tiene ventajas competitivas duraderas como una marca fuerte, efecto de red, patentes, o bajos costos de producción?

    2.  **Salud Financiera y Gestión (Buffett/Munger):**
        * Analiza la deuda ('totalDebt', 'debtToEquity'). ¿Es manejable? ¿Prefieren financiarse con deuda o con capital propio? Los grandes inversores prefieren empresas con poca o ninguna deuda.
        * Observa la rentabilidad ('returnOnEquity', 'profitMargins', 'operatingMargins'). ¿Es consistentemente alta? Esto indica una gestión eficiente y un buen negocio.
        * Evalúa el flujo de caja ('freeCashflow', 'operatingCashflow'). ¿Genera la empresa más efectivo del que gasta? El efectivo es el oxígeno de una empresa.

    3.  **Crecimiento y Categoría (Peter Lynch):**
        * Analiza el crecimiento de los ingresos ('revenueGrowth') y de las ganancias ('earningsGrowth').
        * Clasifica la empresa en una de las categorías de Peter Lynch (ej: "Stalwart" -empresa grande y estable-, "Fast Grower" -crecimiento rápido-, "Cyclical" -cíclica-, "Turnaround" -en reestructuración-). Justifica tu elección.

    4.  **Valoración (Buffett):**
        * Compara el precio actual ('regularMarketPrice') con los múltiplos de valoración (PER 'trailingPE', 'forwardPE', etc.). ¿Parece la acción estar infravalorada, a un precio justo o sobrevalorada en comparación con sus ganancias?
        * Considera el "margen de seguridad". Aunque no podemos calcular el valor intrínseco exacto, ¿los datos sugieren que estamos comprando un negocio maravilloso a un precio justo, o un negocio justo a un precio maravilloso?

    5.  **Conclusión y Veredicto del Inversor:**
        * Sintetiza tu análisis en un párrafo final.
        * Concluye con un veredicto claro: ¿Comprarías esta acción para un portafolio a largo plazo según los principios del "value investing"? ¿Por qué sí o por qué no? Sé decisivo.

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
