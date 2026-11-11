import type { ReactElement, ReactNode } from 'react';
import { iso, lerp, pts, shade, type Point } from './geometry';
import type { BuildingSpec } from './types';

export function grad(id: string, c0: string, c1: string, vertical: boolean): ReactElement {
  return (
    <linearGradient key={id} id={id} gradientUnits="objectBoundingBox" x1={0} y1={0} x2={vertical ? 0 : 1} y2={1}>
      <stop offset="0%" stopColor={c0} />
      <stop offset="100%" stopColor={c1} />
    </linearGradient>
  );
}

/** Petit cuboïde plein (toits, voitures, mobilier) */
export function cuboid(gx: number, gy: number, w: number, d: number, z0: number, z1: number, color: string, key: string, lift = 0): ReactElement {
  const Z = (z: number) => z + lift;
  const T00 = iso(gx, gy, Z(z1));
  const T10 = iso(gx + w, gy, Z(z1));
  const T11 = iso(gx + w, gy + d, Z(z1));
  const T01 = iso(gx, gy + d, Z(z1));
  const B10 = iso(gx + w, gy, Z(z0));
  const B11 = iso(gx + w, gy + d, Z(z0));
  const B01 = iso(gx, gy + d, Z(z0));
  return (
    <g key={key}>
      <polygon points={pts([T10, T11, B11, B10])} fill={shade(color, -0.4)} />
      <polygon points={pts([T01, T11, B11, B01])} fill={shade(color, -0.18)} />
      <polygon points={pts([T00, T10, T11, T01])} fill={shade(color, 0.18)} />
    </g>
  );
}

export function windowsOnFace(topA: Point, topB: Point, botA: Point, botB: Point, cols: number, rows: number, color: string, key: string, glass = false): ReactNode[] {
  const els: ReactNode[] = [];
  const pt = (u: number, v: number) => lerp(lerp(topA, topB, u), lerp(botA, botB, u), v);
  const mU = 0.12;
  const mV = 0.1;
  const gU = (1 - mU * 2) / cols;
  const gV = (1 - mV * 2) / rows;
  const wFrac = 0.64;
  const hFrac = 0.62;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const u0 = mU + i * gU + (gU * (1 - wFrac)) / 2;
      const u1 = u0 + gU * wFrac;
      const v0 = mV + j * gV + (gV * (1 - hFrac)) / 2;
      const v1 = v0 + gV * hFrac;
      // Jour : vitres réfléchissantes (toutes "vitrées", opacité variable).
      // Nuit : fenêtres allumées/éteintes (~80 % allumées).
      const lit = (i * 7 + j * 3 + key.length) % 5 !== 0;
      els.push(
        <polygon
          key={`w-${key}-${i}-${j}`}
          points={pts([pt(u0, v0), pt(u1, v0), pt(u1, v1), pt(u0, v1)])}
          fill={glass ? color : lit ? color : '#15203a'}
          opacity={glass ? 0.6 + ((i + j) % 3) * 0.12 : lit ? 0.95 : 0.5}
        />,
      );
    }
  }
  return els;
}

/** Bandeau lumineux rez-de-chaussée (boutiques) */
export function storefront(topA: Point, topB: Point, botA: Point, botB: Point, color: string, key: string, glow = true): ReactElement {
  const pt = (u: number, v: number) => lerp(lerp(topA, topB, u), lerp(botA, botB, u), v);
  return (
    <polygon
      key={key}
      points={pts([pt(0.06, 0.82), pt(0.94, 0.82), pt(0.94, 0.97), pt(0.06, 0.97)])}
      fill={color}
      opacity={glow ? 0.9 : 0.55}
      filter={glow ? 'url(#winGlow)' : undefined}
    />
  );
}

/** Corniches d'étage + pilastres + plinthe sur une face */
export function facadeDetail(topA: Point, topB: Point, botA: Point, botB: Point, cols: number, rows: number, color: string, key: string): ReactNode[] {
  const pt = (u: number, v: number) => lerp(lerp(topA, topB, u), lerp(botA, botB, u), v);
  const els: ReactNode[] = [];
  const cor = shade(color, 0.18);
  const pil = shade(color, -0.34);
  const plin = shade(color, -0.52);

  els.push(
    <polygon key={`pl-${key}`} points={pts([pt(0.03, 0.9), pt(0.97, 0.9), pt(0.97, 1), pt(0.03, 1)])} fill={plin} opacity={0.85} />,
  );

  const mV = 0.1;
  const gV = (1 - mV * 2) / rows;
  for (let r = 1; r < rows; r++) {
    const v = mV + r * gV;
    const a = pt(0.06, v);
    const b = pt(0.94, v);
    els.push(<line key={`cor-${key}-${r}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={cor} strokeWidth={0.8} opacity={0.38} />);
  }

  const mU = 0.12;
  const gU = (1 - mU * 2) / cols;
  for (let c = 1; c < cols; c++) {
    const u = mU + c * gU;
    const a = pt(u, 0.1);
    const b = pt(u, 0.88);
    els.push(<line key={`pil-${key}-${c}`} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={pil} strokeWidth={0.8} opacity={0.32} />);
  }

  return els;
}

export function buildingDepth(s: BuildingSpec): number {
  return s.gx + s.gy + (s.w + s.d) / 4;
}

export function buildingGradients(spec: BuildingSpec): ReactElement[] {
  const c = spec.color;
  return [
    grad(`g-${spec.id}-roof`, shade(c, 0.3), shade(c, 0.08), false),
    grad(`g-${spec.id}-left`, shade(c, -0.02), shade(c, -0.32), true),
    grad(`g-${spec.id}-right`, shade(c, -0.28), shade(c, -0.55), true),
  ];
}

/** Occlusion ambiante au sol sous un bâtiment */
export function buildingAO(s: BuildingSpec): ReactElement {
  const c = iso(s.gx + s.w / 2, s.gy + s.d / 2, 0);
  return (
    <ellipse
      key={'ao-' + s.id}
      cx={c.x}
      cy={c.y + 6}
      rx={(s.w + s.d) * 18}
      ry={(s.w + s.d) * 9}
      fill="#05070f"
      opacity={0.5}
      filter="url(#aoBlur)"
    />
  );
}
