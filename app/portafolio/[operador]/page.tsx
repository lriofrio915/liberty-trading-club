// app/portafolio/[operador]/page.tsx
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  TrashIcon,
  PlusCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// Importamos las acciones del servidor
import {
  getPortfolioBySlug,
  addTickerToPortfolio,
  removeTickerFromPortfolio,
  deletePortfolio,
} from "@/app/actions/portfolioActions";
import { Portfolio as PortfolioType } from "@/types/api";

// --- 1. Definición de Interfaces Específicas para la API de Yahoo ---

interface YahooApiStockPriceData {
  longName?: string | null;
  symbol?: string | null;
  regularMarketPrice?: number | null;
  regularMarketChangePercent?: number | null;
}

interface YahooApiAssetProfile {
  sector?: string | null;
  industry?: string | null;
}

interface StockApiItem {
  ticker: string;
  data: {
    price?: YahooApiStockPriceData;
    assetProfile?: YahooApiAssetProfile;
    // Omitimos otros módulos para simplificar, pero estos son los usados
  };
  error?: string;
}

interface StockApiResponse {
  success: boolean;
  message?: string;
  data: StockApiItem[];
}

// --- 2. Interfaces de Componente ---

// Definimos la interfaz para los datos de cada activo (usada para el estado local)
interface AssetData {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  price: number | null;
  dailyChange: number | null;
  error?: string;
}

// FIX: Eliminada la interfaz vacía 'Portfolio extends PortfolioType {}'
// Ahora usamos PortfolioType directamente.

