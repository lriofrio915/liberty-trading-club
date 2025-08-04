// app/manuales/SP500-1/page.tsx
import Image from "next/image";

export const metadata = {
  title: "Manual MES - Pulso Bursátil",
  description: "Manual detallado de la estrategia de trading para futuros Micro E-mini S&P 500 (MES).",
};

export default function ManualMESPage() {
  return (
    <div className="container mx-auto p-8 pt-1 max-w-4xl">
      {/* Contenido de la "Página 1" - Idéntico al manual de Nasdaq */}
      <div className="bg-white rounded-lg shadow-xl mb-8 p-10 relative">
        <div className="min-h-[calc(100vh-120px)]">
          <div className="text-gray-600 text-xs border-b border-gray-200 pb-1">
            EQF +20 años de experiencia en conjunto, (2025)
          </div>
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center space-x-2 mt-6 mb-4">
              <span className="text-2xl font-bold text-gray-800">
                Emporium Quality Funds
              </span>
            </div>
            <div className="flex items-center space-x-6">
              <div className="flex flex-col items-start font-times-new-roman text-lg leading-tight text-gray-700">
                <span>Innovación</span>
                <span>Experiencia</span>
                <span>Gestión</span>
              </div>
              <div>
                <Image
                  src="https://i.ibb.co/20RsFG5H/emporium-logo-1.jpg"
                  alt="Logo Emporium"
                  className="w-24 h-24 rounded-full object-cover border-2 border-blue-600 shadow-md"
                  width={100}
                  height={100}
                />
              </div>
              <div className="flex flex-col items-end">
                <span className="font-bold">INVERSIÓN</span>
                <span className="text-sm font-bold">EN</span>
                <span className="font-bold">MERCADOS FINANCIEROS</span>
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
            Estrategia de Trading Intradía para Futuros Micro E-mini S&P 500:
          </h1>
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-8">
            Un Enfoque Integrado Macro-Técnico
          </h2>
          <div className="text-center">
            <p className="text-lg font-semibold">L. Riofrio</p>
            <p className="text-gray-700">
              Emporium Quality Funds, Quito, Ecuador
            </p>
            <p className="text-sm italic mt-1">luis.riofrio@emporium.site</p>
            <p className="text-xs mt-3">
              (Recibido: 09 Julio 2025; Aceptado: 11 Julio 2025)
            </p>
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            Resumen Ejecutivo
          </h3>
          <p className="mb-4 text-justify">
            El presente informe detalla una investigación exhaustiva sobre una
            estrategia de trading intradía aplicada a los futuros Micro E-mini
            S&P 500 (MES) en la plataforma NinjaTrader 8. La estrategia se
            fundamenta en un enfoque de dos etapas: primero, un análisis del
            contexto macroeconómico fundamental para determinar una dirección
            clara del sesgo de operación (compra o venta) para el día; y
            segundo, la aplicación de patrones técnicos del método Wyckoff,
            identificados mediante el indicador Order Flow Volumen Profile, para el
            timing preciso de entrada al mercado.
          </p>
          <p className="mb-4 text-justify">
            El objetivo principal de esta investigación es validar la
            rentabilidad, replicabilidad y enseñabilidad de esta metodología
            para su potencial implementación en un fondo de inversión.
          </p>
          <p className="mb-4 text-justify">
            La gestión de riesgos, anclada en la regla del 2% y stops de
            pérdida fijos, es fundamental para la preservación del capital. Se
            identifican áreas clave para la optimización y la investigación
            futura, incluyendo la cuantificación de los factores de
            sentimiento macroeconómico y la adaptación dinámica de los
            parámetros de riesgo a las condiciones del mercado.
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            1. Introducción
          </h3>
          <p className="mb-4 text-justify">
            El trading intradía en mercados de futuros, como el Micro E-mini
            S&P 500 (MES), ofrece oportunidades significativas de
            capitalización debido a su alta liquidez y volatilidad. Sin
            embargo, el éxito sostenido en este entorno requiere una
            estrategia robusta y bien definida.
          </p>
          <p className="mb-4 text-justify">
            Este estudio presenta una metodología de trading innovadora que
            integra el análisis macroeconómico fundamental con patrones
            técnicos de entrada, buscando optimizar la toma de decisiones y
            mejorar la consistencia de los resultados.
          </p>
          <p className="mb-4 text-justify">
            A diferencia de enfoques puramente técnicos, esta estrategia
            propone una visión holística del mercado. La primera etapa
            consiste en una evaluación profunda del contexto macroeconómico
            global y, específicamente, de los factores que influyen en el
            índice S&P 500.
          </p>
        </div>
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-200 text-sm text-gray-600">
          <span>Emporium Quality Funds</span>
          <span>Página 1</span>
        </div>
      </div>
      
      {/* Contenido de la "Página 2" - Adaptado para el MES */}
      <div className="bg-white rounded-lg shadow-xl mb-8 p-10 relative">
        <div className="min-h-[calc(100vh-120px)]">
          <p className="mb-4 text-justify">
            Esta evaluación permite establecer una dirección operativa
            predominante para el día (alcista o bajista), alineando las
            operaciones con el flujo general del mercado. Una vez definida
            esta dirección, la segunda etapa se centra en la identificación de
            patrones técnicos específicos en el gráfico de precios para
            determinar el momento óptimo de entrada.
          </p>
          <p className="mb-4 text-justify">
            El objetivo de esta investigación es validar la efectividad de
            esta estrategia integrada en términos de rentabilidad, su
            capacidad de ser replicada por otros operadores y la facilidad con
            la que puede ser enseñada.
          </p>
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            2. Marco Teórico
          </h3>
          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            2.1. Análisis Macroeconómico Fundamental para el S&P 500
          </h4>
          <p className="mb-4 text-justify">
            La primera etapa de la estrategia se basa en la premisa de que el
            movimiento de los índices bursátiles, como el S&P 500, está
            intrínsecamente ligado a las condiciones macroeconómicas. El S&P 500,
            al ser un índice de 500 empresas de gran capitalización, es
            particularmente sensible a:
          </p>
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              <strong className="font-semibold">Tasas de Interés:</strong> Las
              tasas altas pueden impactar negativamente a las empresas
              tecnológicas al encarecer el endeudamiento y reducir el valor
              presente de sus flujos de caja futuros.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Inflación:</strong> Una
              inflación elevada puede erosionar los márgenes de beneficio de
              las empresas y reducir el poder adquisitivo de los consumidores.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Crecimiento del PIB:</strong>
              Un crecimiento económico robusto suele traducirse en mayores
              ingresos y beneficios para las empresas.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Datos de Empleo:</strong>
              Indicadores como las nóminas no agrícolas o la tasa de desempleo
              reflejan la salud general de la economía y el consumo.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Políticas de Bancos Centrales:
              </strong>
              Las decisiones de la Reserva Federal (Fed) sobre política
              monetaria tienen un impacto directo en la liquidez del mercado y
              el apetito por el riesgo.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Resultados Corporativos:
              </strong>
              Los informes de ganancias de las principales empresas
              tecnológicas (las &quot7 Magníficas&quot y otras) influyen
              directamente en el sentimiento del sector.
            </li>
          </ul>
          <Image
            src="https://i.ibb.co/xSv60TXG/var.jpg"
            alt="Variables macroeconómicas"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={500}
            height={200}
          />
          <h3 className="text-xs text-center">Gráfico 1. Variables Fundamentales para la Determinación del Sesgo General del Mercado</h3>
          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            2.2. Análisis Técnico: Método Wyckoff y Perfil de Volumen
          </h4>
          <p className="mb-4 text-justify">
            Una vez establecida la dirección macroeconómica, la estrategia se apoya en el análisis técnico para identificar puntos de entrada
            precisos. El concepto central es una adaptación del método Wyckoff,
            buscando un proceso de parada-fobo-test en zonas de interés.
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              <strong className="font-semibold">
                Zonas de Interés:
              </strong>
              Identificamos zonas importantes de soporte y resistencia mediante el
              indicador <b>Order Flow Volumen Profile</b> de NinjaTrader 8. Este indicador
              resalta los puntos de máximo y mínimo valor, actuando como imanes
              para el precio y como zonas de posible rebote.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Nivel de Volumen de Pre-Mercado:
              </strong>
              Adicionalmente, marcamos una zona de interés en la gráfica de 5
              minutos, dibujando una línea horizontal en el nivel de volumen
              más alto del pre-mercado (desde el cierre de mercado hasta la
              apertura americana), ignorando las velas de apertura asiática (18:05)
              y americana (09:30).
            </li>
          </ul>

          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            2.3. Proceso de Entrada (Wyckoff Adaptado)
          </h4>
          <p className="mb-4 text-justify">
            Una vez identificada la zona de interés, el proceso de entrada se
            basa en tres fases:
          </p>
          <ol className="list-decimal ml-6 mb-4">
            <li className="mb-2">
              <strong className="font-semibold">
                Parada:
              </strong>
              Buscamos un movimiento lateral del precio dentro de la zona de
              interés, dibujando un rectángulo que define un soporte y una
              resistencia de esa &quotzona de parada&quot.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Fobo (Fake Out Break Out):
              </strong>
              Esperamos una falsa ruptura de una de las zonas de parada, donde el
              precio sale del canal y luego regresa rápidamente. Esta falsa
              ruptura (Fobo) se confirma cuando el precio alcanza la zona de
              parada opuesta.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Test:
              </strong>
              Después de la confirmación del Fobo, el siguiente paso es esperar
              un &quottesteo&quot a la zona de parada donde ocurrió el Fobo. La
              estrategia trata de posicionarse en este test con una alta
              probabilidad de éxito.
            </li>
          </ol>
          <Image
            src="https://i.ibb.co/4gDqMb8D/vol-profile.jpg" // Usando la misma imagen temporal
            alt="Volumen Profile Adaptado"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={300}
            height={300}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 2. Áreas de Valor para identificación de zonas importantes</h3>
          <Image
            src="https://i.ibb.co/ymwBTSFM/vol-5min.jpg" // Usando la misma imagen temporal
            alt="Volumen en 5 minutos"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 3. Volumen más alto en la gráfica de 5 minutos</h3>
          <Image
            src="https://i.ibb.co/q3YMdHkC/etapas-del-proceso.jpg" // Usando la misma imagen temporal
            alt="Proceso de Wyckoff Adaptado"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 4. Proceso de Wyckoff Simplificado</h3>
          <p className="mb-4 text-justify">
            La estrategia se enfoca en posicionarse en el test de mayor
            probabilidad, siempre alineado con la dirección del sesgo
            macroeconómico. Buscamos compras o ventas en estos puntos con una
            relación riesgo-recompensa de 1:2.
          </p>
        </div>
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-200 text-sm text-gray-600">
          <span>Emporium Quality Funds</span>
          <span>Página 2</span>
        </div>
      </div>
      
      {/* Contenido de la "Página 3" - Adaptado para el MES */}
      <div className="bg-white rounded-lg shadow-xl mb-8 p-10 relative">
        <div className="min-h-[calc(100vh-120px)]">
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            3. Gestión de Riesgos y Ejecución
          </h3>
          <p className="mb-4 text-justify">
            La gestión de riesgos es un pilar fundamental para la preservación
            del capital, especialmente en esta estrategia:
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              <strong className="font-semibold">Regla del 2%:</strong> El
              riesgo máximo por operación no debe exceder el 2% del capital
              total de la cuenta de trading.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Stop-Loss Fijo:</strong> Se
              establece un stop-loss predefinido y <b>no se gestiona a breakeven</b>.
              Asumimos el riesgo porque el precio suele testear en reiteradas
              ocasiones antes de decidir su dirección.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Take Profit:</strong> El
              objetivo de ganancia se establece en niveles basados en una
              relación riesgo-recompensa 1:2, buscando un mayor retorno por
              cada unidad de riesgo asumida.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Horario de Operación:</strong> Buscamos oportunidades
              de compra o venta en las dos primeras horas de la apertura del
              mercado americano.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Frecuencia:</strong> Solo tomamos
              una entrada al día, enfocándonos en la calidad sobre la cantidad.
            </li>
          </ul>
          <p className="text-center font-semibold text-xl my-6 text-gray-900">
            Entrada de Compra (Ejemplo)
          </p>
          <Image
            src="https://i.ibb.co/RGkXNHNF/step-1.png" // Usando la misma imagen temporal
            alt="Planificacion de entrada"
            className="max-w-full h-auto mx-auto my-6 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 5. Planificación del trade</h3>
          <Image
            src="https://i.ibb.co/LBPjsKs/step-2.png" // Usando la misma imagen temporal
            alt="Esperar por la entrada"
            className="max-w-full h-auto mx-auto my-6 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 6. Colocación de la orden en espera</h3>
          <Image
            src="https://i.ibb.co/nqBgH2tR/step-3.png" // Usando la misma imagen temporal
            alt="Activación de la entrada"
            className="max-w-full h-auto mx-auto my-6 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 7. Activación de la orden de compra</h3>
          <Image
            src="https://i.ibb.co/pv3zGMjK/step4.png" // Usando la misma imagen temporal
            alt="Salida en Target"
            className="max-w-full h-auto mx-auto my-6 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 8. Objetivo de compra cumplido.</h3>
        
          <p className="text-center font-semibold text-xl my-6 text-gray-900">
            Entrada de Venta (Ejemplo)
          </p>
          <Image
            src="https://i.ibb.co/Q38RrjXm/compra-exitosa-MNQ-2.jpg" // Usando la misma imagen temporal
            alt="Entrada de venta"
            className="max-w-full h-auto mx-auto my-6 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <h3 className="text-xs text-center mb-4">Gráfico 9. Entrada en venta que termina en Stop Loss.</h3>
        </div>
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-200 text-sm text-gray-600">
          <span>Emporium Quality Funds</span>
          <span>Página 3</span>
        </div>
      </div>
      
      {/* Contenido de la "Página 4" - Idéntico al manual de Nasdaq */}
      <div className="bg-white rounded-lg shadow-xl mb-8 p-10 relative">
        <div className="min-h-[calc(100vh-120px)]">
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            4. Análisis Empírico y Resultados
          </h3>
          <p className="mb-4 text-justify">
            La validación de esta estrategia se ha realizado a través de un
            riguroso backtesting sobre datos históricos del MES, complementado
            con pruebas en tiempo real. Se ha observado que los días con una dirección macroeconómica
            clara y un fuerte catalizador tienden a producir las operaciones
            más exitosas, mientras que los días de incertidumbre
            macroeconómica o consolidación pueden generar señales falsas o un
            rendimiento inferior.
          </p>
          <p className="mb-4 text-justify">
            Para evaluar la estrategia, se utilizarán métricas clave de
            rendimiento y riesgo, esenciales para cualquier fondo de inversión
            que priorice no solo las ganancias, sino también la gestión del
            riesgo para la preservación del capital:
          </p>
          <br />
          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              <strong className="font-semibold">
                Beneficio Neto Total / Retorno Anualizado:
              </strong>
              Mide la rentabilidad global de la estrategia durante el período
              de backtesting.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Sharpe Ratio:</strong> Es una
              métrica de retorno ajustado al riesgo que mide el exceso de
              retorno por unidad de volatilidad asumida.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Drawdown Máximo:</strong>
              Representa la mayor caída de la equidad de la cuenta desde un
              pico hasta un mínimo posterior.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Tasa de Acierto (Win Rate):
              </strong>
              El porcentaje de operaciones ganadoras sobre el total de
              operaciones.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Ratio Riesgo/Recompensa:
              </strong>
              Compara la recompensa promedio esperada con el riesgo promedio
              asumido por operación.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">Consistencia:</strong> Evalúa
              si la estrategia mantiene su rendimiento en diferentes
              condiciones de mercado.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Número de Operaciones:
              </strong>
              Un mayor número de operaciones generalmente confiere mayor
              significancia estadística a los resultados.
            </li>
          </ul>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            5. Conclusiones y Recomendaciones
          </h3>
          <p className="mb-4 text-justify">
            La estrategia de trading intradía para futuros Micro E-mini S&P 500,
            basada en un enfoque integrado macro-técnico, ofrece un marco
            prometedor para la toma de decisiones en mercados volátiles.
          </p>

          <ul className="list-disc ml-6 mb-4">
            <li className="mb-2">
              <strong className="font-semibold">
                Cuantificación de Factores Macroeconómicos:
              </strong>
              Desarrollar un sistema más objetivo y automatizado o un índice para cuantificar
              el &quotsentimiento macro&quot y la dirección.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Adaptación Dinámica de Riesgos:
              </strong>
              Explorar la posibilidad de ajustar los parámetros de riesgo en
              función de la volatilidad del mercado.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Automatización Parcial:
              </strong>
              Investigar la posibilidad de automatizar la identificación de
              patrones técnicos.
            </li>
            <li className="mb-2">
              <strong className="font-semibold">
                Estudio de Correlaciones:
              </strong>
              Profundizar en el estudio de las correlaciones entre el MES y
              otros activos.
            </li>
          </ul>

          <p className="mb-4 text-justify">
            En resumen, esta estrategia representa un paso adelante en la
            integración de diferentes tipos de análisis para el trading
            intradía, y con futuras mejoras, tiene el potencial de ser una
            metodología robusta para fondos de inversión.
          </p>
        </div>
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-200 text-sm text-gray-600">
          <span>Emporium Quality Funds</span>
          <span>Página 4</span>
        </div>
      </div>
      
      {/* Contenido de la "Página 5" - Apéndices, etc. */}
      <div className="bg-white rounded-lg shadow-xl mb-8 p-10 relative">
        <div className="min-h-[calc(100vh-120px)]">
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            Apéndice 1. Escenario 1: Trades Ganadores
          </h3>
          <p className="mb-4 text-justify">
            En esta sección se presentan ejemplos de operaciones que
            finalizaron con un resultado positivo (take profit).
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            (a) Compra (Ejemplo)
          </h4>
          <Image
            src="https://i.ibb.co/9m2VKXqQ/compra-exitosa-MNQ.jpg"
            alt="Operación ganadora de compra"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <p className="mb-4 text-xs text-center">
            Descripción: Ejemplo de entrada Wyckoff que cumple con el patrón y alcanza el take profit.
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            (b) Venta (Ejemplo)
          </h4>
          <Image
            src="/"
            alt="Operación ganadora de venta"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <p className="mb-4 text-center text-xs">
            Descripción: Ejemplo de entrada Wyckoff que cumple con el patrón y alcanza el take profit.
          </p>

          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            Apéndice 2. Escenario 2: Trades Perdedores
          </h3>
          <p className="mb-4 text-justify">
            En esta sección se presentan ejemplos de operaciones que
            finalizaron con un resultado negativo (stop loss).
          </p>

          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            (a) Compra (Ejemplo)
          </h4>
          <Image
            src="https://i.ibb.co/93mn5Sw3/compra-stoploss.png"
            alt="Operación perdedora de compra"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <p className="mb-4 text-center text-xs">
            Descripción: El precio no se desarrolla a favor y cae directamente hacia el stop, respetando la gestión de riesgo.
          </p>
          <h4 className="text-xl font-semibold text-gray-800 mt-5 mb-3">
            (b) Venta (Ejemplo)
          </h4>
          <Image
            src="https://i.ibb.co/Q38RrjXm/compra-exitosa-MNQ-2.jpg"
            alt="Operación perdedora de venta"
            className="max-w-full h-auto mx-auto my-4 block rounded-md shadow-md"
            width={700}
            height={400}
          />
          <p className="mb-4 text-center text-xs">
            Descripción: El precio no se desarrolla a favor y sube directamente hacia el stop, respetando la gestión de riesgo.
          </p>
        </div>
        <div className="flex justify-between pt-4 mt-6 border-t border-gray-200 text-sm text-gray-600">
          <span>Emporium Quality Funds</span>
          <span>Página 5</span>
        </div>
      </div>
      
      {/* Contenido de la "Página 6" - Métricas clave, etc. */}
      <div className="bg-white rounded-lg shadow-xl mb-8 p-10 relative">
        <div className="min-h-[calc(100vh-120px)]">
          <h3 className="text-2xl font-semibold text-gray-900 mt-6 mb-4 pb-2 border-b-2 border-gray-200">
            Apéndice 3. Métricas Clave del Backtesting
          </h3>
          <p className="mb-4 text-justify">
            Para evaluar la estrategia, se utilizan métricas clave de
            rendimiento y riesgo, esenciales para cualquier fondo de inversión
            que priorice no solo las ganancias, sino también la gestión del
            riesgo para la preservación del capital.
          </p>
          <table className="w-full border-collapse my-6 text-base">
            <caption className="text-center font-bold text-lg mb-4 text-gray-900">
              Tabla 1. Métricas Clave de Estudio
            </caption>
            <thead>
              <tr>
                <th className="bg-gray-100 font-semibold text-left p-4 border border-gray-200">
                  Métrica
                </th>
                <th className="bg-gray-100 font-semibold text-left p-4 border border-gray-200">
                  Valor
                </th>
                <th className="bg-gray-100 font-semibold text-left p-4 border border-gray-200">
                  Unidad
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Beneficio Neto Total
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">-</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Retorno Anualizado
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">-</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">Sharpe Ratio</td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">-</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Drawdown Máximo
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">%</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Duración Máx. Drawdown
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">días</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Tasa de Acierto
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">%</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Ganancia Promedio
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">-</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Ratio Riesgo/Recompensa
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">-</td>
              </tr>
              <tr className="even:bg-gray-50">
                <td className="p-4 border border-gray-200">
                  Número Total de Operaciones
                </td>
                <td className="p-4 border border-gray-200 font-semibold text-blue-700">
                  -
                </td>
                <td className="p-4 border border-gray-200">-</td>
              </tr>
            </tbody>
          </table>
          
        </div>
      </div>
    </div>
  );
}