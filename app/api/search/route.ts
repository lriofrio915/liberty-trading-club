// app/api/search/route.ts
import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("query");

    if (!query) {
      return NextResponse.json(
        { error: 'Falta el parámetro "query".' },
        { status: 400 }
      );
    }

    // Usamos el método 'search' de yahoo-finance2, es muy rápido para autocompletado.
    const searchResults = await yahooFinance.search(query);

    // Devolvemos solo las 'quotes', que contienen la información que necesitamos.
    return NextResponse.json({
      success: true,
      data: searchResults.quotes,
    });
  } catch (err) {
    console.error("Error en la API de búsqueda:", err);
    return NextResponse.json(
      { error: "Error al buscar símbolos." },
      { status: 500 }
    );
  }
}
