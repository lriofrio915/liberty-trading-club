// app/api/scrape-pmi-manufacturing-japan/route.ts (Para Next.js App Router)
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
  const url = 'https://tradingeconomics.com/japan/manufacturing-pmi'; // URL del PMI Manufacturero de Japón

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
    // Buscar "was slightly revised higher to X" o "was X"
    const actualMatch = pageText.match(/(?:was(?: slightly)? revised higher to|was)\s+([\d.]+)/i);
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match (JP PMI):", actualMatch[1], "Parsed:", actualValue);
    }

    // --- Extracción de forecastValue (preliminary estimate) ---
    // El texto de ejemplo dice "from the preliminary estimate of 48.8"
    const forecastMatch = pageText.match(/from the preliminary estimate of\s+([\d.]+)/i);
    if (forecastMatch && forecastMatch[1]) {
      forecastValue = parseFloat(forecastMatch[1]);
      // Para depuración: console.log("Forecast Match (JP PMI):", forecastMatch[1], "Parsed:", forecastValue);
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores
    // Esta parte es crucial y a menudo más fiable si el formato del texto cambia.
    $('.table-responsive .table-hover tbody tr').each((i, el) => {
      const variableName = $(el).find('td a').first().text().trim();
      if (variableName.includes('Manufacturing PMI')) {
        const values = $(el).find('td').map((j, td) => $(td).text().trim()).get();
        // Asumiendo que el valor actual está en values[1] y la previsión en values[2]
        if (values[1] && actualValue === null) { // Solo si actualValue no se encontró antes
          actualValue = parseFloat(values[1].replace(',', '.'));
        }
        if (values[2] && forecastValue === null) { // Solo si forecastValue no se encontró antes
          forecastValue = parseFloat(values[2].replace(',', '.'));
        }
        return false; // Salir del bucle .each una vez encontrado
      }
    });

    if (actualValue === null || forecastValue === null) {
      console.warn('No se pudieron encontrar ambos valores (actual y previsión) para el PMI Manufacturero de Japón. Actual:', actualValue, 'Forecast:', forecastValue);
      return NextResponse.json<ScrapedData>(
        {
          error: 'No se pudieron extraer los datos del PMI Manufacturero de Japón.',
          variable: 'PMI Manufacturero',
          actualValue: null,
          forecastValue: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: 'PMI Manufacturero',
      actualValue,
      forecastValue,
    });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error al hacer scraping del PMI Manufacturero de Japón:', errorMessage);
    return NextResponse.json<ScrapedData>(
      {
        error: `Fallo al obtener datos del PMI Manufacturero de Japón: ${errorMessage}`,
        variable: 'PMI Manufacturero',
        actualValue: null,
        forecastValue: null
      },
      { status: 500 }
    );
  }
}
