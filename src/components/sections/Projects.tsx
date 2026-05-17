'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Projects.module.scss';

const PLACEHOLDER_TAGS = [
  ['Vue 3', 'TypeScript', 'Node.js'],
  ['Go', 'Docker', 'GCP'],
  ['React', 'PostgreSQL', 'Next.js'],
];

export function Projects() {
  const t = useTranslations('projects');

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
          <p className={styles.subtitle}>{t('coming_soon_desc')}</p>
        </motion.div>

        <div className={styles.grid}>
          {PLACEHOLDER_TAGS.map((tags, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <div className={styles.corner} />
              <div className={styles.cardInner}>
                <div className={styles.placeholder}>
                  <span>{t('coming_soon')}</span>
                </div>
                <h3 className={styles.projectName}>{t('placeholder')} {i + 1}</h3>
                <p className={styles.projectDesc}>—</p>
                <div className={styles.tags}>
                  {tags.map(tag => (
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
