// components/Dashboard/PerformanceChart.tsx
"use client";

import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";
// Importa los tipos específicos de Chart.js
import {
  ChartConfiguration,
  ChartData,
  ChartOptions,
  ChartType,
} from "chart.js";

interface PerformanceChartProps {
  // Tipos más específicos usando los tipos de Chart.js
  data: ChartData<ChartType>; // Usa ChartData con el tipo de gráfico
  chartType: ChartType; // Usa ChartType para el tipo de gráfico (e.g., 'line', 'doughnut', 'bar')
  options?: ChartOptions<ChartType>; // Usa ChartOptions con el tipo de gráfico
}

export default function PerformanceChart({
  data,
  chartType,
  options,
}: PerformanceChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Destruye la instancia anterior si existe
      }

      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        const config: ChartConfiguration<ChartType> = {
          // Usa ChartConfiguration con el tipo de gráfico
          type: chartType,
          data: data,
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: chartType !== "doughnut", // Ocultar leyenda para donut chart por defecto
                position: "bottom",
                labels: {
                  color: "#0A2342", // Color de texto de la leyenda
                },
              },
              tooltip: {
                // Configuración básica del tooltip
              },
            },
            ...options, // Sobrescribe opciones por defecto con las pasadas por prop
          },
        };
        chartInstance.current = new Chart(ctx, config);
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy(); // Limpieza al desmontar el componente
      }
    };
  }, [data, chartType, options]); // Dependencias para re-renderizar si los datos o tipo cambian

  return <canvas ref={chartRef} />;
}
