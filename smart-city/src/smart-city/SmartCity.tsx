import { useMemo, useState } from 'react';
import { buildingSpecs } from './data';
import { buildingAO, buildingDepth, buildingGradients } from './buildingParts';
import { Building } from './Building';
import { createBalloon, createCar, createDrone, createGround, createLamp, createPerson, createPlaza, createRoads, createTree, createWater } from './scenery';
import { Sky } from './Sky';
import { PALETTES, type Theme } from './theme';
import './SmartCity.css';

const trees: [number, number, number][] = [
  [4, 1, 1], [6.2, 1.1, 0.9], [0.4, 1.2, 1], [3.4, 3.6, 0.85], [7.4, 3.4, 1],
  [4.2, 5.4, 0.9], [6.6, 6.6, 1], [1.2, 6.4, 0.95], [9.3, 2.0, 1], [10.2, 1.2, 0.85],
  [0.5, 6.6, 1], [9.0, 8.4, 0.95], [3.6, 9.2, 0.9], [7.2, 5.2, 0.85], [10.4, 6.0, 0.9], [6.0, 4.4, 0.8],
];

const cars: [number, number, string][] = [
  [2.6, 2.55, '#f97316'], [6.5, 2.65, '#22d3ee'], [4.45, 5.0, '#fbbf24'],
  [4.55, 8.2, '#ef4444'], [3.4, 2.6, '#e2e8f0'], [8.1, 6.2, '#a78bfa'],
];

const lamps: [number, number][] = [
  [1.0, 2.6], [8.0, 2.6], [4.5, 1.0], [4.5, 9.8], [10.0, 5.2], [0.6, 6.2],
];

const people: [number, number, string][] = [
  [5.2, 9.2, '#60a5fa'], [5.8, 8.8, '#f472b6'], [4.9, 8.6, '#fbbf24'], [6.1, 9.4, '#34d399'],
  [3.0, 6.3, '#a78bfa'], [7.0, 6.4, '#fb7185'], [4.6, 5.6, '#e2e8f0'],
];

