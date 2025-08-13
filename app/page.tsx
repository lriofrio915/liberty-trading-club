import Image from "next/image";

export const metadata = {
  title: "Inicio - Senior Trader Program | Emporium Quality Funds",
  description:
    "Descubre el Senior Trader Program de Emporium Quality Funds: acceso a estrategias comprobadas, mentorías, herramientas de análisis y más para convertirte en un operador profesional.",
};

export default function HomePage() {
  return (
    <div className="flex flex-col items-center bg-gray-50 text-gray-800 min-h-screen">
      {/* Sección de Héroe/Bienvenida */}
      <header className="w-full max-w-7xl mx-auto mt-10 p-5">
        <div className="bg-white rounded-xl shadow-2xl p-6 md:p-10 relative text-center max-w-4xl mx-auto">
          <div className="flex flex-col items-center justify-center mb-6">
            <Image
              src="https://i.ibb.co/20RsFG5H/emporium-logo-1.jpg" // Placeholder para el logo
              alt="Emporium Quality Funds Logo"
              className="w-20 h-20 rounded-full object-cover border-2 border-[#0A2342] shadow-md mb-3"
              width={80}
              height={80}
            />
            <h1 className="text-3xl md:text-5xl font-extrabold text-[#0A2342] mb-2 leading-tight">
              Bienvenido al{" "}
              <span className="text-[#849E8F]">Senior Trader Program</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              El entrenamiento de Trading que te llevará a operar como un
              verdadero operador de un fondo de inversión.
            </p>
          </div>
          <p className="text-justify text-gray-700 text-sm md:text-base mb-4 mx-auto max-w-2xl">
            Desde el departamento macroeconómico de Emporium Quality Funds, te
            presentamos la transparencia y la excelencia de nuestras estrategias
            de trading. Todos nuestros resultados están respaldados por{" "}
            <span className="font-bold text-[#0A2342]">
              track records comprobados.
            </span>
          </p>
          <p className="text-justify text-gray-700 text-sm md:text-base mx-auto mb-8 max-w-2xl">
            Te invitamos a explorar los servicios exclusivos a los que tendrás
            acceso con tu suscripción, diseñados para transformar tu operativa y
            desbloquear tu máximo potencial en los mercados financieros.
          </p>

          <a
            href="#programa-secciones"
            className="px-8 py-3 bg-[#0A2342] text-white font-semibold rounded-full shadow-lg hover:bg-[#1A3A5A] transition duration-300 ease-in-out inline-block"
          >
            DESCUBRE EL PROGRAMA
          </a>
        </div>
      </header>

      {/* Contenedor principal de las secciones de productos */}
      <main
        id="programa-secciones"
        className="w-full max-w-7xl mx-auto py-16 px-5"
      >
        <h2 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] text-center mb-16">
          Beneficios Exclusivos de Tu Suscripción
        </h2>

        {/* Sección 1: Acceso a Estrategias de Primer Nivel */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-6">
              1. Estrategias de Trading de Vanguardia
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Accede a{" "}
              <span className="font-semibold text-[#0A2342]">
                estrategias de primer nivel, comprobadas y aplicadas día a día
              </span>{" "}
              en Emporium Quality Funds. Estas estrategias son desarrolladas por
              operadores profesionales con un track record visible y auditable
              en nuestra plataforma.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <span className="font-medium text-[#0A2342]">
                  Conoce a los Operadores:
                </span>{" "}
                Su estilo, activos e instrumentos financieros favoritos.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Manuales Detallados:
                </span>{" "}
                Accede al manual completo de cada estrategia.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Diversidad de Mercados:
                </span>{" "}
                Estrategias para CFDs de divisas e índices, y futuros de índices
                americanos.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Transparencia Total:
                </span>{" "}
                Revisa las métricas, el track record y los informes mensuales de
                aplicación de cada estrategia.
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/JjJ7WC42/Estrategia-de-vanguardia.png" // Placeholder
              alt="Estrategias de Trading de Vanguardia"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección 2: Mentorías Individuales o Grupales */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row-reverse items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-6">
              2. Mentorías Personalizadas y de Grupo
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Mientras tu suscripción esté activa, tendrás acceso a{" "}
              <span className="font-semibold text-[#0A2342]">
                mentorías individuales o grupales
              </span>{" "}
              con nuestros operadores profesionales.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <span className="font-medium text-[#0A2342]">
                  Flexibilidad:
                </span>{" "}
                Agenda sesiones a tu conveniencia.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Especialización:
                </span>{" "}
                Escoge al operador con quien quieres agendar una mentoría, según
                la estrategia que estés aprendiendo y tu estilo de trading.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Acompañamiento Constante:
                </span>{" "}
                Recibe orientación personalizada para pulir tus habilidades y
                resolver tus dudas en tiempo real.
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/8kg8fg9/Mentoring.png" // Placeholder
              alt="Mentorías Individuales o Grupales"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección 3: Herramientas de Análisis Fundamental */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-6">
              3. Herramientas de Análisis Fundamental Avanzadas
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Accede a nuestras{" "}
              <span className="font-semibold text-[#0A2342]">
                herramientas de análisis fundamental
              </span>{" "}
              diseñadas para proporcionarte el &quot;sesgo del día&quot;.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <span className="font-medium text-[#0A2342]">
                  Decisiones Informadas:
                </span>{" "}
                Conoce si vas a priorizar compras o ventas antes de entrar al
                gráfico.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Visión Clara:
                </span>{" "}
                Obtén una perspectiva clara del mercado, basada en variables
                macroeconómicas y datos de sentimiento.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Maximiza tu Potencial:
                </span>{" "}
                Elimina la incertidumbre y opera con una dirección clara.
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/99MfWk5h/Herramientas.png" // Placeholder
              alt="Herramientas de Análisis Fundamental"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección 4: Software de Track Record */}
        <section className="bg-white rounded-xl shadow-xl p-6 md:p-10 mb-16 flex flex-col lg:flex-row-reverse items-center gap-10">
          <div className="lg:w-1/2">
            <h3 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-6">
              4. Software de Track Record para Profesionales
            </h3>
            <p className="text-gray-700 text-lg mb-4">
              Te proporcionamos un{" "}
              <span className="font-semibold text-[#0A2342]">
                software de track record
              </span>{" "}
              para que certifiques tu experiencia operando los mercados.
            </p>
            <ul className="list-disc list-inside text-gray-600 space-y-2 mb-6">
              <li>
                <span className="font-medium text-[#0A2342]">
                  Insights Precisos:
                </span>{" "}
                Recibe los mejores insights de tu operativa, identificando tus
                fortalezas y debilidades.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Mejora Continua:
                </span>{" "}
                Te mostraremos en qué áreas centrarte para mejorar tu
                rendimiento.
              </li>
              <li>
                <span className="font-medium text-[#0A2342]">
                  Certificación y Auditoría:
                </span>{" "}
                Un paso crucial para certificar y auditar tu operativa,
                validando tu camino como operador profesional.
              </li>
            </ul>
          </div>
          <div className="lg:w-1/2 flex justify-center items-center">
            <Image
              src="https://i.ibb.co/nM0JB4SX/Software.png" // Placeholder
              alt="Software de Track Record"
              className="rounded-lg shadow-lg"
              width={600}
              height={400}
            />
          </div>
        </section>

        {/* Sección 5: Bono Extra - Opera en Vivo en Nuestro Trading Floor */}
        <section className="bg-gradient-to-r from-[#0A2342] to-[#1A3A5A] text-white rounded-xl shadow-2xl p-6 md:p-10 mb-16 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            BONO EXCLUSIVO: Opera en Vivo Desde Nuestro Trading Floor
          </h3>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            Como un beneficio adicional de tu suscripción al Senior Trader
            Program, tendrás el derecho de{" "}
            <span className="font-semibold text-yellow-300">
              operar 3 días en vivo y en directo
            </span>{" "}
            desde nuestro Trading Floor de Emporium Quality Funds.
          </p>
          <div className="flex justify-center mb-8">
            <Image
              src="https://i.ibb.co/hx4PtFPq/Emporium.png" // Placeholder
              alt="Trading Floor de Emporium Quality Funds"
              className="rounded-lg shadow-lg"
              width={600}
              height={350}
            />
          </div>
          <p className="text-lg max-w-3xl mx-auto">
            Experimenta el ambiente de un fondo de inversión real y opera{" "}
            <span className="font-semibold text-yellow-300">
              de la mano de profesionales operadores financieros.
            </span>{" "}
            Una oportunidad única para consolidar tu aprendizaje.
          </p>
        </section>

        {/* Llamada a la Acción Final */}
        <section className="text-center py-10">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A2342] mb-6">
            ¿Listo para Transformar tu Trading?
          </h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            El Senior Trader Program es tu puerta de entrada al trading
            profesional. Con estrategias comprobadas, mentorías personalizadas,
            herramientas avanzadas y una experiencia única en nuestro Trading
            Floor, tu camino hacia la rentabilidad comienza aquí.
          </p>
          <a
            href="#"
            className="px-10 py-4 bg-[#849E8F] text-white font-bold text-xl rounded-full shadow-xl hover:bg-[#6C8476] transition duration-300 ease-in-out inline-block"
          >
            SUSCRÍBETE AL SENIOR TRADER PROGRAM
          </a>
        </section>
      </main>

      {/* Pie de Página (Footer) - Manteniendo el estilo existente */}
      <footer className="w-full bg-[#0A2342] py-8 px-5 text-center text-gray-300 mt-16">
        <div className="max-w-7xl mx-auto">
          <p>
            &copy; {new Date().getFullYear()} Emporium Quality Funds. Todos los
            derechos reservados.
          </p>
          <div className="mt-4 space-x-4">
            <a href="#" className="hover:text-white transition duration-300">
              Política de Privacidad
            </a>
            <a href="#" className="hover:text-white transition duration-300">
              Términos y Condiciones
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
