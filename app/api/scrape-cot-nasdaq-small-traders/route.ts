// app/api/scrape-cot-nasdaq-small-traders/route.ts
import axios from "axios"; // Para hacer solicitudes HTTP
import * as cheerio from "cheerio"; // Para parsear el HTML
import { NextResponse } from "next/server"; // Para manejar las respuestas en App Router

// Definición de tipos para la respuesta de la API
interface ScrapedData {
  variable: string;
  longChange: number | null;
  shortChange: number | null;
  actualValue: number | null; // Calculado como el porcentaje de sesgo de Small Traders
  error?: string; // No hay forecastValue para esta variable
}

export async function GET() {
  const url = "https://insider-week.com/en/cot/"; // URL de Insider-Week COT

  try {
    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    let longChange: number | null = null;
    let shortChange: number | null = null;
    let actualValue: number | null = null; // Para el porcentaje de sesgo de Small Traders

    // Buscar la fila de la tabla que contiene "NASDAQ"
    $("table tbody tr").each((i, el) => {
      const indexName = $(el).find("td").eq(0).text().trim(); // La primera columna es el nombre del índice

      if (indexName === "NASDAQ") {
        // Encontrar los valores bajo "Small Traders"
        // Basado en la imagen y la estructura típica (contando desde 0):
        // td[11]: Small Traders Long (Posición total)
        // td[12]: Small Traders Long Change (El dato que queremos: -1,668)
        // td[13]: Small Traders Short (Posición total)
        // td[14]: Small Traders Short Change (El dato que queremos: -1,043)
        const longChangeText = $(el).find("td").eq(13).text().trim(); // CAMBIO AQUÍ: Índice para Small Traders Long Change
        const shortChangeText = $(el).find("td").eq(15).text().trim(); // CAMBIO AQUÍ: Índice para Small Traders Short Change

        longChange = parseInt(longChangeText.replace(/,/g, ""), 10); // Eliminar comas y parsear
        shortChange = parseInt(shortChangeText.replace(/,/g, ""), 10);

        // Calculamos el porcentaje de sesgo de Small Traders
        if (longChange !== null && shortChange !== null) {
          const totalChange = Math.abs(longChange) + Math.abs(shortChange); // Usar valor absoluto para el denominador
          if (totalChange > 0) {
            actualValue = parseFloat(
              (((longChange - shortChange) / totalChange) * 100).toFixed(2)
            );
          } else {
            actualValue = 0; // Si no hay cambios netos (o total de cambios es 0), el sesgo es neutral
          }
        }

        // Si encontramos los datos, podemos salir del bucle
        return false;
      }
    });

    if (longChange === null || shortChange === null || actualValue === null) {
      console.warn(
        "No se pudieron extraer los datos de Sentimiento COT del Nasdaq (Small Traders)."
      );
      return NextResponse.json<ScrapedData>( // Tipado explícito
        {
          error:
            "No se pudieron extraer los datos de Sentimiento COT del Nasdaq (Small Traders).",
          variable: "Sentimiento COT Small Traders",
          longChange: null,
          shortChange: null,
          actualValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      // Tipado explícito
      variable: "Sentimiento COT Small Traders", // Nombre de la variable para la tabla
      longChange,
      shortChange,
      actualValue, // Este será el porcentaje de sesgo de Small Traders
    });
  } catch (error: unknown) {
    // Manejo de errores con 'unknown'
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "Error al hacer scraping de Sentimiento COT Small Traders:",
      errorMessage
    );
    return NextResponse.json<ScrapedData>( // Tipado explícito
      {
        error: `Fallo al obtener datos de Sentimiento COT Small Traders: ${errorMessage}`,
        variable: "Sentimiento COT Small Traders",
        longChange: null,
        shortChange: null,
        actualValue: null,
      },
      { status: 500 }
    );
  }
}
