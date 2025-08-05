// app/api/scrape-pmi-services/route.ts
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
  const url = 'https://tradingeconomics.com/united-states/services-pmi'; // URL del PMI de Servicios

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

    // Expresión regular para encontrar el valor actual (flash estimate):
    // Busca "flash estimate of X"
    const actualMatch = pageText.match(/flash estimate of\s+([\d.]+)/i);
    if (actualMatch && actualMatch[1]) {
      actualValue = parseFloat(actualMatch[1]);
      // Para depuración: console.log("Actual Match (PMI Services):", actualMatch[1], "Parsed:", actualValue);
    }

    // Expresión regular para encontrar la previsión (initial market consensus):
    // Busca "initial market consensus of Y"
    const forecastMatch = pageText.match(/initial market consensus of\s+([\d.]+)/i);
    if (forecastMatch && forecastMatch[1]) {
      forecastValue = parseFloat(forecastMatch[1]);
      // Para depuración: console.log("Forecast Match (PMI Services):", forecastMatch[1], "Parsed:", forecastValue);
    }

    // Fallback para buscar en tablas si las expresiones regulares no encuentran los valores
    // (Esta parte es un respaldo y podría necesitar ajustes si la estructura de la tabla cambia)
    $('.table-responsive .table-hover tbody tr').each((i, el) => {
      const variableName = $(el).find('td a').first().text().trim();
      if (variableName.includes('Services PMI')) {
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
      console.warn('No se pudieron encontrar ambos valores (actual y previsión) para el PMI de Servicios.');
      return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
        { 
          error: 'No se pudieron extraer los datos del PMI de Servicios.',
          variable: 'PMI de Servicios', // Proporcionar todas las propiedades de ScrapedData
          actualValue: null,
          forecastValue: null
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({ // Tipado explícito de la respuesta
      variable: 'PMI de Servicios',
      actualValue,
      forecastValue,
    });

  } catch (error: unknown) { // Cambiado 'any' a 'unknown'
    const errorMessage = error instanceof Error ? error.message : String(error); // Manejo seguro del tipo 'unknown'
    console.error('Error al hacer scraping del PMI de Servicios:', errorMessage);
    return NextResponse.json<ScrapedData>( // Tipado explícito de la respuesta
      { 
        error: `Fallo al obtener datos del PMI de Servicios: ${errorMessage}`,
        variable: 'PMI de Servicios', // Proporcionar todas las propiedades de ScrapedData
        actualValue: null,
        forecastValue: null
      },
      { status: 500 }
    );
  }
}
