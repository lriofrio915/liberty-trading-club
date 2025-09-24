import { notFound } from "next/navigation";
import Portfolio from "@/models/Portfolio";
import connectToDB from "@/lib/mongodb";
import { Portfolio as PortfolioType } from "@/types/api";
import PortfolioDetailPageClient from "@/components/PortfolioDetailPageClient/PortfolioDetailPageClient";

// Función para obtener un solo portafolio por su slug desde la DB
async function getPortfolioBySlug(slug: string): Promise<PortfolioType | null> {
  await connectToDB();
  const portfolio = await Portfolio.findOne({ slug }).lean(); // .lean() para un objeto JS plano
  if (!portfolio) {
    return null;
  }
  return JSON.parse(JSON.stringify(portfolio));
}

interface PageProps {
  params: {
    operador: string;
  };
}

export default async function PortfolioDetailPage({ params }: PageProps) {
  const { operador } = params;
  const portfolio = await getPortfolioBySlug(operador);

  if (!portfolio) {
    notFound(); // Muestra la página 404 de Next.js si no se encuentra
  }

  // Pasamos el portafolio encontrado al componente cliente
  return <PortfolioDetailPageClient portfolio={portfolio} />;
}
