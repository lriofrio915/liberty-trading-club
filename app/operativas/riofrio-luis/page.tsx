"use client"; // Esta directiva convierte el componente en un Client Component

import Image from "next/image";
import { useState } from "react"; // Importa useState para manejar el estado del componente

// Importa los componentes de Chart.js para el gráfico de barras
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registra los componentes de Chart.js. Esto es crucial para que los gráficos se rendericen correctamente.
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Asumiendo que estos componentes existen en tu proyecto según el código proporcionado
import SummarySection from "../../../components/Dashboard/SummarySection";
import PerformanceChart from "../../../components/Dashboard/PerformanceChart";
import StrategyBreakdown from "../../../components/Dashboard/StrategyBreakdown";
import TradesTable from "../../../components/Dashboard/TradesTable";

// NOTA IMPORTANTE: 'export const metadata' ha sido eliminado de aquí.
// Los componentes marcados con "use client" no pueden exportar metadatos.
// Si necesitas definir metadatos para esta página, hazlo en un archivo `layout.tsx`
// en el mismo directorio o en uno superior en tu estructura de Next.js App Router.

// Define la interfaz para los datos del gráfico mensual
interface MonthlyChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }[];
}

// Define la interfaz para las props del componente MonthlyAnalyticsChart
// Se eliminó 'year' de los props ya que no se usa directamente en este componente.
interface MonthlyAnalyticsChartProps {
  data: MonthlyChartData; // Tipado específico para 'data'
}

