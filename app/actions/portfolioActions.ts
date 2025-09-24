"use server";

import { revalidatePath } from "next/cache";
import connectToDB from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import { Portfolio as PortfolioType } from "@/types/api";

// Tipado para los datos de entrada al crear un portafolio
type CreatePortfolioInput = Omit<PortfolioType, "slug"> & {
  nombre: string;
  apellido: string;
};

/**
 * Obtiene todos los portafolios de la base de datos.
 */
export async function getPortfolios(): Promise<PortfolioType[]> {
  try {
    await connectToDB();
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 });

    // MongoDB devuelve documentos Mongoose, necesitamos convertirlos a objetos planos
    // para pasarlos de Server a Client Components.
    return JSON.parse(JSON.stringify(portfolios));
  } catch (error) {
    console.error("Error al obtener portafolios:", error);
    throw new Error("No se pudieron obtener los portafolios.");
  }
}

/**
 * Crea un nuevo portafolio en la base de datos.
 */
export async function createPortfolio(
  data: CreatePortfolioInput
): Promise<PortfolioType> {
  try {
    await connectToDB();

    const slug = `${data.nombre.toLowerCase().trim()}-${data.apellido
      .toLowerCase()
      .trim()}`;

    const newPortfolio = new Portfolio({
      name: `${data.nombre.trim()} ${data.apellido.trim()}`,
      slug,
      tickers: data.tickers,
    });

    const savedPortfolio = await newPortfolio.save();

    // Invalida el caché de la ruta para que se vuelva a renderizar con los datos nuevos.
    revalidatePath("/portafolio");

    return JSON.parse(JSON.stringify(savedPortfolio));
  } catch (error) {
    console.error("Error al crear el portafolio:", error);
    throw new Error("No se pudo crear el portafolio.");
  }
}

/**
 * Elimina un portafolio por su slug.
 */
export async function deletePortfolio(
  slug: string
): Promise<{ success: boolean }> {
  try {
    await connectToDB();
    const result = await Portfolio.findOneAndDelete({ slug });
    if (!result) {
      throw new Error("Portafolio no encontrado.");
    }
    revalidatePath("/portafolio");
    revalidatePath(`/portafolio/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el portafolio:", error);
    throw new Error("No se pudo eliminar el portafolio.");
  }
}

/**
 * Añade un ticker a un portafolio existente.
 */
export async function addTickerToPortfolio(
  slug: string,
  ticker: string
): Promise<PortfolioType> {
  try {
    await connectToDB();
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { slug },
      { $addToSet: { tickers: ticker.toUpperCase() } }, // $addToSet evita duplicados
      { new: true }
    );

    if (!updatedPortfolio) {
      throw new Error("Portafolio no encontrado.");
    }
    revalidatePath(`/portafolio/${slug}`);
    return JSON.parse(JSON.stringify(updatedPortfolio));
  } catch (error) {
    console.error("Error al añadir ticker:", error);
    throw new Error("No se pudo añadir el ticker.");
  }
}

/**
 * Elimina un ticker de un portafolio existente.
 */
export async function removeTickerFromPortfolio(
  slug: string,
  ticker: string
): Promise<PortfolioType> {
  try {
    await connectToDB();
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { slug },
      { $pull: { tickers: ticker } },
      { new: true }
    );

    if (!updatedPortfolio) {
      throw new Error("Portafolio no encontrado.");
    }
    revalidatePath(`/portafolio/${slug}`);
    return JSON.parse(JSON.stringify(updatedPortfolio));
  } catch (error) {
    console.error("Error al eliminar ticker:", error);
    throw new Error("No se pudo eliminar el ticker.");
  }
}
