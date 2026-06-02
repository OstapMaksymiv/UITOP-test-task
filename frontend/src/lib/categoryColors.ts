const PALETTE = [
  "#1976d2",
  "#9c27b0",
  "#2e7d32",
  "#ed6c02",
  "#d32f2f",
  "#0288d1",
  "#7b1fa2",
  "#00796b",
];

export function getCategoryColor(index: number): string {
  return PALETTE[index % PALETTE.length];
}
