'use client';

import { useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  type NodeTypes,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTheme } from 'next-themes';
import styles from './SkillsFlow.module.scss';

const DEVICON = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons';
const SIMPLE  = 'https://cdn.simpleicons.org';

const ICON_MAP: Record<string, string> = {
  'HTML':          `${DEVICON}/html5/html5-original.svg`,
  'CSS':           `${DEVICON}/css3/css3-original.svg`,
  'JavaScript':    `${DEVICON}/javascript/javascript-original.svg`,
  'PHP':           `${DEVICON}/php/php-original.svg`,
  'MySQL':         `${DEVICON}/mysql/mysql-original.svg`,
  'Node.js':       `${DEVICON}/nodejs/nodejs-original.svg`,
  'Bootstrap':     `${DEVICON}/bootstrap/bootstrap-original.svg`,
  'MongoDB':       `${DEVICON}/mongodb/mongodb-original.svg`,
  'Sequelize':     `${DEVICON}/sequelize/sequelize-original.svg`,
  'Vue 2':         `${DEVICON}/vuejs/vuejs-original.svg`,
  'SASS':          `${DEVICON}/sass/sass-original.svg`,
  'Git':           `${DEVICON}/git/git-original.svg`,
  'GitHub':        `${DEVICON}/github/github-original.svg`,
  'GitLab':        `${DEVICON}/gitlab/gitlab-original.svg`,
  'TypeScript':    `${DEVICON}/typescript/typescript-original.svg`,
  'PostgreSQL':    `${DEVICON}/postgresql/postgresql-original.svg`,
  'RabbitMQ':      `${SIMPLE}/rabbitmq/FF6600`,
  'Jira':          `${DEVICON}/jira/jira-original.svg`,
  'Notion':        `${SIMPLE}/notion/000000`,
  'Vue 3':         `${DEVICON}/vuejs/vuejs-original.svg`,
  'Vuetify':       `${DEVICON}/vuetify/vuetify-original.svg`,
  'Pinia':         `${SIMPLE}/pinia/42B883`,
  'Laravel':       `${DEVICON}/laravel/laravel-original.svg`,
  'Go':            `${DEVICON}/go/go-original-wordmark.svg`,
  'Elasticsearch': `${DEVICON}/elasticsearch/elasticsearch-original.svg`,
  'Kibana':        `${DEVICON}/kibana/kibana-original.svg`,
  'Docker':        `${DEVICON}/docker/docker-original.svg`,
  'GCP':           `${DEVICON}/googlecloud/googlecloud-original.svg`,
  'Redis':         `${DEVICON}/redis/redis-original.svg`,
  'React':         `${DEVICON}/react/react-original.svg`,
  'Next.js':       `${DEVICON}/nextjs/nextjs-original.svg`,
  'Zustand':       `${DEVICON}/react/react-original.svg`,
  'Tailwind':      `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  'Vite':          `${DEVICON}/vitejs/vitejs-original.svg`,
  'Framer Motion': `${SIMPLE}/framer/05F`,
};

const COLORS_DARK  = ['#FFD600', '#c084fc', '#60a5fa', '#34d399'];
const COLORS_LIGHT = ['#4B2462', '#7c3aed', '#2563eb', '#059669'];

interface TrailRow { era?: string; subtitle?: string; skills: string[] }

const TRAIL_ROWS: TrailRow[] = [
  { era: 'MAR 2021', subtitle: 'Primeiro Emprego',        skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL'] },
  {                                                         skills: ['Node.js', 'Bootstrap', 'Firebird', 'MongoDB', 'Sequelize'] },
  { era: 'SET 2021', subtitle: 'FiqOn · Dev Front-End',   skills: ['Vue 2', 'SASS', 'Git', 'GitHub', 'GitLab'] },
  { era: 'FEV 2023', subtitle: 'FiqOn · Head de Produto', skills: ['TypeScript', 'PostgreSQL', 'RabbitMQ', 'Jira', 'Notion'] },
  { era: 'MAR 2024', subtitle: 'FiqOn · Fullstack',       skills: ['Vue 3', 'Vuetify', 'Pinia', 'Laravel', 'Go'] },
  {                                                         skills: ['Elasticsearch', 'Kibana', 'Docker', 'GCP', 'Redis'] },
  { era: 'OUT 2024', subtitle: 'Stefanini · Enterprise',  skills: ['React', 'Next.js', 'Zustand', 'Tailwind', 'Vite', 'Framer Motion'] },
];

const CORRELATIONS: [string, string][] = [
  ['MySQL',      'PostgreSQL'],
  ['MySQL',      'Firebird'],
  ['MongoDB',    'Elasticsearch'],
  ['JavaScript', 'TypeScript'],
  ['Vue 2',      'Vue 3'],
  ['GitHub',     'GitLab'],
  ['Docker',     'GCP'],
  ['Pinia',      'Zustand'],
  ['RabbitMQ',   'Node.js'],
  ['Vue 3',      'React'],
  ['Node.js',    'Laravel'],
];

const HGAP = 140;
const VGAP = 155;
const ERA_W = 190;

function buildGraph(isDark: boolean): { nodes: Node[]; edges: Edge[] } {
  const COLORS = isDark ? COLORS_DARK : COLORS_LIGHT;
  const nodes: Node[] = [];
  const edges: Edge[] = [];
  const skillNodeId: Record<string, string> = {};

  let colorIdx = -1;
  const rowColors = TRAIL_ROWS.map(row => {
    if (row.era) colorIdx++;
    return COLORS[colorIdx % COLORS.length];
  });

  TRAIL_ROWS.forEach((row, ri) => {
    const y      = ri * VGAP;
    const rev    = ri % 2 === 1;
    const color  = rowColors[ri];
    const maxX   = (row.skills.length - 1) * HGAP;

    if (row.era) {
      nodes.push({
        id: `era-${ri}`,
        type: 'era',
        position: { x: rev ? maxX + 28 : -(ERA_W + 28), y: y - 8 },
        data: { period: row.era, subtitle: row.subtitle, color },
        draggable: false, selectable: false,
      });
    }

    const rowIds: string[] = [];
    row.skills.forEach((skill, si) => {
      const x  = rev ? (row.skills.length - 1 - si) * HGAP : si * HGAP;
      const id = `s-${ri}-${si}`;
      if (!skillNodeId[skill]) skillNodeId[skill] = id;
      rowIds.push(id);
      nodes.push({
        id,
        type: 'skill',
        position: { x, y },
        data: { label: skill, icon: ICON_MAP[skill], color },
        draggable: false, selectable: false,
      });
    });

    // Within-row trail edges
    const sh = rev ? 'ls' : 'rs';
    const th = rev ? 'rt' : 'lt';
    for (let i = 0; i < rowIds.length - 1; i++) {
      edges.push({
        id: `te-${ri}-${i}`,
        source: rowIds[i],
        target: rowIds[i + 1],
        sourceHandle: sh,
        targetHandle: th,
        type: 'smoothstep',
        animated: true,
        style: { stroke: color, strokeWidth: 1.5, opacity: 0.75 },
      });
    }

    // Turn edge to next row
    if (ri < TRAIL_ROWS.length - 1) {
      edges.push({
        id: `turn-${ri}`,
        source: rowIds[rowIds.length - 1],
        target: `s-${ri + 1}-0`,
        sourceHandle: 'bs',
        targetHandle: 'tt',
        type: 'smoothstep',
        animated: true,
        style: { stroke: color, strokeWidth: 1.5, opacity: 0.75 },
      });
    }
  });

  // Correlation edges (dashed)
  const corrColor = isDark ? 'rgba(192,132,252,0.4)' : 'rgba(124,58,237,0.35)';
  CORRELATIONS.forEach(([a, b], i) => {
    const src = skillNodeId[a], tgt = skillNodeId[b];
    if (src && tgt) {
      edges.push({
        id: `corr-${i}`,
        source: src,
        target: tgt,
        type: 'straight',
        animated: false,
        style: { stroke: corrColor, strokeWidth: 1, strokeDasharray: '5,4' },
      });
    }
  });

  return { nodes, edges };
}

// ── Custom node: Skill ─────────────────────────────────────
function SkillNodeComp({ data }: { data: { label: string; icon?: string; color: string } }) {
  return (
    <div className={styles.skillNode}>
      <Handle type="target"  position={Position.Left}   id="lt" className={styles.handle} />
      <Handle type="target"  position={Position.Right}  id="rt" className={styles.handle} />
      <Handle type="target"  position={Position.Top}    id="tt" className={styles.handle} />
      <Handle type="source"  position={Position.Right}  id="rs" className={styles.handle} />
      <Handle type="source"  position={Position.Left}   id="ls" className={styles.handle} />
      <Handle type="source"  position={Position.Bottom} id="bs" className={styles.handle} />
      <div
        className={styles.skillCircle}
        style={{ '--node-color': data.color } as React.CSSProperties}
      >
        {data.icon
          ? <img
              src={data.icon}
              alt={data.label}
              className={styles.skillIcon}
              crossOrigin="anonymous"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          : <span className={styles.skillFallback}>{data.label.slice(0, 3).toUpperCase()}</span>
        }
      </div>
      <span className={styles.skillLabel}>{data.label}</span>
    </div>
  );
}

// ── Custom node: Era marker ────────────────────────────────
function EraNodeComp({ data }: { data: { period: string; subtitle: string; color: string } }) {
  return (
    <div
      className={styles.eraNode}
      style={{ '--era-color': data.color } as React.CSSProperties}
    >
      <span className={styles.eraPeriod}>{data.period}</span>
      <span className={styles.eraSubtitle}>{data.subtitle}</span>
    </div>
  );
}

const NODE_TYPES: NodeTypes = {
  skill: SkillNodeComp as any,
  era:   EraNodeComp   as any,
};

export function SkillsFlow() {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== 'light';
  const { nodes, edges } = useMemo(() => buildGraph(isDark), [isDark]);

  return (
    <div className={styles.wrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.12 }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        zoomOnScroll={true}
        panOnDrag={true}
        minZoom={0.15}
        maxZoom={2}
      >
        <Background
          variant={BackgroundVariant.Dots}
          size={1.5}
          gap={28}
          color={isDark ? 'rgba(255,214,0,0.07)' : 'rgba(75,36,98,0.07)'}
        />
      </ReactFlow>
    </div>
  );
}
