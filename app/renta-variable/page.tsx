"use client";

import React from "react";
import { LineChart, Users, Building2, Target, Clock, Zap } from "lucide-react"; // Iconos para los beneficios

export default function VariableIncomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-16 px-4 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-purple-100">
        {/* Header Section */}
        <div className="bg-purple-700 text-white p-8 text-center rounded-t-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Potencia tu Capital en{" "}
            <span className="text-yellow-300">Renta Variable</span> con Emporium
            Quality Funds
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Busca el crecimiento a largo plazo superando al mercado.
          </p>
        </div>

        {/* Introduction and Benefits Section */}
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            ¿Por qué invertir en Renta Variable?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
            La inversión en renta variable ofrece el potencial de un crecimiento
            significativo de capital a largo plazo. Con Emporium Quality Funds,
            te posicionas para participar en el dinamismo del mercado con una
            gestión experta.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Benefit Card 1 */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <LineChart className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Potencial de Alto Crecimiento
                </h3>
                <p className="text-gray-700">
                  Participa en el crecimiento de las empresas líderes y busca
                  retornos que superen la inflación y otras inversiones.
                </p>
              </div>
            </div>
            {/* Benefit Card 2 */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <Clock className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Visión a Largo Plazo
                </h3>
                <p className="text-gray-700">
                  Ideal para objetivos financieros a largo plazo, permitiendo
                  que el interés compuesto maximice tus ganancias.
                </p>
              </div>
            </div>
            {/* Benefit Card 3 */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <Target className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Superar al Mercado
                </h3>
                <p className="text-gray-700">
                  Nuestra estrategia busca consistentemente superar el
                  rendimiento de índices de referencia como el S&P 500.
                </p>
              </div>
            </div>
            {/* Benefit Card 4 */}
            <div className="bg-purple-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <Zap className="h-8 w-8 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Gestión Activa y Experta
                </h3>
                <p className="text-gray-700">
                  El equipo de Emporium Quality Funds gestiona activamente tu
                  inversión, adaptándose a las condiciones del mercado.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Emporium Quality Funds Offer Section */}
        <div className="bg-purple-600 text-white p-8 rounded-b-xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Inversión en Renta Variable con Emporium Quality Funds
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-center mb-8">
            <div className="bg-purple-700 p-6 rounded-lg shadow-md">
              <Users className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-2xl font-semibold mb-1">
                Inversión Mínima (Personas Naturales)
              </h3>
              <p className="text-4xl font-extrabold text-yellow-300">
                10,000 USD
              </p>
              <p className="text-sm mt-2">
                Acceso a oportunidades de crecimiento para inversionistas
                individuales.
              </p>
            </div>
            <div className="bg-purple-700 p-6 rounded-lg shadow-md">
              <Building2 className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-2xl font-semibold mb-1">
                Inversión Mínima (Clientes Institucionales)
              </h3>
              <p className="text-4xl font-extrabold text-yellow-300">
                100,000 USD
              </p>
              <p className="text-sm mt-2">
                Soluciones de inversión escalables para grandes capitales.
              </p>
            </div>
          </div>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">
              Rendimiento y Expectativas
            </h3>
            <p className="text-lg mb-2">
              El rendimiento en renta variable es **variable** y la inversión
              está orientada al **largo plazo**.
            </p>
            <p className="text-lg mb-4">
              Nuestro objetivo es **superar al mercado** (nuestro benchmark es
              el S&P 500). Estimamos una rentabilidad promedio entre el{" "}
              <strong className="text-yellow-300">25% y 30%</strong> anual, pero
              es importante recordar que:
            </p>
            <p className="text-md italic text-gray-200">
              &quot;Las estimaciones se basan en rendimientos pasados, y el
              rendimiento pasado no garantiza rendimientos futuros.&quot;
            </p>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-lg mb-6">
              Para obtener más información detallada sobre Emporium Quality
              Funds y cómo potenciar tu inversión, visita sus páginas oficiales:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="https://emporium.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-400 text-purple-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-300 transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Visitar Emporium Quality Funds
              </a>
              <a
                href="https://www.emporium.site/nosotros/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 hover:text-purple-900 transition-colors duration-300 transform hover:scale-105"
              >
                Conoce Más Sobre Nosotros
              </a>
              <a
                href="https://www.emporium.site/eqf/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 hover:text-purple-900 transition-colors duration-300 transform hover:scale-105"
              >
                Descubre EQF
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 text-center text-gray-600 text-sm">
          <p>
            © {new Date().getFullYear()} Liberty Trading Club. Todos los
            derechos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
