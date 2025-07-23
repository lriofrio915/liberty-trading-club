"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; 
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <nav className="fixed top-0 left-0 w-full bg-[#0A2342] p-4 text-white shadow-lg z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-200" onClick={closeMenu}>
          <Image
            src="https://i.ibb.co/20RsFG5H/emporium-logo-1.jpg"
            alt="Emporium Quality Funds Logo"
            width={50} 
            height={50} 
            className="rounded-full mr-2" 
          />
        </Link>
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 p-1 rounded"
            aria-label="Toggle navigation"
          >
            {isOpen ? (
              <XMarkIcon className="h-7 w-7" />
            ) : (
              <Bars3Icon className="h-7 w-7" />
            )}
          </button>
        </div>
        <div className="hidden md:flex space-x-6">
          <Link href="/" className="hover:text-gray-300 transition-colors duration-200">
            Inicio
          </Link>
          <Link href="/informes" className="hover:text-gray-300 transition-colors duration-200">
            Informes
          </Link>
          <Link href="/sentimiento-macro" className="hover:text-gray-300 transition-colors duration-200">
            Sentimiento Macro
          </Link>
        </div>
      </div>
      <div
        className={`md:hidden ${isOpen ? 'block' : 'hidden'} mt-4 space-y-3 pb-2 px-2 transition-all duration-300 ease-in-out`}
      >
        <Link href="/" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium" onClick={closeMenu}>
          Inicio
        </Link>
        <Link href="/informes" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium" onClick={closeMenu}>
          Informes
        </Link>
        <Link href="/sentimiento-macro" className="block text-white hover:text-gray-300 px-3 py-2 rounded-md text-base font-medium" onClick={closeMenu}>
          Sentimiento Macro
        </Link>
      </div>
    </nav>
  );
}