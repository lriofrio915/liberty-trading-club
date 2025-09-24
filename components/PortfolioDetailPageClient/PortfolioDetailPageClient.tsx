"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TrashIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  FolderIcon,
  ArrowRightIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Portfolio, ApiAssetItem } from "@/types/api";
import {
  addTickerToPortfolio,
  removeTickerFromPortfolio,
  deletePortfolio,
  createCartera,
} from "@/app/actions/portfolioActions";

interface AssetData {
  ticker: string;
  name: string;
  sector: string;
  industry: string;
  price: number | null;
  dailyChange: number | null;
}

interface Props {
  portfolio: Portfolio;
}

export default function PortfolioDetailPageClient({
  portfolio: initialPortfolio,
}: Props) {
  const [portfolio, setPortfolio] = useState<Portfolio>(initialPortfolio);
  const [assets, setAssets] = useState<AssetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTickerInput, setNewTickerInput] = useState("");
  const [sortBy, setSortBy] = useState<"sector" | "industry" | "none">("none");
  const router = useRouter();

  // --- Estados para el modal de Crear Cartera ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCarteraName, setNewCarteraName] = useState("");
  const [isCreatingCartera, setIsCreatingCartera] = useState(false);

  const fetchAssetData = useCallback(async (tickers: string[]) => {
    if (tickers.length === 0) {
      setAssets([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/stocks?tickers=${tickers.join(",")}`);
      const result = await response.json();
      if (!result.success)
        throw new Error(result.message || "Error fetching asset data");

      const fetchedAssets = result.data.map((item: ApiAssetItem) => ({
        ticker: item.ticker,
        name: item.data.price?.longName || item.ticker,
        sector: item.data.assetProfile?.sector || "N/A",
        industry: item.data.assetProfile?.industry || "N/A",
        price: item.data.price?.regularMarketPrice ?? null,
        dailyChange: item.data.price?.regularMarketChangePercent ?? null,
      }));
      setAssets(fetchedAssets);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assets.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAssetData(portfolio.tickers);
  }, [portfolio.tickers, fetchAssetData]);

  const sortedAssets = useMemo(() => {
    const sortableAssets = [...assets];
    if (sortBy === "sector")
      return sortableAssets.sort((a, b) => a.sector.localeCompare(b.sector));
    if (sortBy === "industry")
      return sortableAssets.sort((a, b) =>
        a.industry.localeCompare(b.industry)
      );
    return sortableAssets;
  }, [assets, sortBy]);

  const handleAddTicker = async (e: React.FormEvent) => {
    e.preventDefault();
    const tickerToAdd = newTickerInput.trim().toUpperCase();
    if (!tickerToAdd) return;
    try {
      const updatedPortfolio = await addTickerToPortfolio(
        portfolio.slug,
        tickerToAdd
      );
      setPortfolio(updatedPortfolio);
      setNewTickerInput("");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo añadir el ticker."
      );
    }
  };

  const handleDeleteTicker = async (tickerToDelete: string) => {
    try {
      const updatedPortfolio = await removeTickerFromPortfolio(
        portfolio.slug,
        tickerToDelete
      );
      setPortfolio(updatedPortfolio);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "No se pudo eliminar el ticker."
      );
    }
  };

  const handleDeletePortfolio = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este portafolio?")
    ) {
      try {
        await deletePortfolio(portfolio.slug);
        router.push("/portafolio");
        router.refresh();
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo eliminar el portafolio."
        );
      }
    }
  };

  const handleCreateCartera = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCarteraName) return;

    setIsCreatingCartera(true);
    setError(null);
    try {
      await createCartera(portfolio.slug, newCarteraName);
      setNewCarteraName("");
      setIsModalOpen(false);

      // SOLUCIÓN: Esta línea refresca los datos y actualiza la lista automáticamente.
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Error al crear la cartera."
      );
    } finally {
      setIsCreatingCartera(false);
    }
  };

  const getPriceColor = (change: number | null) => {
    if (change === null) return "text-gray-500";
    return change * 100 > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 text-gray-800 pt-2 font-inter">
        <div className="container mx-auto p-4 md:p-8 max-w-7xl">
          <header className="text-center mb-12 mt-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] mb-4">
              Portafolio de {portfolio.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-600">
              Gestiona tu lista de seguimiento principal y organiza tus activos
              en carteras.
            </p>
          </header>

          {error && (
            <div
              className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md"
              role="alert"
            >
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          )}

          <section className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
            <h2 className="text-2xl font-bold text-center text-[#0A2342] mb-6">
              Gestionar Lista Principal
            </h2>
            <form
              onSubmit={handleAddTicker}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4"
            >
              <input
                type="text"
                value={newTickerInput}
                onChange={(e) => setNewTickerInput(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-900 w-full sm:w-auto"
                placeholder="Añadir Ticker a la lista principal"
              />
              <button
                type="submit"
                className="bg-[#0A2342] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center w-full sm:w-auto"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" /> Añadir Activo
              </button>
            </form>
            <div className="text-center">
              <button
                onClick={handleDeletePortfolio}
                className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center w-full sm:w-auto mx-auto"
              >
                <TrashIcon className="h-5 w-5 mr-2" /> Eliminar Portafolio
                Completo
              </button>
            </div>
          </section>

          <section className="bg-white rounded-lg shadow-xl p-6 md:p-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Activos en Seguimiento (Lista Principal)
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      ITEM
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      ACTIVO
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      TICKER
                    </th>
                    <th
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase cursor-pointer"
                      onClick={() =>
                        setSortBy(sortBy === "sector" ? "none" : "sector")
                      }
                    >
                      SECTOR{" "}
                      {sortBy === "sector" ? (
                        <ChevronUpIcon className="h-4 w-4 inline" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 inline" />
                      )}
                    </th>
                    <th
                      className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase cursor-pointer"
                      onClick={() =>
                        setSortBy(sortBy === "industry" ? "none" : "industry")
                      }
                    >
                      INDUSTRIA{" "}
                      {sortBy === "industry" ? (
                        <ChevronUpIcon className="h-4 w-4 inline" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 inline" />
                      )}
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      PRECIO ACTUAL
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      CAMBIO % DIARIO
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      INFORME
                    </th>
                    <th className="py-3 px-6 text-left text-sm font-semibold text-gray-700 uppercase">
                      ACCIONES
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        Cargando activos...
                      </td>
                    </tr>
                  ) : sortedAssets.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="text-center py-8 text-gray-500"
                      >
                        No hay activos en la lista principal.
                      </td>
                    </tr>
                  ) : (
                    sortedAssets.map((asset, index) => (
                      <tr key={asset.ticker} className="hover:bg-gray-50">
                        <td className="py-4 px-6 text-sm text-gray-800">
                          {index + 1}
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-gray-900">
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
                          {asset.price ? `$${asset.price.toFixed(2)}` : "N/A"}
                        </td>
                        <td
                          className={`py-4 px-6 text-sm font-semibold ${getPriceColor(
                            asset.dailyChange
                          )}`}
                        >
                          {asset.dailyChange
                            ? `${(asset.dailyChange * 100).toFixed(2)}%`
                            : "N/A"}
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <Link
                            href={`/stock-screener/${asset.ticker.toLowerCase()}`}
                            className="text-blue-600 hover:underline"
                          >
                            Ver más
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-sm">
                          <button
                            onClick={() => handleDeleteTicker(asset.ticker)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-16">
            <header className="text-center mb-8">
              <h2 className="text-3xl font-extrabold text-[#0A2342]">
                Carteras Bajo Administración
              </h2>
              <p className="mt-2 text-lg text-gray-600">
                Organiza tus activos en carteras según tu estrategia.
              </p>
            </header>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <button
                onClick={() => setIsModalOpen(true)}
                disabled={isCreatingCartera}
                className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center justify-center text-center border-2 border-dashed border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300 cursor-pointer group disabled:opacity-50"
              >
                <PlusCircleIcon className="h-12 w-12 text-gray-400 group-hover:text-indigo-600" />
                <p className="mt-4 text-lg font-semibold text-gray-700 group-hover:text-indigo-800">
                  {isCreatingCartera ? "Creando..." : "Crear Nueva Cartera"}
                </p>
              </button>
              {portfolio.carteras?.map((cartera) => (
                <div
                  key={cartera.slug}
                  className="bg-white rounded-lg shadow-lg p-6 flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer"
                  onClick={() =>
                    router.push(`/portafolio/${portfolio.slug}/${cartera.slug}`)
                  }
                >
                  <div>
                    <div className="flex items-center mb-4">
                      <FolderIcon className="h-8 w-8 text-indigo-500 mr-3" />
                      <h2 className="text-xl font-bold text-gray-800 truncate">
                        {cartera.name}
                      </h2>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">
                      {cartera.tickers.length} activo(s) en seguimiento.
                    </p>
                  </div>
                  <div className="mt-6 w-full inline-flex items-center justify-center px-4 py-2 border rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600">
                    Gestionar <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white text-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-900"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-4 text-center">
              Crear Nueva Cartera
            </h2>
            <form onSubmit={handleCreateCartera}>
              <div className="mb-4">
                <label
                  htmlFor="carteraName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Nombre de la Cartera
                </label>
                <input
                  type="text"
                  id="carteraName"
                  value={newCarteraName}
                  onChange={(e) => setNewCarteraName(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-gray-900 px-3 py-2"
                  placeholder="Ej: Bajo Riesgo, Tecnológicas..."
                  required
                />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="flex justify-end space-x-2 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isCreatingCartera}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 disabled:bg-indigo-300"
                >
                  {isCreatingCartera ? "Creando..." : "Crear"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
