import type { BuildingSpec } from './types';

export const buildingSpecs: BuildingSpec[] = [
  { id: 'achat-culturel', name: 'ACHAT CULTUREL', machines: 14, servers: 0, network: 0, gx: 2.2, gy: 0.3, w: 2, d: 2, color: '#7c3aed', win: '#c4b5fd', glowColor: '#a78bfa', dome: true },
  { id: 'achat-frais', name: 'ACHAT FRAIS', machines: 34, servers: 0, network: 0, gx: 7.3, gy: 0.2, w: 2, d: 2, color: '#16a34a', win: '#86efac', glowColor: '#4ade80', greenery: true },
  { id: 'achat-bazar', name: 'ACHAT BAZAR', machines: 12, servers: 0, network: 0, gx: 0.3, gy: 3.2, w: 2, d: 2, color: '#db2777', win: '#fbbf24', glowColor: '#f472b6', multi: true },
  { id: 'business-center', name: 'BUSINESS CENTER', machines: 10, servers: 3, network: 1, gx: 5.0, gy: 3.2, w: 1.8, d: 1.8, color: '#0891b2', win: '#67e8f9', glowColor: '#22d3ee', tower: true },
  { id: 'achat-sec', name: 'ACHAT SEC', machines: 50, servers: 0, network: 0, gx: 8.0, gy: 4.0, w: 3, d: 2, color: '#475569', win: '#cbd5e1', glowColor: '#94a3b8', warehouse: true },
  { id: 'casino-2-plateau', name: 'CASINO 2 PLATEAU', machines: 16, servers: 0, network: 0, gx: 2.2, gy: 7.0, w: 3, d: 2, color: '#0284c7', win: '#bae6fd', glowColor: '#38bdf8', solar: true },
  { id: 'casino-allabra', name: 'CASINO ALLABRA', machines: 19, servers: 0, network: 0, gx: 7.2, gy: 7.6, w: 2, d: 2, color: '#be123c', win: '#fda4af', glowColor: '#fb7185', garden: true },
];
