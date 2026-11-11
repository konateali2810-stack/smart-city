import type { ReactNode } from 'react';
import { iso, pts, shade, lerp } from './geometry';
import { cuboid, facadeDetail, storefront, windowsOnFace } from './buildingParts';
import type { BuildingSpec } from './types';

interface BuildingProps {
  spec: BuildingSpec;
  hovered: boolean;
  isDay: boolean;
  onHover: (id: string | null) => void;
}

export function Building({ spec, hovered, isDay, onHover }: BuildingProps) {
  const { gx, gy, w, d, color } = spec;
  const lift = hovered ? 14 : 0;
  const H = 46 + spec.machines * 4.0 + (spec.tower ? 150 : 0);
  const z = (gz: number) => gz + lift;

  const T00 = iso(gx, gy, z(H));
  const T10 = iso(gx + w, gy, z(H));
  const T11 = iso(gx + w, gy + d, z(H));
  const T01 = iso(gx, gy + d, z(H));
  const B10 = iso(gx + w, gy, z(0));
  const B11 = iso(gx + w, gy + d, z(0));
  const B01 = iso(gx, gy + d, z(0));

  const children: ReactNode[] = [];

  // Faces avec dégradés
  children.push(<polygon key="fr" points={pts([T10, T11, B11, B10])} fill={`url(#g-${spec.id}-right)`} />);
  children.push(<polygon key="fl" points={pts([T01, T11, B11, B01])} fill={`url(#g-${spec.id}-left)`} />);
  children.push(<polygon key="rf" points={pts([T00, T10, T11, T01])} fill={`url(#g-${spec.id}-roof)`} />);

  // Parapet (liseré de toit)
  children.push(<polyline key="par" points={pts([T01, T00, T10])} fill="none" stroke={shade(color, 0.5)} strokeWidth={1.3} opacity={0.55} />);

  // Liseré néon sur le pourtour du toit (glow) — nuit, ou survol de jour
  if (!isDay || hovered) {
    children.push(
      <polygon
        key="neonRoof"
        points={pts([T00, T10, T11, T01])}
        fill="none"
        stroke={spec.glowColor}
        strokeWidth={hovered ? 3 : 1.8}
        opacity={hovered ? 0.95 : 0.6}
        filter="url(#softGlow)"
        style={{ transition: 'all 0.25s ease' }}
      />,
    );
  }

  const winColor = hovered ? '#fff0bf' : isDay ? '#dceefc' : spec.win;
  const colsR = Math.max(2, Math.round(w * 2.2));
  const colsL = Math.max(2, Math.round(d * 2.2));
  const rows = Math.max(3, Math.round(H / 32));

  // Détails de façade (corniches d'étage, pilastres, plinthe)
  children.push(<g key="fdR">{facadeDetail(T10, T11, B10, B11, colsR, rows, color, 'r' + spec.id)}</g>);
  children.push(<g key="fdL">{facadeDetail(T01, T11, B01, B11, colsL, rows, color, 'l' + spec.id)}</g>);

  // Fenêtres (allumées la nuit, vitres réfléchissantes le jour)
  const glass = isDay && !hovered;
  const wins = [
    ...windowsOnFace(T10, T11, B10, B11, colsR, rows, shade(winColor, -0.04), 'r' + spec.id, glass),
    ...windowsOnFace(T01, T11, B01, B11, colsL, rows, winColor, 'l' + spec.id, glass),
  ];
  children.push(
    <g key="wins" filter={glass ? undefined : 'url(#winGlow)'}>
      {wins}
    </g>,
  );

  // Rez-de-chaussée lumineux (boutiques) sur la face avant-gauche
  children.push(storefront(T01, T11, B01, B11, shade(spec.glowColor, 0.15), 'sf' + spec.id, !isDay));

  // Entrée / auvent lumineux centré
  const ptL = (u: number, v: number) => lerp(lerp(T01, T11, u), lerp(B01, B11, u), v);
  children.push(
    <polygon
      key="door"
      points={pts([ptL(0.44, 0.79), ptL(0.56, 0.79), ptL(0.56, 0.99), ptL(0.44, 0.99)])}
      fill={shade(spec.glowColor, 0.35)}
      opacity={isDay ? 0.6 : 0.95}
      filter={isDay ? undefined : 'url(#winGlow)'}
    />,
  );
  children.push(
    <polyline key="canopy" points={pts([ptL(0.4, 0.79), ptL(0.6, 0.79)])} fill="none" stroke={shade(color, 0.4)} strokeWidth={2.4} opacity={0.8} />,
  );

  // Arête lumineuse coin avant
  children.push(<line key="edge" x1={T11.x} y1={T11.y} x2={B11.x} y2={B11.y} stroke={shade(color, 0.55)} strokeWidth={1.6} opacity={0.55} />);
  // Bande néon verticale sur le coin avant — nuit, ou survol de jour
  if (!isDay || hovered) {
    children.push(
      <line
        key="neonEdge"
        x1={T11.x}
        y1={T11.y}
        x2={B11.x}
        y2={B11.y}
        stroke={spec.glowColor}
        strokeWidth={hovered ? 2.6 : 1.4}
        opacity={hovered ? 0.9 : 0.45}
        filter="url(#softGlow)"
        style={{ transition: 'all 0.25s ease' }}
      />,
    );
  }

  // Équipements de toit
  const rc = iso(gx + w / 2, gy + d / 2, z(H));
  if (spec.tower) {
    // tour à double retrait + antenne
    children.push(cuboid(gx + 0.4, gy + 0.4, w - 0.8, d - 0.8, H, H + 30, color, 'set' + spec.id, lift));
    children.push(cuboid(gx + 0.7, gy + 0.7, w - 1.4, d - 1.4, H + 30, H + 46, color, 'set2' + spec.id, lift));
    const tip = iso(gx + w / 2, gy + d / 2, z(H + 92));
    const base = iso(gx + w / 2, gy + d / 2, z(H + 46));
    children.push(<line key="ant" x1={base.x} y1={base.y} x2={tip.x} y2={tip.y} stroke="#67e8f9" strokeWidth={2} />);
    children.push(<circle key="tip" cx={tip.x} cy={tip.y} r={5} fill="#67e8f9" filter="url(#softGlow)" />);
  } else {
    // unités techniques métalliques (sauf toit végétalisé)
    if (!spec.greenery) {
      children.push(cuboid(gx + 0.3, gy + 0.34, 0.32, 0.3, H, H + 7, '#525c72', 'ac1' + spec.id, lift));
      children.push(cuboid(gx + w - 0.66, gy + d - 0.62, 0.28, 0.26, H, H + 6, '#444d61', 'ac2' + spec.id, lift));
    }
    if (spec.warehouse) {
      for (let i = 1; i < 4; i++) {
        const a = iso(gx + (w * i) / 4, gy, z(H));
        const b = iso(gx + (w * i) / 4, gy + d, z(H));
        children.push(<line key={'rib' + i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={shade(color, 0.08)} strokeWidth={2} opacity={0.55} />);
      }
      for (let i = 0; i < 3; i++) {
        children.push(cuboid(gx + 0.45 + i * 0.85, gy + 0.7, 0.45, 0.5, H, H + 4, '#8b97b3', 'sky' + i + spec.id, lift));
      }
    }
    if (spec.greenery) {
      for (let i = 0; i < 5; i++) {
        children.push(
          <circle key={'g' + i} cx={rc.x - 28 + i * 14} cy={rc.y - 3 - (i % 2) * 5} r={7} fill={i % 2 ? '#22c55e' : '#16a34a'} opacity={0.95} />,
        );
      }
      children.push(cuboid(gx + 0.3, gy + 0.3, 0.36, 0.34, H, H + 13, '#94a3b8', 'wt' + spec.id, lift));
    }
    if (spec.multi) {
      ['#fbbf24', '#22d3ee', '#f472b6'].forEach((col, i) => {
        const p = iso(gx + 0.45 + i * 0.5, gy + 0.5, z(H + 16 + i * 4));
        children.push(<rect key={'sg' + i} x={p.x - 5} y={p.y - 11} width={10} height={15} fill={col} rx={2} filter="url(#winGlow)" />);
      });
    }
    if (spec.dome) {
      // verrière / dôme (médiathèque)
      children.push(<ellipse key="dome" cx={rc.x} cy={rc.y - 7} rx={32} ry={17} fill={shade(spec.glowColor, 0.2)} opacity={0.8} filter="url(#softGlow)" />);
      children.push(<ellipse key="dome2" cx={rc.x} cy={rc.y - 10} rx={19} ry={10} fill={shade(spec.win, 0.25)} opacity={0.92} />);
      children.push(<line key="domeL" x1={rc.x - 18} y1={rc.y - 9} x2={rc.x + 18} y2={rc.y - 9} stroke="#fff" strokeWidth={0.6} opacity={0.5} />);
    }
    if (spec.solar) {
      for (let i = 0; i < 3; i++) {
        const p = iso(gx + 0.6 + i * 0.7, gy + 0.7, z(H + 5));
        children.push(
          <polygon
            key={'sol' + i}
            points={pts([{ x: p.x - 13, y: p.y - 3 }, { x: p.x + 2, y: p.y - 9 }, { x: p.x + 13, y: p.y - 3 }, { x: p.x - 2, y: p.y + 3 }])}
            fill="#1e3a8a"
            stroke="#3b82f6"
            strokeWidth={0.6}
            opacity={0.85}
          />,
        );
      }
    }
    if (spec.garden) {
      for (let i = 0; i < 4; i++) {
        children.push(<circle key={'gd' + i} cx={rc.x - 20 + i * 13} cy={rc.y - 2 - (i % 2) * 4} r={5.5} fill="#22c55e" opacity={0.9} />);
      }
    }
  }

  // Marqueur de localisation
  const mk = iso(gx + w / 2, gy + d / 2, z(H + 70));
  children.push(
    <g key="marker" style={{ transformOrigin: `${mk.x}px ${mk.y}px`, animation: 'glow-pulse 2.4s ease-in-out infinite' }}>
      <path
        d={`M ${mk.x} ${mk.y} C ${mk.x - 11} ${mk.y - 14}, ${mk.x - 11} ${mk.y - 30}, ${mk.x} ${mk.y - 30} C ${mk.x + 11} ${mk.y - 30}, ${mk.x + 11} ${mk.y - 14}, ${mk.x} ${mk.y} Z`}
        fill={spec.glowColor}
        opacity={0.95}
        filter="url(#softGlow)"
      />
      <circle cx={mk.x} cy={mk.y - 22} r={4.5} fill="#0d1228" />
    </g>,
  );

  if (hovered) {
    const lab = iso(gx + w / 2, gy + d / 2, z(H + 92));
    children.push(
      <text key="label" x={lab.x} y={lab.y} textAnchor="middle" style={{ fontSize: '13px', fontWeight: 700, fill: '#fff', letterSpacing: '0.5px' }}>
        {spec.name}
      </text>,
    );
  }

  return (
    <g
      style={{ cursor: 'pointer', transition: 'all 0.25s cubic-bezier(0.34,1.4,0.64,1)' }}
      onMouseEnter={() => onHover(spec.id)}
      onMouseLeave={() => onHover(null)}
    >
      {children}
    </g>
  );
}
