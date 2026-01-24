import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a 10-step primary color palette based on a single hex color
 * @param baseColor - the base primary color in HEX (e.g. '#4F46E5')
 * @returns array of 10 shades from light to dark
 */
export const generatePrimaryPalette = (baseColor: string): string[] => {
  // Convert hex to RGB
  const hexToRgb = (hex: string) => {
    const cleanHex = hex.replace('#', '');
    const bigint = parseInt(cleanHex, 16);
    return [
      (bigint >> 16) & 255, // R
      (bigint >> 8) & 255, // G
      bigint & 255, // B
    ];
  };

  // Convert RGB to HSL
  const rgbToHsl = (r: number, g: number, b: number) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return [h, s, l];
  };

  // Convert HSL back to HEX
  const hslToHex = (h: number, s: number, l: number) => {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    let r: number, g: number, b: number;
    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };
  //@ts-ignore
  const [h, s, l] = rgbToHsl(...hexToRgb(baseColor));

  // Generate 10 shades from light to dark
  const shades: string[] = [];
  const step = 0.08; // adjust lightness step
  for (let i = 9; i >= 0; i--) {
    //@ts-ignore
    let newL = Math.min(Math.max(l + step * (i - 5), 0), 1); // shift around base
    shades.push(hslToHex(h, s, newL));
  }

  return shades;
};
