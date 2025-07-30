// components/Dashboard/KpiCard.tsx
import React from 'react';
import Image from 'next/image';

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string; // Propiedad opcional para la unidad (ej. "%", "USD")
  isPositive?: boolean;
  icon?: React.ReactNode | string;
}

export default function KpiCard({ label, value, unit, isPositive, icon }: KpiCardProps) {
  const valueColorClass = typeof isPositive === 'boolean'
    ? (isPositive ? 'text-[#2CA58D]' : 'text-[#D9534F]')
    : 'text-gray-800';

  // Lógica para formatear el valor monetario
  const displayValue = (val: string | number, unit?: string) => {
    if (unit === "USD") {
      // Si es USD, añade el signo de dólar y formatea el número
      const numericValue = typeof val === 'string' ? parseFloat(val) : val;
      return `$${numericValue.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
    }
    // Si no es USD, devuelve el valor tal cual
    return val;
  };

  return (
    <div className="kpi-card p-4 flex flex-col items-center justify-center min-h-[120px] shadow-md border border-gray-200">
      {icon && (
        <div className="mb-2">
          {typeof icon === 'string' ? (
            <Image src={icon} alt={label} width={40} height={40} className="w-10 h-10 object-contain" />
          ) : (
            icon
          )}
        </div>
      )}
      <p className="text-sm font-semibold text-gray-600 mb-1 text-center">{label}</p>
      <p className={`text-3xl font-extrabold ${valueColorClass}`}>
        {/* Usamos la función displayValue aquí y mostramos la unidad solo si NO es USD */}
        {displayValue(value, unit)}{unit && unit !== "USD" && <span className="text-xl">{unit}</span>}
      </p>
    </div>
  );
}