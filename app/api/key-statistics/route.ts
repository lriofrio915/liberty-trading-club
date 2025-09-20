// app/api/key-statistics/route.ts
import { NextResponse } from "next/server";
import { chromium } from "playwright";

/**
 * Limpia y convierte una cadena de texto de un valor financiero a un número.
 * @param text El texto del valor (e.g., "3.89T", "16.13B", "--").
 * @returns El valor numérico completo.
 */
const cleanAndParseValue = (text: string): number => {
  if (!text || text.trim() === "--") {
    return 0;
  }

  // Elimina las comas y extrae el número base
  let value = parseFloat(text.replace(/,/g, ""));

  // --- INICIO DE LA ACTUALIZACIÓN ---
  // Maneja los sufijos para Trillones (T), Billones (B), Millones (M) y miles (k)
  if (text.includes("T")) {
    value *= 1e12; // 1 Trillón = 1,000,000,000,000
  } else if (text.includes("B")) {
    value *= 1e9; // 1 Billón = 1,000,000,000
  } else if (text.includes("M")) {
    value *= 1e6; // 1 Millón = 1,000,000
  } else if (text.includes("k")) {
    value *= 1e3; // 1 Mil = 1,000
  }
  // --- FIN DE LA ACTUALIZACIÓN ---

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

    const url = `https://finance.yahoo.com/quote/${ticker}/key-statistics/`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("h1", { timeout: 20000 });

    const valuationData = await page.evaluate(() => {
      const getRowValues = (rowTitle: string): string[] => {
        const row = Array.from(
          document.querySelectorAll(
            "section[data-testid='qsp-statistics'] table tr"
          )
        ).find((rowElement) => {
          const titleElement = rowElement.querySelector("td:first-child");
          return titleElement?.textContent?.trim() === rowTitle;
        });

        if (!row) return [];

        const columns = row.querySelectorAll("td:not(:first-child)");
        return Array.from(columns).map((col) => col.textContent?.trim() || "");
      };

      const headerRow = document.querySelector(
        "section[data-testid='qsp-statistics'] table thead tr"
      );
      const headers = Array.from(headerRow?.querySelectorAll("th") || [])
        .map((th) => th.textContent?.trim() || "")
        .filter((header) => header !== "");

      return {
        headers,
        marketCap: getRowValues("Market Cap"),
        enterpriseValue: getRowValues("Enterprise Value"),
        trailingPE: getRowValues("Trailing P/E"),
        forwardPE: getRowValues("Forward P/E"),
        pegRatio: getRowValues("PEG Ratio (5yr expected)"),
        priceSales: getRowValues("Price/Sales"),
        priceBook: getRowValues("Price/Book"),
        enterpriseValueRevenue: getRowValues("Enterprise Value/Revenue"),
        enterpriseValueEBITDA: getRowValues("Enterprise Value/EBITDA"),
      };
    });

    if (Object.values(valuationData).every((val) => !val || val.length === 0)) {
      throw new Error("No se encontraron los datos de valoración.");
    }

    const formattedData = {
      headers: valuationData.headers,
      metrics: {
        marketCap: valuationData.marketCap.map(cleanAndParseValue),
        enterpriseValue: valuationData.enterpriseValue.map(cleanAndParseValue),
        trailingPE: valuationData.trailingPE.map(cleanAndParseValue),
        forwardPE: valuationData.forwardPE.map(cleanAndParseValue),
        pegRatio: valuationData.pegRatio.map(cleanAndParseValue),
        priceSales: valuationData.priceSales.map(cleanAndParseValue),
        priceBook: valuationData.priceBook.map(cleanAndParseValue),
        enterpriseValueRevenue:
          valuationData.enterpriseValueRevenue.map(cleanAndParseValue),
        enterpriseValueEBITDA:
          valuationData.enterpriseValueEBITDA.map(cleanAndParseValue),
      },
    };

    return NextResponse.json(formattedData);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(
      "Error durante el web scraping de key-statistics:",
      errorMessage
    );
    return NextResponse.json(
      { error: "Error al obtener los datos de valoración." },
      { status: 500 }
    );
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}
