// app/api/scrape-interest-rate/route.ts
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
  const url = "https://tradingeconomics.com/united-states/interest-rate"; // URL de Tasa de Interés

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

    // Expresión regular para encontrar el valor actual de la tasa de interés:
    // Busca "held rates steady at X%–Y%", y captura el segundo valor (Y)
    const actualMatch = pageText.match(
      /held rates steady at\s+[\d.]+?%–([\d.]+?)%/i
    );
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match (Interest Rate):", actualMatch[1], "Parsed:", actualValue);
    }

    // Lógica para encontrar la previsión:
    // Si dice "as expected" y ya tenemos el valor actual, la previsión es la misma
    if (actualValue !== null && pageText.includes("as expected")) {
      forecastValue = actualValue;
      // Para depuración: console.log("Forecast Match (Interest Rate - As Expected):", forecastValue);
    } else {
      // Fallback para buscar una previsión explícita si la frase anterior no está presente
      // Esto podría ser útil si la frase cambia o si hay un número de previsión directo.
      const forecastExplicitMatch = pageText.match(
        /(?:market expectations of|forecasts of)\s+([\d.]+?)%/i
      );
      if (forecastExplicitMatch && forecastExplicitMatch[1]) {
        forecastValue = parseFloat(forecastExplicitMatch[1]);
        // Para depuración: console.log("Forecast Match (Interest Rate - Explicit):", forecastExplicitMatch[1], "Parsed:", forecastValue);
      }
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores
    $(".table-responsive .table-hover tbody tr").each((i, el) => {
      const variableName = $(el).find("td a").first().text().trim();
      if (variableName.includes("Interest Rate")) {
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
        return false;
      }
    });

    if (actualValue === null || forecastValue === null) {
      console.warn(
        "No se pudieron encontrar ambos valores (actual y previsión) para la Tasa de Interés."
      );
      return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
        {
          error: "No se pudieron extraer los datos de Tasa de Interés.",
          variable: "Tasa de Interés", // Proporcionar todas las propiedades de ScrapedData
          actualValue: null,
          forecastValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      // Tipado explícito de la respuesta
      variable: "Tasa de Interés",
      actualValue,
      forecastValue,
    });
  } catch (error: unknown) {
    // Cambiado 'any' a 'unknown'
    const errorMessage = error instanceof Error ? error.message : String(error); // Manejo seguro del tipo 'unknown'
    console.error("Error al hacer scraping de Tasa de Interés:", errorMessage);
    return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
      {
        error: `Fallo al obtener datos de Tasa de Interés: ${errorMessage}`,
        variable: "Tasa de Interés", // Proporcionar todas las propiedades de ScrapedData
        actualValue: null,
        forecastValue: null,
      },
      { status: 500 }
    );
  }
}
