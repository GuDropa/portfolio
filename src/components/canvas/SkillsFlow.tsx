'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
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
  'Vue 3':         `${DEVICON}/vuejs/vuejs-original.svg`,
  'SASS':          `${DEVICON}/sass/sass-original.svg`,
  'Git':           `${DEVICON}/git/git-original.svg`,
  'GitHub':        `${DEVICON}/github/github-original.svg`,
  'GitLab':        `${DEVICON}/gitlab/gitlab-original.svg`,
  'TypeScript':    `${DEVICON}/typescript/typescript-original.svg`,
  'PostgreSQL':    `${DEVICON}/postgresql/postgresql-original.svg`,
  'RabbitMQ':      `${SIMPLE}/rabbitmq/FF6600`,
  'Jira':          `${DEVICON}/jira/jira-original.svg`,
  'Notion':        `${SIMPLE}/notion/000000`,
  'Vuetify':       `${DEVICON}/vuetify/vuetify-original.svg`,
  'Pinia':         `${SIMPLE}/pinia/42B883`,
  'Laravel':       `${DEVICON}/laravel/laravel-original.svg`,
  'Go':            `${DEVICON}/go/go-original-wordmark.svg`,
  'Elasticsearch': `${DEVICON}/elasticsearch/elasticsearch-original.svg`,
  'Docker':        `${DEVICON}/docker/docker-original.svg`,
  'GCP':           `${DEVICON}/googlecloud/googlecloud-original.svg`,
  'Redis':         `${DEVICON}/redis/redis-original.svg`,
  'React':         `${DEVICON}/react/react-original.svg`,
  'Next.js':       `${DEVICON}/nextjs/nextjs-original.svg`,
  'Angular':       `${DEVICON}/angular/angular-original.svg`,
  'Zustand':       `${DEVICON}/react/react-original.svg`,
  'Tailwind':      `${DEVICON}/tailwindcss/tailwindcss-original.svg`,
  'Vite':          `${DEVICON}/vitejs/vitejs-original.svg`,
  'Framer Motion': `${SIMPLE}/framer/05F`,
  'Java':          `${DEVICON}/java/java-original.svg`,
  'Oracle':        `${DEVICON}/oracle/oracle-original.svg`,
  'SQL Server':    `${DEVICON}/microsoftsqlserver/microsoftsqlserver-plain.svg`,
};

const ERA_COLORS = ['#FFD600', '#c084fc', '#60a5fa', '#34d399', '#fb923c'];

const ERAS = [
  {
    year: 'MAR 2021',
    company: 'Finer',
    subtitle: 'Primeiro Emprego',
    skills: ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Node.js', 'Bootstrap', 'MongoDB', 'Sequelize'],
  },
  {
    year: 'SET 2021',
    company: 'FiqOn',
    subtitle: 'Dev Front-End',
    skills: ['Vue 2', 'SASS', 'Git', 'GitHub', 'GitLab', 'TypeScript'],
  },
  {
    year: 'FEV 2023',
    company: 'FiqOn',
    subtitle: 'Head de Produto',
    skills: ['PostgreSQL', 'RabbitMQ', 'Jira', 'Notion'],
  },
  {
    year: 'MAR 2024',
    company: 'FiqOn',
    subtitle: 'Tech Lead & Full Stack',
    skills: ['Vue 3', 'Vuetify', 'Pinia', 'Laravel', 'Go', 'Elasticsearch', 'Docker', 'GCP', 'Redis'],
  },
  {
    year: 'OUT 2024',
    company: 'Myrp',
    subtitle: 'Software Engineer',
    skills: ['React', 'Next.js', 'Angular', 'Zustand', 'Tailwind', 'Vite', 'Framer Motion', 'Java', 'Oracle', 'SQL Server'],
  },
];

function EraRow({ era, color, isLast }: { era: typeof ERAS[0]; color: string; isLast: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      className={styles.eraRow}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.4 }}
      style={{ '--era-color': color } as React.CSSProperties}
    >
      <div className={styles.rail}>
        {!isLast && <div className={styles.railLine} />}
        <motion.div
          className={styles.railDot}
          initial={{ scale: 0 }}
          animate={inView ? { scale: 1 } : {}}
          transition={{ duration: 0.3, type: 'spring', stiffness: 280 }}
        />
      </div>

      <div className={styles.eraContent}>
        <motion.div
          className={styles.eraHeader}
          initial={{ opacity: 0, x: -16 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <span className={styles.eraYear}>{era.year}</span>
          <span className={styles.eraSep}>·</span>
          <span className={styles.eraCompany}>{era.company}</span>
          <span className={styles.eraSubtitle}>{era.subtitle}</span>
        </motion.div>

        <div className={styles.chips}>
          {era.skills.map((skill, si) => (
            <motion.span
              key={skill}
              className={styles.chip}
              initial={{ opacity: 0, y: 10 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.28, delay: 0.14 + si * 0.04 }}
            >
              {ICON_MAP[skill] && (
                <img
                  src={ICON_MAP[skill]}
                  alt=""
                  className={styles.chipIcon}
                  crossOrigin="anonymous"
                  onError={e => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function SkillsFlow() {
  return (
    <div className={styles.timeline}>
      {ERAS.map((era, i) => (
        <EraRow
          key={era.year}
          era={era}
          color={ERA_COLORS[i % ERA_COLORS.length]}
          isLast={i === ERAS.length - 1}
        />
      ))}
    </div>
  );
}
