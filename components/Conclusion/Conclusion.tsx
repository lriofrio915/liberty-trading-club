// components/Conclusion/Conclusion.tsx
import { ApiAssetItem } from "@/types/api";
import { formatCurrency, getRawValue } from "../Shared/utils";

interface ConclusionProps {
  assetData: ApiAssetItem;
}

export default function Conclusion({ assetData }: ConclusionProps) {
  // Desestructuramos los datos directamente de assetData.data
  const { price, financialData } =
    assetData.data;

  const companyName = price?.longName || assetData.ticker;
  const currencySymbol = price?.currencySymbol || "€";

  // Extraer los valores raw
  const marketCap = getRawValue(price?.marketCap);
  const targetHighPrice = getRawValue(financialData?.targetHighPrice);
  const targetLowPrice = getRawValue(financialData?.targetLowPrice);
  const targetMeanPrice = getRawValue(financialData?.targetMeanPrice);
  const targetMedianPrice = getRawValue(financialData?.targetMedianPrice);

  return (
    <section className="bg-white rounded-lg shadow-xl p-6 md:p-8 mb-12">
      <h2 className="text-3xl font-bold text-center text-[#0A2342] mb-8">
        7. Conclusion del Informe
      </h2>
      <p className="text-gray-700 leading-relaxed mb-4">
        {companyName} se posiciona como un actor clave en su industria, con una
        fuerte presencia en diversos segmentos. Su capitalización de mercado de
        aproximadamente{" "}
        <span className="highlight-api">
          {formatCurrency(marketCap as number, currencySymbol)}
        </span>{" "}
        y su diversificada cartera de productos sugieren una empresa con una
        base sólida.
      </p>

      <p className="text-gray-700 leading-relaxed mb-4">
        Desde la perspectiva financiera, observamos que los precios objetivos de
        los analistas varían, pero la recomendación media de{" "}
        <span className="highlight-api">
          {financialData?.recommendationKey?.toUpperCase() || ""}
        </span>{" "}
        indica un sentimiento{" "}
        {financialData?.recommendationKey === "buy" ? "positivo" : "cauteloso"}.
        Los objetivos de precio oscilan entre{" "}
        <span className="highlight-api">
          {formatCurrency(targetLowPrice as number, currencySymbol)}
        </span>{" "}
        y{" "}
        <span className="highlight-api">
          {formatCurrency(targetHighPrice as number, currencySymbol)}
        </span>
        , con un precio objetivo medio de{" "}
        <span className="highlight-api">
          {formatCurrency(targetMeanPrice as number, currencySymbol)}
        </span>{" "}
        y una mediana de{" "}
        <span className="highlight-api">
          {formatCurrency(targetMedianPrice as number, currencySymbol)}
        </span>
        .
      </p>
    </section>
  );
}
