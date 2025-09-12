// src/types/interfaces.ts

export interface Transaction {
  date: string;
  type: "Aporte" | "Retiro";
  amount: number;
}

export interface Position {
  asset: string;
  ticker: string;
  quantity: number;
  averageBuyPrice: number;
  currentMarketPrice: number;
  value: number;
  gainLoss: number;
  gainLossPercentage: number;
}

export interface Client {
  id: string;
  name: string;
  initialCapital: number;
  currentCapital: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
  transactions: Transaction[];
  portfolio: Position[];
}
