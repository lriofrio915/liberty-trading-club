"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  TrashIcon,
  PlusCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { Portfolio, ApiAssetItem } from "@/types/api";
import {
  addTickerToPortfolio,
  removeTickerFromPortfolio,
  deletePortfolio,
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
    if (sortBy === "sector") {
      return sortableAssets.sort((a, b) => a.sector.localeCompare(b.sector));
    }
    if (sortBy === "industry") {
      return sortableAssets.sort((a, b) =>
        a.industry.localeCompare(b.industry)
      );
    }
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

  // 1. CORRECCIÓN PRINCIPAL AQUÍ
  const handleDeletePortfolio = async () => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este portafolio?")
    ) {
      try {
        await deletePortfolio(portfolio.slug);
        router.push("/portafolio"); // Primero, redirige al usuario
        router.refresh(); // Luego, refresca los datos del servidor para esa nueva ruta
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "No se pudo eliminar el portafolio."
        );
      }
    }
  };

  const getPriceColor = (change: number | null) => {
    if (change === null) return "text-gray-500";
    return change * 100 > 0 ? "text-green-600" : "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 pt-2 font-inter">
      <div className="container mx-auto p-4 md:p-8 max-w-7xl">
        <header className="text-center mb-12 mt-8">
          <h1 className="text-4xl md:text-5xl font-extrabold text-[#0A2342] mb-4">
            Portafolio de {portfolio.name}
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Un resumen de los activos que componen el portafolio.
          </p>
        </header>

        <section className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
          <h2 className="text-2xl font-bold text-center text-[#0A2342] mb-6">
            Gestionar Activos
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
              placeholder="Añadir Ticker (ej: GOOGL)"
            />
            <button
              type="submit"
              className="bg-[#0A2342] text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-800 flex items-center justify-center w-full sm:w-auto"
            >
              <PlusCircleIcon className="h-5 w-5 mr-2" />
              Añadir Activo
            </button>
          </form>
          <div className="text-center">
            <button
              onClick={handleDeletePortfolio}
              className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 flex items-center justify-center w-full sm:w-auto mx-auto"
            >
              <TrashIcon className="h-5 w-5 mr-2" />
              Eliminar Portafolio
            </button>
          </div>
        </section>

        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        <section className="bg-white rounded-lg shadow-xl p-6 md:p-8">
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
                    <td colSpan={9} className="text-center py-8 text-gray-500">
                      Cargando activos...
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
      </div>
    </div>
  );
}
