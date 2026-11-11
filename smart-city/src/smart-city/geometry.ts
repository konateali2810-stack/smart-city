export interface Point {
  x: number;
  y: number;
}

export const TW = 62;
export const TH = 31;
export const OX = 700;
export const OY = 360;

export function iso(gx: number, gy: number, gz = 0): Point {
  return { x: OX + (gx - gy) * TW, y: OY + (gx + gy) * TH - gz };
}

export function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255;
  let g = (n >> 8) & 255;
  let b = n & 255;
  if (amt >= 0) {
    r += (255 - r) * amt;
    g += (255 - g) * amt;
    b += (255 - b) * amt;
  } else {
    r *= 1 + amt;
    g *= 1 + amt;
    b *= 1 + amt;
  }
  return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
}

export function lerp(p: Point, q: Point, t: number): Point {
  return { x: p.x + (q.x - p.x) * t, y: p.y + (q.y - p.y) * t };
}

export function pts(arr: Point[]): string {
  return arr.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
}
