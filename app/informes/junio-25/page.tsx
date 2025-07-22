// app/informes/junio-25/page.tsx

"use client"; // Marca este componente como un componente de cliente si necesita interactividad (como Chart.js)

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Importa el componente Image de Next.js
import Chart from 'chart.js/auto'; // Importa Chart.js

export default function InformeJunio25Page() {
  // Referencias a los elementos canvas para Chart.js
  const winRateChartRef = useRef<HTMLCanvasElement>(null);
  const streaksChartRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Función para envolver texto en múltiples líneas (útil para etiquetas de gráficos)
    function wrapText(str: string, maxWidth: number): string | string[] {
      if (str.length <= maxWidth) {
        return str;
      }
      const words = str.split(' ');
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
    const tooltipTitleCallback = function (tooltipItems: any): string | string[] {
      const item = tooltipItems[0];
      let label = item.chart.data.labels[item.dataIndex];
      if (Array.isArray(label)) {
        return label.join(' ');
      } else {
        return label;
      }
    };

    // Datos y configuración para el Donut Chart (Tasa de Éxito)
    const winRateData = {
      labels: ['Ganadoras', 'Perdedoras'],
      datasets: [{
        label: 'Resultado de Operaciones',
        data: [6, 2],
        backgroundColor: [
          '#2CA58D', // Acento Positivo/Ganancia
          '#D9534F'  // Acento Negativo/Pérdida
        ],
        borderColor: '#FFFFFF',
        borderWidth: 4,
        hoverOffset: 8
      }]
    };

    const winRateConfig: any = { // Usamos 'any' por la complejidad de tipos de Chart.js en TypeScript para ejemplos rápidos
      type: 'doughnut',
      data: winRateData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                size: 14,
                family: 'Inter'
              },
              color: '#0A2342' // Texto Principal/Oscuro
            }
          },
          tooltip: {
            callbacks: {
              title: tooltipTitleCallback
            }
          },
          title: {
            display: true,
            text: 'Tasa de Éxito: 75%',
            font: {
              size: 20,
              weight: 'bold',
              family: 'Inter'
            },
            color: '#0A2342',
            padding: {
              bottom: 20
            }
          }
        },
        cutout: '70%',
      }
    };

    // Datos y configuración para el Bar Chart (Análisis de Rachas)
    const streaksData = {
      labels: [wrapText('Racha Positiva Más Larga', 16), wrapText('Racha Negativa Más Larga', 16)],
      datasets: [{
        label: 'Nº de Operaciones Consecutivas',
        data: [6, 1],
        backgroundColor: [
          'rgba(44, 165, 141, 0.7)', // Acento Positivo/Ganancia con transparencia
          'rgba(217, 83, 79, 0.7)'    // Acento Negativo/Pérdida con transparencia
        ],
        borderColor: [
          '#2CA58D',
          '#D9534F'
        ],
        borderWidth: 2,
        borderRadius: 5
      }]
    };

    const streaksConfig: any = { // Usamos 'any' por la complejidad de tipos de Chart.js en TypeScript para ejemplos rápidos
      type: 'bar',
      data: streaksData,
      options: {
        indexAxis: 'y', // Hace el gráfico de barras horizontal
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
              color: '#0A2342'
            },
            grid: {
              display: false
            }
          },
          y: {
            ticks: {
              color: '#0A2342',
              font: {
                size: 14
              }
            },
            grid: {
              display: false
            }
          }
        },
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              title: tooltipTitleCallback
            }
          }
        }
      }
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
  }, []); // El array vacío asegura que este efecto se ejecute solo una vez al montar el componente

  return (
    <div className="container mx-auto p-4 md:p-8 max-w-7xl">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] mb-2">Pulso Bursátil: Análisis Operativo de Junio 2025</h1>
        <p className="text-lg md:text-xl text-[#849E8F]">Publicado: 30 de Junio de 2025</p>
        <p className="text-lg md:text-xl text-[#849E8F]">Operador: Luis Riofrío</p>
        <p className="text-lg md:text-xl text-[#849E8F]">Emporium Quality Funds</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12">
        <div className="kpi-card">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">Total de Operaciones</p>
          <p className="text-6xl font-extrabold text-[#0A2342]">8</p>
        </div>
        <div className="kpi-card border-t-4 border-[#2CA58D]">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">Operaciones Ganadoras</p>
          <p className="text-6xl font-extrabold text-[#2CA58D]">6</p>
        </div>
        <div className="kpi-card border-t-4 border-[#D9534F]">
          <p className="text-xl font-semibold text-[#849E8F] mb-2">Operaciones Perdedoras</p>
          <p className="text-6xl font-extrabold text-[#D9534F]">2</p>
        </div>
      </section>

      <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Resumen del Desempeño</h2>
          <p className="text-center text-gray-600 mb-6">Visualización de la proporción de operaciones ganadoras (TARGET) frente a las perdedoras (STOP) durante el mes de junio.</p>
          <div className="chart-container">
            {/* Asigna la referencia al canvas */}
            <canvas id="winRateChart" ref={winRateChartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Nuestra Estrategia de Decisión</h2>
          <p className="text-center text-gray-600 mb-6">Seguimos un proceso disciplinado para cada operación, combinando análisis de sentimiento con confirmaciones técnicas.</p>
          <div className="space-y-4">
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">1️⃣</div>
              <div>
                <h3 className="font-bold">Análisis de Sentimiento</h3>
                <p className="text-sm text-gray-600">Evaluamos Investing.com y las "7 Magníficas" para determinar la dirección del mercado.</p>
              </div>
            </div>
            <div className="flex justify-center flowchart-arrow">↓</div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">2️⃣</div>
              <div>
                <h3 className="font-bold">Doble Confirmación</h3>
                <p className="text-sm text-gray-600">Procedemos solo si al menos 4 de las 7 magníficas apoyan el sentimiento general.</p>
              </div>
            </div>
            <div className="flex justify-center flowchart-arrow">↓</div>
            <div className="flex items-center bg-gray-50 p-4 rounded-lg">
              <div className="text-3xl mr-4">3️⃣</div>
              <div>
                <h3 className="font-bold">Ejecución del Patrón</h3>
                <p className="text-sm text-gray-600">Buscamos rompimientos en NASDAQ o patrones Wyckoff en S&P 500.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Cronología de Operaciones de Junio</h2>
          <p className="text-center text-gray-600 mb-8">La secuencia de operaciones muestra una fuerte consistencia durante el mes, destacando una racha positiva de 6 operaciones consecutivas.</p>
          <div className="relative">
            <div className="absolute left-1/2 top-0 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8">
              {/* Timeline Items */}
              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Lunes 02-06</p>
                </div>
                {/* Asegúrate de que los contenidos como emojis no causen problemas */}
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D9534F] border-4 border-white flex items-center justify-center text-white font-bold">🚫</div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#D9534F]">STOP</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold text-lg text-[#2CA58D]">TARGET</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2CA58D] border-4 border-white flex items-center justify-center text-white font-bold">🎯</div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold">Martes 03-06 - Miércoles 18-06</p>
                  <p className="text-sm text-gray-500">6 operaciones ganadoras consecutivas</p>
                </div>
              </div>

              <div className="relative flex items-center">
                <div className="w-1/2 pr-8 text-right">
                  <p className="font-bold">Miércoles 25-06</p>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#D9534F] border-4 border-white flex items-center justify-center text-white font-bold">🚫</div>
                <div className="w-1/2 pl-8">
                  <p className="font-bold text-lg text-[#D9534F]">STOP</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 text-center">Análisis de Rachas</h2>
          <p className="text-center text-gray-600 mb-6">Una comparación visual de la racha de ganancias más larga frente a la de pérdidas, demostrando una gestión de riesgo efectiva.</p>
          <div className="chart-container">
            {/* Asigna la referencia al canvas */}
            <canvas id="streaksChart" ref={streaksChartRef}></canvas>
          </div>
        </div>

        <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md flex flex-col justify-center">
          <h2 className="text-2xl font-bold mb-4 text-center">El Consejo del Operador</h2>
          <blockquote className="relative p-4 text-xl italic border-l-4 bg-neutral-100 text-neutral-600 border-neutral-500 quote">
            <p className="mb-4">"Mantén claras y respeta al pie de la letra las reglas de tu plan. La verdadera ventaja competitiva reside en la ejecución impecable, inmune a las distracciones del ruido macroeconómico."</p>
            <cite className="flex items-center">
              <div className="flex flex-col items-start">
                <span className="mb-1 text-sm not-italic font-bold">Luis Riofrío, Operador</span>
              </div>
            </cite>
          </blockquote>
        </div>

        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Anexo Fotográfico: Operaciones del Mes</h2>
          <p className="text-center text-gray-600 mb-8">Las imágenes ilustran todas y cada una de las operaciones ejecutadas durante junio, mostrando la disciplina en la aplicación de nuestra estrategia.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Ejemplo de Imagen de Operación usando Next.js Image Component */}
            <div>
              <h3 className="font-bold text-lg mb-2">Lunes 02-06: NASDAQ Futures (NQ) - STOP</h3>
              <Image
                src="https://i.ibb.co/mFtbR1hP/02.jpg"
                alt="Captura de pantalla de la operación de NASDAQ del 02 de junio, resultado STOP"
                width={800} // <<< Reemplaza con el ancho real de 02.jpg
                height={600} // <<< Reemplaza con el alto real de 02.jpg
                className="w-full h-auto rounded-lg shadow-md mb-4"
                priority // Carga esta imagen con alta prioridad si es importante en el viewport inicial
              />
              <p className="text-sm text-gray-600">Descripción: La continuación del rompimiento no sucede inmediatamente, retrocede hacia el stop.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Martes 03-06: NASDAQ Futures (NQ) - TARGET</h3>
              <Image
                src="https://i.ibb.co/VfV06v5/03.jpg"
                alt="Captura de pantalla de la operación de NASDAQ del 03 de junio, resultado TARGET"
                width={800} // <<< Reemplaza con el ancho real de 03.jpg
                height={600} // <<< Reemplaza con el alto real de 03.jpg
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">Descripción: El primer target es conseguido exitosamente, el segundo objetivo cierra en breakeven por gestión del stop.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Miércoles 04-06: NASDAQ Futures (NQ) - TARGET</h3>
              <Image
                src="https://i.ibb.co/qM559P3Q/04.png"
                alt="Captura de pantalla de la operación de NASDAQ del 04 de junio, resultado TARGET"
                width={800} // <<< Reemplaza con el ancho real de 04.png
                height={600} // <<< Reemplaza con el alto real de 04.png
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">Descripción: El primer target es conseguido exitosamente, el segundo objetivo cierra en breakeven por gestión del stop.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Lunes 09-06: NASDAQ Futures (NQ) - TARGET</h3>
              <Image
                src="https://i.ibb.co/tPTHWG1x/09.png"
                alt="Captura de pantalla de la operación de NASDAQ del 09 de junio, resultado TARGET"
                width={800} // <<< Reemplaza con el ancho real de 09.png
                height={600} // <<< Reemplaza con el alto real de 09.png
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">Descripción: El primer target es conseguido exitosamente, el segundo objetivo cierra en relación 1:1 por gestión del stop.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Miércoles 11-06: NASDAQ Futures (NQ) - TARGET</h3>
              <Image
                src="https://i.ibb.co/NnFMfcTn/11.png"
                alt="Captura de pantalla de la operación de NASDAQ del 11 de junio, resultado TARGET"
                width={800} // <<< Reemplaza con el ancho real de 11.png
                height={600} // <<< Reemplaza con el alto real de 11.png
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">Descripción: El primer target es conseguido exitosamente, el segundo objetivo cierra en breakeven por gestión del stop.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Lunes 16-06: NASDAQ Futures (NQ) - TARGET</h3>
              <Image
                src="https://i.ibb.co/0pxNRcb3/16.png"
                alt="Captura de pantalla de la operación de NASDAQ del 16 de junio, resultado TARGET"
                width={800} // <<< Reemplaza con el ancho real de 16.png
                height={600} // <<< Reemplaza con el alto real de 16.png
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">Descripción: El precio llega exitosamente al primer target pero cierro en breakeven porque en la apertura del trade se dio un deslizamiento y entré en un precio no deseado.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Miércoles 18-06: NASDAQ Futures (NQ) - TARGET</h3>
              <Image
                src="https://i.ibb.co/G3d0SmTq/18.png"
                alt="Captura de pantalla de la operación de NASDAQ del 18 de junio, resultado TARGET"
                width={800} // <<< Reemplaza con el ancho real de 18.png
                height={600} // <<< Reemplaza con el alto real de 18.png
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">El primer target es conseguido exitosamente, el segundo objetivo cierra en breakeven por gestión del stop.</p>
            </div>
            <div>
              <h3 className="font-bold text-lg mb-2">Miércoles 25-06: NASDAQ Futures (NQ) - STOP</h3>
              <Image
                src="https://i.ibb.co/RkRf7thB/25.png"
                alt="Captura de pantalla de la operación de NASDAQ del 25 de junio, resultado STOP"
                width={800} // <<< Reemplaza con el ancho real de 25.png
                height={600} // <<< Reemplaza con el alto real de 25.png
                className="w-full h-auto rounded-lg shadow-md mb-4"
              />
              <p className="text-sm text-gray-600">Descripción: El precio no se desarrolla a favor de la compra y cae directamente hacia el stop.</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 bg-transparent rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-center text-[#0A2342]">Contexto Macroeconómico de Junio</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div className="kpi-card p-4">
              <p className="text-5xl mb-2">🌍</p>
              <h3 className="font-bold text-lg mb-1">Tensiones Geopolíticas</h3>
              <p className="text-sm text-gray-600">El foco en Medio Oriente generó volatilidad y movimientos hacia activos de refugio.</p>
            </div>
            <div className="kpi-card p-4">
              <p className="text-5xl mb-2">⚖️</p>
              <h3 className="font-bold text-lg mb-1">Política Arancelaria</h3>
              <p className="text-sm text-gray-600">Discusiones comerciales mantuvieron en vilo a los mercados por su impacto en las cadenas de suministro.</p>
            </div>
            <div className="kpi-card p-4">
              <p className="text-5xl mb-2">🏛️</p>
              <h3 className="font-bold text-lg mb-1">Bancos Centrales</h3>
              <p className="text-sm text-gray-600">Las expectativas sobre tasas de interés fueron un motor clave para la renta variable.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="text-center mt-12 pt-8 border-t border-gray-300">
        <h3 className="font-bold mb-2">Aviso Legal</h3>
        <p className="text-xs text-gray-500 max-w-4xl mx-auto">
          El contenido de este informe tiene fines puramente educativos e informativos y no constituye en ningún caso asesoramiento de inversión. La operativa con futuros implica un alto grado de riesgo y puede no ser adecuada para todos los inversores. Existe la posibilidad de que se incurra en pérdidas que superen la inversión inicial. Los resultados pasados no son indicativos de resultados futuros.
        </p>
      </footer>
    </div>
  );
}