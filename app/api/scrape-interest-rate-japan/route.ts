// app/api/scrape-interest-rate-japan/route.ts (Para Next.js App Router)
import axios from 'axios'; // Para hacer solicitudes HTTP
import * as cheerio from 'cheerio'; // Para parsear el HTML
import { NextResponse } from 'next/server'; // Para manejar las respuestas en App Router

// Definición de tipos para la respuesta de la API
interface ScrapedData {
  variable: string;
  actualValue: number | null;
  forecastValue: number | null;
  error?: string;
}

export async function GET() {
  const url = 'https://tradingeconomics.com/japan/interest-rate'; // URL de Tasa de Interés de Japón

  try {
    // Realizar la solicitud HTTP para obtener el HTML de la página
    const { data } = await axios.get(url, {
      headers: {
        // Es buena práctica incluir un User-Agent para simular un navegador real
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    // Cargar el HTML en Cheerio para facilitar la manipulación del DOM
    const $ = cheerio.load(data);

    let actualValue: number | null = null;
    let forecastValue: number | null = null;

    // Obtener todo el texto del cuerpo de la página para buscar los valores
    const pageText = $('body').text();
    // Para depuración: console.log("Texto completo de la página (primeros 1000 caracteres):", pageText.substring(0, 1000));

    // --- Extracción de actualValue ---
    // Buscar patrones como "rate at X%"
    // El texto de ejemplo dice "benchmark short-term rate at 0.5%"
    const actualMatch = pageText.match(/(?:benchmark short-term rate at|rate at)\s+([\d.]+?)%/i);
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match (JP Interest Rate):", actualMatch[1], "Parsed:", actualValue);
    }

    // --- Extracción de forecastValue ---
    // PRIORIDAD 1: Si el valor actual se encontró y el texto menciona "in line with market expectations",
    // asumimos que el forecast es igual al actual.
    if (actualValue !== null && pageText.includes("in line with market expectations")) {
      forecastValue = actualValue;
    } else {
      // PRIORIDAD 2: Intentar buscar una previsión numérica explícita para la tasa de interés.
      // El texto proporcionado no tiene una previsión numérica directa para la tasa de interés.
      const explicitForecastMatch = pageText.match(/(?:interest rate forecast of|expected interest rate to be)\s+([\d.]+?)%/i);
      if (explicitForecastMatch && explicitForecastMatch[1]) {
        forecastValue = parseFloat(explicitForecastMatch[1]);
      }
    }

    // Fallback para buscar en tablas si las expresiones regulares no encontraron los valores o para la previsión
    // Esta parte se ejecutará si los métodos anteriores no encontraron ambos valores
    $('.table-responsive .table-hover tbody tr').each((i, el) => {
      const variableName = $(el).find('td a').first().text().trim();
      if (variableName.includes('Interest Rate')) {
        const values = $(el).find('td').map((j, td) => $(td).text().trim()).get();
        // Asumiendo que el valor actual está en values[1] y la previsión en values[2]
        if (values[1] && actualValue === null) { // Solo si actualValue no se encontró antes
          actualValue = parseFloat(values[1].replace('%', '').replace(',', '.'));
        }
        if (values[2] && forecastValue === null) { // Solo si forecastValue no se encontró antes
          forecastValue = parseFloat(values[2].replace('%', '').replace(',', '.'));
        }
        return false; // Salir del bucle .each una vez encontrado
      }
    });

    if (actualValue === null || forecastValue === null) {
      console.warn('No se pudieron encontrar ambos valores (actual y previsión) para la Tasa de Interés de Japón. Actual:', actualValue, 'Forecast:', forecastValue);
      return NextResponse.json<ScrapedData>(
        {
          error: 'No se pudieron extraer los datos de Tasa de Interés de Japón.',
          variable: 'Tasa de Interés',
          actualValue: null,
          forecastValue: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: 'Tasa de Interés',
      actualValue,
      forecastValue,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error al hacer scraping de Tasa de Interés de Japón:', errorMessage);
    return NextResponse.json<ScrapedData>(
      {
        error: `Fallo al obtener datos de Tasa de Interés de Japón: ${errorMessage}`,
        variable: 'Tasa de Interés',
        actualValue: null,
        forecastValue: null
      },
      { status: 500 }
    );
  }
}
