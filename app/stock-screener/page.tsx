"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, ChartBarIcon } from "@heroicons/react/24/outline";

// Interfaz para los resultados/sugerencias de la búsqueda
interface SearchSuggestion {
  symbol: string;
  shortname?: string;
  longname?: string;
  exchange?: string;
  quoteType?: string;
}

export default function StockScreener() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isListVisible, setIsListVisible] = useState(false);
  const router = useRouter();

  const fetchSuggestions = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    setError(null);
    setIsListVisible(true);

    try {
      // Llamamos al nuevo endpoint de búsqueda
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(searchQuery)}`
      );
      if (!response.ok) throw new Error("Error en la red al buscar.");

      const data = await response.json();
      if (data.success && data.data) {
        setSuggestions(
          data.data.filter(
            (item: SearchSuggestion) => item.quoteType === "EQUITY"
          )
        ); // Filtramos para mostrar solo acciones (Equity)
      } else {
        setSuggestions([]);
      }
    } catch (err) {
      console.error("Error buscando sugerencias:", err);
      setError("No se pudieron obtener sugerencias.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchSuggestions(query);
    }, 300); // Debounce de 300ms para una respuesta más rápida

    return () => clearTimeout(timer);
  }, [query, fetchSuggestions]);

  const viewReport = (ticker: string) => {
    setQuery(""); // Limpia la búsqueda
    setSuggestions([]); // Oculta las sugerencias
    setIsListVisible(false);
    router.push(`/stock-screener/${ticker.toLowerCase()}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Stock Screener
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Busca acciones por ticker o nombre y accede a sus informes
            financieros.
          </p>
        </div>

        {/* Barra de búsqueda con contenedor relativo para las sugerencias */}
        <div className="relative">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-4 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Buscar por ticker o nombre (ej: AAPL o Apple)"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => setIsListVisible(true)}
                onBlur={() => setTimeout(() => setIsListVisible(false), 200)} // Pequeño delay para permitir el clic
              />
            </div>
          </div>

          {/* Lista de Sugerencias (Autocompletado) */}
          {isListVisible && query.length >= 2 && (
            <div className="absolute z-10 w-full mt-1 bg-white rounded-lg shadow-lg">
              {loading && <div className="p-4 text-gray-500">Buscando...</div>}
              {error && <div className="p-4 text-red-500">{error}</div>}
              {!loading && suggestions.length > 0 && (
                <ul className="max-h-60 overflow-y-auto">
                  {suggestions.map((item) => (
                    <li
                      key={item.symbol}
                      className="px-4 py-3 hover:bg-indigo-50 cursor-pointer"
                      onMouseDown={() => viewReport(item.symbol)} // Usamos onMouseDown para que se dispare antes del onBlur del input
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-indigo-700">
                            {item.symbol}
                          </p>
                          <p className="text-sm text-gray-600">
                            {item.shortname || item.longname}
                          </p>
                        </div>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                          {item.exchange}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {!loading && suggestions.length === 0 && query.length > 1 && (
                <div className="p-4 text-gray-500">
                  No se encontraron acciones.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Información adicional cuando no hay búsqueda */}
        {!query && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Comienza tu búsqueda
            </h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Escribe al menos 2 caracteres para ver sugerencias.</li>
              <li>Puedes buscar por el símbolo del ticker (ej: "MSFT").</li>
              <li>
                También puedes buscar por el nombre de la empresa (ej:
                "Microsoft").
              </li>
              <li>
                Selecciona un resultado para ver el informe financiero completo.
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
