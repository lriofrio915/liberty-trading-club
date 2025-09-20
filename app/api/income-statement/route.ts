// app/api/income-statement/route.ts
import { NextResponse } from "next/server";
import { chromium } from "playwright";

/**
 * Limpia y convierte una cadena de texto de un valor financiero a un número.
 * @param text El texto del valor (e.g., "2,450,670", "-").
 * @returns El valor numérico completo (en unidades, no en miles).
 */
const cleanAndParseValue = (text: string) => {
  if (!text || text.trim() === "-") {
    return 0;
  }
  const value = parseFloat(text.replace(/,/g, ""));
  // CAMBIO AQUÍ: Multiplicamos por 1000 porque los datos de esta página están en miles.
  return isNaN(value) ? 0 : value * 1000;
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
      const getRowValues = (rowTitle: string): string[] => {
        const row = Array.from(
          document.querySelectorAll("div.tableBody .row")
        ).find((rowElement) => {
          const titleElement = rowElement.querySelector(".rowTitle");
          return titleElement?.textContent?.trim() === rowTitle;
        });

        if (!row) return [];

        const columns = row.querySelectorAll("div.column:not(.sticky)");
        return Array.from(columns).map((col) => col.textContent?.trim() || "");
      };

      const headerRow = document.querySelector("div.tableHeader .row");
      const headers = Array.from(
        headerRow?.querySelectorAll("div.column") || []
      )
        .map((th) => th.textContent?.trim() || "")
        .filter((header) => header !== "Breakdown" && header !== "");

      return {
        headers,
        totalRevenue: getRowValues("Total Revenue"),
        costOfRevenue: getRowValues("Cost of Revenue"),
        grossProfit: getRowValues("Gross Profit"),
        ebit: getRowValues("EBIT"),
        ebitda: getRowValues("EBITDA"),
        netIncome: getRowValues("Net Income Common Stockholders"),
        basicEps: getRowValues("Basic EPS"),
        dilutedEps: getRowValues("Diluted EPS"),
        basicAverageShares: getRowValues("Basic Average Shares"),
        dilutedAverageShares: getRowValues("Diluted Average Shares"),
        taxRateForCalcs: getRowValues("Tax Rate for Calcs"),
        taxEffectOfUnusualItems: getRowValues("Tax Effect of Unusual Items"),
        pretaxIncome: getRowValues("Pretax Income"),
      };
    });

    if (Object.values(financialData).every((val) => !val || val.length === 0)) {
      throw new Error("No se encontraron los datos de la tabla.");
    }

    const formattedData = {
      headers: financialData.headers,
      metrics: {
        totalRevenue: financialData.totalRevenue.map(cleanAndParseValue),
        costOfRevenue: financialData.costOfRevenue.map(cleanAndParseValue),
        grossProfit: financialData.grossProfit.map(cleanAndParseValue),
        ebit: financialData.ebit.map(cleanAndParseValue),
        ebitda: financialData.ebitda.map(cleanAndParseValue),
        netIncome: financialData.netIncome.map(cleanAndParseValue),
        basicEps: financialData.basicEps.map(cleanAndParseValue),
        dilutedEps: financialData.dilutedEps.map(cleanAndParseValue),
        basicAverageShares:
          financialData.basicAverageShares.map(cleanAndParseValue),
        dilutedAverageShares:
          financialData.dilutedAverageShares.map(cleanAndParseValue),
        taxRateForCalcs: financialData.taxRateForCalcs.map(cleanAndParseValue),
        taxEffectOfUnusualItems:
          financialData.taxEffectOfUnusualItems.map(cleanAndParseValue),
        pretaxIncome: financialData.pretaxIncome.map(cleanAndParseValue),
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
