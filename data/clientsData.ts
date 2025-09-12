// src/data/clientsData.ts

import { Client } from "../types/interfaces";

const calculateClientData = (
  client: Omit<
    Client,
    "currentCapital" | "totalGainLoss" | "totalGainLossPercentage"
  >
): Client => {
  const currentCapital = client.portfolio.reduce(
    (sum, pos) => sum + pos.value,
    client.initialCapital
  );
  const totalGainLoss = currentCapital - client.initialCapital;
  const totalGainLossPercentage = (totalGainLoss / client.initialCapital) * 100;

  return {
    ...client,
    currentCapital,
    totalGainLoss,
    totalGainLossPercentage,
  };
};

export const clientsData: Client[] = [
  calculateClientData({
    id: "001",
    name: "Stefanny Medrano",
    initialCapital: 4000,
    transactions: [{ date: "2025-09-10", type: "Aporte", amount: 4000 }],
    portfolio: [
      {
        asset: "Acciones de Apple",
        ticker: "AAPL",
        quantity: 10,
        averageBuyPrice: 170.0,
        currentMarketPrice: 175.0,
        value: 1750,
        gainLoss: 50,
        gainLossPercentage: 2.94,
      },
      {
        asset: "ETF SPY",
        ticker: "SPY",
        quantity: 5,
        averageBuyPrice: 450.0,
        currentMarketPrice: 460.0,
        value: 2300,
        gainLoss: 50,
        gainLossPercentage: 2.22,
      },
    ],
  }),
  calculateClientData({
    id: "002",
    name: "Luis Riofrio",
    initialCapital: 1000,
    transactions: [{ date: "2025-09-10", type: "Aporte", amount: 1000 }],
    portfolio: [
      {
        asset: "Acciones de Microsoft",
        ticker: "MSFT",
        quantity: 3,
        averageBuyPrice: 280.0,
        currentMarketPrice: 285.0,
        value: 855,
        gainLoss: 15,
        gainLossPercentage: 1.78,
      },
      {
        asset: "Bonos del Tesoro",
        ticker: "TLT",
        quantity: 2,
        averageBuyPrice: 110.0,
        currentMarketPrice: 105.0,
        value: 210,
        gainLoss: -10,
        gainLossPercentage: -4.55,
      },
    ],
  }),
];
