"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  Cog6ToothIcon,
  FolderOpenIcon,
} from "@heroicons/react/24/outline";
import { Portfolio } from "@/types/api";

// 1. Definimos las props que recibirá el Navbar desde el layout.
interface NavbarProps {
  portfolios: Portfolio[];
}

export default function Navbar({ portfolios }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const navbarRef = useRef<HTMLDivElement>(null);
  const coursesModalRef = useRef<HTMLDivElement>(null);

  // 2. Se elimina el `useEffect` que leía de localStorage.
  // Los datos ahora se reciben directamente a través de las props.

  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setOpenSubDropdown(null);
    setIsCoursesModalOpen(false);
  }, []);

  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    setOpenSubDropdown(null);
  };

  const toggleSubDropdown = (subDropdownName: string) => {
    setOpenSubDropdown(
      openSubDropdown === subDropdownName ? null : subDropdownName
    );
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node)
      ) {
        closeAllMenus();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeAllMenus]);

  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isCoursesModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isCoursesModalOpen]);

  // Funciones del modal de cursos
  const openCoursesModal = () => {
    closeAllMenus();
    setIsCoursesModalOpen(true);
  };
  const closeCoursesModal = () => setIsCoursesModalOpen(false);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    closeCoursesModal();
    window.location.href = "/cursos-gratis";
  };

  return (
    <>
      <nav
        ref={navbarRef}
        className="fixed top-0 left-0 w-full bg-[#0A2342] py-4 text-white shadow-lg z-50"
      >
        <div className="container mx-auto flex justify-between items-center px-4 md:px-6">
          <Link
            href="/"
            className="flex items-center hover:opacity-80 transition-opacity duration-200"
            onClick={closeAllMenus}
          >
            <Image
              src="https://i.ibb.co/VY4mMs15/icono.png"
              alt="Liberty Trading Club Logo"
              width={50}
              height={50}
              className="rounded-full mr-2"
            />
          </Link>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-white hover:text-gray-300 focus:outline-none p-1 rounded"
              aria-label="Toggle navigation"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-7 w-7" />
              ) : (
                <Bars3Icon className="h-7 w-7" />
              )}
            </button>
          </div>

          <div className="hidden md:flex space-x-6 items-center">
            {/* Estrategias */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("estrategias")}
                className="flex items-center text-white hover:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                Estrategias{" "}
                {openDropdown === "estrategias" ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              {openDropdown === "estrategias" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="/manuales/Nasdaq"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    Estrategia NQ
                  </Link>
                  <Link
                    href="/manuales/SP500-1"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    Estrategia MES
                  </Link>
                  <Link
                    href="/manuales/SP500-2"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    Estrategia ES
                  </Link>
                </div>
              )}
            </div>

            {/* Herramientas */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("herramientas")}
                className="flex items-center text-white hover:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-1" /> Herramientas{" "}
                {openDropdown === "herramientas" ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              {openDropdown === "herramientas" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                  <div className="relative group">
                    <button
                      onClick={() => toggleSubDropdown("sesgoDiario")}
                      className="flex justify-between items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    >
                      <span>Sesgo Diario</span>
                      {openSubDropdown === "sesgoDiario" ? (
                        <ChevronUpIcon className="ml-1 h-4 w-4" />
                      ) : (
                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                      )}
                    </button>
                    {openSubDropdown === "sesgoDiario" && (
                      <div className="absolute left-full top-0 mt-0 ml-1 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-20">
                        <Link
                          href="/sentimiento-macro/NQ"
                          className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                          onClick={closeAllMenus}
                        >
                          Nasdaq
                        </Link>
                        <Link
                          href="/sentimiento-macro/ES"
                          className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                          onClick={closeAllMenus}
                        >
                          S&P 500
                        </Link>
                      </div>
                    )}
                  </div>
                  <Link
                    href="/stock-screener"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    Stock Screener
                  </Link>
                </div>
              )}
            </div>

            {/* Portafolios */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("portafolios")}
                className="flex items-center text-white hover:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                Portafolios{" "}
                {openDropdown === "portafolios" ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              {openDropdown === "portafolios" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="/portafolio"
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    <FolderOpenIcon className="h-5 w-5 mr-2" /> Gestionar
                  </Link>
                  {portfolios.length > 0 && (
                    <hr className="border-gray-700 my-1" />
                  )}
                  {portfolios.map((portfolio) => (
                    <Link
                      key={portfolio.slug}
                      href={`/portafolio/${portfolio.slug}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                      onClick={closeAllMenus}
                    >
                      {portfolio.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Invertir */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("invertir")}
                className="flex items-center text-white hover:text-gray-300 px-3 py-2 rounded-md font-medium"
              >
                Invertir{" "}
                {openDropdown === "invertir" ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              {openDropdown === "invertir" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                  <Link
                    href="/renta-fija"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    Renta Fija
                  </Link>
                  <Link
                    href="/renta-variable"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E]"
                    onClick={closeAllMenus}
                  >
                    Renta Variable
                  </Link>
                </div>
              )}
            </div>

            <button
              onClick={openCoursesModal}
              className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB]"
            >
              Cursos Gratis
            </button>
            <Link
              href="/contacto"
              className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB]"
              onClick={closeAllMenus}
            >
              Contacto
            </Link>
          </div>
        </div>

        {/* Menú Móvil Completo */}
        <div
          className={`md:hidden fixed top-16 left-0 w-full bg-[#0A2342] ${
            isMobileMenuOpen ? "block" : "hidden"
          } max-h-[calc(100vh-64px)] overflow-y-auto pb-4`}
        >
          <div className="space-y-3 pt-2 px-4">
            <div className="border-b border-gray-700 pb-2">
              <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
                Herramientas:
              </span>
              <Link
                href="/stock-screener"
                className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                onClick={closeAllMenus}
              >
                Stock Screener
              </Link>
              <Link
                href="/sentimiento-macro/NQ"
                className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                onClick={closeAllMenus}
              >
                Sesgo Diario - Nasdaq
              </Link>
              <Link
                href="/sentimiento-macro/ES"
                className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                onClick={closeAllMenus}
              >
                Sesgo Diario - S&P 500
              </Link>
            </div>

            <div className="border-b border-gray-700 pb-2">
              <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
                Portafolios:
              </span>
              <Link
                href="/portafolio"
                className="flex items-center w-full text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                onClick={closeAllMenus}
              >
                <FolderOpenIcon className="h-5 w-5 mr-2" /> Gestionar
              </Link>
              {portfolios.length > 0 && <hr className="border-gray-700 my-2" />}
              {portfolios.map((portfolio) => (
                <Link
                  key={`mobile-${portfolio.slug}`}
                  href={`/portafolio/${portfolio.slug}`}
                  className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                  onClick={closeAllMenus}
                >
                  {portfolio.name}
                </Link>
              ))}
            </div>

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

            <div className="border-b border-gray-700 pb-2">
              <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
                Invertir:
              </span>
              <Link
                href="/renta-fija"
                className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                onClick={closeAllMenus}
              >
                Renta Fija
              </Link>
              <Link
                href="/renta-variable"
                className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
                onClick={closeAllMenus}
              >
                Renta Variable
              </Link>
            </div>

            <div className="pt-2 border-b border-gray-700 pb-2">
              <button
                onClick={openCoursesModal}
                className="block w-full text-left px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium"
              >
                Cursos Gratis
              </button>
            </div>

            <div className="pt-4">
              <Link
                href="/contacto"
                className="block w-full text-center px-4 py-3 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB]"
                onClick={closeAllMenus}
              >
                Contacto
              </Link>
            </div>
          </div>
        </div>

        {isCoursesModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
            <div
              ref={coursesModalRef}
              className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 relative text-gray-800"
            >
              <button
                onClick={closeCoursesModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold mb-6 text-center">
                Accede a Cursos Gratis
              </h2>
              <p className="text-gray-600 text-center mb-6">
                Regístrate para obtener acceso a contenido exclusivo y videos
                gratuitos.
              </p>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium">
                    Nombre y Apellido
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium">
                    Celular
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                >
                  Acceder a Cursos
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