export function SmartCity() {
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>('night');
  const isDay = theme === 'day';
  const palette = PALETTES[theme];
  const current = hoveredBuilding ? buildingSpecs.find((b) => b.id === hoveredBuilding) ?? null : null;

  const depthObjs = useMemo(() => {
    const objs: { depth: number; el: React.ReactNode }[] = [];

    buildingSpecs.forEach((s) => {
      objs.push({
        depth: buildingDepth(s),
        el: <Building key={s.id} spec={s} hovered={hoveredBuilding === s.id} isDay={isDay} onHover={setHoveredBuilding} />,
      });
    });

    trees.forEach((t, i) => objs.push({ depth: t[0] + t[1] + 0.1, el: createTree(t[0], t[1], t[2], 'tree' + i) }));
    cars.forEach((c, i) => objs.push({ depth: c[0] + c[1] + 0.15, el: createCar(c[0], c[1], c[2], 'car' + i) }));
    lamps.forEach((l, i) => objs.push({ depth: l[0] + l[1] + 0.05, el: createLamp(l[0], l[1], 'lamp' + i, palette.lampsOn) }));
    people.forEach((p, i) => objs.push({ depth: p[0] + p[1] + 0.2, el: createPerson(p[0], p[1], p[2], 'pers' + i) }));

    return objs.sort((a, b) => a.depth - b.depth);
  }, [hoveredBuilding, isDay, palette.lampsOn]);

  const tooltipOpacity = current ? 1 : 0;
  const tooltipY = current ? '0px' : '12px';

  return (
    <div className={`smart-city ${isDay ? 'smart-city--day' : 'smart-city--night'}`}>
      <Sky theme={theme} />
      <div className="smart-city-header">
        <h1>Smart City</h1>
        <p>Parc Informatique · Vue temps réel</p>
      </div>

      <button
        type="button"
        className="smart-city-theme-toggle"
        onClick={() => setTheme((t) => (t === 'night' ? 'day' : 'night'))}
        aria-label={isDay ? 'Passer en mode nuit' : 'Passer en mode jour'}
        title={isDay ? 'Passer en mode nuit' : 'Passer en mode jour'}
      >
        <span className="smart-city-theme-icon">{isDay ? '☀️' : '🌙'}</span>
        <span className="smart-city-theme-label">{isDay ? 'Jour' : 'Nuit'}</span>
      </button>

      <svg className="smart-city-svg" viewBox="0 0 1400 1150" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id="groundGrad" cx="50%" cy="38%" r="74%">
            <stop offset="0%" stopColor={palette.ground[0]} />
            <stop offset="55%" stopColor={palette.ground[1]} />
            <stop offset="100%" stopColor={palette.ground[2]} />
          </radialGradient>
          <linearGradient id="waterGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.water[0]} />
            <stop offset="100%" stopColor={palette.water[1]} />
          </linearGradient>
          <radialGradient id="lampPool" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffe7a0" stopOpacity={0.5} />
            <stop offset="100%" stopColor="#ffe7a0" stopOpacity={0} />
          </radialGradient>
          <radialGradient id="cityBloom" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#7ea2ff" stopOpacity={0.35} />
            <stop offset="55%" stopColor="#5b6fc0" stopOpacity={0.12} />
            <stop offset="100%" stopColor="#5b6fc0" stopOpacity={0} />
          </radialGradient>
          <filter id="winGlow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={2.2} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="softGlow" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation={5} result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="aoBlur" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation={9} />
          </filter>
        </defs>

        <g>
          <defs>{buildingSpecs.flatMap((s) => buildingGradients(s))}</defs>
          {createGround()}
          {palette.cityBloom && <ellipse cx={700} cy={620} rx={620} ry={360} fill="url(#cityBloom)" pointerEvents="none" />}
          {createWater()}
          {createRoads()}
          {createPlaza()}
          <g>{buildingSpecs.map((s) => buildingAO(s))}</g>
          {createBalloon()}
          {createDrone(560, 250, '#5ee7ff', 6, 0, 'drone1', palette.lampsOn)}
          {createDrone(1080, 330, '#f472b6', 7.5, 1.2, 'drone2', palette.lampsOn)}
          {createDrone(860, 150, '#a78bfa', 6.8, 2.4, 'drone3', palette.lampsOn)}
          {depthObjs.map((o) => o.el)}
        </g>
      </svg>

      <div className="smart-city-vignette" />

      <div className="smart-city-tooltip" style={{ opacity: tooltipOpacity, transform: `translateY(${tooltipY})` }}>
        <div className="smart-city-tooltip-head">
          <span className="smart-city-tooltip-dot" style={{ background: current?.glowColor ?? '#5ee7ff', boxShadow: `0 0 10px ${current?.glowColor ?? '#5ee7ff'}` }} />
          <span className="smart-city-tooltip-name">{current?.name ?? ''}</span>
        </div>
        <div className="smart-city-tooltip-rows">
          <div className="smart-city-tooltip-row">
            <span className="smart-city-tooltip-label">Machines totales</span>
            <strong className="smart-city-tooltip-value" style={{ color: '#5ee7ff' }}>{current?.machines ?? 0}</strong>
          </div>
          <div className="smart-city-tooltip-row">
            <span className="smart-city-tooltip-label">Serveurs</span>
            <strong className="smart-city-tooltip-value" style={{ color: '#a78bfa' }}>{current?.servers ?? 0}</strong>
          </div>
          <div className="smart-city-tooltip-row">
            <span className="smart-city-tooltip-label">Équipements réseau</span>
            <strong className="smart-city-tooltip-value" style={{ color: '#4ade80' }}>{current?.network ?? 0}</strong>
          </div>
          <div className="smart-city-tooltip-row smart-city-tooltip-row-last">
            <span className="smart-city-tooltip-label">Statut</span>
            <strong className="smart-city-tooltip-status" style={{ color: '#4ade80' }}>{current ? '✓ Opérationnel' : ''}</strong>
          </div>
        </div>
      </div>

      <div className="smart-city-legend">
        <p>Survolez un bâtiment pour ses détails</p>
        <p>Taille proportionnelle au nombre de machines</p>
      </div>
    </div>
  );
}
