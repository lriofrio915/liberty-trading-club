// app/api/list-cot-assets-with-price-change/route.ts
import axios from 'axios';
import * as cheerio from 'cheerio';
import { NextResponse } from 'next/server';

interface PositionData {
  long: number;
  longChange: number;
  short: number;
  shortChange: number;
}

interface OpenInterestData {
  value: number;
  changePercent: number;
}

interface AssetData {
  assetName: string;
  priceChange: number;
  largeSpeculators: PositionData;
  smallTraders: PositionData;
  openInterest: OpenInterestData;
}

interface CategoryData {
  [category: string]: AssetData[];
}

interface AssetListResponse {
  reportDate: string; // Nueva propiedad para la fecha del reporte
  data: CategoryData;
  error?: string;
}

function parseNumber(text: string): number {
  if (!text) return 0;
  
  const isNegative = text.includes('(') || text.startsWith('-');
  const cleaned = text.replace(/[(),]/g, '').trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : (isNegative ? -Math.abs(parsed) : parsed);
}

function parsePercent(text: string): number {
  if (!text) return 0;
  
  const isNegative = text.includes('(') || text.startsWith('-') || text.includes('−');
  const cleaned = text.replace(/[(),%−]/g, '').trim();
  
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : (isNegative ? -Math.abs(parsed) : parsed);
}

export async function GET() {
  const url = 'https://insider-week.com/en/cot/';

  try {
    const { data } = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      },
    });

    const $ = cheerio.load(data);
    const result: CategoryData = {};
    let currentCategory = 'GENERAL';
    let reportDate = 'Fecha no disponible';

    // Buscar la fecha del reporte
    $('table.cotTableNew.cotTableNew2 tr').each((i, el) => {
      const rowText = $(el).text().trim();
      if (rowText.includes('Week to:')) {
        // Extraer la fecha del texto "Week to: MM/DD/YYYY"
        const dateMatch = rowText.match(/\d{2}\/\d{2}\/\d{4}/);
        if (dateMatch) {
          reportDate = dateMatch[0];
        }
        return false; // Detener el bucle una vez encontrada la fecha
      }
    });

    // Procesar los datos como antes
    $('table.cotTableNew.cotTableNew2 tr').each((i, el) => {
      if ($(el).find('td[colspan]').length > 0 || $(el).hasClass('tablePart')) {
        currentCategory = $(el).find('td').text().trim() || currentCategory;
        result[currentCategory] = result[currentCategory] || [];
        return;
      }

      const cols = $(el).find('td');
      if (cols.length >= 17) {
        const assetName = cols.eq(0).text().trim();
        
        if (assetName && !assetName.includes('Week to:')) {
          const priceChange = parseNumber(cols.eq(2).text());

          const largeSpeculators = {
            long: parseNumber(cols.eq(8).text()),
            longChange: parseNumber(cols.eq(9).text()),
            short: parseNumber(cols.eq(10).text()),
            shortChange: parseNumber(cols.eq(11).text())
          };

          const smallTraders = {
            long: parseNumber(cols.eq(12).text()),
            longChange: parseNumber(cols.eq(13).text()),
            short: parseNumber(cols.eq(14).text()),
            shortChange: parseNumber(cols.eq(15).text())
          };

          const openInterest = {
            value: parseNumber(cols.eq(16).text()),
            changePercent: parsePercent(cols.eq(17).text())
          };

          if (assetName) {
            if (!result[currentCategory]) {
              result[currentCategory] = [];
            }

            result[currentCategory].push({
              assetName,
              priceChange,
              largeSpeculators,
              smallTraders,
              openInterest
            });
          }
        }
      }
    });

    const hasData = Object.values(result).some(category => category.length > 0);
    if (!hasData) {
      console.warn('API: No se encontraron datos en la tabla COT.');
      return NextResponse.json<AssetListResponse>(
        { reportDate, data: {}, error: 'No se encontraron datos en la tabla COT' },
        { status: 404 }
      );
    }

    return NextResponse.json<AssetListResponse>({ reportDate, data: result });

  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('API Error:', errorMessage);
    return NextResponse.json<AssetListResponse>(
      { reportDate: 'Fecha no disponible', data: {}, error: `Error fetching COT data: ${errorMessage}` },
      { status: 500 }
    );
  }
}