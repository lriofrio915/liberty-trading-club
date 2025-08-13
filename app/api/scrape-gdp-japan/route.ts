// app/api/scrape-gdp-japan/route.ts (Para Next.js App Router)
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
  const url = "https://tradingeconomics.com/japan/gdp-growth"; // URL del PIB de Japón

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
    let forecastValue: number | null = null;

    // Obtener todo el texto del cuerpo de la página para buscar los valores
    const pageText = $("body").text();
    // Para depuración: console.log("Texto completo de la página (primeros 1000 caracteres):", pageText.substring(0, 1000));

    // --- Mejorar la extracción de actualValue ---
    // 1. Buscar "flat" o "0%"
    if (pageText.includes("was flat in")) {
      actualValue = 0;
    } else {
      // 2. Buscar patrones como "grew X%", "decreased X%", "fell by X%", "shrank by X%"
      const actualMatch = pageText.match(
        /(?:grew|rose|increased|decreased|fell by|shrank by)\s+([\d.-]+?)%/i
      );
      if (actualMatch && actualMatch[1]) {
        actualValue = parseFloat(actualMatch[1]);
      }
    }

    // --- Mejorar la extracción de forecastValue ---
    // Buscar "estimate of a X% contraction" o "estimate of a X% growth"
    const forecastMatch = pageText.match(
      /(?:flash estimate of a|estimate of a)\s+([\d.-]+?)%\s+(?:contraction|growth)/i
    );
    if (forecastMatch && forecastMatch[1]) {
      forecastValue = parseFloat(forecastMatch[1]);
      // Si es una contracción y el número es positivo, lo hacemos negativo
      if (forecastMatch[0].includes("contraction") && forecastValue > 0) {
        forecastValue *= -1;
      }
    } else {
      // Fallback para otros patrones de previsión si el anterior falla
      const genericForecastMatch = pageText.match(
        /(?:expectations of a|forecast of a|beating expectations of a)\s+([\d.-]+?)%/i
      );
      if (genericForecastMatch && genericForecastMatch[1]) {
        forecastValue = parseFloat(genericForecastMatch[1]);
      }
    }


    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores
    // Esta parte es crucial y a menudo más fiable si el formato del texto cambia.
    $(".table-responsive .table-hover tbody tr").each((i, el) => {
      const variableName = $(el).find("td a").first().text().trim();
      if (variableName.includes("GDP Growth Rate")) {
        const values = $(el)
          .find("td")
          .map((j, td) => $(td).text().trim())
          .get();
        // Asumiendo que el valor actual está en values[1] y la previsión en values[2]
        if (values[1] && actualValue === null) { // Solo si actualValue no se encontró antes
          actualValue = parseFloat(
            values[1].replace("%", "").replace(",", ".")
          );
        }
        if (values[2] && forecastValue === null) { // Solo if forecastValue no se encontró antes
          forecastValue = parseFloat(
            values[2].replace("%", "").replace(",", ".")
          );
        }
        return false; // Salir del bucle .each una vez encontrado
      }
    });

    if (actualValue === null || forecastValue === null) {
      console.warn(
        "No se pudieron encontrar ambos valores (actual y previsión) para el PIB de Japón. Actual:", actualValue, "Forecast:", forecastValue
      );
      return NextResponse.json<ScrapedData>(
        {
          error: "No se pudieron extraer los datos de Crecimiento del PIB de Japón.",
          variable: "Crecimiento del PIB",
          actualValue: null,
          forecastValue: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: "Crecimiento del PIB",
      actualValue,
      forecastValue,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error al hacer scraping del PIB de Japón:", errorMessage);
    return NextResponse.json<ScrapedData>(
      {
        error: `Fallo al obtener datos de Crecimiento del PIB de Japón: ${errorMessage}`,
        variable: "Crecimiento del PIB",
        actualValue: null,
        forecastValue: null
      },
      { status: 500 }
    );
  }
}
