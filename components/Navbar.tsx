// components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  // Nuevo estado para el menú de Operativa
  const [isOperativaDropdownOpen, setIsOperativaDropdownOpen] = useState(false);
  // Estados existentes para los otros menús
  const [isEstrategiasDropdownOpen, setIsEstrategiasDropdownOpen] = useState(false);
  const [isInformesDropdownOpen, setIsInformesDropdownOpen] = useState(false);
  const [isAnalisisDropdownOpen, setIsAnalisisDropdownOpen] = useState(false);

  // Nueva referencia para el menú de Operativa
  const operativaDropdownRef = useRef<HTMLDivElement>(null);
  // Referencias existentes
  const estrategiasDropdownRef = useRef<HTMLDivElement>(null);
  const informesDropdownRef = useRef<HTMLDivElement>(null);
  const analisisDropdownRef = useRef<HTMLDivElement>(null);

  // Función para cerrar todos los menús y dropdowns
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsOperativaDropdownOpen(false); // Incluimos el nuevo menú
    setIsEstrategiasDropdownOpen(false);
    setIsInformesDropdownOpen(false);
    setIsAnalisisDropdownOpen(false);
  };

  // Manejar clics fuera de CUALQUIER dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        operativaDropdownRef.current &&
        !operativaDropdownRef.current.contains(target) &&
        estrategiasDropdownRef.current &&
        !estrategiasDropdownRef.current.contains(target) &&
        informesDropdownRef.current &&
        !informesDropdownRef.current.contains(target) &&
        analisisDropdownRef.current &&
        !analisisDropdownRef.current.contains(target)
      ) {
        setIsOperativaDropdownOpen(false);
        setIsEstrategiasDropdownOpen(false);
        setIsInformesDropdownOpen(false);
        setIsAnalisisDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [operativaDropdownRef, estrategiasDropdownRef, informesDropdownRef, analisisDropdownRef]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0A2342] p-4 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
          onClick={closeAllMenus}
        >
          <Image
            src="https://i.ibb.co/20RsFG5H/emporium-logo-1.jpg"
            alt="Emporium Quality Funds Logo"
            width={50}
            height={50}
            className="rounded-full mr-2"
          />
        </Link>

        {/* Botón de Hamburguesa para Móvil */}
        <div className="md:hidden">
          <button
            onClick={() => {
              setIsMobileMenuOpen(!isMobileMenuOpen);
              closeAllMenus(); // Asegura que todos los dropdowns se cierren en móvil
            }}
            className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 p-1 rounded"
            aria-label="Toggle navigation"
          >
            {isMobileMenuOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>

        {/* Enlaces de Navegación para Escritorio */}
        <div className="hidden md:flex space-x-6 items-center">
          {/* Menú desplegable de Operativa (NUEVO) */}
          <div className="relative" ref={operativaDropdownRef}>
            <button
              onClick={() => {
                setIsOperativaDropdownOpen(!isOperativaDropdownOpen);
                setIsEstrategiasDropdownOpen(false);
                setIsInformesDropdownOpen(false);
                setIsAnalisisDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
            >
              Operativa
              {isOperativaDropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isOperativaDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/operativas/aluisa-diego"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Aluisa Diego
                </Link>
                <Link
                  href="/operativas/riofrio-luis"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Riofrío Luis
                </Link>
                <Link
                  href="/operativas/saa-mateo"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Saa Mateo
                </Link>
                <Link
                  href="/operativas/tenesaca-jose"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Tenesaca Jose
                </Link>
              </div>
            )}
          </div>

          {/* Menú desplegable de Estrategias (EXISTENTE) */}
          <div className="relative" ref={estrategiasDropdownRef}>
            <button
              onClick={() => {
                setIsEstrategiasDropdownOpen(!isEstrategiasDropdownOpen);
                setIsOperativaDropdownOpen(false); // Cierra los demás
                setIsInformesDropdownOpen(false);
                setIsAnalisisDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
            >
              Estrategias
              {isEstrategiasDropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isEstrategiasDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/manuales/Nasdaq"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Estrategia NQ
                </Link>
                <Link
                  href="/manuales/SP500-1"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Estrategia MES
                </Link>
                <Link
                  href="/manuales/SP500-2"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Estrategia ES
                </Link>
              </div>
            )}
          </div>

          {/* Menú desplegable de Informes (EXISTENTE) */}
          <div className="relative" ref={informesDropdownRef}>
            <button
              onClick={() => {
                setIsInformesDropdownOpen(!isInformesDropdownOpen);
                setIsOperativaDropdownOpen(false);
                setIsEstrategiasDropdownOpen(false);
                setIsAnalisisDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
            >
              Informes
              {isInformesDropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isInformesDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/informes/NQ"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Informes NQ
                </Link>
                <Link
                  href="/informes/MES"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Informes MES
                </Link>
                <Link
                  href="/informes/ES"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Informes ES
                </Link>
              </div>
            )}
          </div>

          {/* Menú desplegable de Análisis Fundamental (EXISTENTE) */}
          <div className="relative" ref={analisisDropdownRef}>
            <button
              onClick={() => {
                setIsAnalisisDropdownOpen(!isAnalisisDropdownOpen);
                setIsOperativaDropdownOpen(false);
                setIsEstrategiasDropdownOpen(false);
                setIsInformesDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
            >
              Análisis Fundamental
              {isAnalisisDropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isAnalisisDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link
                  href="/sentimiento-macro/NQ"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Nasdaq
                </Link>
                <Link
                  href="/sentimiento-macro/ES"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  S&P 500
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Menú Desplegable para Móvil (Hamburguesa) */}
      <div
        className={`md:hidden ${
          isMobileMenuOpen ? "block" : "hidden"
        } mt-4 space-y-3 pb-2 px-2 transition-all duration-300 ease-in-out`}
      >
        {/* Operativa (NUEVO) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
          Operativa:
        </span>
        <Link
          href="/operativas/aluisa-diego"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Aluisa Diego
        </Link>
        <Link
          href="/operativas/riofrio-luis"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Riofrío Luis
        </Link>
        <Link
          href="/operativas/saa-mateo"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Saa Mateo
        </Link>
        <Link
          href="/operativas/tenesaca-jose"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Tenesaca Jose
        </Link>

        <hr className="border-gray-700 my-2" />

        {/* Estrategias (EXISTENTE) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
          Estrategias:
        </span>
        <Link
          href="/manuales/Nasdaq"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Estrategia NQ
        </Link>
        <Link
          href="/manuales/SP500-1"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Estrategia MES
        </Link>
        <Link
          href="/manuales/SP500-2"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Estrategia ES
        </Link>

        <hr className="border-gray-700 my-2" />

        {/* Informes (EXISTENTE) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
          Informes:
        </span>
        <Link
          href="/informes/NQ"
          className="block px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Informes NQ
        </Link>
        <Link
          href="/informes/MES"
          className="block px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Informes MES
        </Link>
        <Link
          href="/informes/ES"
          className="block px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Informes ES
        </Link>

        <hr className="border-gray-700 my-2" />

        {/* Análisis Fundamental (EXISTENTE) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
          Análisis Fundamental:
        </span>
        <Link
          href="/sentimiento-macro/NQ"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          Nasdaq
        </Link>
        <Link
          href="/sentimiento-macro/ES"
          className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
          onClick={closeAllMenus}
        >
          S&P 500
        </Link>
      </div>
    </nav>
  );
}