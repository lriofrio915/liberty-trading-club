import Image from "next/image";
import ScrollToTopButton from "@/components/ScrollToTopButton";

export const metadata = {
  title:
    "Liberty Trading Club | Entrenamiento Profesional en Trading de Futuros",
  description:
    "Únete al exclusivo club de trading dirigido por Luis Riofrio, operador de Emporium Quality Funds. Estrategias reales, mentorías en vivo y preparación para el SIE Exam.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center bg-gray-50 text-gray-800 min-h-screen relative">
      <ScrollToTopButton />
      {/* Sección Hero */}
      <header className="w-full max-w-7xl mx-auto mt-10 p-5">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 relative text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-6">
            <Image
              src="https://i.ibb.co/xqwwYbhz/liberty.png"
              alt="Liberty Trading Club Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#1E3A8A] shadow-md mb-3"
              width={80}
              height={80}
            />
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#1E3A8A] mb-2 leading-tight">
              Bienvenido a{" "}
              <span className="text-[#3B82F6]">Liberty Trading Club</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              El único club donde transformarás tu trading con estrategias
              reales aplicadas en un fondo de inversión.
            </p>
          </div>

          <div className="flex justify-center mb-6">
            <Image
              src="https://i.ibb.co/hx4PtFPq/Emporium.png"
              alt="Luis Riofrio en el trading floor"
              className="rounded-lg shadow-md"
              width={400}
              height={250}
            />
          </div>

          <p className="text-justify text-gray-700 text-sm md:text-base mb-4 mx-auto max-w-2xl">
            Dirigido por{" "}
            <span className="font-bold text-[#1E3A8A]">Luis Riofrio</span>,
            operador profesional en Emporium Quality Funds, te ofrecemos un{" "}
            <span className="font-semibold">acompañamiento real</span> con
            reuniones semanales, mentorías personalizadas y preparación para el
            SIE Exam.
          </p>

          <a
            href="#beneficios"
            className="px-8 py-3 bg-[#1E3A8A] text-white font-semibold rounded-full shadow-lg hover:bg-[#3B82F6] transition duration-300 ease-in-out inline-block"
          >
            CONOCE LOS BENEFICIOS
          </a>
        </div>
      </header>

      {/* Sección Mentor */}
      <section className="w-full max-w-7xl mx-auto my-16 px-5">
        <div className="bg-gradient-to-r from-[#1E3A8A] to-[#3B82F6] rounded-xl shadow-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="md:w-1/3 flex justify-center">
              <Image
                src="https://i.ibb.co/2199yPR6/luis-riofrio.jpg"
                alt="Luis Riofrio"
                className="rounded-full border-4 border-white shadow-xl"
                width={250}
                height={250}
              />
            </div>
            <div className="md:w-2/3">
              <h2 className="text-3xl font-bold mb-4">Luis Riofrio</h2>
              <h3 className="text-xl text-blue-100 mb-6">
                Operador en Emporium Quality Funds | Fundador de Liberty Trading
                Club
              </h3>
              <p className="mb-4">
                &quot;De ingeniero químico a operador profesional: Mi misión es
                guiarte con{" "}
                <span className="font-semibold">métodos reales</span> que aplico
                diariamente en un fondo de inversión. No te dejaré a mitad del
                camino.&quot;
              </p>
              <ul className="list-disc list-inside space-y-2">
                <li>6 años operando futuros de Nasdaq y SP500</li>
                <li>Operador en Emporium Quality Funds</li>
                <li>Certificación SIE en proceso (FINRA)</li>
                <li>Formación en Bloomberg Market Concepts</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <main id="beneficios" className="w-full max-w-7xl mx-auto py-16 px-5">
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#1E3A8A] text-center mb-16">
          Beneficios Exclusivos del Club
        </h2>

        {/* Sección 1: Reuniones Semanales */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-6">
              1. Reuniones Semanales en Vivo
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Cada fin de semana nos reunimos para{" "}
              <span className="font-semibold text-[#1E3A8A]">
                analizar mercados
              </span>{" "}
              y{" "}
              <span className="font-semibold text-[#1E3A8A]">
                fortalecer tu formación
              </span>
              :
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <span className="font-medium text-[#1E3A8A]">
                  Sábados 8PM (EC):
                </span>{" "}
                Review de operaciones de la semana y oportunidades en
                Nasdaq/SP500
              </li>
              <li>
                <span className="font-medium text-[#1E3A8A]">
                  Sábados 9PM (EC):
                </span>{" "}
                Sesión de aprendizaje teórico (NinjaTrader, gestión de riesgo)
              </li>
              <li>
                <span className="font-medium text-[#1E3A8A]">
                  Domingos 8PM (EC):
                </span>{" "}
                Preparación para el SIE Exam (certificación profesional)
              </li>
            </ul>
            <a
              href="https://pay.hotmart.com/R33067457O?sck=HOTMART_PRODUCT_PAGE&off=0k5nqz4n&hotfeature=32&bid=1755472180427"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 bg-[#1E3A8A] text-white font-medium rounded-full shadow hover:bg-[#3B82F6] transition duration-300 inline-block"
            >
              UNIRME AL CLUB
            </a>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/8kg8fg9/Mentoring.png"
              alt="Reuniones semanales"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección 2: Estrategias Reales */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row-reverse items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-6">
              2. Estrategias de un Fondo Real
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Accede a{" "}
              <span className="font-semibold text-[#1E3A8A]">
                3 estrategias probadas
              </span>{" "}
              y que funcionan:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>1 estrategia especializada en Nasdaq</li>
              <li>2 estrategias para SP500</li>
              <li>Enfoque Macro-Técnico (fundamental + técnico)</li>
              <li>Manuales detallados con reglas de entrada/salida</li>
            </ul>
            <a
              href="https://pay.hotmart.com/R33067457O?sck=HOTMART_PRODUCT_PAGE&off=0k5nqz4n&hotfeature=32&bid=1755472180427"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 bg-[#1E3A8A] text-white font-medium rounded-full shadow hover:bg-[#3B82F6] transition duration-300 inline-block"
            >
              ACCEDER A LAS ESTRATEGIAS
            </a>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/99MfWk5h/Herramientas.png"
              alt="Estrategias de trading"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección 3: Mentorías Personalizadas */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-6">
              3. Mentorías 1-a-1
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              <span className="font-semibold text-[#1E3A8A]">
                Acompañamiento real
              </span>{" "}
              - No estás solo en este proceso:
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>Sesiones personalizadas según tu nivel</li>
              <li>Revisión de tu operativa y track record</li>
              <li>Feedback continuo sobre tu progreso</li>
              <li>Resolución de dudas en tiempo real</li>
            </ul>
            <a
              href="https://pay.hotmart.com/R33067457O?sck=HOTMART_PRODUCT_PAGE&off=0k5nqz4n&hotfeature=32&bid=1755472180427"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 px-6 py-2 bg-[#1E3A8A] text-white font-medium rounded-full shadow hover:bg-[#3B82F6] transition duration-300 inline-block"
            >
              QUIERO MI MENTORÍA
            </a>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/nM0JB4SX/Software.png"
              alt="Mentorías personalizadas"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección Requisitos */}
        <section className="bg-gray-50 rounded-xl shadow-xl p-6 md:p-10 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] text-center mb-10">
            ¿Qué Necesitas Para Empezar?
          </h2>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-l-4 border-[#1E3A8A]">
              <h3 className="text-2xl font-bold text-[#1E3A8A] mb-4 flex items-center">
                <svg
                  className="w-6 h-6 mr-2 text-[#1E3A8A]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Requisitos Básicos
              </h3>
              <ul className="list-disc list-inside space-y-3 pl-5 text-gray-700">
                <li>
                  <span className="font-semibold">Dispositivo:</span>{" "}
                  Computadora con Windows (no compatible con Mac sin
                  configuración adicional)
                </li>
                <li>
                  <span className="font-semibold">Tiempo:</span> 5-10 horas
                  semanales para las sesiones y práctica
                </li>
                <li>
                  <span className="font-semibold">Capital inicial:</span> No es
                  necesario para comenzar (puedes empezar en demo)
                </li>
              </ul>
            </div>

            <h3 className="text-2xl font-bold text-[#1E3A8A] mb-6 text-center">
              Opciones para Acceder a Data de Mercado
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Opción 1 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-[#1E3A8A] font-bold">1</span>
                </div>
                <h4 className="font-bold text-lg text-center mb-3">
                  Cuentas Demo Gratuitas
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-4">
                  <li>NinjaTrader (7 días de data gratis)</li>
                  <li>Bulenox (15 días de data gratis)</li>
                  <li>Requiere crear cuentas con diferentes correos</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500 text-center">
                  Ideal para tus primeros 2-3 meses
                </p>
              </div>

              {/* Opción 2 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-[#1E3A8A] font-bold">2</span>
                </div>
                <h4 className="font-bold text-lg text-center mb-3">
                  Cuenta Real
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-4">
                  <li>Interactive Brokers o NinjaTrader</li>
                  <li>Mínimo recomendado: $3,000 USD</li>
                  <li>Data en tiempo real incluida</li>
                </ul>
                <p className="mt-3 text-xs text-gray-500 text-center">
                  Cuando tengas capital disponible
                </p>
              </div>

              {/* Opción 3 */}
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border-2 border-[#1E3A8A] relative">
                <div className="absolute -top-3 -right-3 bg-[#1E3A8A] text-white text-xs font-bold px-2 py-1 rounded">
                  RECOMENDADO
                </div>
                <div className="bg-blue-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4 mx-auto">
                  <span className="text-[#1E3A8A] font-bold">3</span>
                </div>
                <h4 className="font-bold text-lg text-center mb-3">
                  Pruebas de Fondeo
                </h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 pl-4">
                  <li>Apex, Bulenox u otras</li>
                  <li>Costo aproximado: $20/mes</li>
                  <li>Acceso a data profesional</li>
                  <li>Posibilidad de operar capital real</li>
                </ul>
                <p className="mt-3 text-xs text-center">
                  <span className="text-[#1E3A8A] font-semibold">
                    Inversión anual: ~$240 USD
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-10 bg-[#1E3A8A] text-white p-6 rounded-lg">
              <h4 className="text-xl font-bold mb-3 text-center">
                Nuestra Recomendación Profesional
              </h4>
              <p className="mb-4 text-center">
                &quot;Invierte en una evaluación de fondeo (opción 3) con mentalidad
                de{" "}
                <span className="font-semibold text-blue-100">
                  aprendizaje a largo plazo
                </span>
                . Considera los $20/mes como el costo de tu educación práctica:&quot;
              </p>
              <ul className="list-disc list-inside space-y-2 max-w-2xl mx-auto">
                <li>Practica 1 año completo por menos de $250</li>
                <li>Desarrolla un track record verificable</li>
                <li>
                  Si pasas la evaluación, obtendrás capital real para operar
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Módulos del Programa */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] text-center mb-10">
            Programa de Formación Completo
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Módulo 1: Fundamentos de Mercados Financieros",
              "Módulo 2: Vehículos de Inversión Profesionales",
              "Módulo 3: Plataformas y Cuentas de Trading",
              "Módulo 4: Análisis Fundamental Avanzado",
              "Módulo 5: Estrategias Técnicas para Futuros",
              "Módulo 6: NinjaTrader 8 - Configuración Profesional",
              "Módulo 7: Operativa en Demo y Gestión de Riesgo",
              "Módulo 8: Transición a Cuentas Reales",
              "Módulo 9: Psicotrading y Mentalidad",
            ].map((modulo, index) => (
              <div
                key={index}
                className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:border-[#1E3A8A] transition"
              >
                <h3 className="font-bold text-[#1E3A8A]">{modulo}</h3>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center py-10 px-5 w-full">
          <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-200">
            <h2 className="text-3xl md:text-4xl font-bold text-[#1E3A8A] mb-6">
              ¿Listo para Operar como un Profesional?
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Únete ahora a Liberty Trading Club y comienza tu transformación:
            </p>

            <div className="space-y-4">
              <a
                href="https://pay.hotmart.com/R33067457O?sck=HOTMART_PRODUCT_PAGE&off=0k5nqz4n&hotfeature=32&bid=1755472180427"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-4 bg-[#1E3A8A] hover:bg-[#3B82F6] text-white font-bold text-xl rounded-full shadow-xl transition duration-300 inline-block w-full"
              >
                ACCEDER AL PROGRAMA
              </a>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="font-semibold text-[#1E3A8A]">
                  Próximo inicio: 15 de cada mes
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Cupos limitados - Inscripciones abiertas
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#1E3A8A] py-8 px-5 text-center text-gray-300">
        <div className="max-w-7xl mx-auto">
          <p className="mb-4">
            &copy; {new Date().getFullYear()} Liberty Trading Club. Todos los
            derechos reservados.
          </p>
          <p className="text-sm">
            Dirigido por Luis Riofrio - Operador Financiero Profesional
          </p>
          <div className="mt-4 space-x-4">
            <a
              href="#"
              className="hover:text-white transition duration-300 text-sm"
            >
              Términos y Condiciones
            </a>
            <a
              href="#"
              className="hover:text-white transition duration-300 text-sm"
            >
              Política de Privacidad
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
