export const isLightColor = (hex: string): boolean => {
  if (!hex) return false;

  // Remove hash if present
  const color = hex.startsWith('#') ? hex.slice(1) : hex;

  // Convert standard hex (6 chars) or shorthad (3 chars)
  const r = parseInt(color.length === 3 ? color[0] + color[0] : color.substring(0, 2), 16);
  const g = parseInt(color.length === 3 ? color[1] + color[1] : color.substring(2, 4), 16);
  const b = parseInt(color.length === 3 ? color[2] + color[2] : color.substring(4, 6), 16);

  // Calculate luminance (standard formula)
  // 0.299*R + 0.587*G + 0.114*B
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

  // Standard threshold is usually around 128-186 depending on preference.
  // 186 is often used for W3C compliance for contrast, but for UI theme logic,
  // we might want a slightly distinct cut-off.
  // Let's use 180 to be safe with light grays.
  return luminance > 180;
};
