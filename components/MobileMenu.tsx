// components/MobileMenu.tsx
"use client";

import Link from "next/link";
import { PlusCircleIcon } from "@heroicons/react/24/outline";

// Definimos las interfaces aquí también para que el componente sea autocontenido
interface Portfolio {
  name: string;
  slug: string;
}

interface MobileMenuProps {
  isOpen: boolean;
  closeMenu: () => void;
  portfolios: Portfolio[];
  handleOpenForm: () => void;
  openCoursesModal: () => void;
}

export default function MobileMenu({
  isOpen,
  closeMenu,
  portfolios,
  handleOpenForm,
  openCoursesModal,
}: MobileMenuProps) {
  if (!isOpen) {
    return null;
  }

  const handleLinkClick = () => {
    closeMenu();
  };

  const handleOpenFormClick = () => {
    handleOpenForm();
    closeMenu();
  };

  const handleOpenCoursesClick = () => {
    openCoursesModal();
    closeMenu();
  };

  return (
    <div className="md:hidden fixed inset-0 top-16 bg-[#0A2342] z-40 max-h-[calc(100vh-64px)] overflow-y-auto">
      <div className="px-4 pt-2 pb-4 space-y-3">
        {/* Herramientas */}
        <div className="border-b border-gray-700 pb-2">
          <span className="block px-3 py-2 text-sm font-semibold text-gray-400">
            Herramientas
          </span>
          <Link
            href="/stock-screener"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Stock Screener
          </Link>
          <Link
            href="/sentimiento-macro/NQ"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Sesgo Diario - Nasdaq
          </Link>
          <Link
            href="/sentimiento-macro/ES"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Sesgo Diario - S&P 500
          </Link>
        </div>

        {/* Portafolios */}
        <div className="border-b border-gray-700 pb-2">
          <span className="block px-3 py-2 text-sm font-semibold text-gray-400">
            Portafolios
          </span>
          <button
            onClick={handleOpenFormClick}
            className="flex items-center w-full rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
          >
            <PlusCircleIcon className="mr-2 h-5 w-5" />
            Agregar
          </button>
          {portfolios.length > 0 && <hr className="my-2 border-gray-700" />}
          {portfolios.map((p) => (
            <Link
              key={`mobile-${p.slug}`}
              href={`/portafolio/${p.slug}`}
              className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
              onClick={handleLinkClick}
            >
              {p.name}
            </Link>
          ))}
        </div>

        {/* Estrategias */}
        <div className="border-b border-gray-700 pb-2">
          <span className="block px-3 py-2 text-sm font-semibold text-gray-400">
            Estrategias
          </span>
          <Link
            href="/manuales/Nasdaq"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Estrategia NQ
          </Link>
          <Link
            href="/manuales/SP500-1"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Estrategia MES
          </Link>
          <Link
            href="/manuales/SP500-2"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Estrategia ES
          </Link>
        </div>

        {/* Informes */}
        <div className="border-b border-gray-700 pb-2">
          <span className="block px-3 py-2 text-sm font-semibold text-gray-400">
            Informes
          </span>
          <Link
            href="/informes/NQ"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Informes NQ
          </Link>
          <Link
            href="/informes/MES"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Informes MES
          </Link>
          <Link
            href="/informes/ES"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Informes ES
          </Link>
        </div>

        {/* Invertir */}
        <div className="border-b border-gray-700 pb-2">
          <span className="block px-3 py-2 text-sm font-semibold text-gray-400">
            Invertir
          </span>
          <Link
            href="/renta-fija"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Renta Fija
          </Link>
          <Link
            href="/renta-variable"
            className="block rounded-md px-3 py-2 text-base font-medium text-white hover:text-gray-300 pl-6"
            onClick={handleLinkClick}
          >
            Renta Variable
          </Link>
        </div>

        {/* Acciones Principales */}
        <div className="pt-2">
          <button
            onClick={handleOpenCoursesClick}
            className="block w-full rounded-md px-3 py-2 text-left text-base font-medium text-white hover:text-gray-300"
          >
            Cursos Gratis
          </button>
          <Link
            href="/contacto"
            className="mt-2 block w-full rounded-md bg-[#3B82F6] px-4 py-3 text-center text-base font-medium text-white hover:bg-[#2563EB]"
            onClick={handleLinkClick}
          >
            Contacto
          </Link>
        </div>
      </div>
    </div>
  );
}
