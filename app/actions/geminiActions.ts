// app/actions/generateValueInvestingAnalysis.ts
"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
import { ApiAssetItem } from "@/types/api";

/**
 * Genera un análisis de inversión de valor y perfil de riesgo para un activo específico.
 *
 * @param assetData - El objeto completo con los datos financieros del activo.
 * @returns Una promesa que se resuelve en un string con el análisis de la IA.
 */
export async function generateValueInvestingAnalysis(
  assetData: ApiAssetItem
): Promise<string> {
  // --- CONSOLE LOGS PARA DEBUG ---
  console.log("--- DEBUG: Datos de entrada para el análisis (assetData) ---");
  console.log(assetData);
  console.log("---------------------------------------------------------");
  // --- FIN CONSOLE LOGS PARA DEBUG ---

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "La clave de API de Gemini no está configurada en el servidor."
    );
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const dataString = JSON.stringify(
    assetData,
    (key, value) => (value === undefined ? null : value),
    2
  );

  // --- ✨ 1. OBTENER LA FECHA ACTUAL ---
  // Creamos la fecha actual y la formateamos en español para Ecuador.
  const currentDate = new Date().toLocaleDateString("es-EC", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // --- CONSOLE LOG PARA DEBUG DE LA FECHA ---
  console.log(`--- DEBUG: Fecha del informe: ${currentDate} ---`);
  // --- FIN CONSOLE LOG PARA DEBUG DE LA FECHA ---

  // --- ✨ 2. INCLUIR LA FECHA EN EL PROMPT ---
  const prompt = `Eres un analista financiero de élite, especializado en "value investing" y gestión de riesgos, entrenado con las filosofías de Warren Buffett, Charlie Munger y Peter Lynch. Tu tarea es analizar los datos de la empresa con ticker "${assetData.ticker}" y redactar un informe fundamental conciso y profundo para un gestor de portafolios.

**INSTRUCCIONES DE FORMATO Y CONSISTENCIA:**
1.  **Estilización Profesional y Compacta:** Todas las tablas del informe (Secciones 3 y 4) deben tener un formato visualmente mejorado, profesional y fácil de leer. **Utiliza sintaxis de Markdown robusta y elimina TODAS las líneas en blanco innecesarias entre encabezados de lista, el título de la tabla y la tabla misma para asegurar una presentación COMPACTA y sin espacios verticales grandes.**
2.  **Búsqueda Reforzada (Anti-N/A):** Si los datos de múltiplos proyectados (NTM) para EV/EBITDA, EV/EBIT, o EV/FCF resultan ser 'N/A' a partir de los datos iniciales ('${dataString}'), la IA debe realizar una **búsqueda exhaustiva en la web** para obtener estos valores proyectados antes de generar el informe. Si después de la búsqueda no se encuentran, se mantendrá 'N/A'.

El informe debe tener cuatro secciones claras y usar la fecha de hoy.

Veredicto del Inversor (IA):
**INFORME DE ANÁLISIS FUNDAMENTAL PARA EL GESTOR DE PORTAFOLIOS**

**Fecha del Informe:** ${currentDate}

---

**SECCIÓN 1: ANÁLISIS DE INVERSIÓN DE VALOR (${assetData.ticker})**
Adopta el siguiente enfoque, combinando las fortalezas de los tres maestros:

1.  **Comprensión del Negocio (Buffett/Munger/Lynch):**
    * Basado en 'sector', 'industria' y 'longBusinessSummary', describe en una o dos frases a qué se dedica la empresa. ¿Es un negocio simple y comprensible?
    * Identifica su "**foso económico**" (Economic Moat). ¿Tiene ventajas competitivas duraderas? Haz una comparativa frende a sus principales competidores.

2.  **Salud Financiera y Gestión (Buffett/Munger):**
    * Analiza la deuda ('totalDebt', 'debtToEquity'). ¿Es manejable? Los grandes inversores prefieren empresas con poca deuda.
    * Observa la rentabilidad ('returnOnEquity', 'profitMargins'). ¿Es consistentemente alta?
    * Evalúa el flujo de caja ('freeCashflow', 'operatingCashflow'). ¿Genera la empresa más efectivo del que gasta?

3.  **Crecimiento y Categoría (Peter Lynch):**
    * Analiza el crecimiento de ingresos ('revenueGrowth') y ganancias ('earningsGrowth').
    * Clasifica la empresa en una de las categorías de Peter Lynch (ej: "Stalwart", "Fast Grower", "Cyclical", "Turnaround"). Justifica tu elección.

4.  **Valoración (Buffett):**
    * Compara el precio actual ('regularMarketPrice') con sus múltiplos de valoración ('trailingPE', 'forwardPE'). ¿Parece la acción estar infravalorada, a un precio justo o sobrevalorada?
    * Considera el "**margen de seguridad**". ¿Es una compra atractiva al precio actual?

5.  **Veredicto de Inversión de Valor:**
    * Sintetiza tu análisis en un párrafo.
    * Concluye con un veredicto claro: **¿Es esta una acción candidata para un portafolio de "value investing" a largo plazo? ¿Sí o no y por qué?**

---

**SECCIÓN 2: PERFIL DE RIESGO DEL ACTIVO (${assetData.ticker})**
Independientemente de si es una buena inversión de valor o no, ahora evalúa el perfil de riesgo de la acción para un gestor de portafolios.

1.  **Análisis de Volatilidad y Sensibilidad:**
    * Considera el indicador 'beta'. Un beta > 1 indica mayor volatilidad que el mercado; < 1 menor volatilidad.
    * Observa el 'sector' y la 'industria'. ¿Son típicamente volátiles (ej. tecnología, biotecnología) o estables (ej. consumo básico, utilities)?

2.  **Conclusión de Riesgo:**
    * Clasifica la acción en una de estas tres categorías: **Riesgo Bajo**, **Riesgo Moderado**, o **Riesgo Alto**.
    * Justifica tu clasificación en una frase, indicando para qué tipo de inversor (conservador, equilibrado, agresivo) sería más adecuada esta acción.

---

**SECCIÓN 3: VALORACIÓN RELATIVA, PROYECCIONES Y COMPARABLES SECTORIALES**

Esta sección tiene como objetivo determinar si la valoración actual de ${assetData.ticker} es justa en el contexto de su industria, utilizando reglas de valoración objetivas.

1.  **Reglas de Negocio para Múltiplos y Coste de Capital:**
    * **Coste de Capital (WACC) Fijo:** Para el DCF simplificado de la Sección 4, utiliza una tasa de descuento basada en el sector: **Tecnología/FinTech = 9.5%, Consumo Básico/Utilities = 7.5%, Industrial/Cíclico = 11.0%.**
    * **Valores Objetivo de Múltiplos Fijos por Sector (PER / EV/EBITDA / EV/EBIT / EV/FCF):**
        * **Tecnología / SaaS / FinTech:** 25x / 18x / 16x / 25x
        * **Consumo Discrecional / Retail:** 18x / 11x / 10x / 16x
        * **Consumo Básico / Salud:** 22x / 14x / 12x / 20x
        * **Industrial / Materiales:** 15x / 9x / 8x / 14x
        * **Energía / Utilities:** 14x / 8x / 7x / 12x
        * **Financiero (Bancos):** 12x / N/A / N/A / N/A (Se prefiere P/VL)
    * **INSTRUCCIÓN CLAVE:** La IA debe identificar el **sector más adecuado** de la lista anterior y aplicar sus valores objetivo fijos.

2.  **Proyecciones Futuras de Métricas Operacionales:**
    * Crea la siguiente tabla usando datos históricos y proyecciones de eficiencia para el 2026, con **formato estilizado y profesional.**
| Métrica | Promedio Histórico | Estimación 2026e |
| :--- | :--- | :--- |
| **Crecimiento de Ventas** | [Insertar Promedio Histórico de Crecimiento de Ventas] | [Insertar Estimación 2026e de Crecimiento de Ventas] |
| **Margen EBIT** | [Insertar Promedio Histórico de Margen EBIT] | [Insertar Estimación 2026e de Margen EBIT] |
| **Tasa de Impuestos** | [Insertar Promedio Histórico de Tasa de Impuestos] | [Insertar Estimación 2026e de Tasa de Impuestos] |
| **Aumento de Acciones** | [Insertar Promedio Histórico de Aumento de Acciones] | [Insertar Estimación 2026e de Aumento de Acciones] |

3.  **Múltiplos de Valoración Comparados (LTM, NTM, Objetivo Sectorial Fijo):**
    * Crea la siguiente tabla, utilizando los valores de los Últimos 12 Meses (LTM), los Próximos 12 Meses (NTM) y el Valor Objetivo FIJO del sector identificado. Si los datos NTM para EV/EBITDA, EV/EBIT o EV/FCF resultan ser 'N/A' de la data inicial, la IA debe realizar una **búsqueda en la web** para encontrar el dato proyectado. Si aún así no se encuentra, se mantiene 'N/A'. Utiliza **formato estilizado y profesional.**
| Múltiplo | Valor LTM | Valor NTM | Valor Objetivo Sector (Fijo) | Veredicto Relativo |
| :--- | :--- | :--- | :--- | :--- |
| **PER** | [Insertar Valor PER LTM] | [Insertar Valor PER NTM] | [Insertar PER Objetivo del sector] | [Conclusión] |
| **EV / EBITDA** | [Insertar Valor EV/EBITDA LTM] | [Insertar Valor EV/EBITDA NTM, con búsqueda de respaldo si es 'N/A'] | [Insertar EV/EBITDA Objetivo del sector] | [Conclusión] |
| **EV / EBIT** | [Insertar Valor EV/EBIT LTM] | [Insertar Valor EV/EBIT NTM, con búsqueda de respaldo si es 'N/A'] | [Insertar EV/EBIT Objetivo del sector] | [Conclusión] |
| **EV / FCF** | [Insertar Valor EV/FCF LTM] | [Insertar Valor EV/FCF NTM, con búsqueda de respaldo si es 'N/A'] | [Insertar EV/FCF Objetivo del sector] | [Conclusión] |

4.  **Análisis de Valoración (Resumen):**
    * Explica brevemente la diferencia entre el valor de ${assetData.ticker}$ y el promedio/objetivo del sector **FIJO**.
    * ¿Qué implican estos múltiplos (LTM/NTM) en contraste con las proyecciones de eficiencia (Margen EBIT) en la tesis de inversión de valor?

---

**SECCIÓN 4: VALOR INTRÍNSECO Y MARGEN DE SEGURIDAD (VALORACIÓN ABSOLUTA)**

El objetivo es estimar el **valor intrínseco** (el valor real del negocio) para compararlo con el **precio actual** y calcular el margen de seguridad.

1.  **Cálculo del Valor Intrínseco (VI):**
    * **Regla Clave:** La IA debe utilizar el **WACC Fijo** y los **Múltiplos Objetivos Fijos** del sector identificados en la Sección 3 para garantizar la consistencia.
    * **Método 1 (Flujo de Caja Libre - FCF / DCF Simplificado):** Proyecta el FCF basándose en el 'earningsGrowth' y aplica la **tasa de descuento conservadora FIJA** identificada para el sector para obtener un VI por DCF simplificado.
    * **Método 2 (Precio Objetivo por Múltiplo PEG de Peter Lynch):** **Precio Objetivo** = (Múltiplo PEG ideal [1.5x para Stalwart] * Tasa de Crecimiento de Ganancias [${assetData.earningsGrowth}$] * [Earnings Per Share Proyectado]).
    * **Método 3 (Múltiplo Sectorial Objetivo Fijo):** Aplica el **Valor Objetivo Fijo del PER** identificado para el sector (de la SECCIÓN 3) al Beneficio Proyectado ('forwardPE' ya descontado por el 'earningsGrowth') de ${assetData.ticker}$ para obtener un precio objetivo.
    * **Valor Intrínseco Promedio:** Calcula el promedio de los tres valores objetivo obtenidos.

2.  **Tabla de Margen de Seguridad:**
    * Crea la siguiente tabla para el resumen final de la valoración, con **formato estilizado y profesional.**
| Indicador | Valor |
| :--- | :--- |
| **Precio Actual (${assetData.ticker})** | ${assetData.regularMarketPrice} |
| **Valor Intrínseco Promedio (VI)** | [Insertar el promedio de los 3 métodos] |
| **Diferencia Absoluta** | [VI - Precio Actual] |
| **Margen de Seguridad** | [(VI / Precio Actual) - 1] * 100% |

3.  **Conclusión de la Valoración Final:**
    * Basado en el Margen de Seguridad, ¿la acción está **SUBVALUADA**, **SOBREVALUADA** o **JUSTIPRECIADA**?
    * ¿El Margen de Seguridad es suficiente para un inversor de valor (se busca típicamente > 25-30%)?

---

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
