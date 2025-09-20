// components/ValuationMultiplesTable/ValuationMultiplesTable.tsx
"use client";
import React, { useState, useEffect, Dispatch, SetStateAction } from "react";
import Tooltip from "../Shared/Tooltips";

// Interfaz para los datos que se obtienen de la API
interface ValuationData {
  ltm: number;
}

// Interfaz para el estado de los múltiplos objetivo
interface TargetsState {
  per: number;
  ev_ebitda: number;
  ev_ebit: number;
  ev_fcf: number;
}

// Interfaz actualizada para las Props del componente
interface Props {
  ticker: string;
  currentPrice: number;
  targets: TargetsState;
  setTargets: Dispatch<SetStateAction<TargetsState>>;
}

const ValuationMultiplesTable: React.FC<Props> = ({
  ticker,
  currentPrice,
  targets,
  setTargets,
}) => {
  const [ltmMetrics, setLtmMetrics] = useState<{
    [key: string]: ValuationData;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const metricDescriptions: { [key: string]: string } = {
    PER: "Price-to-Earnings: Mide cuánto pagan los inversores por cada dólar de ganancias.",
    EV_EBITDA:
      "Enterprise Value to EBITDA: Compara el valor total de la empresa con sus ganancias operativas.",
    EV_EBIT:
      "Enterprise Value to EBIT: Similar a EV/EBITDA, pero considera la depreciación y amortización.",
    EV_FCF:
      "Enterprise Value to Free Cash Flow: Mide el valor de la empresa en relación con el efectivo que genera.",
  };

  useEffect(() => {
    const fetchLtmData = async () => {
      if (!ticker) return;
      setLoading(true);
      try {
        const [keyStatsRes, incomeRes, fcfRes] = await Promise.all([
          fetch(`/api/key-statistics?ticker=${ticker}`),
          fetch(`/api/income-statement?ticker=${ticker}`),
          fetch(`/api/free-cash-flow?ticker=${ticker}`),
        ]);

        const keyStatsData = await keyStatsRes.json();
        const incomeData = await incomeRes.json();
        const fcfData = await fcfRes.json();

        const enterpriseValue =
          (keyStatsData.metrics.enterpriseValue || [])[0] || 0;
        const trailingPE = (keyStatsData.metrics.trailingPE || [])[0] || 0;
        const ebitda = (incomeData.metrics.ebitda || [])[0] || 0;
        const ebit = (incomeData.metrics.ebit || [])[0] || 0;
        const freeCashFlow = (fcfData.metrics.freeCashFlow || [])[0] || 0;

        setLtmMetrics({
          per: { ltm: trailingPE },
          ev_ebitda: { ltm: ebitda > 0 ? enterpriseValue / ebitda : 0 },
          ev_ebit: { ltm: ebit > 0 ? enterpriseValue / ebit : 0 },
          ev_fcf: {
            ltm: freeCashFlow > 0 ? enterpriseValue / freeCashFlow : 0,
          },
        });
      } catch (error) {
        console.error("Failed to fetch LTM valuation data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLtmData();
  }, [ticker]);

  const handleTargetChange = (key: keyof TargetsState, value: string) => {
    setTargets((prevTargets) => ({
      ...prevTargets,
      [key]: parseFloat(value) || 0,
    }));
  };

  if (loading) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200 animate-pulse">
        <div className="h-6 w-1/3 bg-gray-200 rounded mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>
    );
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
            <th className="py-2 text-center">LTM</th>
            <th className="py-2 text-center">Objetivo (2026e)</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(targets).map((key) => (
            <tr key={key} className="border-b border-gray-200">
              <td className="py-2 font-semibold uppercase">
                <Tooltip
                  text={
                    metricDescriptions[key.toUpperCase()] ||
                    "Descripción no disponible."
                  }
                >
                  {key.replace(/_/g, " / ")}
                </Tooltip>
              </td>
              <td className="py-2 text-center">
                {ltmMetrics[key]?.ltm?.toFixed(2) || "N/A"}
              </td>
              {/* *** CORRECCIÓN AQUÍ: Se añaden clases flex para centrar el input *** */}
              <td className="py-2 text-red-600 font-bold flex justify-center items-center">
                <input
                  type="number"
                  value={targets[key as keyof TargetsState]}
                  onChange={(e) =>
                    handleTargetChange(
                      key as keyof TargetsState,
                      e.target.value
                    )
                  }
                  className="w-24 text-center bg-gray-100 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
