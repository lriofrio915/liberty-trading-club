"use client";

import { useState, useRef, useEffect, ReactNode } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import AddPortfolioForm from "../AddPortfolioForm/AddPortfolioForm";
import { Portfolio } from "@/types/api";

interface PortfolioClientPageProps {
  children: ReactNode;
}

export default function PortfolioClientPage({
  children,
}: PortfolioClientPageProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const handleOpenForm = () => setIsFormOpen(true);
  const handleCloseForm = () => setIsFormOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(event.target as Node)) {
        handleCloseForm();
      }
    };
    if (isFormOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isFormOpen]);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <div
          onClick={handleOpenForm}
          className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all duration-300"
        >
          <PlusCircleIcon className="h-12 w-12 text-gray-400 mb-4" />
          <span className="text-lg font-semibold text-gray-700">
            Crear Nuevo Portafolio
          </span>
        </div>
        {children}
      </div>

      {isFormOpen && (
        <AddPortfolioForm onClose={handleCloseForm} formRef={formRef} />
      )}
    </>
  );
}
