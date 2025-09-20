// app/api/income-statement/route.ts
import { NextResponse } from "next/server";
import { chromium } from "playwright";

const cleanAndParseValue = (text: string) => {
  if (!text || text.trim() === "-") return 0;
  const value = parseFloat(text.replace(/,/g, ""));
  return isNaN(value) ? 0 : value;
};

export async function GET(request: Request) {
  let browser;
  try {
    const { searchParams } = new URL(request.url);
    const ticker = searchParams.get("ticker");

    if (!ticker) {
      return NextResponse.json(
        { error: 'Falta el parámetro "ticker" en la solicitud.' },
        { status: 400 }
      );
    }

    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const url = `https://finance.yahoo.com/quote/${ticker}/financials/`;
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForSelector("h1", { timeout: 20000 });

    const financialData = await page.evaluate(() => {
      // Función auxiliar mejorada para buscar por múltiples nombres, en orden de prioridad
      const getRowValues = (rowTitles: string[]): string[] => {
        const lowerCaseTitles = rowTitles.map((t) => t.toLowerCase());
        const allRows = Array.from(
          document.querySelectorAll("div.tableBody .row")
        );

        for (const title of lowerCaseTitles) {
          const row = allRows.find((rowElement) => {
            const titleElement = rowElement.querySelector(".rowTitle");
            return titleElement?.textContent?.trim().toLowerCase() === title;
          });

          if (row) {
            const columns = row.querySelectorAll("div.column:not(.sticky)");
            return Array.from(columns).map(
              (col) => col.textContent?.trim() || ""
            );
          }
        }
        return []; // Retorna vacío si no se encuentra ninguna de las opciones
      };

      const headerRow = document.querySelector("div.tableHeader .row");
      const headers = Array.from(
        headerRow?.querySelectorAll("div.column") || []
      )
        .map((th) => th.textContent?.trim() || "")
        .filter((header) => header !== "Breakdown" && header !== "");

      // Usamos arrays de posibles nombres para mayor robustez
      return {
        headers,
        totalRevenue: getRowValues(["Total Revenue"]),
        ebit: getRowValues(["EBIT", "Earnings Before Interest and Taxes"]),
        pretaxIncome: getRowValues(["Pretax Income", "Pre-Tax Income"]),
        // *** CORRECCIÓN: Priorizamos "Tax Provision" ***
        taxRateForCalcs: getRowValues(["Tax Provision", "Tax Rate for Calcs"]),
        basicAverageShares: getRowValues([
          "Basic Average Shares",
          "Basic Average Shares Outstanding",
        ]),
        // Añadimos métricas que faltaban por si son necesarias en el futuro
        ebitda: getRowValues(["EBITDA"]),
        netIncome: getRowValues([
          "Net Income Common Stockholders",
          "Net Income",
        ]),
        costOfRevenue: getRowValues(["Cost of Revenue"]),
        grossProfit: getRowValues(["Gross Profit"]),
        basicEps: getRowValues(["Basic EPS"]),
        dilutedEps: getRowValues(["Diluted EPS"]),
        dilutedAverageShares: getRowValues([
          "Diluted Average Shares",
          "Diluted Average Shares Outstanding",
        ]),
        taxEffectOfUnusualItems: getRowValues(["Tax Effect of Unusual Items"]),
      };
    });

    if (Object.values(financialData).every((val) => !val || val.length === 0)) {
      throw new Error("No se encontraron los datos de la tabla.");
    }

    const formattedData = {
      headers: financialData.headers,
      metrics: {
        totalRevenue: financialData.totalRevenue.map(cleanAndParseValue),
        ebit: financialData.ebit.map(cleanAndParseValue),
        pretaxIncome: financialData.pretaxIncome.map(cleanAndParseValue),
        taxRateForCalcs: financialData.taxRateForCalcs.map(cleanAndParseValue),
        basicAverageShares:
          financialData.basicAverageShares.map(cleanAndParseValue),
        // Mapeamos el resto de los datos
        ebitda: financialData.ebitda.map(cleanAndParseValue),
        netIncome: financialData.netIncome.map(cleanAndParseValue),
        costOfRevenue: financialData.costOfRevenue.map(cleanAndParseValue),
        grossProfit: financialData.grossProfit.map(cleanAndParseValue),
        basicEps: financialData.basicEps.map(cleanAndParseValue),
        dilutedEps: financialData.dilutedEps.map(cleanAndParseValue),
        dilutedAverageShares:
          financialData.dilutedAverageShares.map(cleanAndParseValue),
        taxEffectOfUnusualItems:
          financialData.taxEffectOfUnusualItems.map(cleanAndParseValue),
      },
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    console.error("Error durante el web scraping:", errorMessage);
    return NextResponse.json(
      { error: "Error al obtener los datos financieros." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
