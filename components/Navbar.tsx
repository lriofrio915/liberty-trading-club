// components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bars3Icon, XMarkIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isStrategy1DropdownOpen, setIsStrategy1DropdownOpen] = useState(false);
  const [isStrategy2DropdownOpen, setIsStrategy2DropdownOpen] = useState(false);
  const [isStrategy3DropdownOpen, setIsStrategy3DropdownOpen] = useState(false);

  const strategy1DropdownRef = useRef<HTMLDivElement>(null);
  const strategy2DropdownRef = useRef<HTMLDivElement>(null);
  const strategy3DropdownRef = useRef<HTMLDivElement>(null);

  // Función para cerrar todos los menús y dropdowns
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsStrategy1DropdownOpen(false);
    setIsStrategy2DropdownOpen(false);
    setIsStrategy3DropdownOpen(false);
  };

  // Manejar clics fuera de CUALQUIER dropdown para cerrarlo
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        strategy1DropdownRef.current && !strategy1DropdownRef.current.contains(event.target as Node) &&
        strategy2DropdownRef.current && !strategy2DropdownRef.current.contains(event.target as Node) &&
        strategy3DropdownRef.current && !strategy3DropdownRef.current.contains(event.target as Node)
      ) {
        setIsStrategy1DropdownOpen(false);
        setIsStrategy2DropdownOpen(false);
        setIsStrategy3DropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [strategy1DropdownRef, strategy2DropdownRef, strategy3DropdownRef]);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0A2342] p-4 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200" onClick={closeAllMenus}>
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
              setIsStrategy1DropdownOpen(false); // Close other dropdowns when mobile menu opens/closes
              setIsStrategy2DropdownOpen(false);
              setIsStrategy3DropdownOpen(false);
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
          {/* Estrategia 1 con Dropdown (NQ) */}
          <div className="relative" ref={strategy1DropdownRef}>
            <button
              onClick={() => {
                setIsStrategy1DropdownOpen(!isStrategy1DropdownOpen);
                setIsStrategy2DropdownOpen(false); // Close others
                setIsStrategy3DropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none"
            >
              Estrategia 1 (NQ)
              {isStrategy1DropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isStrategy1DropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link href="/manuales/Nasdaq" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Manual NQ
                </Link>
                <Link href="/informes/NQ" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Informes NQ
                </Link>
                <Link href="/sentimiento-macro/NQ" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Sentimiento Macro NQ
                </Link>
              </div>
            )}
          </div>

          {/* Estrategia 2 con Dropdown (MES) */}
          <div className="relative" ref={strategy2DropdownRef}>
            <button
              onClick={() => {
                setIsStrategy2DropdownOpen(!isStrategy2DropdownOpen);
                setIsStrategy1DropdownOpen(false); // Close others
                setIsStrategy3DropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none"
            >
              Estrategia 2 (MES)
              {isStrategy2DropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isStrategy2DropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link href="/manuales/SP500-1" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Manual MES
                </Link>
                <Link href="/informes/MES" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Informes MES
                </Link>
                <Link href="/sentimiento-macro/MES" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Sentimiento Macro MES
                </Link>
              </div>
            )}
          </div>

          {/* Estrategia 3 con Dropdown (ES) */}
          <div className="relative" ref={strategy3DropdownRef}>
            <button
              onClick={() => {
                setIsStrategy3DropdownOpen(!isStrategy3DropdownOpen);
                setIsStrategy1DropdownOpen(false); // Close others
                setIsStrategy2DropdownOpen(false);
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none"
            >
              Estrategia 3 (ES)
              {isStrategy3DropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isStrategy3DropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <Link href="/manuales/SP500-2" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Manual ES
                </Link>
                <Link href="/informes/ES" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Informes ES
                </Link>
                <Link href="/sentimiento-macro/ES" className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200" onClick={closeAllMenus}>
                  Sentimiento Macro ES
                </Link>
              </div>
            )}
          </div>

          {/* Enlace de Contacto (si aplica) */}
          <Link href="/contacto" className="hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium">
            Contacto
          </Link>
        </div>
      </div>

      {/* Menú Desplegable para Móvil (Hamburguesa) */}
      <div
        className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} mt-4 space-y-3 pb-2 px-2 transition-all duration-300 ease-in-out`}
      >
        {/* Estrategia 1 (NQ - aplanado en móvil) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">Estrategia 1 (NQ):</span>
        <Link href="/manuales/Nasdaq" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Manual NQ
        </Link>
        <Link href="/informes/NQ" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Informes NQ
        </Link>
        <Link href="/sentimiento-macro/NQ" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Sentimiento Macro NQ
        </Link>

        <hr className="border-gray-700 my-2" />

        {/* Estrategia 2 (MES - aplanado en móvil) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">Estrategia 2 (MES):</span>
        <Link href="/manuales/SP500-1" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Manual MES
        </Link>
        <Link href="/informes/MES" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Informes MES
        </Link>
        <Link href="/sentimiento-macro/MES" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Sentimiento Macro MES
        </Link>

        <hr className="border-gray-700 my-2" />

        {/* Estrategia 3 (ES - aplanado en móvil) */}
        <span className="block text-gray-400 text-sm font-semibold px-3 py-2">Estrategia 3 (ES):</span>
        <Link href="/manuales/SP500-2" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Manual ES
        </Link>
        <Link href="/informes/ES" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Informes ES
        </Link>
        <Link href="/sentimiento-macro/ES" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6" onClick={closeAllMenus}>
          Sentimiento Macro ES
        </Link>

        <hr className="border-gray-700 my-2" />

        {/* Contacto (si aplica) */}
        <Link href="/contacto" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium" onClick={closeAllMenus}>
          Contacto
        </Link>
      </div>
    </nav>
  );
}