// app/api/scrape-gdp/route.ts (Para Next.js App Router)
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
  const url = "https://tradingeconomics.com/united-states/gdp-growth"; // URL del PIB

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
    // Para depuración: console.log("Texto completo de la página (primeros 500 caracteres):", pageText.substring(0, 500));

    // Expresión regular para encontrar el valor actual:
    // Ahora incluye "grew at an annual rate of", "expanded", "expanded at an annual rate of"
    const actualMatch = pageText.match(
      /(?:grew an annualized|grew at an annual rate of|rose|increased|expanded|expanded at an annual rate of)\s+([\d.]+?)%/i
    );
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match:", actualMatch[1], "Parsed:", actualValue);
    }

    // Expresión regular para encontrar la previsión:
    // Ahora incluye "estimate of", "first estimate of", "second estimate of", "final estimate of", "projected at", "anticipated at"
    const forecastMatch = pageText.match(
      /(?:expectations of a|forecast of a|beating expectations of a|estimate of|first estimate of|second estimate of|final estimate of|projected at|anticipated at)\s+([\d.]+?)%/i
    );
    if (forecastMatch && forecastMatch[1]) {
      forecastValue = parseFloat(forecastMatch[1]);
      // Para depuración: console.log("Forecast Match:", forecastMatch[1], "Parsed:", forecastValue);
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores
    $(".table-responsive .table-hover tbody tr").each((i, el) => {
      const variableName = $(el).find("td a").first().text().trim();
      if (variableName.includes("GDP Growth Rate")) {
        const values = $(el)
          .find("td")
          .map((j, td) => $(td).text().trim())
          .get();
        if (values[1] && actualValue === null) {
          actualValue = parseFloat(
            values[1].replace("%", "").replace(",", ".")
          );
        }
        if (values[2] && forecastValue === null) {
          forecastValue = parseFloat(
            values[2].replace("%", "").replace(",", ".")
          );
        }
        return false; // Salir del .each() una vez que se encuentra la fila
      }
    });

    if (actualValue === null || forecastValue === null) {
      console.warn(
        "No se pudieron encontrar ambos valores (actual y previsión) para el PIB."
      );
      return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
        {
          error: "No se pudieron extraer los datos de Crecimiento del PIB.",
          variable: "Crecimiento del PIB", // Proporcionar todas las propiedades de ScrapedData
          actualValue: null,
          forecastValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      // Tipado explícito de la respuesta
      variable: "Crecimiento del PIB",
      actualValue,
      forecastValue,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error); // Manejo seguro del tipo 'unknown'
    console.error("Error al hacer scraping del PIB:", errorMessage);
    return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
      {
        error: `Fallo al obtener datos de Crecimiento del PIB: ${errorMessage}`,
        variable: "Crecimiento del PIB", // Proporcionar todas las propiedades de ScrapedData
        actualValue: null,
        forecastValue: null,
      },
      { status: 500 }
    );
  }
}
