// app/manuales/SP500-1/page.tsx

export const metadata = {
  title: "Manual Estrategia MES - Pulso Bursátil",
  description: "Manual detallado de la estrategia de trading para futuros Micro E-mini S&P 500 (MES).",
};

export default function ManualMESPage() {
  return (
    <div className="container mx-auto p-8 pt-20 max-w-4xl"> {/* pt-20 para el navbar fijo */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-4">Hola Manual MES</h1>
      <p className="text-lg text-gray-700 mb-6">
        Este es el contenido del manual de la **Estrategia Micro E-mini S&P 500 (MES)**.
      </p>
      <p className="text-gray-600">
        Explora las particularidades de operar el futuro MES, incluyendo análisis, puntos de entrada y salida adaptados a este instrumento, y consideraciones específicas para su gestión.
      </p>
      {/* Puedes añadir más contenido aquí */}
    </div>
  );
}