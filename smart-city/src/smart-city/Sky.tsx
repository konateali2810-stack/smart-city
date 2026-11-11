import { useMemo } from 'react';
import type { Theme } from './theme';
import './Sky.css';

interface Star {
  left: number;
  top: number;
  size: number;
  delay: number;
  dur: number;
  color: string;
}

interface Cloud {
  left: number;
  top: number;
  scale: number;
  dur: number;
  delay: number;
  opacity: number;
}

function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function makeStars(n: number): Star[] {
  const colors = ['#ffffff', '#cfe0ff', '#bff3ff', '#ffe7c4'];
  const rand = seeded(1337);
  const stars: Star[] = [];
  for (let i = 0; i < n; i++) {
    stars.push({
      left: rand() * 100,
      top: rand() * 62,
      size: 0.6 + rand() * 1.8,
      delay: rand() * 6,
      dur: 2.5 + rand() * 4,
      color: colors[Math.floor(rand() * colors.length)],
    });
  }
  return stars;
}

function makeClouds(n: number): Cloud[] {
  const rand = seeded(4242);
  const clouds: Cloud[] = [];
  for (let i = 0; i < n; i++) {
    clouds.push({
      left: rand() * 90,
      top: 6 + rand() * 34,
      scale: 0.7 + rand() * 1.1,
      dur: 26 + rand() * 26,
      delay: -rand() * 30,
      opacity: 0.55 + rand() * 0.35,
    });
  }
  return clouds;
}

function NightSky() {
  const stars = useMemo(() => makeStars(110), []);
  return (
    <div className="sky sky-night">
      <div className="sky-aurora sky-aurora-cyan" />
      <div className="sky-aurora sky-aurora-violet" />
      <div className="sky-aurora sky-aurora-pink" />

      <div className="sky-moon">
        <div className="sky-moon-glow" />
        <div className="sky-moon-disc" />
      </div>

      <div className="sky-stars">
        {stars.map((s, i) => (
          <span
            key={i}
            className="sky-star"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: `${s.size}px`,
              height: `${s.size}px`,
              background: s.color,
              boxShadow: `0 0 ${s.size * 2}px ${s.color}`,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.dur}s`,
            }}
          />
        ))}
      </div>

      <div className="sky-horizon" />
    </div>
  );
}

function DaySky() {
  const clouds = useMemo(() => makeClouds(7), []);
  return (
    <div className="sky sky-day">
      <div className="sky-sun">
        <div className="sky-sun-glow" />
        <div className="sky-sun-disc" />
      </div>

      <div className="sky-clouds">
        {clouds.map((c, i) => (
          <div
            key={i}
            className="sky-cloud"
            style={{
              top: `${c.top}%`,
              opacity: c.opacity,
              animationDuration: `${c.dur}s`,
              animationDelay: `${c.delay}s`,
              ['--s' as string]: c.scale,
            } as React.CSSProperties}
          />
        ))}
      </div>

      <div className="sky-horizon sky-horizon-day" />
    </div>
  );
}

export function Sky({ theme }: { theme: Theme }) {
  return theme === 'day' ? <DaySky /> : <NightSky />;
}