export default function PortfolioPage() {
  const params = useParams();
  const router = useRouter();
  const operadorSlug = params.operador as string;

  // Usamos PortfolioType directamente
  const [portfolio, setPortfolio] = useState<PortfolioType | null>(null);
  const [currentTickers, setCurrentTickers] = useState<string[]>([]);
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"none" | "sector" | "industry">("none");
  const [newTickerInput, setNewTickerInput] = useState<string>("");
  const [addingTicker, setAddingTicker] = useState<boolean>(false);
  const [deletingPortfolio, setDeletingPortfolio] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);

  // LÓGICA DE CARGA DESDE MONGODB (al montar o cambiar el slug)
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const foundPortfolio = await getPortfolioBySlug(operadorSlug);
      if (foundPortfolio) {
        setPortfolio(foundPortfolio);
        setCurrentTickers(foundPortfolio.tickers);
      } else {
        setError("Portafolio no encontrado.");
      }
    } catch (err: unknown) {
      // FIX: Manejo de error usando 'unknown'
      console.error("Error al cargar el portafolio:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Error al cargar los datos del portafolio.";
      setError(message);
    } finally {
      // El loading se mantiene si hay tickers para la siguiente fase (fetchPortfolioData)
      if (currentTickers.length === 0) setLoading(false);
    }
  }, [operadorSlug, currentTickers.length]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Función para obtener los datos de todos los tickers (API Yahoo)
  const fetchPortfolioData = useCallback(async () => {
    if (currentTickers.length === 0) {
      setAssets([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const tickersString = currentTickers.join(",");
      const response = await fetch(`/api/stocks?tickers=${tickersString}`);

      if (!response.ok) {
        throw new Error("Fallo al obtener los datos del portafolio.");
      }

      // FIX: Usamos el tipo específico StockApiResponse
      const apiResponse: StockApiResponse = await response.json();

      if (apiResponse.success === false) {
        throw new Error(
          apiResponse.message ||
            "No se pudieron cargar los datos del portafolio."
        );
      }

      // FIX: Mapeo tipado
      const fetchedAssets: AssetData[] = apiResponse.data.map(
        (item: StockApiItem) => {
          const priceData = item.data?.price;
          const assetProfileData = item.data?.assetProfile;

          const name = priceData?.longName || priceData?.symbol || item.ticker;
          const sector = assetProfileData?.sector || "N/A";
          const industry = assetProfileData?.industry || "N/A";

          // Uso de coalescencia para asegurar el tipo number | null
          const price = priceData?.regularMarketPrice ?? null;
          const dailyChange = priceData?.regularMarketChangePercent ?? null;

          return {
            ticker: item.ticker,
            name: name,
            sector: sector,
            industry: industry,
            price: price,
            dailyChange: dailyChange,
          };
        }
      );

      setAssets(fetchedAssets);
    } catch (err: unknown) {
      console.error("Error al obtener datos del portafolio:", err);
      setError(
        err instanceof Error
          ? err.message
          : "No se pudieron cargar los datos del portafolio. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  }, [currentTickers]);

  useEffect(() => {
    // Solo recarga los datos de Yahoo si los tickers han sido cargados
    if (
      currentTickers.length > 0 ||
      (portfolio && currentTickers.length === 0)
    ) {
      fetchPortfolioData();
    }
  }, [portfolio, currentTickers, fetchPortfolioData]);

  const sortedAssets = useMemo(() => {
    const sortableAssets = [...assets];
    if (sortBy === "sector") {
      return sortableAssets.sort((a, b) => {
        if (!a.sector || a.sector === "N/A") return 1;
        if (!b.sector || b.sector === "N/A") return -1;
        return a.sector.localeCompare(b.sector);
      });
    } else if (sortBy === "industry") {
      return sortableAssets.sort((a, b) => {
        if (!a.industry || a.industry === "N/A") return 1;
        if (!b.industry || b.industry === "N/A") return -1;
        return a.industry.localeCompare(b.industry);
      });
    }
    return assets;
  }, [assets, sortBy]);

  const toggleSortBySector = () => {
    setSortBy(sortBy === "sector" ? "none" : "sector");
  };

  const toggleSortByIndustry = () => {
    setSortBy(sortBy === "industry" ? "none" : "industry");
  };

  const getPriceColor = (change: number | null) => {
    if (change === null) return "text-gray-500";
    return change * 100 > 0
      ? "text-green-600"
      : change * 100 < 0
      ? "text-red-600"
      : "text-gray-500";
  };

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    const tickerToAdd = newTickerInput.trim().toUpperCase();

    if (!tickerToAdd) {
      setError("Por favor, introduce un ticker para añadir.");
      return;
    }
    if (currentTickers.includes(tickerToAdd)) {
      setError("Este ticker ya está en la lista.");
      return;
    }

    setAddingTicker(true);
    setError(null);

    // 1. Validar el ticker antes de agregarlo (Lógica de API sin cambios)
    const validationResponse = await fetch(
      `/api/stocks?tickers=${tickerToAdd}`
    );
    // FIX: Usamos el tipo StockApiResponse
    const validationData: StockApiResponse = await validationResponse.json();

    if (
      !validationData.success ||
      validationData.data.length === 0 ||
      validationData.data[0].data.price === undefined
    ) {
      setError(
        `El ticker "${tickerToAdd}" no es válido o no se encontraron datos.`
      );
      setAddingTicker(false);
      return;
    }

    try {
      // 2. Si el ticker es válido, actualizamos la base de datos
      await addTickerToPortfolio(operadorSlug, tickerToAdd);

      // La acción del servidor ya revalidó el path, forzando la recarga
      // de datos de Yahoo en el siguiente ciclo.
      setCurrentTickers((prev) => [...prev, tickerToAdd]);
      setNewTickerInput("");
    } catch (e: unknown) {
      // FIX: Manejo de error tipado
      const message =
        e instanceof Error
          ? e.message
          : "Fallo al guardar el ticker en la base de datos.";
      setError(message);
    } finally {
      setAddingTicker(false);
    }
  };

  const handleDeleteTicker = async (tickerToDelete: string) => {
    try {
      // 1. Eliminamos el ticker de la base de datos
      await removeTickerFromPortfolio(operadorSlug, tickerToDelete);

      // 2. Actualizamos el estado local (para recargar la tabla)
      setCurrentTickers((prev) =>
        prev.filter((ticker) => ticker !== tickerToDelete)
      );
      setAssets((prevAssets) =>
        prevAssets.filter((asset) => asset.ticker !== tickerToDelete)
      );
    } catch (e: unknown) {
      // FIX: Manejo de error tipado
      const message =
        e instanceof Error
          ? e.message
          : "Fallo al eliminar el ticker de la base de datos.";
      setError(message);
    }
  };

  const openDeleteConfirmModal = () => {
    setShowConfirmModal(true);
  };

  const closeDeleteConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const confirmDeletePortfolio = async () => {
    setDeletingPortfolio(true);

    try {
      // 1. Eliminamos el portafolio de la base de datos
      await deletePortfolio(operadorSlug);

      // 2. Redirigir a la página principal (la acción ya revalida el navbar)
      router.push("/portafolio"); // Redirigimos a la página de gestión
    } catch (e: unknown) {
      // FIX: Manejo de error tipado
      const message =
        e instanceof Error
          ? e.message
          : "Fallo al eliminar el portafolio de la base de datos.";
      setError(message);
      setDeletingPortfolio(false);
      closeDeleteConfirmModal();
    }
  };

  if (loading && !portfolio) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 text-gray-800 flex justify-center items-center">
        <p>Cargando datos del portafolio...</p>
      </div>
    );
  }

  if (error && !portfolio) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 text-gray-800 flex justify-center items-center">
        <p className="text-red-500 text-lg">
          {error || "No se pudo cargar el portafolio."}
        </p>
      </div>
    );
  }

  if (!portfolio) {
    return (
      <div className="pt-24 min-h-screen bg-gray-50 text-gray-800 flex justify-center items-center">
        <p className="text-red-500 text-lg">Portafolio no encontrado.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-2 font-inter">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] mb-4">
            Portafolio de {portfolio.name || "Cargando..."}
          </h1>
          <p className="text-lg md:text-xl text-[#849E8F]">
            Un resumen de los activos que componen el portafolio, con
            información de precios y cambios diarios, incluyendo sector e
            industria.
          </p>
        </header>

        {/* --- FORMULARIO PARA AÑADIR TICKERS Y BOTÓN DE ELIMINAR --- */}
        <section className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-[#0A2342] mb-6">
            Gestionar Activos
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <form
              onSubmit={handleAddTicker}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center w-full sm:w-auto"
            >
              <input
                type="text"
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0A2342] w-full sm:w-auto text-gray-900"
                placeholder="Introduce un Ticker (ej: GOOGL)"
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                disabled={addingTicker}
              />
              <button
                type="submit"
                className="bg-[#0A2342] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto disabled:bg-gray-400"
                disabled={addingTicker}
              >
                {addingTicker ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                )}
                Añadir Activo
              </button>
            </form>
            <button
              onClick={openDeleteConfirmModal}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-200 flex items-center justify-center w-full sm:w-auto disabled:bg-gray-400"
              disabled={deletingPortfolio}
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              {deletingPortfolio ? "Eliminando..." : "Eliminar Portafolio"}
            </button>
          </div>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4 text-center">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline ml-2">{error}</span>
            </div>
          )}
        </section>

        {/* Sección de Activos en Cartera */}
        <section className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
          <h2 className="text-3xl font-bold text-center text-[#0A2342] mb-6">
            Activos en Cartera
          </h2>
          {loading ? (
            <div className="text-center py-10 text-gray-500">
              <svg
                className="animate-spin h-8 w-8 text-blue-500 mx-auto"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <p className="mt-4">Cargando datos...</p>
            </div>
          ) : sortedAssets.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              <p>No se encontraron activos para mostrar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-lg">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                <thead className="bg-gray-100 border-b border-gray-200">
                  <tr>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Item
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Activo
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Ticker
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-[#0A2342] transition-colors duration-200"
                      onClick={toggleSortBySector}
                    >
                      <div className="flex items-center">
                        Sector
                        {sortBy === "sector" ? (
                          <ChevronUpIcon className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider cursor-pointer hover:text-[#0A2342] transition-colors duration-200"
                      onClick={toggleSortByIndustry}
                    >
                      <div className="flex items-center">
                        Industria
                        {sortBy === "industry" ? (
                          <ChevronUpIcon className="ml-1 h-4 w-4" />
                        ) : (
                          <ChevronDownIcon className="ml-1 h-4 w-4" />
                        )}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Precio Actual
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Cambio % Diario
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Informe
                    </th>
                    <th
                      scope="col"
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedAssets.map((asset, index) => (
                    <tr
                      key={asset.ticker}
                      className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="py-4 px-6 text-sm text-gray-800 font-medium">
                        {index + 1}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {asset.name}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {asset.ticker}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {asset.sector}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {asset.industry}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800">
                        {asset.price !== null
                          ? `$${asset.price.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td
                        className={`py-4 px-6 text-sm font-semibold ${getPriceColor(
                          asset.dailyChange
                        )}`}
                      >
                        {asset.dailyChange !== null
                          ? `${(asset.dailyChange * 100).toFixed(2)}%`
                          : "N/A"}
                      </td>
                      <td className="py-4 px-6 text-sm">
                        {asset.error ? (
                          <span className="text-red-500 text-xs">
                            Error de carga
                          </span>
                        ) : (
                          <a
                            href={`/stock-screener/${asset.ticker.toLowerCase()}`}
                            className="text-blue-600 hover:text-blue-800 font-medium underline transition-colors duration-200"
                          >
                            Ver más
                          </a>
                        )}
                      </td>
                      <td className="py-4 px-6 text-sm text-gray-800 flex justify-center items-center">
                        <button
                          onClick={() => handleDeleteTicker(asset.ticker)}
                          className="text-red-600 hover:text-red-800 transition-colors duration-200 cursor-pointer"
                          title={`Eliminar ${asset.ticker}`}
                        >
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="text-center mt-12 pt-8 border-t border-gray-200">
          <h3 className="font-bold mb-2 text-[#0A2342]">Aviso Legal</h3>
          <p className="text-xs text-[#849E8F] max-w-4xl mx-auto">
            El contenido de este portafolio tiene fines puramente educativos e
            informativos y no constituye en ningún caso asesoramiento de
            inversión. La operativa con activos financieros implica un alto
            grado de riesgo y puede no ser adecuada para todos los inversores.
            Existe la posibilidad de que se incurra en pérdidas que superen la
            inversión inicial. Los resultados pasados no son indicativos de
            resultados futuros.
          </p>
        </footer>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm relative text-center">
            <ExclamationCircleIcon className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              ¿Estás seguro de que quieres eliminar este portafolio?
            </h3>
            <p className="text-gray-600 mb-6">
              Esta acción es irreversible y eliminará el portafolio &quot;
              {portfolio.name}&quot; de forma permanente.
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeDeleteConfirmModal}
                className="px-6 py-2 bg-gray-300 text-gray-800 rounded-md font-semibold hover:bg-gray-400 transition-colors disabled:bg-gray-400"
                disabled={deletingPortfolio}
              >
                Cancelar
              </button>
              <button
                onClick={confirmDeletePortfolio}
                className="px-6 py-2 bg-red-600 text-white rounded-md font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-400"
                disabled={deletingPortfolio}
              >
                {deletingPortfolio ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
