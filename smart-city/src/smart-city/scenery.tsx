import type { ReactElement } from 'react';
import { iso, lerp, pts } from './geometry';
import { cuboid } from './buildingParts';

export function createGround(): ReactElement {
  const els: ReactElement[] = [];
  const g0 = 0;
  const g1 = 11;
  els.push(<polygon key="ground" fill="url(#groundGrad)" points={pts([iso(g0, g0), iso(g1, g0), iso(g1, g1), iso(g0, g1)])} />);
  for (let i = g0; i <= g1; i++) {
    els.push(<line key={'gx' + i} x1={iso(i, g0).x} y1={iso(i, g0).y} x2={iso(i, g1).x} y2={iso(i, g1).y} stroke="#3a4a72" strokeWidth={0.5} opacity={0.16} />);
    els.push(<line key={'gy' + i} x1={iso(g0, i).x} y1={iso(g0, i).y} x2={iso(g1, i).x} y2={iso(g1, i).y} stroke="#3a4a72" strokeWidth={0.5} opacity={0.16} />);
  }
  return <g key="groundgrp">{els}</g>;
}

export function createRoads(): ReactElement {
  const els: ReactElement[] = [];
  const road = (ax: number, ay: number, bx: number, by: number, half: number, k: string) => {
    const c =
      ay === by
        ? [iso(ax, ay - half), iso(bx, by - half), iso(bx, by + half), iso(ax, ay + half)]
        : [iso(ax - half, ay), iso(bx - half, by), iso(bx + half, by), iso(ax + half, ay)];
    els.push(<polygon key={'road' + k} points={pts(c)} fill="#2c3858" opacity={0.9} />);
    // ligne médiane pointillée
    const n = 9;
    for (let i = 0; i < n; i++) {
      const t0 = i / n + 0.02;
      const t1 = t0 + 0.045;
      const p0 = lerp(iso(ax, ay), iso(bx, by), t0);
      const p1 = lerp(iso(ax, ay), iso(bx, by), t1);
      els.push(<line key={`dash${k}-${i}`} x1={p0.x} y1={p0.y} x2={p1.x} y2={p1.y} stroke="#5a6a92" strokeWidth={1.4} opacity={0.6} />);
    }
  };
  road(0, 2.6, 11, 2.6, 0.34, 'h1');
  road(0, 6.2, 11, 6.2, 0.34, 'h2');
  road(4.5, 0, 4.5, 11, 0.32, 'v1');

  // passages piétons aux intersections
  const cross = (cx: number, cy: number, k: string) => {
    for (let i = 0; i < 5; i++) {
      const off = -0.26 + i * 0.13;
      const a = iso(cx + off, cy - 0.32);
      const b = iso(cx + off, cy + 0.32);
      els.push(<line key={'cw' + k + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke="#cfd8f0" strokeWidth={1.5} opacity={0.32} />);
    }
  };
  cross(4.5, 2.6, 'a');
  cross(4.5, 6.2, 'b');

  return <g key="roads">{els}</g>;
}

export function createWater(): ReactElement {
  const c = [iso(-0.5, 8.5), iso(3, 8.5), iso(3, 11.5), iso(-0.5, 11.5)];
  const els: ReactElement[] = [<polygon key="water" points={pts(c)} fill="url(#waterGrad)" opacity={0.9} />];
  for (let i = 0; i < 6; i++) {
    const p = iso(-0.2 + i * 0.5, 9.2 + (i % 2) * 0.7);
    els.push(
      <ellipse key={'rf' + i} cx={p.x} cy={p.y} rx={16} ry={4.5} fill="#9fd8ff" opacity={0.3} style={{ animation: `shimmer ${3 + i * 0.4}s ease-in-out infinite` }} />,
    );
  }
  const pa = iso(1.4, 8.0);
  const pb = iso(1.4, 9.7);
  els.push(<line key="bridge" x1={pa.x} y1={pa.y} x2={pb.x} y2={pb.y} stroke="#c2410c" strokeWidth={9} opacity={0.9} strokeLinecap="round" />);
  return <g key="watergrp">{els}</g>;
}

export function createPlaza(): ReactElement {
  const els: ReactElement[] = [];
  const c = iso(5.5, 9.0);
  els.push(<ellipse key="plaza" cx={c.x} cy={c.y} rx={96} ry={48} fill="#28344f" opacity={0.85} />);
  els.push(<ellipse key="court" cx={c.x} cy={c.y} rx={66} ry={33} fill="#173a2c" opacity={0.9} />);
  els.push(<ellipse key="cline" cx={c.x} cy={c.y} rx={22} ry={11} fill="none" stroke="#4ade80" strokeWidth={1.2} opacity={0.5} />);
  els.push(<circle key="fount" cx={c.x} cy={c.y} r={7} fill="#5ee7ff" opacity={0.8} filter="url(#softGlow)" />);
  return <g key="plazagrp">{els}</g>;
}

export function createTree(gx: number, gy: number, scale: number, key: string): ReactElement {
  const base = iso(gx, gy, 0);
  const top = iso(gx, gy, 30 * scale);
  return (
    <g key={key}>
      <ellipse cx={base.x + 4} cy={base.y + 3} rx={13 * scale} ry={5 * scale} fill="#05070f" opacity={0.4} filter="url(#aoBlur)" />
      <line x1={base.x} y1={base.y} x2={top.x} y2={top.y + 7} stroke="#5b3a1f" strokeWidth={3 * scale} />
      <circle cx={top.x} cy={top.y + 2} r={14 * scale} fill="#14532d" />
      <circle cx={top.x - 5 * scale} cy={top.y - 6 * scale} r={10 * scale} fill="#22c55e" />
      <circle cx={top.x + 6 * scale} cy={top.y - 2 * scale} r={8.5 * scale} fill="#16a34a" />
      <circle cx={top.x + 1 * scale} cy={top.y - 11 * scale} r={6 * scale} fill="#4ade80" />
    </g>
  );
}

export function createCar(gx: number, gy: number, color: string, key: string): ReactElement {
  const base = iso(gx, gy, 0);
  return (
    <g key={key}>
      <ellipse cx={base.x + 2} cy={base.y + 3} rx={11} ry={4} fill="#05070f" opacity={0.4} filter="url(#aoBlur)" />
      {cuboid(gx - 0.1, gy - 0.1, 0.34, 0.2, 0, 9, color, 'cb' + key)}
    </g>
  );
}

export function createLamp(gx: number, gy: number, key: string, lampsOn = true): ReactElement {
  const base = iso(gx, gy, 0);
  const top = iso(gx, gy, 36);
  return (
    <g key={key}>
      {lampsOn && <ellipse cx={base.x} cy={base.y} rx={34} ry={17} fill="url(#lampPool)" />}
      <line x1={base.x} y1={base.y} x2={top.x} y2={top.y} stroke="#475569" strokeWidth={1.6} />
      {lampsOn ? (
        <circle cx={top.x} cy={top.y} r={4} fill="#ffe7a0" opacity={0.95} filter="url(#softGlow)" style={{ animation: 'win-flicker 3s ease-in-out infinite' }} />
      ) : (
        <circle cx={top.x} cy={top.y} r={4} fill="#7c89b0" opacity={0.85} />
      )}
    </g>
  );
}

export function createPerson(gx: number, gy: number, color: string, key: string): ReactElement {
  const base = iso(gx, gy, 0);
  const head = iso(gx, gy, 13);
  return (
    <g key={key}>
      <ellipse cx={base.x + 2} cy={base.y + 2} rx={5} ry={2} fill="#05070f" opacity={0.4} />
      <line x1={base.x} y1={base.y} x2={head.x} y2={head.y + 4} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      <circle cx={head.x} cy={head.y} r={2.6} fill="#f1d4b3" />
    </g>
  );
}

/** Drone de surveillance volant (coordonnées écran SVG, hors grille iso) */
export function createDrone(cx: number, cy: number, color: string, dur: number, delay: number, key: string, lampsOn = true): ReactElement {
  return (
    <g key={key} style={{ animation: `drone-float ${dur}s ease-in-out infinite`, animationDelay: `${delay}s`, transformOrigin: `${cx}px ${cy}px` }}>
      {/* halo projecteur */}
      <ellipse cx={cx} cy={cy + 26} rx={16} ry={5} fill={color} opacity={lampsOn ? 0.18 : 0.06} filter="url(#softGlow)" />
      {/* bras */}
      <line x1={cx - 13} y1={cy - 3} x2={cx + 13} y2={cy - 3} stroke="#2b3450" strokeWidth={2} strokeLinecap="round" />
      {/* corps */}
      <rect x={cx - 6} y={cy - 5} width={12} height={6} rx={2} fill="#1c2238" stroke="#3a4566" strokeWidth={0.6} />
      {/* hélices */}
      <ellipse cx={cx - 13} cy={cy - 4} rx={6} ry={1.6} fill="#7c89b0" opacity={0.7} />
      <ellipse cx={cx + 13} cy={cy - 4} rx={6} ry={1.6} fill="#7c89b0" opacity={0.7} />
      {/* feu clignotant */}
      <circle cx={cx} cy={cy + 2} r={2.4} fill={color} filter="url(#softGlow)" style={{ animation: 'drone-blink 1.4s steps(1) infinite', animationDelay: `${delay}s` }} />
    </g>
  );
}

export function createBalloon(): ReactElement {
  return (
    <g key="balloon" style={{ animation: 'balloon-float 5s ease-in-out infinite' }}>
      <ellipse cx={980} cy={175} rx={27} ry={31} fill="#f472b6" opacity={0.92} />
      <ellipse cx={980} cy={175} rx={9} ry={31} fill="#fbbf24" opacity={0.85} />
      <rect x={974} y={210} width={12} height={9} fill="#92400e" rx={1} />
      <line x1={968} y1={201} x2={975} y2={210} stroke="#92400e" strokeWidth={1} />
      <line x1={992} y1={201} x2={985} y2={210} stroke="#92400e" strokeWidth={1} />
    </g>
  );
}
