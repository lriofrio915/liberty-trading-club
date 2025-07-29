// app/manuales/Nasdaq/page.tsx

export const metadata = {
  title: "Manual Estrategia NQ - Pulso Bursátil",
  description: "Manual detallado de la estrategia de trading para futuros Micro E-mini Nasdaq 100 (NQ).",
};

export default function ManualNasdaqPage() {
  return (
    <div className="container mx-auto p-8 pt-20 max-w-4xl"> {/* pt-20 para el navbar fijo */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-4">Hola Manual NQ</h1>
      <p className="text-lg text-gray-700 mb-6">
        Este es el contenido del manual de la **Estrategia Nasdaq (NQ)**.
      </p>
      <p className="text-gray-600">
        Aquí podrás encontrar todos los detalles sobre la metodología, indicadores, gestión de riesgo y ejemplos prácticos relacionados con las operaciones en futuros Micro E-mini Nasdaq 100.
      </p>
      {/* Puedes añadir más contenido aquí */}
    </div>
  );
}