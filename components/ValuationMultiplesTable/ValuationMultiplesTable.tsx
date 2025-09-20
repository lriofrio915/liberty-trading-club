// components/ValuationMultiplesTable/ValuationMultiplesTable.tsx
"use client";
import React, { useState, useEffect } from "react";
import Tooltip from "../Shared/Tooltips";

interface Props {
  ticker: string;
  currentPrice: number;
}

interface ValuationData {
  ltm: number;
  target: number;
}

interface ValuationMultiplesResponse {
  PER: number;
  EV_EBITDA: number;
  EV_EBIT: number;
  EV_FCF: number;
}

const ValuationMultiplesTable: React.FC<Props> = ({ ticker, currentPrice }) => {
  const [valuationMetrics, setValuationMetrics] = useState<{
    [key: string]: ValuationData;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const metricDescriptions: { [key: string]: string } = {
    PER: "Mide cuánto están los inversores dispuestos a pagar por cada dólar de ganancias de una empresa. Se calcula dividiendo el precio de la acción entre el EPS.",
    EV_EBITDA:
      "Compara el valor total de la empresa (Enterprise Value) con las ganancias antes de intereses, impuestos, depreciación y amortización. Es una medida de la rentabilidad operativa.",
    EV_EBIT:
      "Similar al EV/EBITDA, pero excluye la depreciación y amortización. Útil para comparar empresas con diferentes estructuras de capital.",
    EV_FCF:
      "Compara el valor total de la empresa (Enterprise Value) con el flujo de caja libre. Es útil porque se enfoca en la caja real que la empresa produce.",
  };

  useEffect(() => {
    const fetchValuationData = async () => {
      setLoading(true);
      try {
        // --- ÚNICO CAMBIO: Apuntamos a la nueva ruta /api/valuation-multiples ---
        const response = await fetch(
          `/api/valuation-multiples?ticker=${ticker}`
        );
        if (!response.ok) {
          throw new Error("Error al obtener los múltiplos de valoración.");
        }
        const multiples: ValuationMultiplesResponse = await response.json();

        setValuationMetrics({
          PER: { ltm: multiples.PER, target: 0 },
          EV_EBITDA: { ltm: multiples.EV_EBITDA, target: 0 },
          EV_EBIT: { ltm: multiples.EV_EBIT, target: 0 },
          EV_FCF: { ltm: multiples.EV_FCF, target: 0 },
        });
      } catch (error) {
        console.error("Failed to fetch valuation data:", error);
        // Opcional: podrías poner un estado de error aquí para mostrarlo en la UI
      } finally {
        setLoading(false);
      }
    };

    if (ticker) {
      fetchValuationData();
    }
  }, [ticker]);

  const handleTargetChange = (key: string, value: string) => {
    setValuationMetrics((prevMetrics) => ({
      ...prevMetrics,
      [key]: {
        ...prevMetrics[key],
        target: parseFloat(value) || 0,
      },
    }));
  };

  if (loading) {
    // ... tu código de loading
  }

  return (
    <div className="bg-white text-gray-800 p-4 rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">Múltiplos de valoración</h3>
        <div className="text-right">
          <p className="text-sm text-gray-500">Precio actual</p>
          <p className="text-2xl font-bold text-green-600">
            ${currentPrice.toFixed(2)}
          </p>
        </div>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-200 text-gray-500">
            <th className="py-2">Métrica</th>
            <th className="py-2">LTM</th>
            <th className="py-2">Objetivo</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(valuationMetrics).map(([key, value]) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="py-2 font-semibold uppercase">
                <Tooltip
                  text={metricDescriptions[key] || "Descripción no disponible."}
                >
                  {key.replace("_", " / ")}
                </Tooltip>
              </td>
              <td className="py-2">{value.ltm?.toFixed(2) || "-"}</td>
              <td className="py-2 text-red-600 font-bold">
                <input
                  type="number"
                  value={value.target}
                  onChange={(e) => handleTargetChange(key, e.target.value)}
                  className="w-20 text-right bg-transparent border-none outline-none focus:ring-0"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ValuationMultiplesTable;
