// components/FutureFinancialTable/FutureFinancialTable.tsx
"use client";

import React from "react";
import { ApiAssetItem } from "@/types/api";
import { getRawValue, getTimestampFromDate } from "@/lib/valuationCalculations";

interface FutureFinancialTableProps {
  assetData: ApiAssetItem;
}

interface TableRow {
  name: string;
  values: (number | string)[];
}

const formatNumber = (num: number): string => {
  if (num === 0) return "0";
  const absNum = Math.abs(num);
  if (absNum >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(2)}B`;
  }
  if (absNum >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(2)}M`;
  }
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

const calculateTaxRate = (
  taxProvisions: number[],
  pretaxIncomes: number[]
): string[] => {
  return pretaxIncomes.map((pretax, index) => {
    const tax = taxProvisions[index];
    if (pretax === undefined || tax === undefined || pretax === 0) return "N/A";
    const rate = (tax / pretax) * 100;
    return `${rate.toFixed(2)}%`;
  });
};

export default function FutureFinancialTable({
  assetData,
}: FutureFinancialTableProps) {
  const { ticker, data } = assetData;
  const incomeHistory =
    data.incomeStatementHistory?.incomeStatementHistory || [];
  const balanceHistory = data.balanceSheetHistory?.balanceSheetStatements || [];
  const cashflowHistory =
    data.cashflowStatementHistory?.cashflowStatements || [];

  // --- ✨ CORRECCIÓN APLICADA AQUÍ ---
  // 1. Extraemos todos los años, incluso si hay duplicados.
  const allHeaders = incomeHistory.map((item) =>
    new Date(getTimestampFromDate(item.endDate) * 1000).getFullYear().toString()
  );

  // 2. Creamos un array de años únicos usando `Set` para renderizar los encabezados.
  //    Lo ordenamos numéricamente para asegurar el orden cronológico.
  const uniqueHeaders = [...new Set(allHeaders)].sort(
    (a, b) => parseInt(a) - parseInt(b)
  );

  const tableRows: TableRow[] = [
    {
      name: "Acciones en circulación",
      values: balanceHistory
        .map(
          (item) =>
            getRawValue(item.ordinarySharesNumber) ||
            getRawValue(item.shareIssued)
        )
        .reverse(),
    },
    {
      name: "Ventas (Revenue)",
      values: incomeHistory
        .map((item) => getRawValue(item.totalRevenue))
        .reverse(),
    },
    {
      name: "EBIT",
      values: incomeHistory.map((item) => getRawValue(item.ebit)).reverse(),
    },
    {
      name: "EBITDA",
      values: incomeHistory.map((item) => getRawValue(item.ebitda)).reverse(),
    },
    {
      name: "Free Cash Flow (FCF)",
      values: cashflowHistory
        .map((item) => getRawValue(item.freeCashflow))
        .reverse(),
    },
    {
      name: "Deuda Total",
      values: balanceHistory
        .map((item) => getRawValue(item.totalDebt))
        .reverse(),
    },
    {
      name: "Efectivo y equivalentes",
      values: balanceHistory.map((item) => getRawValue(item.cash)).reverse(),
    },
    {
      name: "Tasa de impuestos (%)",
      values: calculateTaxRate(
        incomeHistory.map((item) => getRawValue(item.taxProvision)).reverse(),
        incomeHistory.map((item) => getRawValue(item.pretaxIncome)).reverse()
      ),
    },
  ];

  if (incomeHistory.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
        <h2 className="text-3xl font-bold text-center text-[#0A2342] mb-2">
          Datos Financieros Históricos
        </h2>
        <p className="text-center text-gray-500">
          No hay datos históricos detallados disponibles para mostrar.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
      <h2 className="text-3xl font-bold text-center text-[#0A2342] mb-6">
        Datos Financieros Históricos de {ticker}
      </h2>
      <div className="overflow-x-auto rounded-xl shadow-inner bg-gray-50 p-2">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Métrica
              </th>
              {/* 3. Iteramos sobre los años ÚNICOS y usamos una combinación de valor + índice para la key */}
              {uniqueHeaders.map((header, index) => (
                <th
                  key={`${header}-${index}`} // Clave garantizada como única
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tableRows.map((row) => (
              <tr
                key={row.name}
                className="hover:bg-gray-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-800">
                  {row.name}
                </td>
                {row.values
                  .slice(0, uniqueHeaders.length)
                  .map((value, colIndex) => (
                    <td
                      key={colIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-600"
                    >
                      {typeof value === "number" ? formatNumber(value) : value}
                    </td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
