'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Projects.module.scss';

type Project = {
  name: string;
  description: string;
  tags: string[];
  github: string;
  live: string;
};

function ExternalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
    </svg>
  );
}

export function Projects() {
  const t = useTranslations('projects');
  const items = t.raw('items') as Project[];

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.tag}>04</span>
          <h2 className={styles.title}>{t('title')}</h2>
        </motion.div>

        <div className={styles.grid}>
          {items.map((project, i) => (
            <motion.div
              key={project.name}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className={styles.corner} />
              <div className={styles.cardInner}>
                <div className={styles.cardTop}>
                  <h3 className={styles.projectName}>{project.name}</h3>
                  <div className={styles.links}>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.link}
                      aria-label={`${project.name} GitHub`}
                    >
                      <GitHubIcon />
                      {t('view_code')}
                    </a>
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${styles.link} ${styles.linkAccent}`}
                      aria-label={`${project.name} live demo`}
                    >
                      <ExternalIcon />
                      {t('view_live')}
                    </a>
                  </div>
                </div>

                <p className={styles.projectDesc}>{project.description}</p>

                <div className={styles.tags}>
                  {project.tags.map(tag => (
                    <span key={tag} className={styles.tagPill}>{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
