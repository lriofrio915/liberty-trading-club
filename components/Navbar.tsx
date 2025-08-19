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
  const [isEstrategiasDropdownOpen, setIsEstrategiasDropdownOpen] = useState(false);
  const [isInformesDropdownOpen, setIsInformesDropdownOpen] = useState(false);
  const [isSesgoDiarioDropdownOpen, setIsSesgoDiarioDropdownOpen] = useState(false);

  const estrategiasDropdownRef = useRef<HTMLDivElement>(null);
  const informesDropdownRef = useRef<HTMLDivElement>(null);
  const sesgoDiarioDropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsEstrategiasDropdownOpen(false);
    setIsInformesDropdownOpen(false);
    setIsSesgoDiarioDropdownOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      
      // Cerrar menús desplegables de escritorio si se hace clic fuera
      if (
        (estrategiasDropdownRef.current && !estrategiasDropdownRef.current.contains(target)) &&
        (informesDropdownRef.current && !informesDropdownRef.current.contains(target)) &&
        (sesgoDiarioDropdownRef.current && !sesgoDiarioDropdownRef.current.contains(target)) &&
        !(target as HTMLElement).closest('button[aria-label="Toggle navigation"]')
      ) {
        closeAllMenus();
      }
      
      // Cerrar menú móvil si se hace clic fuera
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0A2342] py-4 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
          onClick={closeAllMenus}
        >
          <Image
            src="https://i.ibb.co/xqwwYbhz/liberty.png"
            alt="Liberty Trading Club Logo"
            width={50}
            height={50}
            className="rounded-full mr-2"
          />
        </Link>

        {/* Botón de Hamburguesa para Móvil */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white hover:text-gray-300 focus:outline-none p-1 rounded"
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
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
          {/* Menú desplegable de Estrategias */}
          <div className="relative" ref={estrategiasDropdownRef}>
            <button
              onClick={() => {
                setIsEstrategiasDropdownOpen(!isEstrategiasDropdownOpen);
                setIsInformesDropdownOpen(false);
                setIsSesgoDiarioDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              aria-expanded={isEstrategiasDropdownOpen}
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

          {/* Menú desplegable de Informes */}
          <div className="relative" ref={informesDropdownRef}>
            <button
              onClick={() => {
                setIsInformesDropdownOpen(!isInformesDropdownOpen);
                setIsEstrategiasDropdownOpen(false);
                setIsSesgoDiarioDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              aria-expanded={isInformesDropdownOpen}
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

          {/* Menú desplegable de Sesgo Diario */}
          <div className="relative" ref={sesgoDiarioDropdownRef}>
            <button
              onClick={() => {
                setIsSesgoDiarioDropdownOpen(!isSesgoDiarioDropdownOpen);
                setIsEstrategiasDropdownOpen(false);
                setIsInformesDropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              aria-expanded={isSesgoDiarioDropdownOpen}
            >
              Sesgo Diario
              {isSesgoDiarioDropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isSesgoDiarioDropdownOpen && (
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

          {/* Botón de Contacto */}
          <Link
            href="/contacto"
            className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors duration-200"
            onClick={closeAllMenus}
          >
            Contacto
          </Link>
        </div>
      </div>

      {/* Menú Desplegable para Móvil */}
      <div
        ref={mobileMenuRef}
        className={`md:hidden fixed top-16 left-0 w-full bg-[#0A2342] ${
          isMobileMenuOpen ? "block" : "hidden"
        } max-h-[calc(100vh-64px)] overflow-y-auto pb-4 transition-all duration-300 ease-in-out`}
      >
        <div className="space-y-3 pt-2 px-4">
          {/* Estrategias */}
          <div className="border-b border-gray-700 pb-2">
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
          </div>

          {/* Informes */}
          <div className="border-b border-gray-700 pb-2">
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
          </div>

          {/* Sesgo Diario */}
          <div className="border-b border-gray-700 pb-2">
            <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
              Sesgo Diario:
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

          {/* Botón de Contacto para móvil */}
          <div className="pt-4">
            <Link
              href="/contacto"
              className="block w-full text-center px-4 py-3 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors duration-200"
              onClick={closeAllMenus}
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}