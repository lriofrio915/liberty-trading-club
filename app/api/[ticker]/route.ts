// app/api/[ticker]/route.ts

import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";
import {
  CashflowStatement,
  BalanceSheet,
  IncomeStatement,
  FinancialHistoryItem,
  HistoricalData,
  YahooFinanceRawValue,
  YahooFinanceDateValue,
  IncomeStatementHistory,
  RawYahooFinanceCashflowItem,
  RawYahooFinanceBalanceSheetItem,
  RawYahooFinanceIncomeStatementItem,
  YahooFinanceModule,
  QuoteSummaryCashflowStatementHistory,
  QuoteSummaryBalanceSheetHistory, 
} from "@/types/api";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ ticker: string }> }
) {
  const { ticker } = await params;

  if (!ticker) {
    return NextResponse.json(
      { success: false, message: "El ticker es obligatorio" },
      { status: 400 }
    );
  }

  try {
    const modulesToFetch: YahooFinanceModule[] = [
      "price",
      "financialData",
      "summaryDetail",
      "assetProfile",
      "defaultKeyStatistics",
      "cashflowStatementHistory",
      "balanceSheetHistory",
      "incomeStatementHistory",
      "earningsTrend",
    ];

    const quoteSummaryResult = await yahooFinance.quoteSummary(ticker, {
      modules: modulesToFetch,
    });

    const historicalPriceData = await yahooFinance.historical(ticker, {
      period1: "2021-01-01",
    });

    if (
      !quoteSummaryResult ||
      (!quoteSummaryResult.price && historicalPriceData.length === 0)
    ) {
      return NextResponse.json(
        {
          success: false,
          message: `Ticker '${ticker}' no encontrado o sin datos relevantes.`,
        },
        { status: 404 }
      );
    }

    const financialHistory: FinancialHistoryItem[] = [];

    const cashflowStatements =
      (
        quoteSummaryResult.cashflowStatementHistory as QuoteSummaryCashflowStatementHistory
      )?.cashflowStatements || [];
    const balanceSheetStatements =
      (
        quoteSummaryResult.balanceSheetHistory as QuoteSummaryBalanceSheetHistory
      )?.balanceSheetStatements || [];
    const incomeStatementHistoryObject =
      quoteSummaryResult.incomeStatementHistory as
        | IncomeStatementHistory
        | undefined;
    const incomeStatements =
      incomeStatementHistoryObject?.incomeStatements || [];

    const statementsByYear: {
      [year: string]: {
        cashflow?: CashflowStatement;
        balanceSheet?: BalanceSheet;
        incomeStatement?: IncomeStatement;
      };
    } = {};

    // FUNCIÓN GETYEARFROMENDDATE CORREGIDA
    const getYearFromEndDate = (
      endDate: Date | YahooFinanceDateValue | undefined
    ): string | undefined => {
      if (!endDate) return undefined;

      // Primero verificar si es Date
      if (endDate instanceof Date) {
        return endDate.getFullYear().toString();
      }

      // Luego verificar si es YahooFinanceDateValue con 'fmt'
      if (
        typeof endDate === "object" &&
        "fmt" in endDate &&
        typeof endDate.fmt === "string"
      ) {
        return endDate.fmt.substring(0, 4);
      }

      // Si tiene 'raw' (timestamp)
      if (
        typeof endDate === "object" &&
        "raw" in endDate &&
        typeof endDate.raw === "number"
      ) {
        return new Date(endDate.raw * 1000).getFullYear().toString();
      }

      return undefined;
    };

    // FUNCIÓN TOYAHOOFINANCERAWVALUE CORREGIDA
    const toYahooFinanceRawValue = (
      value: number | YahooFinanceRawValue | undefined
    ): YahooFinanceRawValue | undefined => {
      if (typeof value === "number") {
        return { raw: value, fmt: value.toLocaleString() };
      } else if (value && typeof value === "object" && "raw" in value) {
        return value;
      }
      return undefined;
    };

    const normalizeEndDate = (
      endDate: Date | YahooFinanceDateValue
    ): YahooFinanceDateValue => {
      if (endDate instanceof Date) {
        return {
          raw: Math.floor(endDate.getTime() / 1000),
          fmt: endDate.toISOString().split("T")[0],
        };
      }
      return endDate;
    };

    cashflowStatements.forEach((stmt: RawYahooFinanceCashflowItem) => {
      const year = getYearFromEndDate(stmt.endDate);
      if (year) {
        const normalizedEndDate = normalizeEndDate(stmt.endDate);
        const cashflowStmt: CashflowStatement = {
          maxAge: stmt.maxAge,
          endDate: normalizedEndDate,
          freeCashFlow: toYahooFinanceRawValue(stmt.freeCashFlow),
          operatingCashFlow: toYahooFinanceRawValue(stmt.operatingCashFlow),
          capitalExpenditures: toYahooFinanceRawValue(stmt.capitalExpenditures),
        };
        statementsByYear[year] = {
          ...(statementsByYear[year] || {}),
          cashflow: cashflowStmt,
        };
      }
    });

    balanceSheetStatements.forEach((stmt: RawYahooFinanceBalanceSheetItem) => {
      const year = getYearFromEndDate(stmt.endDate);
      if (year) {
        const normalizedEndDate = normalizeEndDate(stmt.endDate);
        const balanceSheetStmt: BalanceSheet = {
          maxAge: stmt.maxAge,
          endDate: normalizedEndDate,
          totalDebt: toYahooFinanceRawValue(stmt.totalDebt),
          totalStockholderEquity: toYahooFinanceRawValue(
            stmt.totalStockholderEquity
          ),
        };
        statementsByYear[year] = {
          ...(statementsByYear[year] || {}),
          balanceSheet: balanceSheetStmt,
        };
      }
    });

    incomeStatements.forEach((stmt: RawYahooFinanceIncomeStatementItem) => {
      const year = getYearFromEndDate(stmt.endDate);
      if (year) {
        const normalizedEndDate = normalizeEndDate(stmt.endDate);
        const incomeStatementStmt: IncomeStatement = {
          maxAge: stmt.maxAge,
          endDate: normalizedEndDate,
          totalRevenue: toYahooFinanceRawValue(stmt.totalRevenue),
          netIncome: toYahooFinanceRawValue(stmt.netIncome),
          grossProfit: toYahooFinanceRawValue(stmt.grossProfit),
        };
        statementsByYear[year] = {
          ...(statementsByYear[year] || {}),
          incomeStatement: incomeStatementStmt,
        };
      }
    });

    for (const year of Object.keys(statementsByYear).sort().reverse()) {
      const { cashflow, balanceSheet } = statementsByYear[year];

      const freeCashFlow = cashflow?.freeCashFlow?.raw ?? null;
      const operatingCashFlow = cashflow?.operatingCashFlow?.raw ?? null;
      const capitalExpenditures = cashflow?.capitalExpenditures?.raw ?? null;
      const totalDebt = balanceSheet?.totalDebt?.raw ?? null;
      const totalEquity = balanceSheet?.totalStockholderEquity?.raw ?? null;
      const debtToEquity =
        totalDebt !== null && totalEquity !== null && totalEquity !== 0
          ? totalDebt / totalEquity
          : null;

      financialHistory.push({
        year: year,
        freeCashFlow,
        totalDebt,
        totalEquity,
        debtToEquity,
        operatingCashFlow,
        capitalExpenditures,
      });
    }

    const formattedHistoricalData: HistoricalData[] = historicalPriceData.map(
      (item) => ({
        date: item.date.toISOString().split("T")[0],
        open: item.open,
        high: item.high,
        low: item.low,
        close: item.close,
        volume: item.volume,
        adjClose: item.adjClose,
      })
    );

    const formattedData = {
      ticker: ticker.toUpperCase(),
      data: {
        ...quoteSummaryResult,
        historical: formattedHistoricalData,
        financialHistory: financialHistory,
      },
    };

    return NextResponse.json({ success: true, assetData: [formattedData] });
  } catch (error) {
    console.error(`Error al obtener datos para ${ticker}:`, error);
    return NextResponse.json(
      {
        success: false,
        message:
          "No se pudo obtener la información del ticker. Por favor, verifica el símbolo.",
      },
      { status: 500 }
    );
  }
}
