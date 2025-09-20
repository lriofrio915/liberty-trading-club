// app/api/balance-sheet/route.ts
import { NextResponse } from "next/server";
import { chromium, Browser } from "playwright";

// ... (La interfaz BalanceSheetResponse permanece igual)
type BalanceSheetResponse = {
  headers: string[];
  metrics: {
    totalAssets: number[];
    totalLiabilitiesNetMinorityInterest: number[];
    totalEquityGrossMinorityInterest: number[];
    totalCapitalization: number[];
    commonStockEquity: number[];
    capitalLeaseObligations: number[];
    netTangibleAssets: number[];
    workingCapital: number[];
    investedCapital: number[];
    tangibleBookValue: number[];
    totalDebt: number[];
    netDebt: number[];
    shareIssued: number[];
    ordinarySharesNumber: number[];
    currentAssets: number[];
  };
};

const cleanAndParseValue = (text: string) => {
  if (!text || text.trim() === "-" || text.trim() === "—") return 0;
  const value = parseFloat(text.replace(/,/g, ""));
  // CAMBIO AQUÍ: Multiplicamos por 1000 porque los datos de esta página están en miles.
  return Number.isFinite(value) ? value * 1000 : 0;
};

// ... (El resto del archivo permanece igual, desde ROWS hasta el final)
const ROWS: Record<keyof BalanceSheetResponse["metrics"], string[]> = {
  totalAssets: ["total assets"],
  totalLiabilitiesNetMinorityInterest: [
    "total liabilities net minority interest",
    "total liabilities net minority",
  ],
  totalEquityGrossMinorityInterest: [
    "total equity gross minority interest",
    "total equity gross minority",
  ],
  totalCapitalization: ["total capitalization"],
  commonStockEquity: ["common stock equity"],
  capitalLeaseObligations: [
    "capital lease obligations",
    "finance lease obligations",
  ],
  netTangibleAssets: ["net tangible assets"],
  workingCapital: ["working capital"],
  investedCapital: ["invested capital"],
  tangibleBookValue: ["tangible book value"],
  totalDebt: ["total debt", "total debt and capital lease obligation"],
  netDebt: ["net debt"],
  shareIssued: ["share issued", "shares issued"],
  ordinarySharesNumber: ["ordinary shares number", "ordinary shares"],
  currentAssets: ["current assets", "total current assets"],
};

export async function GET(request: Request) {
  let browser: Browser | undefined;

  try {
    const { searchParams } = new URL(request.url);
    const rawTicker = searchParams.get("ticker");

    if (!rawTicker) {
      return NextResponse.json(
        { error: 'Falta el parámetro "ticker".' },
        { status: 400 }
      );
    }

    const ticker = rawTicker.trim();
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const url = `https://finance.yahoo.com/quote/${ticker}/balance-sheet/`;
    await page.goto(url, { waitUntil: "domcontentloaded" });

    await page.waitForSelector("h1", { timeout: 20000 });

    try {
      await page.click('div.row:has-text("Total Assets") button');
      await page.waitForTimeout(1000);
    } catch {
      console.warn(
        "No se pudo hacer clic en el botón de expansión. Ignorando."
      );
    }

    const rowValues: Record<string, string[]> = {};
    await page.waitForSelector("div.tableBody .row .rowTitle", {
      timeout: 15000,
    });

    for (const [key, labelList] of Object.entries(ROWS)) {
      const values = await page.evaluate((labels: string[]) => {
        const allRows = Array.from(
          document.querySelectorAll("div.tableBody .row")
        );
        const target = allRows.find((row) => {
          const title =
            row.querySelector(".rowTitle")?.textContent?.trim() || "";
          const titleNorm = title.replace(/\s+/g, " ").trim().toLowerCase();
          return labels.some((l) => titleNorm.includes(l));
        });
        if (!target) return [];
        const cols = target.querySelectorAll("div.column:not(.sticky)");
        return Array.from(cols).map((c) => c.textContent?.trim() || "");
      }, labelList);

      rowValues[key] = values;
    }

    const headers = await page.evaluate(() => {
      const headerRow = document.querySelector("div.tableHeader .row");
      const cols = Array.from(headerRow?.querySelectorAll("div.column") || [])
        .map((c) => c.textContent?.trim() || "")
        .filter((t) => t && t !== "Breakdown");
      return cols;
    });

    if (!headers.length) {
      throw new Error("No se detectaron encabezados de la tabla.");
    }

    const formatted: BalanceSheetResponse = {
      headers,
      metrics: {
        totalAssets: (rowValues["totalAssets"] || []).map(cleanAndParseValue),
        totalLiabilitiesNetMinorityInterest: (
          rowValues["totalLiabilitiesNetMinorityInterest"] || []
        ).map(cleanAndParseValue),
        totalEquityGrossMinorityInterest: (
          rowValues["totalEquityGrossMinorityInterest"] || []
        ).map(cleanAndParseValue),
        totalCapitalization: (rowValues["totalCapitalization"] || []).map(
          cleanAndParseValue
        ),
        commonStockEquity: (rowValues["commonStockEquity"] || []).map(
          cleanAndParseValue
        ),
        capitalLeaseObligations: (
          rowValues["capitalLeaseObligations"] || []
        ).map(cleanAndParseValue),
        netTangibleAssets: (rowValues["netTangibleAssets"] || []).map(
          cleanAndParseValue
        ),
        workingCapital: (rowValues["workingCapital"] || []).map(
          cleanAndParseValue
        ),
        investedCapital: (rowValues["investedCapital"] || []).map(
          cleanAndParseValue
        ),
        tangibleBookValue: (rowValues["tangibleBookValue"] || []).map(
          cleanAndParseValue
        ),
        totalDebt: (rowValues["totalDebt"] || []).map(cleanAndParseValue),
        netDebt: (rowValues["netDebt"] || []).map(cleanAndParseValue),
        shareIssued: (rowValues["shareIssued"] || []).map(cleanAndParseValue),
        ordinarySharesNumber: (rowValues["ordinarySharesNumber"] || []).map(
          cleanAndParseValue
        ),
        currentAssets: (rowValues["currentAssets"] || []).map(
          cleanAndParseValue
        ),
      },
    };

    const hasAnyData = Object.values(formatted.metrics).some(
      (arr) => Array.isArray(arr) && arr.length > 0
    );
    if (!hasAnyData) {
      throw new Error("No se encontraron filas en la tabla (Balance Sheet).");
    }

    return NextResponse.json(formatted);
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : "Error desconocido";
    console.error("Error Balance Sheet scraping:", errorMessage);
    return NextResponse.json(
      { error: "Error al obtener el Balance Sheet desde Yahoo." },
      { status: 500 }
    );
  } finally {
    if (browser) await browser.close();
  }
}
