// app/informes/ES/julio-25/page.tsx
"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Chart from "chart.js/auto";
import { ChartConfiguration, TooltipItem } from "chart.js";

export default function InformeJulio25ESPage() {
  // Cambiado el nombre de la función
  // Referencias a los elementos canvas para Chart.js
  const winRateChartRef = useRef<HTMLCanvasElement>(null);
  const streaksChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Función para envolver texto en múltiples líneas (útil para etiquetas de gráficos)
    function wrapText(str: string, maxWidth: number): string | string[] {
      if (str.length <= maxWidth) {
        return str;
      }
      const words = str.split(" ");
      const lines = [];
      let currentLine = words[0];

      for (let i = 1; i < words.length; i++) {
        const word = words[i];
        if ((currentLine + " " + word).length < maxWidth) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      lines.push(currentLine);
      return lines;
    }

    // Callback para tooltips de Chart.js
    const tooltipTitleCallback = function (
      tooltipItems: TooltipItem<"doughnut" | "bar">[]
    ): string | string[] {
      const item = tooltipItems[0];
      const labels = item.chart.data.labels;
      const label = labels ? labels[item.dataIndex] : "";
      if (Array.isArray(label)) {
        return label.join(" ");
      } else {
        return label as string;
      }
    };

    // Datos y configuración para el Donut Chart (Tasa de Éxito)
    const winRateData = {
      labels: ["Ganadoras", "Perdedoras"],
      datasets: [
        {
          label: "Resultado de Operaciones",
          data: [3, 2], // 3 Targets, 2 Stops (ignorando el break-even para la visualización de la tasa)
          backgroundColor: ["#2CA58D", "#D9534F"],
          borderColor: "#FFFFFF",
          borderWidth: 4,
          hoverOffset: 8,
        },
      ],
    };
    const winRateConfig: ChartConfiguration<"doughnut", number[], string> = {
      type: "doughnut",
      data: winRateData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              font: {
                size: 14,
                family: "Inter",
              },
              color: "#0A2342",
            },
          },
          tooltip: {
            callbacks: {
              title: tooltipTitleCallback,
            },
          },
          title: {
            display: true,
            text: "Tasa de Éxito: 60%", // 3 ganadoras de 5 trades (ignorando el breakeven)
            font: {
              size: 20,
              weight: "bold",
              family: "Inter",
            },
            color: "#0A2342",
            padding: {
              bottom: 20,
            },
          },
        },
        cutout: "70%",
      },
    };

    // Datos y configuración para el Bar Chart (Análisis de Rachas)
    const streaksData = {
      labels: [
        (() => {
          const label = wrapText("Racha Positiva Más Larga", 16);
          return Array.isArray(label) ? label.join(" ") : label;
        })(),
        (() => {
          const label = wrapText("Racha Negativa Más Larga", 16);
          return Array.isArray(label) ? label.join(" ") : label;
        })(),
      ],
      datasets: [
        {
          label: "Nº de Operaciones Consecutivas",
          data: [2, 2], // Racha positiva más larga: 2 (últimos dos targets); Racha negativa más larga: 2 (dos stops)
          backgroundColor: [
            "rgba(44, 165, 141, 0.7)",
            "rgba(217, 83, 79, 0.7)",
          ],
          borderColor: ["#2CA58D", "#D9534F"],
          borderWidth: 2,
          borderRadius: 5,
        },
      ],
    };

    const streaksConfig: ChartConfiguration<"bar", number[], string> = {
      type: "bar",
      data: streaksData,
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: "#0A2342",
            },
            grid: {
              display: false,
            },
          },
          y: {
            ticks: {
              color: "#0A2342",
              font: {
                size: 14,
              },
            },
            grid: {
              display: false,
            },
          },
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              title: tooltipTitleCallback,
            },
          },
        },
      },
    };

    // Inicializar los gráficos solo si los elementos canvas existen
    let winRateChart: Chart | null = null;
    let streaksChart: Chart | null = null;

    if (winRateChartRef.current) {
      winRateChart = new Chart(winRateChartRef.current, winRateConfig);
    }
    if (streaksChartRef.current) {
      streaksChart = new Chart(streaksChartRef.current, streaksConfig);
    }

    // Función de limpieza para destruir los gráficos cuando el componente se desmonte
    return () => {
      winRateChart?.destroy();
      streaksChart?.destroy();
    };
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl pt-20">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] mb-2">
          E-mini S&P 500: Análisis Operativo de Julio 2025
        </h1>
        <p className="text-lg md:text-xl text-[#849E8F]">
          Publicado: 31 de Julio de 2025
        </p>
        <p className="text-lg md:text-xl text-[#849E8F]">
          Operador: Luis Riofrío
        </p>
        <p className="text-lg md:text-xl text-[#849E8F]">
          Liberty Trading Club
        </p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8 mb-12">
        <div className="kpi-card text-center">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">
            Total de Operaciones
          </p>
          <p className="text-6xl font-extrabold text-[#0A2342]">6</p>{" "}
          {/* Actualizado: 6 */}
        </div>
        <div className="kpi-card border-t-4 border-[#2CA58D] text-center">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">
            Operaciones Ganadoras
          </p>
          <p className="text-6xl font-extrabold text-[#2CA58D]">3</p>{" "}
          {/* Actualizado: 3 */}
        </div>
        <div className="kpi-card border-t-4 border-[#D9534F] text-center">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">
            Operaciones Perdedoras
          </p>
          <p className="text-6xl font-extrabold text-[#D9534F]">2</p>{" "}
          {/* Actualizado: 2 */}
        </div>
        <div className="kpi-card border-t-4 border-gray-400 text-center">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">
            Operaciones Break Even
          </p>
          <p className="text-6xl font-extrabold text-gray-400">1</p>{" "}
          {/* Actualizado: 1 */}
        </div>
      </section>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Resumen del Desempeño
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Visualización de la proporción de operaciones ganadoras (TARGET)
            frente a las perdedoras (STOP) durante el mes de julio. (El Break
            Even no se incluye en este cálculo).
          </p>
          <div className="chart-container">
            <canvas id="winRateChart" ref={winRateChartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Nuestra Estrategia de Decisión
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Seguimos un proceso disciplinado para cada operación, combinando
            análisis macroeconómico y sentimiento con confirmaciones técnicas.
          </p>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">1️⃣</div>
              <div>
                <h3 className="font-bold">Análisis Macroeconómico</h3>
                <p className="text-sm text-gray-600">
                  Evaluamos variables macro: PIB, PMIs, inflación, desempleo,
                  tasas de interés y ventas minoristas.
                </p>
              </div>
            </div>
            <div className="flex justify-center flowchart-arrow">↓</div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">2️⃣</div>
              <div>
                <h3 className="font-bold">Análisis de Sentimiento</h3>
                <p className="text-sm text-gray-600">
                  Evaluamos el sentimiento de los inversores y las tendencias
                  del mercado para determinar la dirección operativa.
                </p>
              </div>
            </div>
            <div className="flex justify-center flowchart-arrow">↓</div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">3️⃣</div>
              <div>
                <h3 className="font-bold">Ejecución del Patrón</h3>
                <p className="text-sm text-gray-600">
                  Buscamos la confirmación de la entrada de compra o venta en zonas
                  de interés clave apoyado por los indicadores.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Cronología de Operaciones de Julio
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Un resumen de las operaciones ejecutadas durante el mes de julio.
          </p>
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {/* Operaciones de julio del ES, ordenadas cronológicamente */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Martes 08-07</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2CA58D] border-4 border-white flex items-center justify-center text-white font-bold">
                  🎯
                </div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#2CA58D]">
                    TARGET (Compra)
                  </p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Miércoles 09-07</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D9534F] border-4 border-white flex items-center justify-center text-white font-bold">
                  🚫
                </div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#D9534F]">
                    STOP (Compra)
                  </p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Lunes 14-07</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2CA58D] border-4 border-white flex items-center justify-center text-white font-bold">
                  🎯
                </div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#2CA58D]">
                    TARGET (Venta)
                  </p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Martes 22-07</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D9534F] border-4 border-white flex items-center justify-center text-white font-bold">
                  🚫
                </div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#D9534F]">
                    STOP (Compra)
                  </p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Miércoles 23-07</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gray-400 border-4 border-white flex items-center justify-center text-white font-bold">
                  +/-
                </div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-gray-400">
                    BREAK EVEN (Compra)
                  </p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Miércoles 23-07 (2da entrada)</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2CA58D] border-4 border-white flex items-center justify-center text-white font-bold">
                  🎯
                </div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#2CA58D]">
                    TARGET (Compra)
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">
            Análisis de Rachas
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Visualización de la racha de ganancias más larga y la racha de
            pérdidas más larga durante el mes.
          </p>
          <div className="chart-container">
            <canvas id="streaksChart" ref={streaksChartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center">
            El Consejo del Operador
          </h2>
          <blockquote className="relative p-4 text-xl italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote">
            <p className="mb-4">
              &quot;Confiar en el plan y aprender de cada trade, incluso los
              breakeven, es lo que nos hace más fuertes.&quot;
            </p>
            <cite className="flex items-center">
              <div className="flex flex-col items-start">
                <span className="mb-1 text-sm not-italic font-bold">
                  Luis Riofrío, Operador
                </span>
              </div>
            </cite>
          </blockquote>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Anexo Fotográfico: Operaciones del Mes
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Las imágenes ilustran las operaciones ejecutadas durante julio.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Operaciones de julio del ES, ordenadas cronológicamente */}
            <div>
              <h3 className="font-bold text-lg mb-2">
                Operación 1: Martes 08-07 - TARGET (Compra)
              </h3>
              <Image
                src="https://i.ibb.co/Ld0TCh7x/ejemplo-de-compra.png"
                alt="Operación de compra en ES del 08 de julio, resultado TARGET"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-4"
                priority
              />
              <p className="text-sm text-gray-600">
                Descripción: Entrada de compra que cumple con el patrón y
                alcanza el take profit.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Operación 2: Miércoles 09-07 - STOP (Compra)
              </h3>
              <Image
                src="https://i.ibb.co/F4qWctx9/compra-09-07.png"
                alt="Operación de compra en ES del 09 de julio, resultado STOP"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">
                Descripción: Entrada de compra que finaliza en stop loss.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Operación 3: Lunes 14-07 - TARGET (Venta)
              </h3>
              <Image
                src="https://i.ibb.co/HLytq7qL/venta-exitosa.png"
                alt="Operación de venta en ES del 14 de julio, resultado TARGET"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">
                Descripción: Entrada de venta que cumple con el patrón y alcanza
                el objetivo.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Operación 4: Martes 22-07 - STOP (Compra)
              </h3>
              <Image
                src="https://i.ibb.co/K4Ny7W4/compra-fallida.png"
                alt="Operación de compra en ES del 22 de julio, resultado STOP"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">
                Descripción: Entrada de compra que finaliza en stop loss.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Operación 5: Miércoles 23-07 - BREAK EVEN (Compra)
              </h3>
              <Image
                src="https://i.ibb.co/99s3M0Yt/compra-23-07.jpg"
                alt="Operación de compra en ES del 23 de julio, resultado BREAK EVEN"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">
                Descripción: Operación gestionada a breakeven que termina sin
                pérdidas ni ganancias, aunque el precio luego se desarrolló a
                favor.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">
                Operación 6: Miércoles 23-07 (2da entrada) - TARGET (Compra)
              </h3>
              <Image
                src="https://i.ibb.co/99s3M0Yt/compra-23-07.jpg"
                alt="Segunda operación de compra en ES del 23 de julio, resultado TARGET"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">
                Descripción: Segunda entrada del día que cumple con el patrón y
                logra alcanzar el objetivo.
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-transparent rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#0A2342]">
            Contexto Macroeconómico de Julio
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mx-auto max-w-4xl">
            <div className="kpi-card p-4">
              <p className="text-5xl mb-2">🏛️</p>
              <h3 className="font-bold text-lg mb-1">Política Monetaria</h3>
              <p className="text-sm text-gray-600">
                Las expectativas sobre la postura de la Reserva Federal y otros
                bancos centrales en torno a las tasas de interés y la inflación,
                generaron movimientos clave en la renta variable.
              </p>
            </div>
            <div className="kpi-card p-4">
              <p className="text-5xl mb-2">📊</p>
              <h3 className="font-bold text-lg mb-1">
                Resultados Corporativos
              </h3>
              <p className="text-sm text-gray-600">
                La temporada de ganancias del segundo trimestre, especialmente
                de las grandes tecnológicas, fue un catalizador significativo
                que redefinió el sentimiento sectorial y la volatilidad del
                mercado.
              </p>
            </div>
            <div className="kpi-card p-4">
              <p className="text-5xl mb-2">🌍</p>
              <h3 className="font-bold text-lg mb-1">Tensiones Geopolíticas</h3>
              <p className="text-sm text-gray-600">
                Los focos de tensión internacionales continuaron generando
                incertidumbre, impulsando la volatilidad en los mercados de
                materias primas y afectando las perspectivas de las cadenas de
                suministro globales.
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center mt-12 pt-8 border-t border-gray-300">
        <h3 className="font-bold mb-2">Aviso Legal</h3>
        <p className="text-xs text-gray-500 max-w-4xl mx-auto">
          El contenido de este informe tiene fines puramente educativos e
          informativos y no constituye en ningún caso asesoramiento de
          inversión. La operativa con futuros implica un alto grado de riesgo y
          puede no ser adecuada para todos los inversores. Existe la posibilidad
          de que se incurra en pérdidas que superen la inversión inicial. Los
          resultados pasados no son indicativos de resultados futuros.
        </p>
      </footer>
    </div>
  );
}
