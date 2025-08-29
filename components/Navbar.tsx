"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  PlusCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import AddPortfolioForm from "../components/AddPortfolioForm/AddPortfolioForm";

// Define la interfaz para la estructura de cada portafolio
interface Portfolio {
  name: string;
  slug: string;
  tickers: string[];
}

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [openSubDropdown, setOpenSubDropdown] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  const navbarRef = useRef<HTMLDivElement>(null);
  const coursesModalRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Carga los portafolios desde localStorage al cargar el componente
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPortfolios = localStorage.getItem("portfolios"); // Corregido: clave 'portfolios'
      if (savedPortfolios) {
        try {
          const parsedPortfolios: Portfolio[] = JSON.parse(savedPortfolios);
          setPortfolios(parsedPortfolios);
        } catch (error) {
          console.error(
            "Error al parsear los portafolios de localStorage:",
            error
          );
          setPortfolios([]);
        }
      }
    }
  }, []);

  // Función para cerrar todos los menús y modales
  const closeAllMenus = useCallback(() => {
    setIsMobileMenuOpen(false);
    setOpenDropdown(null);
    setOpenSubDropdown(null);
    setIsCoursesModalOpen(false);
    setIsFormOpen(false);
  }, []);

  // Alterna la visibilidad de los menús desplegables principales
  const toggleDropdown = (dropdownName: string) => {
    setOpenDropdown(openDropdown === dropdownName ? null : dropdownName);
    setOpenSubDropdown(null);
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
    if (isCoursesModalOpen) {
      setIsCoursesModalOpen(false);
    }
    if (isFormOpen) {
      setIsFormOpen(false);
    }
  };

  // Alterna la visibilidad de los sub-menús desplegables
  const toggleSubDropdown = (subDropdownName: string) => {
    setOpenSubDropdown(
      openSubDropdown === subDropdownName ? null : subDropdownName
    );
  };

  // Maneja los clics fuera de los menús y modales para cerrarlos
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        (navbarRef.current && navbarRef.current.contains(target)) ||
        (coursesModalRef.current && coursesModalRef.current.contains(target)) ||
        (formRef.current && formRef.current.contains(target))
      ) {
        return;
      }
      closeAllMenus();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [closeAllMenus]);

  // Controla el overflow del body cuando los menús o modales están abiertos
  useEffect(() => {
    document.body.style.overflow =
      isMobileMenuOpen || isFormOpen || isCoursesModalOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isFormOpen, isCoursesModalOpen]);

  // Maneja la apertura del formulario de agregar portafolio
  const handleOpenForm = () => {
    closeAllMenus();
    setIsFormOpen(true);
  };

  // Callback llamado cuando un nuevo portafolio es añadido por el formulario
  const handlePortfolioAdded = (newPortfolio: Portfolio) => {
    setPortfolios((prevPortfolios) => {
      const updatedPortfolios = [...prevPortfolios, newPortfolio];
      localStorage.setItem("portfolios", JSON.stringify(updatedPortfolios)); // Corregido: clave 'portfolios'
      return updatedPortfolios;
    });
  };

  // Maneja el cierre del formulario de agregar portafolio
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // Funciones para el modal de Cursos Gratis
  const openCoursesModal = () => {
    closeAllMenus();
    setIsCoursesModalOpen(true);
    setFormData({ name: "", email: "", phone: "" });
  };

  const closeCoursesModal = () => {
    setIsCoursesModalOpen(false);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Datos del formulario:", formData);
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
          {/* Logo */}
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

          {/* Botón de Menú Móvil */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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

          {/* Menú de Navegación para Escritorio */}
          <div className="hidden md:flex space-x-6 items-center">
            {/* Menú de Estrategias */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("estrategias")}
                className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              >
                Estrategias
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

            {/* Menú de Informes */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("informes")}
                className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              >
                Informes
                {openDropdown === "informes" ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              {openDropdown === "informes" && (
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

            {/* Menú de Herramientas */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("herramientas")}
                className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              >
                <Cog6ToothIcon className="h-5 w-5 mr-1" />
                Herramientas
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
                      className="flex justify-between items-center px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200 w-full text-left"
                      onClick={() => toggleSubDropdown("sesgoDiario")}
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
                  <Link
                    href="/stock-screener"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                    onClick={closeAllMenus}
                  >
                    Stock Screener
                  </Link>
                </div>
              )}
            </div>

            {/* Menú de Portafolios */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("portafolios")}
                className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              >
                Portafolios
                {openDropdown === "portafolios" ? (
                  <ChevronUpIcon className="ml-1 h-4 w-4" />
                ) : (
                  <ChevronDownIcon className="ml-1 h-4 w-4" />
                )}
              </button>
              {openDropdown === "portafolios" && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                  <button
                    onClick={handleOpenForm}
                    className="flex items-center w-full px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Agregar
                  </button>
                  {portfolios.length > 0 && (
                    <hr className="border-gray-700 my-1" />
                  )}
                  {portfolios.map((portfolio) => (
                    <Link
                      key={portfolio.slug}
                      href={`/portafolio/${portfolio.slug}`}
                      className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                      onClick={closeAllMenus}
                    >
                      {portfolio.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Menú de Invertir */}
            <div className="relative">
              <button
                onClick={() => toggleDropdown("invertir")}
                className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              >
                Invertir
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
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                    onClick={closeAllMenus}
                  >
                    Renta Fija
                  </Link>
                  <Link
                    href="/renta-variable"
                    className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                    onClick={closeAllMenus}
                  >
                    Renta Variable
                  </Link>
                </div>
              )}
            </div>

            {/* Botón de Cursos Gratis (abre modal) */}
            <button
              onClick={openCoursesModal}
              className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors duration-200 cursor-pointer"
            >
              Cursos Gratis
            </button>

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
          className={`md:hidden fixed top-16 left-0 w-full bg-[#0A2342] ${
            isMobileMenuOpen ? "block" : "hidden"
          } max-h-[calc(100vh-64px)] overflow-y-auto pb-4 transition-all duration-300 ease-in-out`}
        >
          <div className="space-y-3 pt-2 px-4">
            {/* Menú Móvil de Herramientas */}
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

            {/* Menú Móvil de Portafolios */}
            <div className="border-b border-gray-700 pb-2">
              <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
                Portafolios:
              </span>
              <button
                onClick={handleOpenForm}
                className="flex items-center w-full text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              >
                <PlusCircleIcon className="h-5 w-5 mr-2" />
                Agregar
              </button>
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

            {/* Menú de Invertir (móvil) */}
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

            {/* Botón de Cursos Gratis para móvil */}
            <div className="pt-2 border-b border-gray-700 pb-2">
              <button
                onClick={openCoursesModal}
                className="block w-full text-left px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium cursor-pointer"
              >
                Cursos Gratis
              </button>
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

        {/* Modal de Cursos Gratis */}
        {isCoursesModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[100]">
            <div
              ref={coursesModalRef}
              className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full mx-4 relative"
            >
              <button
                onClick={closeCoursesModal}
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
                aria-label="Cerrar"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Accede a Cursos Gratis
              </h2>
              <p className="text-gray-600 text-center mb-6">
                ¡Regístrate para obtener acceso a contenido exclusivo y videos
                gratuitos!
              </p>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Acceder a Cursos
                </button>
              </form>
            </div>
          </div>
        )}
      </nav>
      {isFormOpen && (
        <AddPortfolioForm
          onClose={handleCloseForm}
          onPortfolioAdded={handlePortfolioAdded}
          formRef={formRef}
        />
      )}
    </>
  );
}
