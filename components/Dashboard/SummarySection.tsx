// components/Dashboard/SummarySection.tsx
import KpiCard from "./KpiCard";

interface SummarySectionProps {
  featuredKpis: {
    netProfit: { value: number | string; label: string; isPositive: boolean };
    profitFactor: {
      value: number | string;
      label: string;
      isPositive: boolean;
    };
    winRate: {
      value: number | string;
      label: string;
      unit: string;
      isPositive: boolean;
    };
    riskRewardRatio: { value: string; label: string; isPositive: boolean };
  };
  insights: {
    value: number | string;
    label: string;
    icon: string;
    unit?: string;
  }[];
}

export default function SummarySection({
  featuredKpis,
  insights,
}: SummarySectionProps) {
  return (
    <div className="bg-white rounded-lg shadow-xl mb-8 p-6 md:p-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-[#0A2342] mb-4 md:mb-0">
          Información Destacada
        </h2>
      </div>

      {/* Fila de KPI principales (featuredKpis) */}
      {/* Ajustado a 4 columnas, ya que Swiset se eliminó, para que se distribuyan uniformemente */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard
          label={featuredKpis.netProfit.label}
          value={featuredKpis.netProfit.value}
          unit="USD"
          isPositive={featuredKpis.netProfit.isPositive}
        />
        <KpiCard
          label={featuredKpis.profitFactor.label}
          value={featuredKpis.profitFactor.value}
          isPositive={featuredKpis.profitFactor.isPositive}
        />
        <KpiCard
          label={featuredKpis.winRate.label}
          value={featuredKpis.winRate.value}
          unit={featuredKpis.winRate.unit}
          isPositive={featuredKpis.winRate.isPositive}
        />
        <KpiCard
          label={featuredKpis.riskRewardRatio.label}
          value={featuredKpis.riskRewardRatio.value}
          isPositive={featuredKpis.riskRewardRatio.isPositive}
        />
        {/* Eliminado el KpiCard para swisetRatio */}
      </div>

      {/* Insights Más Relevantes */}
      <h3 className="text-xl font-bold text-[#0A2342] mb-5 text-center">
        Insights Más Relevantes
      </h3>
      {/* CORRECCIÓN FINAL PARA EL TAMAÑO UNIFORME DE LOS INSIGHTS */}
      {/* Usamos grid-cols-fill o definimos las columnas y place-items-center para centrar las celdas */}
      {/* Definimos 4 columnas para desktop, y place-items-stretch para que los ítems llenen la celda */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 place-items-stretch">
        {insights.map((insight, index) => (
          <KpiCard
            key={index}
            label={insight.label}
            value={insight.value}
            unit={insight.unit}
            icon={insight.icon}
            isPositive={
              insight.label.includes("Ganancia") ||
              insight.label.includes("Ganados") ||
              insight.label.includes("Total de Trades") ||
              insight.label.includes("Longs Consecutivos")
                ? true
                : insight.label.includes("Perdidos") ||
                  insight.label.includes("Riesgo") ||
                  insight.label.includes("Shorts Consecutivos")
                ? false
                : undefined // Dejar indefinido si es neutral
            }
          />
        ))}
      </div>
    </div>
  );
}