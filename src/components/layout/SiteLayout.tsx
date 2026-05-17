import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Outlet, Link, NavLink, useLocation } from 'react-router-dom';
import { BookOpen, BriefcaseBusiness, Home, Mail, Moon, Sun } from 'lucide-react';
import { useI18n } from '../../features/i18n/i18nContext';
import { useTheme } from '../../features/theme/themeContext';

const assetBase = import.meta.env.BASE_URL;

function AnchorScroll() {
  const { hash, pathname } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(hash);
    if (target) {
      window.setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, [hash, pathname]);

  return null;
}

interface GridAgent {
  path: Array<[number, number]>;
  color: string;
  speed: number;
  size: number;
  offset: number;
}

const agentPalette = {
  light: ['#008f8c', '#3158d4', '#b7791f', '#7c3aed', '#db2777', '#0f766e'],
  dark: ['#67e8c3', '#8fb1ff', '#d6b46b', '#d6b46b', '#b9f7d0', '#b7a8ff']
};

const pointsPerAgent = 9;
const trailLength = 7;
const speedMultiplier = 1.55;

const gridAgents: GridAgent[] = [
  { path: [[-2, 2], [4, 2], [4, 6], [11, 6], [11, 1], [18, 1]], color: '0', speed: 22, size: 2.2, offset: 0 },
  { path: [[20, 9], [13, 9], [13, 5], [7, 5], [7, 13], [1, 13]], color: '1', speed: 18, size: 2.8, offset: 0.12 },
  { path: [[3, -1], [3, 5], [9, 5], [9, 9], [5, 9], [5, 16]], color: '2', speed: 16, size: 2.1, offset: 0.24 },
  { path: [[17, 0], [10, 0], [10, 5], [17, 5], [17, 11], [9, 11]], color: '3', speed: 24, size: 1.8, offset: 0.36 },
  { path: [[-1, 15], [-1, 8], [5, 8], [5, 3], [12, 3], [12, 10], [21, 10]], color: '4', speed: 20, size: 2.4, offset: 0.48 },
  { path: [[22, 4], [15, 4], [15, 8], [10, 8], [10, 2], [2, 2]], color: '5', speed: 15, size: 1.9, offset: 0.6 },
  { path: [[-3, 7], [4, 7], [4, 0], [9, 0], [9, 8], [17, 8]], color: '0', speed: 17, size: 1.7, offset: 0.72 },
  { path: [[12, 17], [12, 11], [19, 11], [19, 5], [14, 5], [14, -1]], color: '2', speed: 21, size: 2.1, offset: 0.84 },
  { path: [[6, 18], [6, 12], [0, 12], [0, 6], [8, 6], [8, -2]], color: '0', speed: 14, size: 1.8, offset: 0.18 },
  { path: [[21, 14], [15, 14], [15, 17], [8, 17], [8, 10], [2, 10]], color: '3', speed: 19, size: 1.9, offset: 0.3 },
  { path: [[-2, 4], [2, 4], [2, 11], [9, 11], [9, 15], [16, 15]], color: '1', speed: 13, size: 1.7, offset: 0.42 },
  { path: [[18, -2], [18, 3], [12, 3], [12, 12], [20, 12]], color: '2', speed: 15, size: 2, offset: 0.54 },
  { path: [[0, 0], [6, 0], [6, 4], [1, 4], [1, 9], [6, 9]], color: '0', speed: 12, size: 1.6, offset: 0.66 },
  { path: [[23, 7], [18, 7], [18, 16], [11, 16], [11, 6]], color: '1', speed: 16, size: 1.8, offset: 0.78 },
  { path: [[4, 16], [4, 10], [13, 10], [13, 14], [22, 14]], color: '2', speed: 14, size: 1.7, offset: 0.9 },
  { path: [[-4, 1], [1, 1], [1, 6], [7, 6], [7, 2], [14, 2]], color: '0', speed: 13, size: 1.6, offset: 0.03 },
  { path: [[24, 2], [19, 2], [19, 8], [12, 8], [12, 15]], color: '1', speed: 12, size: 1.7, offset: 0.15 },
  { path: [[7, -3], [7, 4], [14, 4], [14, 9], [20, 9]], color: '2', speed: 11, size: 1.5, offset: 0.27 },
  { path: [[-3, 11], [3, 11], [3, 17], [10, 17], [10, 12], [17, 12]], color: '3', speed: 14, size: 1.6, offset: 0.39 },
  { path: [[16, 18], [16, 13], [22, 13], [22, 6], [15, 6]], color: '0', speed: 12, size: 1.8, offset: 0.51 },
  { path: [[2, 19], [2, 14], [-2, 14], [-2, 8], [5, 8]], color: '1', speed: 10, size: 1.5, offset: 0.63 },
  { path: [[25, 11], [19, 11], [19, 17], [13, 17], [13, 7]], color: '2', speed: 13, size: 1.6, offset: 0.75 },
  { path: [[10, -4], [10, 1], [5, 1], [5, 7], [12, 7], [12, 13]], color: '3', speed: 11, size: 1.7, offset: 0.87 },
  { path: [[-4, 16], [1, 16], [1, 18], [8, 18], [8, 14], [15, 14]], color: '0', speed: 12, size: 1.5, offset: 0.21 },
  { path: [[22, -3], [22, 4], [16, 4], [16, 10], [23, 10]], color: '4', speed: 10, size: 1.6, offset: 0.57 }
];

