// app/api/scrape-retail-sales-japan/route.ts (Para Next.js App Router)
import axios from "axios"; // Para hacer solicitudes HTTP
import * as cheerio from "cheerio"; // Para parsear el HTML
import { NextResponse } from "next/server"; // Para manejar las respuestas en App Router

// Definición de tipos para la respuesta de la API
interface ScrapedData {
  variable: string;
  actualValue: number | null;
  forecastValue: number | null; // Puede que no siempre haya una previsión explícita en el texto
  error?: string;
}

export async function GET() {
  const url = "https://tradingeconomics.com/japan/retail-sales"; // URL de Ventas Minoristas de Japón

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
    let forecastValue: number | null = null; // Inicialmente null, ya que el texto no siempre tiene previsión clara

    // Obtener todo el texto del cuerpo de la página para buscar los valores
    const pageText = $("body").text();
    // Para depuración: console.log("Texto completo de la página (primeros 1000 caracteres):", pageText.substring(0, 1000));

    // --- Extracción de actualValue ---
    // Buscar patrones como "increased X percent"
    // El texto de ejemplo dice "increased 1 percent in June of 2025"
    const actualMatch = pageText.match(
      /(?:increased|rose|grew)\s+([\d.]+)\s*percent(?: in June of 2025)?/i
    );
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match (JP Retail Sales):", actualMatch[1], "Parsed:", actualValue);
    }

    // --- Extracción de forecastValue ---
    // El texto proporcionado no tiene una "previsión" clara para el dato actual,
    // solo una "revisión al alza" de una caída anterior.
    // Si la página web tiene una sección de previsión, la tabla es el mejor fallback.
    const forecastMatchText = pageText.match(
      /(?:preliminary estimate of|flash estimate of|forecast of)\s+([\d.]+?)%/i
    );
    if (forecastMatchText && forecastMatchText[1]) {
      forecastValue = parseFloat(forecastMatchText[1]);
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores o para la previsión
    $(".table-responsive .table-hover tbody tr").each((i, el) => {
      const variableName = $(el).find("td a").first().text().trim();
      if (
        variableName.includes("Retail Sales MoM") ||
        variableName.includes("Retail Sales")
      ) {
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

    if (actualValue === null) {
      // La previsión puede ser null si no se encuentra un valor claro
      console.warn(
        "No se pudo encontrar el valor actual para Ventas Minoristas de Japón. Actual:",
        actualValue,
        "Forecast:",
        forecastValue
      );
      return NextResponse.json<ScrapedData>(
        {
          error:
            "No se pudieron extraer los datos de Ventas Minoristas de Japón.",
          variable: "Ventas Minoristas",
          actualValue: null,
          forecastValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: "Ventas Minoristas",
      actualValue,
      forecastValue, // Puede ser null si no se encontró en el texto o tabla
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "Error al hacer scraping de Ventas Minoristas de Japón:",
      errorMessage
    );
    return NextResponse.json<ScrapedData>(
      {
        error: `Fallo al obtener datos de Ventas Minoristas de Japón: ${errorMessage}`,
        variable: "Ventas Minoristas",
        actualValue: null,
        forecastValue: null,
      },
      { status: 500 }
    );
  }
}
