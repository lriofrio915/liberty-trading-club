// app/api/scrape-cot-sp500-small-traders/route.ts
import axios, { AxiosError } from "axios"; // Importar AxiosError para un manejo de tipos seguro
import * as cheerio from "cheerio";
import { NextResponse } from "next/server";

// Definición de tipos para la respuesta de la API
interface ScrapedData {
  variable: string;
  longChange: number | null;
  shortChange: number | null;
  actualValue: number | null;
  error?: string;
}

export async function GET() {
  const url = "https://insider-week.com/en/cot/";

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
    let actualValue: number | null = null;

    $("table tbody tr").each((i, el) => {
      const indexName = $(el).find("td").eq(0).text().trim();

      if (indexName === "S&P500") {
        const longChangeText = $(el).find("td").eq(13).text().trim();
        const shortChangeText = $(el).find("td").eq(15).text().trim();

        longChange = parseInt(longChangeText.replace(/,/g, ""), 10);
        shortChange = parseInt(shortChangeText.replace(/,/g, ""), 10);

        if (longChange !== null && shortChange !== null) {
          const totalChange = Math.abs(longChange) + Math.abs(shortChange);
          if (totalChange > 0) {
            actualValue = parseFloat(
              (((longChange - shortChange) / totalChange) * 100).toFixed(2)
            );
          } else {
            actualValue = 0;
          }
        }
        return false;
      }
    });

    if (longChange === null || shortChange === null || actualValue === null) {
      console.warn(
        "No se pudieron extraer los datos de Sentimiento COT del S&P 500 (Small Traders)."
      );
      return NextResponse.json<ScrapedData>(
        {
          error:
            "No se pudieron extraer los datos de Sentimiento COT del S&P 500 (Small Traders).",
          variable: "Sentimiento COT Small Traders",
          longChange: null,
          shortChange: null,
          actualValue: null,
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: "Sentimiento COT Small Traders",
      longChange,
      shortChange,
      actualValue,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "Error al hacer scraping de Sentimiento COT Small Traders S&P 500:",
      errorMessage
    );

    // Solución al error: Comprobación de tipo para AxiosError
    let status = 500;
    if (error instanceof AxiosError && error.response) {
      status = error.response.status;
    }

    const specificErrorMsg =
      status === 403
        ? "Acceso denegado (403 Forbidden). El sitio web está bloqueando el scraping."
        : `Fallo al obtener datos de Sentimiento COT Small Traders S&P 500: ${errorMessage}`;

    return NextResponse.json<ScrapedData>(
      {
        error: specificErrorMsg,
        variable: "Sentimiento COT Small Traders",
        longChange: null,
        shortChange: null,
        actualValue: null,
      },
      { status: status }
    );
  }
}
