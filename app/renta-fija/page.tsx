"use client";

import React from "react";
import {
  CheckCircle2,
  DollarSign,
  CalendarDays,
  TrendingUp,
  ShieldCheck,
  Handshake,
} from "lucide-react"; // Iconos para los beneficios

export default function FixedIncomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-16 px-4 font-inter">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-blue-100">
        {/* Header Section */}
        <div className="bg-blue-700 text-white p-8 text-center rounded-t-xl">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Invierte en <span className="text-yellow-300">Renta Fija</span> con
            SG Consulting Group
          </h1>
          <p className="text-xl md:text-2xl font-light">
            Asegura tu futuro financiero con rendimientos estables y confiables.
          </p>
        </div>

        {/* Introduction and Benefits Section */}
        <div className="p-8">
          <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
            ¿Por qué elegir la Renta Fija?
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
            La inversión en renta fija es una estrategia sólida para quienes
            buscan seguridad y predictibilidad en sus retornos. Con SG
            Consulting Group, accedes a oportunidades exclusivas que combinan
            estabilidad y atractiva rentabilidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Benefit Card 1 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <CheckCircle2 className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Seguridad y Estabilidad
                </h3>
                <p className="text-gray-700">
                  Minimiza la exposición a la volatilidad del mercado con
                  inversiones que ofrecen retornos predecibles. Ideal para
                  proteger tu capital.
                </p>
              </div>
            </div>
            {/* Benefit Card 2 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <TrendingUp className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Rendimientos Atractivos
                </h3>
                <p className="text-gray-700">
                  Accede a ofertas de rentabilidad competitivas que superan las
                  opciones tradicionales de ahorro.
                </p>
              </div>
            </div>
            {/* Benefit Card 3 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <ShieldCheck className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Diversificación de Cartera
                </h3>
                <p className="text-gray-700">
                  Complementa tus inversiones de mayor riesgo y equilibra tu
                  portafolio para un crecimiento sostenido.
                </p>
              </div>
            </div>
            {/* Benefit Card 4 */}
            <div className="bg-blue-50 p-6 rounded-lg shadow-md flex items-start space-x-4">
              <Handshake className="h-8 w-8 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Asesoría Profesional
                </h3>
                <p className="text-gray-700">
                  Cuenta con el respaldo y la experiencia de SG Consulting Group
                  para tomar las mejores decisiones.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SG Consulting Group Offer Section */}
        <div className="bg-blue-600 text-white p-8 rounded-b-xl">
          <h2 className="text-3xl font-bold text-center mb-6">
            Nuestra Oferta Exclusiva con SG Consulting Group
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-8">
            <div className="bg-blue-700 p-6 rounded-lg shadow-md">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-2xl font-semibold mb-1">
                Rentabilidad Anual
              </h3>
              <p className="text-4xl font-extrabold text-yellow-300">15%</p>
              <p className="text-sm mt-2">
                Sujeto a ajustes por tasas de interés internacionales de EE.UU.
                y monto de capital invertido.
              </p>
            </div>
            <div className="bg-blue-700 p-6 rounded-lg shadow-md">
              <DollarSign className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-2xl font-semibold mb-1">Inversión Mínima</h3>
              <p className="text-4xl font-extrabold text-yellow-300">
                1,000 USD
              </p>
              <p className="text-sm mt-2">
                Accesible para pequeños y grandes inversionistas.
              </p>
            </div>
            <div className="bg-blue-700 p-6 rounded-lg shadow-md">
              <CalendarDays className="h-12 w-12 mx-auto mb-3 text-yellow-300" />
              <h3 className="text-2xl font-semibold mb-1">Plazos Flexibles</h3>
              <p className="text-4xl font-extrabold text-yellow-300">
                7 o 13 Meses
              </p>
              <p className="text-sm mt-2">
                Elige el periodo que mejor se adapte a tus objetivos.
              </p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <p className="text-lg mb-6">
              Para más información detallada y comenzar a invertir, visita la
              página oficial de SG Consulting Group:
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <a
                href="https://sgconsulting.site/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-yellow-400 text-blue-900 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-300 transition-colors duration-300 shadow-lg transform hover:scale-105"
              >
                Visitar SG Consulting Group
              </a>
              <a
                href="https://sgconsulting.site/descubre/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 hover:text-blue-900 transition-colors duration-300 transform hover:scale-105"
              >
                Descubre Más
              </a>
              <a
                href="https://sgconsulting.site/sg-miami/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-transparent border-2 border-yellow-400 text-yellow-400 font-bold py-3 px-8 rounded-full text-lg hover:bg-yellow-400 hover:text-blue-900 transition-colors duration-300 transform hover:scale-105"
              >
                SG Miami
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