function pathLength(path: GridAgent['path']) {
  return path.slice(1).reduce((total, point, index) => {
    const previous = path[index];
    return total + Math.abs(point[0] - previous[0]) + Math.abs(point[1] - previous[1]);
  }, 0);
}

function segmentPoint(path: GridAgent['path'], distance: number) {
  const total = pathLength(path);
  let remaining = ((distance % total) + total) % total;
  for (let index = 0; index < path.length - 1; index += 1) {
    const start = path[index];
    const end = path[index + 1];
    const length = Math.abs(end[0] - start[0]) + Math.abs(end[1] - start[1]);
    if (remaining <= length) {
      const ratio = length === 0 ? 0 : remaining / length;
      return {
        x: start[0] + (end[0] - start[0]) * ratio,
        y: start[1] + (end[1] - start[1]) * ratio
      };
    }
    remaining -= length;
  }

  const [x, y] = path[0];
  return { x, y };
}

function wrap(value: number, size: number) {
  return ((value % size) + size) % size;
}

function AmbientGridCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return undefined;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return undefined;
    }

    let frame = 0;
    let start = performance.now();
    const grid = 54;

    const resize = () => {
      const scale = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * scale);
      canvas.height = Math.floor(window.innerHeight * scale);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      context.setTransform(scale, 0, 0, scale, 0, 0);
    };

    const draw = (time: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const gridOffsetX = -(grid * 0.5);
      const gridOffsetY = -(grid * 0.5);
      const columns = Math.max(24, Math.ceil(width / grid) + 2);
      const rows = Math.max(18, Math.ceil(height / grid) + 2);
      context.clearRect(0, 0, width, height);

      context.globalAlpha = 0.82;
      context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--line-strong').trim() || 'rgba(222, 240, 232, 0.18)';
      context.lineWidth = 1;
      for (let x = gridOffsetX; x < width + grid; x += grid) {
        context.beginPath();
        context.moveTo(x, 0);
        context.lineTo(x, height);
        context.stroke();
      }
      for (let y = gridOffsetY; y < height + grid; y += grid) {
        context.beginPath();
        context.moveTo(0, y);
        context.lineTo(width, y);
        context.stroke();
      }

      const isLightTheme = document.documentElement.dataset.theme !== 'dark';
      const palette = isLightTheme ? agentPalette.light : agentPalette.dark;
      const seconds = (time - start) / 1000;
      gridAgents.forEach((agent, agentIndex) => {
        const color = palette[Number(agent.color) % palette.length];
        const totalLength = pathLength(agent.path);

        Array.from({ length: pointsPerAgent }).forEach((_, pointIndex) => {
          const pointOffset = (pointIndex / pointsPerAgent) * totalLength + agent.offset * 48 + agentIndex * 0.37;
          const spreadX = wrap(agentIndex * 7 + pointIndex * 11, columns);
          const spreadY = wrap(agentIndex * 5 + pointIndex * 13, rows);
          const distance = seconds * agent.speed * speedMultiplier / grid + pointOffset;
          const trail = Array.from({ length: trailLength }, (__, index) => segmentPoint(agent.path, distance - index * 0.18));

          context.strokeStyle = color;
          context.lineWidth = isLightTheme ? 1.25 : 1.1;
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.beginPath();
          trail.forEach((point, index) => {
            const x = gridOffsetX + wrap(point.x + spreadX, columns) * grid;
            const y = gridOffsetY + wrap(point.y + spreadY, rows) * grid;
            if (index === 0) {
              context.moveTo(x, y);
              return;
            }
            context.globalAlpha = Math.max(0, (isLightTheme ? 0.36 : 0.3) - index * 0.055);
            context.lineTo(x, y);
          });
          context.stroke();

          trail.slice(1).forEach((point, index) => {
            context.globalAlpha = Math.max(0, (isLightTheme ? 0.3 : 0.22) - index * 0.035);
            context.fillStyle = color;
            context.beginPath();
            context.arc(gridOffsetX + wrap(point.x + spreadX, columns) * grid, gridOffsetY + wrap(point.y + spreadY, rows) * grid, Math.max(0.45, agent.size - index * 0.16), 0, Math.PI * 2);
            context.fill();
          });

          const head = trail[0];
          context.globalAlpha = isLightTheme ? 0.92 : 0.8;
          context.shadowColor = color;
          context.shadowBlur = isLightTheme ? 9 : 13;
          context.fillStyle = color;
          context.beginPath();
          context.arc(gridOffsetX + wrap(head.x + spreadX, columns) * grid, gridOffsetY + wrap(head.y + spreadY, rows) * grid, agent.size + (isLightTheme ? 0.25 : 0), 0, Math.PI * 2);
          context.fill();
          context.shadowBlur = 0;
        });
      });

      frame = window.requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    frame = window.requestAnimationFrame((time) => {
      start = time;
      draw(time);
    });

    return () => {
      window.removeEventListener('resize', resize);
      window.cancelAnimationFrame(frame);
    };
  }, []);

  return <canvas className="ambient-grid" ref={canvasRef} aria-hidden="true" />;
}

