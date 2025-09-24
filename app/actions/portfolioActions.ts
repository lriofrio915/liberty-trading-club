"use server";

import { revalidatePath } from "next/cache";
import connectToDB from "@/lib/mongodb";
import Portfolio from "@/models/Portfolio";
import {
  Portfolio as PortfolioType,
  Cartera as CarteraType,
} from "@/types/api";

// --- ACCIONES DE PORTAFOLIOS (OPERADORES) ---

type CreatePortfolioInput = Omit<PortfolioType, "slug" | "carteras" | "_id"> & {
  nombre: string;
  apellido: string;
};

export async function getPortfolios(): Promise<PortfolioType[]> {
  try {
    await connectToDB();
    const portfolios = await Portfolio.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(portfolios));
  } catch (error) {
    console.error("Error al obtener portafolios:", error);
    throw new Error("No se pudieron obtener los portafolios.");
  }
}

export async function getPortfolioBySlug(
  slug: string
): Promise<PortfolioType | null> {
  try {
    await connectToDB();
    const portfolio = await Portfolio.findOne({ slug }).lean();
    return portfolio ? JSON.parse(JSON.stringify(portfolio)) : null;
  } catch (error) {
    console.error("Error al obtener el portafolio:", error);
    throw new Error("No se pudo obtener el portafolio.");
  }
}

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
      carteras: [],
    });
    const savedPortfolio = await newPortfolio.save();
    revalidatePath("/portafolio");
    return JSON.parse(JSON.stringify(savedPortfolio));
  } catch (error) {
    console.error("Error al crear el portafolio:", error);
    throw new Error("No se pudo crear el portafolio.");
  }
}

export async function deletePortfolio(
  slug: string
): Promise<{ success: boolean }> {
  try {
    await connectToDB();
    const result = await Portfolio.findOneAndDelete({ slug });
    if (!result) throw new Error("Portafolio no encontrado.");
    revalidatePath("/portafolio");
    revalidatePath(`/portafolio/${slug}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar el portafolio:", error);
    throw new Error("No se pudo eliminar el portafolio.");
  }
}

// --- ACCIONES DE TICKERS DEL PORTAFOLIO PRINCIPAL ---

export async function addTickerToPortfolio(
  slug: string,
  ticker: string
): Promise<PortfolioType> {
  try {
    await connectToDB();
    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { slug },
      { $addToSet: { tickers: ticker.toUpperCase() } },
      { new: true }
    ).lean();
    if (!updatedPortfolio) throw new Error("Portafolio no encontrado.");
    revalidatePath(`/portafolio/${slug}`);
    return JSON.parse(JSON.stringify(updatedPortfolio));
  } catch (error) {
    console.error("Error al añadir ticker al portafolio:", error);
    throw new Error("No se pudo añadir el ticker.");
  }
}

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
    ).lean();
    if (!updatedPortfolio) throw new Error("Portafolio no encontrado.");
    revalidatePath(`/portafolio/${slug}`);
    return JSON.parse(JSON.stringify(updatedPortfolio));
  } catch (error) {
    console.error("Error al eliminar ticker del portafolio:", error);
    throw new Error("No se pudo eliminar el ticker.");
  }
}

// --- ACCIONES PARA CARTERAS ---

export async function createCartera(
  portfolioSlug: string,
  carteraName: string
) {
  if (!carteraName || !carteraName.trim()) {
    throw new Error("El nombre de la cartera no puede estar vacío.");
  }
  try {
    await connectToDB();
    const carteraSlug = carteraName.trim().toLowerCase().replace(/\s+/g, "-");
    const newCartera = {
      name: carteraName.trim(),
      slug: carteraSlug,
      tickers: [],
    };

    const updatedPortfolio = await Portfolio.findOneAndUpdate(
      { slug: portfolioSlug },
      { $push: { carteras: newCartera } },
      { new: true }
    );

    if (!updatedPortfolio) throw new Error("Portafolio no encontrado.");
    revalidatePath(`/portafolio/${portfolioSlug}`);
    return {
      success: true,
      newCartera: JSON.parse(JSON.stringify(newCartera)),
    };
  } catch (error) {
    console.error("Error al crear la cartera:", error);
    throw new Error("No se pudo crear la cartera.");
  }
}

// NUEVA ACCIÓN PARA ELIMINAR CARTERA
export async function deleteCartera(
  portfolioSlug: string,
  carteraSlug: string
): Promise<{ success: boolean }> {
  try {
    await connectToDB();
    const result = await Portfolio.findOneAndUpdate(
      { slug: portfolioSlug },
      { $pull: { carteras: { slug: carteraSlug } } },
      { new: true }
    );
    if (!result) {
      throw new Error("Portafolio no encontrado para eliminar la cartera.");
    }
    revalidatePath(`/portafolio/${portfolioSlug}`);
    return { success: true };
  } catch (error) {
    console.error("Error al eliminar la cartera:", error);
    throw new Error("No se pudo eliminar la cartera.");
  }
}

export async function addTickerToCartera(
  portfolioSlug: string,
  carteraSlug: string,
  ticker: string
): Promise<CarteraType> {
  try {
    await connectToDB();
    const portfolio = (await Portfolio.findOneAndUpdate(
      { slug: portfolioSlug, "carteras.slug": carteraSlug },
      { $addToSet: { "carteras.$.tickers": ticker.toUpperCase() } },
      { new: true, lean: true }
    )) as PortfolioType | null;
    if (!portfolio) throw new Error("Cartera no encontrada.");
    revalidatePath(`/portafolio/${portfolioSlug}/${carteraSlug}`);
    const updatedCartera = portfolio.carteras.find(
      (c) => c.slug === carteraSlug
    );
    if (!updatedCartera)
      throw new Error("Sub-cartera no encontrada después de actualizar.");
    return JSON.parse(JSON.stringify(updatedCartera));
  } catch (error) {
    console.error("Error al añadir ticker a la cartera:", error);
    throw new Error("No se pudo añadir el ticker a la cartera.");
  }
}

export async function removeTickerFromCartera(
  portfolioSlug: string,
  carteraSlug: string,
  ticker: string
): Promise<CarteraType> {
  try {
    await connectToDB();
    const portfolio = (await Portfolio.findOneAndUpdate(
      { slug: portfolioSlug, "carteras.slug": carteraSlug },
      { $pull: { "carteras.$.tickers": ticker } },
      { new: true, lean: true }
    )) as PortfolioType | null;
    if (!portfolio) throw new Error("Cartera no encontrada.");
    revalidatePath(`/portafolio/${portfolioSlug}/${carteraSlug}`);
    const updatedCartera = portfolio.carteras.find(
      (c) => c.slug === carteraSlug
    );
    if (!updatedCartera)
      throw new Error("Sub-cartera no encontrada después de actualizar.");
    return JSON.parse(JSON.stringify(updatedCartera));
  } catch (error) {
    console.error("Error al eliminar ticker de la cartera:", error);
    throw new Error("No se pudo eliminar el ticker de la cartera.");
  }
}
