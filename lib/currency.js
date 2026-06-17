export function formatCurrency(amount, options = {}) {
  const { compact = false, signed = false } = options;
  const value = Number(amount || 0);
  const absoluteValue = Math.abs(value);
  const formattedNumber = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: compact ? 0 : 2,
    minimumFractionDigits: compact ? 0 : 2,
  }).format(absoluteValue);
  const sign = signed && value !== 0 ? (value > 0 ? "+" : "-") : value < 0 ? "-" : "";

  return `${sign}Rs. ${formattedNumber}`;
}
