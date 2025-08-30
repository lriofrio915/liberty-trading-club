// components/Shared/DataListItem/DataListItem.tsx
import { YahooFinanceRawValue } from "@/types/api";
import { formatCurrency, formatPercentage, formatDate } from "../Shared/utils";

interface DataListItemProps {
  label: string;
  value: string | number | undefined | null | YahooFinanceRawValue;
  format?: "currency" | "percentage" | "number" | "date" | "text";
  currencySymbol?: string;
  highlight?: boolean;
}

export default function DataListItem({
  label,
  value,
  format = "text",
  currencySymbol = "€",
  highlight = true,
}: DataListItemProps) {
  if (value === null || value === undefined || value === "") return null;

  // Extraer el valor raw si es YahooFinanceRawValue
  const rawValue =
    typeof value === "object" && value !== null && "raw" in value
      ? value.raw
      : value;

  if (rawValue === null || rawValue === undefined || rawValue === "")
    return null;

  let formattedValue: string;

  switch (format) {
    case "currency":
      formattedValue =
        typeof rawValue === "number"
          ? formatCurrency(rawValue, currencySymbol)
          : String(rawValue);
      break;
    case "percentage":
      formattedValue =
        typeof rawValue === "number"
          ? formatPercentage(rawValue)
          : String(rawValue);
      break;
    case "number":
      formattedValue =
        typeof rawValue === "number"
          ? rawValue.toLocaleString()
          : String(rawValue);
      break;
    case "date":
      formattedValue =
        typeof rawValue === "number" ? formatDate(rawValue) : String(rawValue);
      break;
    case "text":
    default:
      formattedValue = String(rawValue);
      break;
  }

  if (formattedValue === "") return null;

  return (
    <li className="mb-1">
      <span className="font-semibold">{label}:</span>{" "}
      {highlight ? (
        <span className="highlight-api">{formattedValue}</span>
      ) : (
        <span>{formattedValue}</span>
      )}
    </li>
  );
}
