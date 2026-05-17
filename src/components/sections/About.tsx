'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './About.module.scss';

export function About() {
  const t = useTranslations('about');

  return (
    <section id="about" className={styles.about}>
      <div className={styles.container}>
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.tag}>01</span>
          <h2 className={styles.title}>{t('title')}</h2>

          <div className={styles.divider}>
            <svg width="100%" height="24" viewBox="0 0 600 24" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <circle cx="12" cy="12" r="4" fill="var(--accent)" />
              <line x1="16" y1="12" x2="285" y2="12" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="300" cy="12" r="3" fill="var(--accent)" fillOpacity="0.4" />
              <line x1="315" y1="12" x2="584" y2="12" stroke="var(--accent)" strokeOpacity="0.25" strokeWidth="1" strokeDasharray="4 6" />
              <circle cx="588" cy="12" r="4" fill="var(--accent)" />
            </svg>
          </div>

          <p className={styles.text}>{t('text')}</p>

          <div className={styles.stats}>
            <div className={styles.stat}>
              <strong>4+</strong>
              <span>Anos de experiência</span>
            </div>
            <div className={styles.stat}>
              <strong>R$3M</strong>
              <span>Captado — FiqOn</span>
            </div>
            <div className={styles.stat}>
              <strong>5+</strong>
              <span>Empresas atendidas</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
