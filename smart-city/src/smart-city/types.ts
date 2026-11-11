export interface BuildingSpec {
  id: string;
  name: string;
  machines: number;
  servers: number;
  network: number;
  gx: number;
  gy: number;
  w: number;
  d: number;
  color: string;
  win: string;
  glowColor: string;
  dome?: boolean;
  greenery?: boolean;
  multi?: boolean;
  tower?: boolean;
  warehouse?: boolean;
  solar?: boolean;
  garden?: boolean;
}
