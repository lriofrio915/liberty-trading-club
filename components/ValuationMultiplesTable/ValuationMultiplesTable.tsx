import React, { useState, useEffect } from "react";
import Tooltip from "../Shared/Tooltips";

interface Props {
  ticker: string;
  currentPrice: number;
}

interface ValuationData {
  ltm: number;
  ntm: number;
  target: number;
}

interface MultiplesData {
  headers: string[];
  metrics: { [key: string]: number };
}

interface IncomeStatementData {
  metrics: {
    ebit: number[];
  };
}

interface FreeCashFlowData {
  metrics: {
    freeCashFlow: number[];
  };
}

const ValuationMultiplesTable: React.FC<Props> = ({ ticker, currentPrice }) => {
  const [valuationMetrics, setValuationMetrics] = useState<{
    [key: string]: ValuationData;
  }>({});
  const [loading, setLoading] = useState<boolean>(true);

  const hardcodedTargets = {
    PER: 0,
    EV_EBITDA: 0,
    EV_EBIT: 0,
    EV_FCF: 0,
  };

  const metricDescriptions: { [key: string]: string } = {
    PER: "Mide cuánto están los inversores dispuestos a pagar por cada dólar de ganancias de una empresa. Se calcula dividiendo el precio de la acción entre el EPS.",
    EV_EBITDA:
      "Compara el valor total de la empresa con las ganancias antes de intereses, impuestos, depreciación y amortización. Es una medida de la rentabilidad operativa.",
    EV_EBIT:
      "Similar al EV/EBITDA, pero excluye la depreciación y amortización. Útil para comparar empresas con diferentes estructuras de capital.",
    EV_FCF:
      "Compara el valor total de la empresa con el flujo de caja libre. Es útil porque se enfoca en la caja real que la empresa produce.",
  };

  useEffect(() => {
    const fetchValuationData = async () => {
      setLoading(true);
      try {
        const [
          keyStatisticsResponse,
          incomeStatementResponse,
          freeCashFlowResponse,
        ] = await Promise.all([
          fetch(`/api/key-statistics?ticker=${ticker}`).then((res) =>
            res.json()
          ),
          fetch(`/api/income-statement?ticker=${ticker}`).then((res) =>
            res.json()
          ),
          fetch(`/api/free-cash-flow?ticker=${ticker}`).then((res) =>
            res.json()
          ),
        ]);

        const keyStatisticsData: MultiplesData = keyStatisticsResponse;
        const incomeStatementData: IncomeStatementData =
          incomeStatementResponse;
        const freeCashFlowData: FreeCashFlowData = freeCashFlowResponse;

        // Extraer los valores del TTM de Key Statistics de manera más robusta
        const trailingPE = keyStatisticsData.metrics["Trailing P/E"] || 0;
        const forwardPE = keyStatisticsData.metrics["Forward P/E"] || 0;
        const enterpriseValue =
          keyStatisticsData.metrics["Enterprise Value"] || 0;
        const enterpriseValueEBITDA =
          keyStatisticsData.metrics["Enterprise Value/EBITDA"] || 0;

        // Extraer los valores de las otras APIs de forma segura
        const freeCashFlow =
          (freeCashFlowData.metrics.freeCashFlow || []).at(0) || 0;
        const ebit = (incomeStatementData.metrics.ebit || []).at(0) || 0;

        const ltmMetrics = {
          PER: trailingPE,
          EV_EBITDA: enterpriseValueEBITDA,
          EV_EBIT: ebit !== 0 ? enterpriseValue / ebit : 0,
          EV_FCF: freeCashFlow !== 0 ? enterpriseValue / freeCashFlow : 0,
        };

        const ntmMetrics = {
          PER: forwardPE,
          // NTM Enterprise Value/EBITDA no está disponible directamente, usaremos el LTM
          EV_EBITDA: keyStatisticsData.metrics["Enterprise Value/EBITDA"] || 0,
          // No se puede calcular NTM EV/EBIT y EV/FCF sin datos NTM para EBIT y FCF
          EV_EBIT: 0,
          EV_FCF: 0,
        };

        setValuationMetrics({
          PER: {
            ltm: ltmMetrics.PER,
            ntm: ntmMetrics.PER,
            target: hardcodedTargets.PER,
          },
          EV_EBITDA: {
            ltm: ltmMetrics.EV_EBITDA,
            ntm: ntmMetrics.EV_EBITDA,
            target: hardcodedTargets.EV_EBITDA,
          },
          EV_EBIT: {
            ltm: ltmMetrics.EV_EBIT,
            ntm: ntmMetrics.EV_EBIT,
            target: hardcodedTargets.EV_EBIT,
          },
          EV_FCF: {
            ltm: ltmMetrics.EV_FCF,
            ntm: ntmMetrics.EV_FCF,
            target: hardcodedTargets.EV_FCF,
          },
        });
      } catch (error) {
        console.error("Failed to fetch valuation data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchValuationData();
  }, [
    ticker,
    hardcodedTargets.PER,
    hardcodedTargets.EV_EBITDA,
    hardcodedTargets.EV_EBIT,
    hardcodedTargets.EV_FCF,
  ]);

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
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded"></div>
          <div className="text-right">
            <div className="h-4 w-24 bg-gray-200 rounded mb-1"></div>
            <div className="h-8 w-32 bg-gray-200 rounded"></div>
          </div>
        </div>
        <div className="flex items-center justify-center p-8">
          <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-teal-500"></div>
          <p className="ml-4 text-xl text-teal-400">Cargando valoraciones...</p>
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
            <th className="py-2">LTM</th>
            <th className="py-2">NTM</th>
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
              <td className="py-2">{value.ltm?.toFixed(2)}</td>
              <td className="py-2">{value.ntm?.toFixed(2)}</td>
              <td className="py-2 text-red-600 font-bold">
                <input
                  type="number"
                  value={value.target}
                  onChange={(e) => handleTargetChange(key, e.target.value)}
                  className="w-20 text-right bg-transparent border-none outline-none"
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
