import PerformanceChart from './PerformanceChart'; 
interface StrategyBreakdownProps {
  data: {
    strategies: { name: string; profit: number; loss: number; }[];
    mostProfitable: string;
    leastProfitable: string;
    mostUsed: string;
  };
}

export default function StrategyBreakdown({ data }: StrategyBreakdownProps) {
  const chartData = {
    labels: data.strategies.map(s => s.name),
    datasets: [
      {
        label: 'Profit',
        data: data.strategies.map(s => s.profit),
        backgroundColor: '#2CA58D', // Verde
        borderColor: '#2CA58D',
        borderWidth: 1,
      },
      {
        label: 'Losses',
        data: data.strategies.map(s => -s.loss), // Losses como valores negativos para barras
        backgroundColor: '#D9534F', // Rojo
        borderColor: '#D9534F',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    indexAxis: 'y' as const, // Makes bars horizontal
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        stacked: true, 
        grid: { display: false },
        ticks: { color: '#0A2342' },
      },
      y: {
        stacked: true, 
        grid: { display: false },
        ticks: { color: '#0A2342' },
      },
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#0A2342',
        }
      },
    },
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-[#0A2342] mb-6">Estadísticas por Activo</h2>
      <p className="text-gray-600 mb-4">Cuáles son los activos donde gano y pierdo más.</p>
      <div className="h-64 mb-6"> {/* Altura para el gráfico */}
        <PerformanceChart data={chartData} chartType="bar" options={chartOptions} />
      </div>
      <div className="flex flex-col md:flex-row justify-around text-center gap-4 text-gray-800">
        <div className="bg-gray-100 p-3 rounded-md shadow-sm">
          <p className="text-sm font-semibold">Activo Más Rentable:</p>
          <p className="font-bold text-[#2CA58D]">{data.mostProfitable}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-md shadow-sm">
          <p className="text-sm font-semibold">Activo Menos Rentable:</p>
          <p className="font-bold text-[#D9534F]">{data.leastProfitable}</p>
        </div>
        <div className="bg-gray-100 p-3 rounded-md shadow-sm">
          <p className="text-sm font-semibold">Activo Más Usada:</p>
          <p className="font-bold text-[#0A2342]">{data.mostUsed}</p>
        </div>
      </div>
    </div>
  );
}