// app/api/scrape-pmi-manufacturing/route.ts
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
  const url = 'https://tradingeconomics.com/united-states/manufacturing-pmi'; // URL del PMI Manufacturero

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
    // Para depuración: console.log("Texto completo de la página (primeros 500 caracteres):", pageText.substring(0, 500));

    // Expresión regular para encontrar el valor actual:
    // Busca "revised slightly higher to X" o "was X" en el contexto de PMI
    const actualMatch = pageText.match(/(?:revised slightly higher to|was)\s+([\d.]+?)\s+in July 2025/i);
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match:", actualMatch[1], "Parsed:", actualValue);
    }

    // Expresión regular para encontrar la previsión (preliminary estimate):
    // Busca "from a preliminary estimate of Y"
    const forecastMatch = pageText.match(/from a preliminary estimate of\s+([\d.]+)(?:,|\s|$)/i);
    if (forecastMatch && forecastMatch[1]) {
      forecastValue = parseFloat(forecastMatch[1]);
      // Para depuración: console.log("Forecast Match:", forecastMatch[1], "Parsed:", forecastValue);
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores
    $('.table-responsive .table-hover tbody tr').each((i, el) => {
      const variableName = $(el).find('td a').first().text().trim();
      if (variableName.includes('Manufacturing PMI')) {
        const values = $(el).find('td').map((j, td) => $(td).text().trim()).get();
        if (values[1] && actualValue === null) {
          actualValue = parseFloat(values[1].replace(',', '.'));
        }
        if (values[2] && forecastValue === null) {
          forecastValue = parseFloat(values[2].replace(',', '.'));
        }
        return false;
      }
    });

    if (actualValue === null || forecastValue === null) {
      console.warn('No se pudieron encontrar ambos valores (actual y previsión) para el PMI Manufacturero.');
      return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
        { 
          error: 'No se pudieron extraer los datos del PMI Manufacturero.',
          variable: 'PMI Manufacturero', // Proporcionar todas las propiedades de ScrapedData
          actualValue: null,
          forecastValue: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({ // Tipado explícito de la respuesta
      variable: 'PMI Manufacturero',
      actualValue,
      forecastValue,
    });

  } catch (error: unknown) { // Cambiado 'any' a 'unknown'
    const errorMessage = error instanceof Error ? error.message : String(error); // Manejo seguro del tipo 'unknown'
    console.error('Error al hacer scraping del PMI Manufacturero:', errorMessage);
    return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
      { 
        error: `Fallo al obtener datos del PMI Manufacturero: ${errorMessage}`,
        variable: 'PMI Manufacturero', // Proporcionar todas las propiedades de ScrapedData
        actualValue: null,
        forecastValue: null
      },
      { status: 500 }
    );
  }
}
