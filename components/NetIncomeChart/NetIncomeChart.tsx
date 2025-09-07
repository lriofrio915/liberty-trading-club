"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ApiAssetItem } from "@/types/api";
import { getRawValue } from "../Shared/utils";

// ===================================
// INTERFACES Y FUNCIONES AUXILIARES
// ===================================

interface ChartData {
  year: string;
  netIncome: number | null;
}

interface NetIncomeChartProps {
  assetData: ApiAssetItem;
}

// Función auxiliar para formatear valores del eje Y
const formatYAxisTick = (value: number) => {
  if (value === 0) return "$0";

  const absValue = Math.abs(value);
  let formattedValue: string;

  if (absValue >= 1_000_000_000) {
    formattedValue = `$${(value / 1_000_000_000).toFixed(1)}B`;
  } else if (absValue >= 1_000_000) {
    formattedValue = `$${(value / 1_000_000).toFixed(1)}M`;
  } else if (absValue >= 1_000) {
    formattedValue = `$${(value / 1_000).toFixed(1)}K`;
  } else {
    formattedValue = `$${value.toLocaleString()}`;
  }

  return formattedValue;
};

// Función auxiliar para formatear los valores del Tooltip
const formatTooltipValue = (value: number) => {
  if (value === null) return "N/A";
  return `$${value.toLocaleString()}`;
};

// ===================================
// COMPONENTE PRINCIPAL
// ===================================
export default function NetIncomeChart({ assetData }: NetIncomeChartProps) {
  // Obtener dato TTM (Trailing Twelve Months)
  const ttmNetIncome = assetData.data.defaultKeyStatistics?.netIncomeToCommon;
  const financialHistory =
    assetData.data.incomeStatementHistory?.incomeStatementHistory;
  const hasFinancialHistory = financialHistory && financialHistory.length > 0;

  const chartData: ChartData[] = [];

  // Agregar dato TTM (2025) si existe
  if (ttmNetIncome) {
    const ttmNetIncomeValue = getRawValue(ttmNetIncome);
    const currentYear = new Date().getFullYear().toString();

    if (typeof ttmNetIncomeValue === "number") {
      chartData.push({
        year: currentYear, // 2025
        netIncome: ttmNetIncomeValue,
      });
    }
  }

  // Agregar datos históricos
  if (hasFinancialHistory) {
    financialHistory.forEach((item) => {
      // Extraer el año
      let year = "N/A";
      try {
        if (item.endDate) {
          if (typeof item.endDate === "object" && "raw" in item.endDate) {
            year = new Date(item.endDate.raw * 1000).getFullYear().toString();
          } else if (item.endDate instanceof Date) {
            year = item.endDate.getFullYear().toString();
          } else if (typeof item.endDate === "string") {
            year = new Date(item.endDate).getFullYear().toString();
          }
        }
      } catch (error) {
        console.error("Error parsing date:", error);
      }

      const netIncomeValue = getRawValue(item.netIncome);

      // Solo agregar si no es el año actual (para evitar duplicados con TTM)
      if (year !== new Date().getFullYear().toString()) {
        chartData.push({
          year,
          netIncome: typeof netIncomeValue === "number" ? netIncomeValue : null,
        });
      }
    });
  }

  // Ordenar por año (ascendente)
  chartData.sort((a, b) => parseInt(a.year) - parseInt(b.year));
  const hasData = chartData.length > 0;

  if (!hasData) {
    return (
      <div className="bg-yellow-50 p-6 rounded-lg text-center my-8">
        <h4 className="text-lg font-semibold text-yellow-800 mb-2">
          Datos de Ingresos Netos No Disponibles
        </h4>
        <p className="text-sm text-yellow-600">
          La información histórica de Ingresos Netos no está disponible para
          esta empresa.
        </p>
      </div>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
      <h3 className="text-2xl font-semibold text-[#0A2342] mb-6 text-center">
        Análisis de Ingresos Netos
      </h3>
      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 80, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis
                label={{
                  value: "Ingreso Neto ($)",
                  angle: -90,
                  position: "outside",
                  dx: -70,
                  style: { textAnchor: "middle" },
                }}
                tickFormatter={formatYAxisTick}
              />
              <Tooltip formatter={formatTooltipValue} />
              <Bar dataKey="netIncome" fill="#4B5563" name="Ingreso Neto" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}
