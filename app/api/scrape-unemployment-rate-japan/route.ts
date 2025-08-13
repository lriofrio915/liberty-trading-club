// app/api/scrape-unemployment-rate-japan/route.ts (Para Next.js App Router)
import axios from "axios"; // Para hacer solicitudes HTTP
import * as cheerio from "cheerio"; // Para parsear el HTML
import { NextResponse } from "next/server"; // Para manejar las respuestas en App Router

// Definición de tipos para la respuesta de la API
interface ScrapedData {
  variable: string;
  actualValue: number | null;
  forecastValue: number | null;
  error?: string;
}

export async function GET() {
  const url = "https://tradingeconomics.com/japan/unemployment-rate"; // URL de Tasa de Desempleo de Japón

  try {
    // Realizar la solicitud HTTP para obtener el HTML de la página
    const { data } = await axios.get(url, {
      headers: {
        // Es buena práctica incluir un User-Agent para simular un navegador real
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    // Cargar el HTML en Cheerio para facilitar la manipulación del DOM
    const $ = cheerio.load(data);

    let actualValue: number | null = null;
    let forecastValue: number | null = null; // Inicialmente null

    // Obtener todo el texto del cuerpo de la página para buscar los valores
    const pageText = $("body").text();
    // Para depuración: console.log("Texto completo de la página (primeros 1000 caracteres):", pageText.substring(0, 1000));

    // --- Extracción de actualValue ---
    // Buscar patrones como "held steady at X%" o "rate was X%"
    // El texto de ejemplo dice "unemployment rate held steady at 2.5%"
    const actualMatch = pageText.match(
      /(?:unemployment rate held steady at|rate was)\s+([\d.]+?)%/i
    );
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match (JP Unemployment):", actualMatch[1], "Parsed:", actualValue);
    }

    // --- Extracción de forecastValue ---
    // El texto dice "aligning with market estimates", lo que implica que el forecast es el mismo que el actual
    // Sin embargo, si hay un "consensus of X" o "forecast of Y" explícito, lo preferimos.
    const forecastMatchText = pageText.match(
      /(?:aligning with market estimates of|consensus of|forecast of)\s+([\d.]+?)%/i
    );
    if (forecastMatchText && forecastMatchText[1]) {
      forecastValue = parseFloat(forecastMatchText[1]);
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores o para la previsión
    $(".table-responsive .table-hover tbody tr").each((i, el) => {
      const variableName = $(el).find("td a").first().text().trim();
      if (variableName.includes("Unemployment Rate")) {
        const values = $(el)
          .find("td")
          .map((j, td) => $(td).text().trim())
          .get();
        // Asumiendo que el valor actual está en values[1] y la previsión en values[2]
        if (values[1] && actualValue === null) {
          // Solo si actualValue no se encontró antes
          actualValue = parseFloat(
            values[1].replace("%", "").replace(",", ".")
          );
        }
        if (values[2] && forecastValue === null) {
          // Solo si forecastValue no se encontró antes
          forecastValue = parseFloat(
            values[2].replace("%", "").replace(",", ".")
          );
        }
        return false; // Salir del bucle .each una vez encontrado
      }
    });

    // Si el forecastValue sigue siendo null y el actualValue se encontró, asumimos que el forecast es igual al actual
    if (actualValue !== null && forecastValue === null) {
      forecastValue = actualValue;
    }

    if (actualValue === null || forecastValue === null) {
      console.warn(
        "No se pudieron encontrar ambos valores (actual y previsión) para la Tasa de Desempleo de Japón. Actual:",
        actualValue,
        "Forecast:",
        forecastValue
      );
      return NextResponse.json<ScrapedData>(
        {
          error:
            "No se pudieron extraer los datos de Tasa de Desempleo de Japón.",
          variable: "Tasa de Desempleo",
          actualValue: null,
          forecastValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: "Tasa de Desempleo",
      actualValue,
      forecastValue,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "Error al hacer scraping de Tasa de Desempleo de Japón:",
      errorMessage
    );
    return NextResponse.json<ScrapedData>(
      {
        error: `Fallo al obtener datos de Tasa de Desempleo de Japón: ${errorMessage}`,
        variable: "Tasa de Desempleo",
        actualValue: null,
        forecastValue: null,
      },
      { status: 500 }
    );
  }
}
