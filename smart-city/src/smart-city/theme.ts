export type Theme = 'day' | 'night';

export interface ThemePalette {
  /** Dégradé du sol isométrique (3 arrêts). */
  ground: [string, string, string];
  /** Dégradé de l'eau (2 arrêts). */
  water: [string, string];
  /** Halo lumineux de la ville au sol (rendu uniquement la nuit). */
  cityBloom: boolean;
  /** Fenêtres allumées + néons (nuit) ou verre réfléchissant (jour). */
  litWindows: boolean;
  /** Lampadaires / projecteurs allumés. */
  lampsOn: boolean;
}

export const PALETTES: Record<Theme, ThemePalette> = {
  night: {
    ground: ['#566aa8', '#36426c', '#222a4c'],
    water: ['#2a9df4', '#0a347e'],
    cityBloom: true,
    litWindows: true,
    lampsOn: true,
  },
  day: {
    ground: ['#cdd9ee', '#aebdd9', '#8d9fc2'],
    water: ['#7fd0ff', '#1f86d8'],
    cityBloom: false,
    litWindows: false,
    lampsOn: false,
  },
};
