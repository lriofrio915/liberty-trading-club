"use client";

import { useState, useRef, useEffect } from "react";
// import Link from "next/link"; // Eliminado
// import Image from "next/image"; // Eliminado
import {
  Bars3Icon,
  XMarkIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEstrategiasDropdownOpen, setIsEstrategiasDropdownOpen] =
    useState(false);
  const [isInformesDropdownOpen, setIsInformesDropdownOpen] = useState(false);
  const [isSesgoDiarioDropdownOpen, setIsSesgoDiarioDropdownOpen] =
    useState(false);
  // Nuevos estados para la opción "Invertir" y el modal de "Cursos Gratis"
  const [isInvertirDropdownOpen, setIsInvertirDropdownOpen] = useState(false);
  const [isCoursesModalOpen, setIsCoursesModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });

  const estrategiasDropdownRef = useRef<HTMLDivElement>(null);
  const informesDropdownRef = useRef<HTMLDivElement>(null);
  const sesgoDiarioDropdownRef = useRef<HTMLDivElement>(null);
  // Nuevas refs para "Invertir" y el modal
  const invertirDropdownRef = useRef<HTMLDivElement>(null);
  const coursesModalRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Función para cerrar todos los menús y modales
  const closeAllMenus = () => {
    setIsMobileMenuOpen(false);
    setIsEstrategiasDropdownOpen(false);
    setIsInformesDropdownOpen(false);
    setIsSesgoDiarioDropdownOpen(false);
    setIsInvertirDropdownOpen(false); // Cerrar el nuevo dropdown
    setIsCoursesModalOpen(false); // Cerrar el modal
  };

  // Manejo de clics fuera para cerrar menús y modales
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // Cerrar menús desplegables de escritorio si se hace clic fuera
      if (
        estrategiasDropdownRef.current &&
        !estrategiasDropdownRef.current.contains(target) &&
        informesDropdownRef.current &&
        !informesDropdownRef.current.contains(target) &&
        sesgoDiarioDropdownRef.current &&
        !sesgoDiarioDropdownRef.current.contains(target) &&
        invertirDropdownRef.current &&
        !invertirDropdownRef.current.contains(target) && // Nuevo dropdown
        !(target as HTMLElement).closest(
          'button[aria-label="Toggle navigation"]'
        ) &&
        !(coursesModalRef.current && coursesModalRef.current.contains(target)) // No cerrar si el clic es dentro del modal
      ) {
        setIsEstrategiasDropdownOpen(false);
        setIsInformesDropdownOpen(false);
        setIsSesgoDiarioDropdownOpen(false);
        setIsInvertirDropdownOpen(false);
      }

      // Cerrar menú móvil si se hace clic fuera (y no es el botón de hamburguesa)
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !(target as HTMLElement).closest(
          'button[aria-label="Toggle navigation"]'
        )
      ) {
        setIsMobileMenuOpen(false);
      }

      // Cerrar modal si se hace clic fuera de él
      if (
        isCoursesModalOpen &&
        coursesModalRef.current &&
        !coursesModalRef.current.contains(target)
      ) {
        setIsCoursesModalOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isCoursesModalOpen]); // Añadir isCoursesModalOpen a las dependencias

  // Controlar el scroll del cuerpo cuando el menú móvil o el modal están abiertos
  useEffect(() => {
    if (isMobileMenuOpen || isCoursesModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen, isCoursesModalOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Funciones para el modal de Cursos Gratis
  const openCoursesModal = () => {
    closeAllMenus(); // Cerrar otros menús antes de abrir el modal
    setIsCoursesModalOpen(true);
    setFormData({ name: "", email: "", phone: "" }); // Resetear el formulario
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
    // Aquí podrías enviar los datos a tu backend
    console.log("Datos del formulario:", formData);
    // Usar window.location.href para la redirección después de la alerta
    // No usar alert() directamente, se reemplaza con un mensaje en la consola o un modal personalizado
    console.log(
      "¡Gracias por tu interés! Serás redirigido a la página de cursos gratis."
    );
    closeCoursesModal();
    window.location.href = "/cursos-gratis"; // Redirigir a la página de cursos
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0A2342] py-4 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Logo */}
        <a
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity duration-200"
          onClick={closeAllMenus}
        >
          <img
            src="https://i.ibb.co/VY4mMs15/icono.png"
            alt="Liberty Trading Club Logo"
            width={50}
            height={50}
            className="rounded-full mr-2"
          />
        </a>

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
                setIsInvertirDropdownOpen(false); // Cerrar otros
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
                <a
                  href="/manuales/Nasdaq"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Estrategia NQ
                </a>
                <a
                  href="/manuales/SP500-1"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Estrategia MES
                </a>
                <a
                  href="/manuales/SP500-2"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Estrategia ES
                </a>
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
                setIsInvertirDropdownOpen(false); // Cerrar otros
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
                <a
                  href="/informes/NQ"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Informes NQ
                </a>
                <a
                  href="/informes/MES"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Informes MES
                </a>
                <a
                  href="/informes/ES"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Informes ES
                </a>
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
                setIsInvertirDropdownOpen(false); // Cerrar otros
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
                <a
                  href="/sentimiento-macro/NQ"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Nasdaq
                </a>
                <a
                  href="/sentimiento-macro/ES"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  S&P 500
                </a>
              </div>
            )}
          </div>

          {/* Nuevo Menú desplegable de Invertir */}
          <div className="relative" ref={invertirDropdownRef}>
            <button
              onClick={() => {
                setIsInvertirDropdownOpen(!isInvertirDropdownOpen);
                setIsEstrategiasDropdownOpen(false);
                setIsInformesDropdownOpen(false);
                setIsSesgoDiarioDropdownOpen(false); // Cerrar otros
              }}
              className="flex items-center text-white hover:text-gray-300 transition-colors duration-200 px-3 py-2 rounded-md font-medium focus:outline-none cursor-pointer"
              aria-expanded={isInvertirDropdownOpen}
            >
              Invertir
              {isInvertirDropdownOpen ? (
                <ChevronUpIcon className="ml-1 h-4 w-4" />
              ) : (
                <ChevronDownIcon className="ml-1 h-4 w-4" />
              )}
            </button>
            {isInvertirDropdownOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-[#1A3A5E] rounded-md shadow-lg py-1 z-10">
                <a
                  href="/renta-fija"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Renta Fija
                </a>
                <a
                  href="/renta-variable"
                  className="block px-4 py-2 text-sm text-white hover:bg-[#2A4A7E] transition-colors duration-200"
                  onClick={closeAllMenus}
                >
                  Renta Variable
                </a>
              </div>
            )}
          </div>

          {/* Nuevo Botón de Cursos Gratis (abre modal) */}
          <button
            onClick={openCoursesModal}
            className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors duration-200 cursor-pointer"
          >
            Cursos Gratis
          </button>

          {/* Botón de Contacto */}
          <a
            href="/contacto"
            className="px-4 py-2 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors duration-200"
            onClick={closeAllMenus}
          >
            Contacto
          </a>
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
            <a
              href="/manuales/Nasdaq"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Estrategia NQ
            </a>
            <a
              href="/manuales/SP500-1"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Estrategia MES
            </a>
            <a
              href="/manuales/SP500-2"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Estrategia ES
            </a>
          </div>

          {/* Informes */}
          <div className="border-b border-gray-700 pb-2">
            <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
              Informes:
            </span>
            <a
              href="/informes/NQ"
              className="block px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Informes NQ
            </a>
            <a
              href="/informes/MES"
              className="block px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Informes MES
            </a>
            <a
              href="/informes/ES"
              className="block px-3 py-2 text-white hover:text-gray-300 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Informes ES
            </a>
          </div>

          {/* Sesgo Diario */}
          <div className="border-b border-gray-700 pb-2">
            <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
              Sesgo Diario:
            </span>
            <a
              href="/sentimiento-macro/NQ"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Nasdaq
            </a>
            <a
              href="/sentimiento-macro/ES"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              S&P 500
            </a>
          </div>

          {/* Nuevo Menú desplegable de Invertir (móvil) */}
          <div className="border-b border-gray-700 pb-2">
            <span className="block text-gray-400 text-sm font-semibold px-3 py-2">
              Invertir:
            </span>
            <a
              href="/renta-fija"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Renta Fija
            </a>
            <a
              href="/renta-variable"
              className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium pl-6"
              onClick={closeAllMenus}
            >
              Renta Variable
            </a>
          </div>

          {/* Nuevo Botón de Cursos Gratis para móvil */}
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
            <a
              href="/contacto"
              className="block w-full text-center px-4 py-3 bg-[#3B82F6] text-white font-medium rounded-md hover:bg-[#2563EB] transition-colors duration-200"
              onClick={closeAllMenus}
            >
              Contacto
            </a>
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
  );
}
