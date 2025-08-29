"use client";

import { useState, FormEvent, RefObject } from "react";
import { useRouter } from "next/navigation";
import { XMarkIcon } from "@heroicons/react/24/outline";
// Asegúrate de que la ruta de importación coincida con tu estructura de archivos
import { Portfolio } from "../../types/api";

interface AddPortfolioFormProps {
  onClose: () => void;
  onPortfolioAdded: (portfolio: Portfolio) => void;
  formRef: RefObject<HTMLDivElement | null>;
}

const AddPortfolioForm: React.FC<AddPortfolioFormProps> = ({
  onClose,
  onPortfolioAdded,
  formRef,
}) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [tickers, setTickers] = useState("");
  const router = useRouter();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    const operadorSlug = `${nombre.toLowerCase()}-${apellido.toLowerCase()}`;
    const tickersArray = tickers
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t !== "");

    const newPortfolio: Portfolio = {
      name: `${nombre} ${apellido}`,
      slug: operadorSlug,
      tickers: tickersArray,
    };

    onPortfolioAdded(newPortfolio);
    router.push(`/portafolio/${operadorSlug}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div
        ref={formRef}
        className="bg-white text-gray-800 p-6 rounded-lg shadow-xl w-full max-w-md relative border border-gray-200"
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
        <h2 className="text-2xl font-bold mb-4">Agregar Nuevo Portafolio</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700"
            >
              Nombre:
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-gray-700"
            >
              Apellido:
            </label>
            <input
              type="text"
              id="apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 px-3 py-2"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="tickers"
              className="block text-sm font-medium text-gray-700"
            >
              Tickers (separados por comas):
            </label>
            <input
              type="text"
              id="tickers"
              value={tickers}
              onChange={(e) => setTickers(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-gray-900 px-3 py-2"
              placeholder="Ej: AAPL, TSLA, GOOG"
              required
            />
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition-colors"
            >
              Crear Portafolio
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPortfolioForm;
