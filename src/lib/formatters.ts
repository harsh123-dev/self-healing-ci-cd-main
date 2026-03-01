// Utility functions for formatting prices and currencies

export const formatPrice = (price: number, currency: "INR" | "USD" | "EUR"): string => {
  const formatter = new Intl.NumberFormat(
    currency === "INR" ? "en-IN" : currency === "EUR" ? "de-DE" : "en-US",
    {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }
  );
  return formatter.format(price);
};

export const formatPriceShort = (price: number, currency: "INR" | "USD" | "EUR"): string => {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };

  if (price >= 10000000) {
    return `${symbols[currency]}${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `${symbols[currency]}${(price / 100000).toFixed(2)} L`;
  }
  if (price >= 1000) {
    return `${symbols[currency]}${(price / 1000).toFixed(1)}K`;
  }
  return `${symbols[currency]}${price}`;
};

export const getCurrencySymbol = (currency: "INR" | "USD" | "EUR"): string => {
  const symbols: Record<string, string> = {
    INR: "₹",
    USD: "$",
    EUR: "€",
  };
  return symbols[currency];
};

export const categoryLabels: Record<string, string> = {
  hatchback: "Hatchback",
  sedan: "Sedan",
  suv: "SUV",
  luxury: "Luxury",
  sports: "Sports",
  ev: "Electric",
  hybrid: "Hybrid",
};

export const getCategoryLabel = (category: string): string => {
  return categoryLabels[category] || category;
};

export const getCategoryColor = (category: string): string => {
  const colors: Record<string, string> = {
    ev: "text-primary",
    hybrid: "text-green-400",
    sports: "text-red-400",
    luxury: "text-amber-400",
    suv: "text-blue-400",
    sedan: "text-purple-400",
    hatchback: "text-cyan-400",
  };
  return colors[category] || "text-muted-foreground";
};

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
};
