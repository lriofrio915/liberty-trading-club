import Link from "next/link";
import { IPortfolio } from "@/models/Portfolio";
import { FolderIcon } from "@heroicons/react/24/outline";

interface PortfolioCardProps {
  portfolio: IPortfolio;
}

export default function PortfolioCard({ portfolio }: PortfolioCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300 flex flex-col justify-between">
      <div>
        <div className="flex items-center mb-4">
          <FolderIcon className="h-6 w-6 text-indigo-500 mr-3" />
          <h3 className="text-xl font-bold text-gray-800">{portfolio.name}</h3>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          {portfolio.tickers.length} activo(s) en seguimiento.
        </p>
        <div className="flex flex-wrap gap-2">
          {portfolio.tickers.slice(0, 3).map((ticker) => (
            <span
              key={ticker}
              className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full"
            >
              {ticker}
            </span>
          ))}
          {portfolio.tickers.length > 3 && (
            <span className="bg-gray-200 text-gray-700 text-xs font-semibold px-2.5 py-1 rounded-full">
              +{portfolio.tickers.length - 3}...
            </span>
          )}
        </div>
      </div>
      <Link
        href={`/portafolio/${portfolio.slug}`}
        className="mt-6 block w-full bg-indigo-600 text-white text-center font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors duration-300"
      >
        Gestionar
      </Link>
    </div>
  );
}