export function SiteLayout() {
  const { content, locale, toggleLocale } = useI18n();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();

  return (
    <div className="app-shell">
      <AmbientGridCanvas />
      <AnchorScroll />
      <header className="site-header">
        <Link to="/" className="brand" aria-label="Nguyễn Lê Quốc Bảo home">
          <img src={`${assetBase}assets/icons/brand-mark.svg`} alt="" />
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          <NavLink to="/" end aria-label={content.nav.home} title={content.nav.home}><Home size={19} /></NavLink>
          <NavLink to="/capabilities" aria-label={content.nav.capabilities} title={content.nav.capabilities}><BookOpen size={19} /></NavLink>
          <NavLink to="/projects" aria-label={content.nav.projects} title={content.nav.projects}><BriefcaseBusiness size={19} /></NavLink>
          <NavLink to="/contact" aria-label={content.nav.contact} title={content.nav.contact}><Mail size={19} /></NavLink>
        </nav>
      </header>
      <div className="header-actions">
        <button type="button" onClick={toggleTheme} aria-label="Toggle color theme">
          {theme === 'dark' ? <Sun size={17} /> : <Moon size={17} />}
        </button>
        <button type="button" onClick={toggleLocale} aria-label="Toggle language">
          {locale === 'vi' ? 'EN' : 'VI'}
        </button>
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={`${location.pathname}${location.hash}-${locale}-${theme}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
        >
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
