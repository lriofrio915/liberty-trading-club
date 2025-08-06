// app/api/scrape-magnificent7-sentiment/route.ts
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

interface ScrapedData {
  variable: string;
  actualValue: number | null; // El total de puntos (+7 a -7)
  forecastValue: number | null | undefined; // No aplicable para esta métrica
  error?: string;
  individualChanges?: {
    symbol: string;
    change: number | null;
    score: number | null;
  }[]; // Opcional: para depuración o si se necesita ver individuales
}

export async function GET() {
  const magnificent7Symbols = [
    { name: "Apple", symbol: "AAPL" },
    { name: "Microsoft", symbol: "MSFT" },
    { name: "Google", symbol: "GOOG" }, // Alphabet Class C
    { name: "Amazon", symbol: "AMZN" },
    { name: "Meta", symbol: "META" }, // Antes Facebook
    { name: "Nvidia", symbol: "NVDA" },
    { name: "Tesla", symbol: "TSLA" },
  ];

  let totalMagnificent7Score = 0;
  const individualChanges: {
    symbol: string;
    change: number | null;
    score: number | null;
  }[] = [];
  let hasError = false;
  let errorMessageAccumulated = "";

  try {
    // Usamos Promise.allSettled para hacer todas las llamadas en paralelo
    // y manejar los errores individuales sin detener todo el proceso.
    const results = await Promise.allSettled(
      magnificent7Symbols.map(async (stock) => {
        try {
          const quote = await yahooFinance.quote(stock.symbol);
          let percentageChange: number | null = null;
          let individualScore: number | null = null;

          if (quote && typeof quote.regularMarketChangePercent === "number") {
            percentageChange = quote.regularMarketChangePercent;

            // Asignar +1 si positivo, -1 si negativo, 0 si cero
            if (percentageChange > 0) {
              individualScore = 1;
            } else if (percentageChange < 0) {
              individualScore = -1;
            } else {
              individualScore = 0;
            }
            totalMagnificent7Score += individualScore; // Sumar al score total
          }

          individualChanges.push({
            symbol: stock.symbol,
            change: percentageChange,
            score: individualScore,
          });

          return {
            symbol: stock.symbol,
            change: percentageChange,
            score: individualScore,
          };
        } catch (innerError: unknown) {
          const innerErrorMessage =
            innerError instanceof Error
              ? innerError.message
              : String(innerError);
          console.error(
            `Error fetching ${stock.symbol} from Yahoo Finance:`,
            innerErrorMessage
          );
          hasError = true;
          errorMessageAccumulated += `Fallo al obtener ${stock.name}: ${innerErrorMessage}. `;
          individualChanges.push({
            symbol: stock.symbol,
            change: null,
            score: null,
          }); // Registrar como fallido
          throw innerError; // Relanzar para que Promise.allSettled lo capture como 'rejected'
        }
      })
    );

    // Opcional: Revisar los resultados de Promise.allSettled para un manejo más granular
    results.forEach((result) => {
      if (result.status === "rejected") {
        // Los errores ya se loggearon arriba, pero aquí puedes manejar el estado general de error
        // si necesitas saber si al menos una falló.
        // La variable `hasError` ya se encarga de esto.
      }
    });

    if (hasError) {
      console.warn(
        "Algunas acciones de las 7 Magníficas no se pudieron obtener."
      );
      return NextResponse.json<ScrapedData>(
        {
          error: `Se encontraron errores al obtener datos de algunas de las 7 Magníficas: ${errorMessageAccumulated}`,
          variable: "Sentimiento de las 7 Magníficas",
          actualValue: totalMagnificent7Score, // Devolver el score parcial si hay errores
          forecastValue: undefined,
          individualChanges: individualChanges, // Opcional: para ver qué falló
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ScrapedData>({
      variable: "Sentimiento de las 7 Magníficas",
      actualValue: totalMagnificent7Score,
      forecastValue: undefined, // No hay previsión
      individualChanges: individualChanges, // Opcional: para depuración
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "Error general al procesar Sentimiento de las 7 Magníficas:",
      errorMessage
    );
    return NextResponse.json<ScrapedData>(
      {
        error: `Fallo al calcular el Sentimiento de las 7 Magníficas: ${errorMessage}`,
        variable: "Sentimiento de las 7 Magníficas",
        actualValue: null,
        forecastValue: undefined,
        individualChanges: individualChanges,
      },
      { status: 500 }
    );
  }
}
