"use client";

import React from "react";
import {
  DollarSign,
  BarChart3,
  BookOpen,
} from "lucide-react"; // Iconos para los temas

export default function CoursesPage() {
  const cryptoVideos = [
    {
      id: "HqGUkfGSNzg",
      title:
        "CÓMO ELABORAR un PORTAFOLIO de INVERSIÓN - ¡Portafolio de Criptoactivos en SIMPLES PASOS!",
      description:
        "Aprende a construir un portafolio de criptoactivos sólido y diversificado con pasos sencillos.",
    },
    {
      id: "fmYMKY-jopI",
      title:
        "✅ Como USAR las CRIPTOMONEDAS como medio de pago - Fácil y Rápido",
      description:
        "Descubre cómo utilizar tus criptomonedas para realizar pagos de forma sencilla y eficiente.",
    },
    {
      id: "KExbLLHSLWg",
      title:
        "CÓMO HACER TRADING de FUTUROS en BINANCE🏅*2024*🏅✅APRENDE PASO A PASO",
      description:
        "Guía completa para iniciar en el trading de futuros de criptomonedas en Binance, paso a paso.",
    },
  ];

  const cfdVideos = [
    {
      id: "nBlgJiUvYmY",
      title:
        "CÓMO ANALIZAR GRÁFICOS EN TRADINGVIEW: analizar gráficos de trading con ondas de elliott y fibonacci",
      description:
        "Domina el análisis técnico de gráficos en TradingView utilizando ondas de Elliott y Fibonacci.",
    },
    {
      id: "58NpUEaFe24",
      title:
        "🚀 Estrategias Ganadoras para Trading de Futuros y CFDs 📊 Nasdaq y Euro 💰",
      description:
        "Explora estrategias efectivas para operar futuros y CFDs en mercados como el Nasdaq y el Euro.",
    },
    {
      id: "2r58CkfPoWE",
      title:
        "🌟 ¡Domina Una Estrategia de Trading con RSI y Velas Japonesas! 💹 [Día 1]",
      description:
        "Inicia tu aprendizaje de una estrategia de trading potente con el RSI y patrones de velas japonesas.",
    },
    {
      id: "5Bxd5qZsH7I",
      title:
        "🌟 ¡Domina Una Estrategia de Trading con RSI y Velas Japonesas! 💹 [Día 2]",
      description:
        "Continúa profundizando en la estrategia de trading con RSI y velas japonesas, con más detalles y ejemplos.",
    },
    {
      id: "le6CtG6Fke8",
      title:
        "🌟 ¡Domina Una Estrategia de Trading con RSI y Velas Japonesas! 💹 [Día 3]",
      description:
        "Completa tu dominio de la estrategia de trading con RSI y velas japonesas, aplicando todo lo aprendido.",
    },
    {
      id: "_KiOzecQRbs",
      title:
        "💸 Educación Financiera 100% Práctica 🎓 | Abre tu Cuenta en Duo Markets y Usa el RSI para Invertir 🚀",
      description:
        "Guía práctica para abrir una cuenta en Duo Markets y aplicar el indicador RSI en tus inversiones.",
    },
  ];

  const YouTubeVideo = ({
    videoId,
    title,
    description,
  }: {
    videoId: string;
    title: string;
    description: string;
  }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition-transform duration-300 hover:scale-105 hover:shadow-xl border border-gray-200">
      <div
        className="relative"
        style={{ paddingBottom: "56.25%" /* 16:9 Aspect Ratio */ }}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1`} // Added parameters
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          aria-label={`Video de YouTube: ${title}`}
        ></iframe>
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 font-inter">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-10 text-center border border-blue-100">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            <BookOpen className="inline-block h-10 w-10 text-blue-600 mr-3" />
            Cursos <span className="text-blue-600">Gratis</span> de Trading
          </h1>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Accede a contenido educativo de alto valor para potenciar tus
            conocimientos en el mundo de las inversiones y el trading.
          </p>
        </div>

        {/* Crypto Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <DollarSign className="h-8 w-8 text-green-600 mr-3" />
            Criptoactivos
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Corrected: Pass video.id as videoId prop */}
            {cryptoVideos.map((video) => (
              <YouTubeVideo
                key={video.id}
                videoId={video.id}
                title={video.title}
                description={video.description}
              />
            ))}
          </div>
        </div>

        {/* CFDs Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600 mr-3" />
            CFDs en Divisas y Metales
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Corrected: Pass video.id as videoId prop */}
            {cfdVideos.map((video) => (
              <YouTubeVideo
                key={video.id}
                videoId={video.id}
                title={video.title}
                description={video.description}
              />
            ))}
          </div>
        </div>

        {/* Call to Action for more learning */}
        <div className="bg-blue-600 text-white p-8 rounded-xl shadow-lg text-center border border-blue-700">
          <h2 className="text-3xl font-bold mb-4">
            ¿Listo para llevar tu trading al siguiente nivel?
          </h2>
          <p className="text-lg mb-6">
            Estos cursos son solo el inicio. Explora nuestras estrategias
            avanzas y análisis de mercado.
          </p>
          <a
            href="/contacto" // Puedes cambiar esto a una página de contacto o de cursos premium
            className="inline-block bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-300 transition-colors duration-300 shadow-lg transform hover:scale-105"
          >
            Contáctanos para Asesoría Personalizada
          </a>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>
            © {new Date().getFullYear()} Liberty Trading Club. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
