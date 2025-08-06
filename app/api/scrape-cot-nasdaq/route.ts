// app/api/scrape-cot-nasdaq/route.ts
import axios from 'axios'; // Para hacer solicitudes HTTP
import * as cheerio from 'cheerio'; // Para parsear el HTML
import { NextResponse } from 'next/server'; // Para manejar las respuestas en App Router

// Definición de tipos para la respuesta de la API
interface ScrapedData {
  variable: string;
  longChange: number | null;
  shortChange: number | null;
  actualValue: number | null; // Calculado como el porcentaje de sesgo profesional (LongChange - ShortChange) / (LongChange + ShortChange) * 100
  error?: string; // No hay forecastValue para esta variable
}

export async function GET() {
  const url = 'https://insider-week.com/en/cot/'; // URL de Insider-Week COT

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);

    let longChange: number | null = null;
    let shortChange: number | null = null;
    let actualValue: number | null = null; // Para el porcentaje de sesgo profesional

    // Buscar la fila de la tabla que contiene "NASDAQ"
    $('table tbody tr').each((i, el) => {
      const indexName = $(el).find('td').eq(0).text().trim(); // La primera columna es el nombre del índice

      if (indexName === 'NASDAQ') {
        // Encontrar los valores bajo "Large Speculators"
        // Basado en la imagen y la estructura típica (contando desde 0):
        // td[0]: Nombre del índice (NASDAQ)
        // td[1]: Price change, %
        // td[2]: Trend
        // td[3]: Commercial Long
        // td[4]: Commercial Change (Commercial Long)
        // td[5]: Commercial Short
        // td[6]: Commercial Change (Commercial Short)
        // td[7]: Large Speculators Long (Posición total)
        // td[8]: Large Speculators Long Change 
        // td[9]: Large Speculators Short (Posición total)
        // td[10]: Large Speculators Short Change 
        const longChangeText = $(el).find('td').eq(9).text().trim(); 
        const shortChangeText = $(el).find('td').eq(11).text().trim(); 

        longChange = parseInt(longChangeText.replace(/,/g, ''), 10); // Eliminar comas y parsear
        shortChange = parseInt(shortChangeText.replace(/,/g, ''), 10);

        // Calculamos el porcentaje de sesgo profesional
        if (longChange !== null && shortChange !== null) {
          const totalChange = longChange + shortChange;
          if (totalChange > 0) {
            actualValue = parseFloat(((longChange - shortChange) / totalChange * 100).toFixed(2));
          } else {
            actualValue = 0; // Si no hay cambios netos (o total de cambios es 0), el sesgo es neutral
          }
        }

        // Si encontramos los datos, podemos salir del bucle
        return false;
      }
    });

    if (longChange === null || shortChange === null || actualValue === null) {
      console.warn('No se pudieron extraer los datos de Sentimiento COT del Nasdaq (Large Speculators).');
      return NextResponse.json<ScrapedData>( // Tipado explícito
        {
          error: 'No se pudieron extraer los datos de Sentimiento COT del Nasdaq.',
          variable: 'Sentimiento COT del Nasdaq',
          longChange: null,
          shortChange: null,
          actualValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({ // Tipado explícito
      variable: 'Sentimiento COT del Nasdaq',
      longChange,
      shortChange,
      actualValue, // Este será el porcentaje de sesgo profesional
    });

  } catch (error: unknown) { // Manejo de errores con 'unknown'
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error al hacer scraping de Sentimiento COT del Nasdaq:', errorMessage);
    return NextResponse.json<ScrapedData>( // Tipado explícito
      {
        error: `Fallo al obtener datos de Sentimiento COT del Nasdaq: ${errorMessage}`,
        variable: 'Sentimiento COT del Nasdaq',
        longChange: null,
        shortChange: null,
        actualValue: null,
      },
      { status: 500 }
    );
  }
}
