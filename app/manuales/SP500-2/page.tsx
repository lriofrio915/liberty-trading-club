// app/manuales/SP500-2/page.tsx

export const metadata = {
  title: "Manual Estrategia ES - Pulso Bursátil",
  description: "Manual detallado de la estrategia de trading para futuros E-mini S&P 500 (ES).",
};

export default function ManualESPage() {
  return (
    <div className="container mx-auto p-8 pt-20 max-w-4xl"> {/* pt-20 para el navbar fijo */}
      <h1 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-4">Hola Manual ES</h1>
      <p className="text-lg text-gray-700 mb-6">
        Este es el contenido del manual de la **Estrategia E-mini S&P 500 (ES)**.
      </p>
      <p className="text-gray-600">
        Sumérgete en la estrategia diseñada para el futuro ES, con un enfoque en su liquidez, tamaño de contrato y las técnicas de trading más adecuadas para maximizar las oportunidades en este mercado.
      </p>
      {/* Puedes añadir más contenido aquí */}
    </div>
  );
}