// Componente para el gráfico de Analíticas Mensuales
const MonthlyAnalyticsChart = ({ data }: MonthlyAnalyticsChartProps) => {
  // Opciones del gráfico para personalizar su apariencia y comportamiento
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico cambie de tamaño libremente
    plugins: {
      legend: {
        display: false, // Ocultamos la leyenda ya que solo hay un conjunto de datos y los colores son autoexplicativos
      },
      tooltip: {
        callbacks: {
          // Tipado específico para tooltipItem de Chart.js
          label: function (tooltipItem: import("chart.js").TooltipItem<"bar">) {
            let label = tooltipItem.dataset.label ?? "";
            if (label) {
              label += ": ";
            }
            // Usa tooltipItem.parsed.y para gráficos de barras (puede ser indefinido)
            if (typeof tooltipItem.parsed.y === "number") {
              label += `${tooltipItem.parsed.y.toFixed(2)}%`;
            }
            return label;
          },
        },
        // Color de fondo personalizado para los tooltips que coincida con el tema
        backgroundColor: "#0A2342",
        titleColor: "#FFFFFF",
        bodyColor: "#FFFFFF",
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // Oculta las líneas de cuadrícula verticales
        },
        ticks: {
          color: "#6B7280", // Color para las etiquetas del eje X (meses)
        },
      },
      y: {
        beginAtZero: true, // Asegura que el eje Y comience en cero
        ticks: {
          // Tipado específico para 'value' en la callback de los ticks del eje Y
          callback: function (value: string | number) {
            return `${value}%`; // Formatea las etiquetas del eje Y para mostrar porcentaje
          },
          color: "#6B7280", // Color para las etiquetas del eje Y (porcentajes)
        },
        grid: {
          color: "#E5E7EB", // Color para las líneas de cuadrícula horizontales
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default function HomePage() {
  // Datos fijos para el rendimiento mensual a lo largo de diferentes años
  // Estos datos imitan la estructura y los valores de la imagen proporcionada para 2025
  // e incluyen datos ficticios para 2023 y 2024.
  type YearKey = "2023" | "2024" | "2025";

  const monthlyPerformanceData: Record<
    YearKey,
    { labels: string[]; data: number[] }
  > = {
    "2023": {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      data: [-1.2, -0.8, 0.5, 1.0, -0.3, 1.5, 0.7, -0.1, 0.9, 1.3, -0.6, 2.0],
    },
    "2024": {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      data: [0.8, 1.1, -0.2, 2.0, -1.0, 0.5, 1.3, -0.4, 0.6, 1.0, -0.2, 1.8],
    },
    "2025": {
      labels: [
        "Ene",
        "Feb",
        "Mar",
        "Abr",
        "May",
        "Jun",
        "Jul",
        "Ago",
        "Sep",
        "Oct",
        "Nov",
        "Dic",
      ],
      data: [
        -7.15, -5.58, -2.57, -2.92, -2.62, 0.37, 2.59, 2.19, 1.5, 0.8, -0.4,
        1.9,
      ], // Extendido con datos ficticios para Sep-Dic
    },
  };

  // Estado para manejar el año seleccionado actualmente para el gráfico
  const [selectedYear, setSelectedYear] = useState<YearKey>("2025");

  // Función para obtener dinámicamente los datos del gráfico y los colores según el año seleccionado
  const getChartData = (year: YearKey): MonthlyChartData => {
    const dataForYear = monthlyPerformanceData[year];
    const backgroundColors = dataForYear.data.map(
      (value) => (value < 0 ? "#D9534F" : "#2CA58D") // Rojo para negativo, verde para positivo
    );

    return {
      labels: dataForYear.labels,
      datasets: [
        {
          label: "Cambio Mensual",
          data: dataForYear.data,
          backgroundColor: backgroundColors,
          borderColor: backgroundColors, // El color del borde coincide con el fondo para barras sólidas
          borderWidth: 1,
        },
      ],
    };
  };

  // Obtiene los datos para el año seleccionado actualmente
  const currentChartData = getChartData(selectedYear);

  // Estas son tus variables de datos de tablero existentes, sin cambios
  const featuredKpis = {
    netProfit: {
      value: 645,
      label: "Beneficio Neto",
      isPositive: true,
    },
    profitFactor: {
      value: 1.3,
      label: "Factor de Beneficio",
      isPositive: true,
    },
    winRate: {
      value: 64.8,
      label: "Ratio de Ganancia",
      unit: "%",
      isPositive: true,
    },
    riskRewardRatio: {
      value: "1:1.07",
      label: "Ratio Riesgo/Beneficio",
      isPositive: true,
    },
  };

  const insights = [
    {
      value: 118.22,
      label: "Mejor Ganancia Histórica",
      icon: "https://i.ibb.co/h1fSg8sb/best-profit.png",
      unit: "USD",
    },
    {
      value: 7,
      label: "Máximos Trades Ganados Consecutivamente",
      icon: "https://i.ibb.co/cS3FMWz7/streak-win.png",
    },
    {
      value: 2,
      label: "Máximos Trades Perdidos Consecutivamente",
      icon: "https://i.ibb.co/HTSkPgPn/streak-loss.png",
    },
    {
      value: 166,
      label: "Total de Trades",
      icon: "https://i.ibb.co/XZ9P2yxT/total-trades.png",
    },
    {
      value: 8,
      label: "Longs Consecutivos",
      icon: "https://i.ibb.co/C3q0CNVR/longs.png",
    },
    {
      value: 6,
      label: "Shorts Consecutivos",
      icon: "https://i.ibb.co/0wLcy8p/shorts.png",
    },
    {
      value: 45,
      label: "Riesgo Monetario Promedio",
      icon: "https://i.ibb.co/GfPB4D1W/risk-money.png",
      unit: "USD",
    },
    {
      value: 166,
      label: "Ganancia Monetaria Promedio",
      icon: "https://i.ibb.co/qMNKQv5f/average-win.png",
      unit: "USD",
    },
  ];

  const portfolioPerformanceData = {
    labels: [
      "Día 1",
      "Día 5",
      "Día 10",
      "Día 15",
      "Día 20",
      "Día 25",
      "Día 30",
    ],
    datasets: [
      {
        label: "Balance",
        data: [0, 100, 300, 550, 700, 950, 1148], // Datos de ejemplo que imitan el gráfico
        borderColor: "#2CA58D", // Verde
        backgroundColor: "rgba(44, 165, 141, 0.2)", // Relleno verde claro
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const portfolioAllocationData = {
    labels: ["Nasdaq", "SP500"],
    data: [28.6, 42.9],
    colors: ["#0C422C", "#149266"], // Verdes más oscuros a más claros
  };

  const strategyPerformanceData = {
    strategies: [
      { name: "Nasdaq", profit: 395, loss: 150 },
      { name: "SP500", profit: 180, loss: 10 },
    ],
    mostProfitable: "Nasdaq",
    leastProfitable: "SP500",
    mostUsed: "Nasdaq",
  };

  // Asegura que el tipo de 'side' sea "Compra" | "Venta"
  type TradeSide = "Compra" | "Venta";
  interface Trade {
    id: number;
    asset: string;
    side: TradeSide;
    date: string;
    time: string;
    duration: string;
    entryPrice: number;
    netProfit: number;
  }

  const detailedTradesData: Trade[] = [
    {
      id: 1,
      asset: "Nasdaq",
      side: "Compra",
      date: "23/07/2025",
      time: "10:42:01",
      duration: "9m 20s",
      entryPrice: 23172,
      netProfit: 28,
    },
    {
      id: 2,
      asset: "Nasdaq",
      side: "Compra",
      date: "23/07/2025",
      time: "10:42:01",
      duration: "9m 20s",
      entryPrice: 23172,
      netProfit: -165,
    },
    {
      id: 3,
      asset: "SP500",
      side: "Compra",
      date: "23/07/2025",
      time: "10:37:37",
      duration: "1h 14m 44s",
      entryPrice: 6357.75,
      netProfit: 280,
    },
    {
      id: 4,
      asset: "SP500",
      side: "Compra",
      date: "23/07/2025",
      time: "10:37:37",
      duration: "1h 14m 44s",
      entryPrice: 6357.75,
      netProfit: -42.5,
    },
    {
      id: 5,
      asset: "SP500",
      side: "Compra",
      date: "23/07/2025",
      time: "10:37:37",
      duration: "1h 14m 44s",
      entryPrice: 6357.75,
      netProfit: 42.5,
    },
    {
      id: 6,
      asset: "Nasdaq",
      side: "Compra",
      date: "23/07/2025",
      time: "10:20:34",
      duration: "9m 24s",
      entryPrice: 6357.75,
      netProfit: 595,
    },
  ];

  return (
    <div className="flex flex-col items-center p-5 bg-gray-50 text-gray-700 min-h-screen pt-15 md:pt-15">
      <div className="w-full max-w-7xl mx-auto">
        {/* Nueva Tarjeta de Identificación del Operador */}
        <div className="bg-white rounded-lg shadow-xl mb-8 p-6 md:p-8 relative overflow-hidden border-2 border-[#0A2342] bg-gradient-to-br from-[#1A3A5E] to-[#0A2342] text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between">
            {/* Foto del Operador */}
            <div className="flex-shrink-0 mb-6 md:mb-0 md:mr-8">
              <div className="w-32 h-40 bg-gray-200 border-2 border-white shadow-lg rounded-md flex items-center justify-center overflow-hidden">
                <Image
                  src="https://i.ibb.co/2199yPR6/luis-riofrio.jpg"
                  alt="Foto de Luis Riofrío"
                  className="w-full h-full object-cover"
                  width={128}
                  height={160}
                />
              </div>
            </div>

            {/* Información del Operador */}
            <div className="flex-grow text-center md:text-left">
              <h1 className="text-3xl md:text-4xl font-extrabold text-[#2CA58D] mb-1">
                OPERATIVA
              </h1>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
                Track Record - Luis Riofrío
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-6 text-sm md:text-base">
                <div className="flex items-center">
                  <span className="font-semibold text-gray-300 w-28">
                    Edad:
                  </span>
                  <span className="ml-2 font-normal text-white">34 años</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-300 w-28">
                    Activos:
                  </span>
                  <span className="ml-2 font-normal text-white">
                    Nasdaq, S&P 500
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-300 w-28">
                    Tipo de Trading:
                  </span>
                  <span className="ml-2 font-normal text-white">Intradía</span>
                </div>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-300 w-28">
                    Horario Operativo:
                  </span>
                  <span className="ml-2 font-normal text-white">
                    Horario americano
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Filtros */}
        <div className="bg-white rounded-lg shadow-xl mb-8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2 items-center">
              <label
                htmlFor="period-filter"
                className="text-gray-700 text-sm font-semibold"
              >
                Período:
              </label>
              <select
                id="period-filter"
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
              >
                <option>Mes actual</option>
                <option>Ene 2025</option>
                <option>Feb 2025</option>
                <option>Mar 2025</option>
                <option>Abr 2025</option>
                <option>May 2025</option>
                <option>Jun 2025</option>
                <option>Jul 2025</option>
                <option>Ago 2025</option>
                <option>Sep 2025</option>
                <option>Oct 2025</option>
                <option>Nov 2025</option>
                <option>Dic 2025</option>
              </select>
              <label
                htmlFor="account-filter"
                className="text-gray-700 text-sm font-semibold"
              >
                Activo:
              </label>
              <select
                id="account-filter"
                className="p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-sm"
              >
                <option>Todos los Activos</option>
                <option>Nasdaq</option>
                <option>SP500</option>
              </select>
            </div>
            <div className="flex gap-2 items-center">
              <button className="flex items-center px-4 py-2 bg-[#2CA58D] text-white font-semibold rounded-md shadow-md hover:bg-opacity-90 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L4.293 6.707A1 1 0 014 6V3z"
                    clipRule="evenodd"
                  />
                </svg>
                Filtrar
              </button>
              <button className="px-3 py-2 bg-gray-200 text-gray-700 rounded-md shadow-sm hover:bg-gray-300 transition-colors duration-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M23 4v6h-6" />
                  <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                </svg>
              </button>
            </div>
            <div className="flex space-x-2">
              <span className="flex items-center text-[#2CA58D] text-sm">
                <span className="w-3 h-3 rounded-full bg-[#2CA58D] mr-1"></span>{" "}
                Rentable
              </span>
              <span className="flex items-center text-[#D9534F] text-sm">
                <span className="w-3 h-3 rounded-full bg-[#D9534F] mr-1"></span>{" "}
                Pérdida
              </span>
              <span className="flex items-center text-gray-500 text-sm">
                <span className="w-3 h-3 rounded-full bg-gray-400 mr-1"></span>{" "}
                Neutral
              </span>
            </div>
          </div>
        </div>

        {/* Sección de Métricas Destacadas*/}
        <SummarySection featuredKpis={featuredKpis} insights={insights} />

        {/* Estadísticas de Portafolio */}
        <div className="bg-white rounded-lg shadow-xl mb-8 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#0A2342] mb-6">
            Estadísticas de Portafolio
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">
                Pérdidas/Ganancias del Portafolio
              </h3>
              <p className="text-gray-600 mb-4">
                Cómo ha sido mi rendimiento a lo largo del tiempo (Balance).
              </p>
              <div className="h-64">
                <PerformanceChart
                  data={portfolioPerformanceData}
                  chartType="line"
                />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3 text-center">
                Asignación del Portafolio
              </h3>
              <p className="text-gray-600 mb-4 text-center">
                Qué tanto opero cada activo de mi portafolio.
              </p>
              <div className="h-64 flex justify-center items-center">
                <PerformanceChart
                  data={{
                    labels: portfolioAllocationData.labels,
                    datasets: [
                      {
                        data: portfolioAllocationData.data,
                        backgroundColor: portfolioAllocationData.colors,
                        borderColor: "#FFFFFF",
                        borderWidth: 2,
                      },
                    ],
                  }}
                  chartType="doughnut"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas de Estrategia por Activo */}
        <div className="bg-white rounded-lg shadow-xl mb-8 p-6 md:p-8">
          <StrategyBreakdown data={strategyPerformanceData} />
        </div>

        {/* SECCIÓN DE ANALÍTICAS MENSUALES - POSICIONADA ANTES DE INFORMACIÓN DETALLADA */}
        <div className="bg-white rounded-lg shadow-xl mb-8 p-6 md:p-8">
          <h2 className="text-2xl font-bold text-[#0A2342] mb-6">
            Analíticas Mensuales
          </h2>
          {/* Botones de selección de año */}
          <div className="flex space-x-2 mb-6">
            {Object.keys(monthlyPerformanceData).map((year) => (
              <button
                key={year}
                onClick={() => setSelectedYear(year as YearKey)}
                className={`px-4 py-2 rounded-md font-semibold transition-colors duration-200 ${
                  selectedYear === year
                    ? "bg-[#0A2342] text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {year}
              </button>
            ))}
          </div>
          <div className="h-64">
            {/* Altura fija para el contenedor del gráfico */}
            <MonthlyAnalyticsChart
              data={currentChartData}
              // 'year' se eliminó de las props porque no se usa en este componente
            />
          </div>
        </div>

        {/* Información Detallada*/}
        <div className="bg-white rounded-lg shadow-xl mb-8 p-6 md:p-8">
          <TradesTable trades={detailedTradesData} />
        </div>

        <footer className="text-center mt-12 pt-8 border-t border-gray-300">
          <h3 className="font-bold mb-2">Aviso Legal</h3>
          <p className="text-xs text-gray-500 max-w-4xl mx-auto">
            El contenido de este informe tiene fines puramente educativos e
            informativos y no constituye en ningún caso asesoramiento de
            inversión. La operativa con futuros implica un alto grado de riesgo
            y puede no ser adecuada para todos los inversores. Existe la
            posibilidad de que se incurra en pérdidas que superen la inversión
            inicial. Los resultados pasados no son indicativos de resultados
            futuros.
          </p>
        </footer>
      </div>
    </div>
  );
}
