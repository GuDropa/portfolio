'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Experience.module.scss';

export function Experience() {
  const t = useTranslations('experience');
  const roles = t.raw('roles') as Array<{
    title: string;
    company: string;
    location: string;
    period: string;
    team: string;
    bullets: string[];
  }>;

  return (
    <section id="experience" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.tag}>02</span>
          <h2 className={styles.title}>{t('title')}</h2>
        </motion.div>

        <div className={styles.timeline}>
          {roles.map((role, i) => (
            <motion.div
              key={i}
              className={styles.card}
              initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
            >
              <div className={styles.cardInner}>
                <div className={styles.cardTop}>
                  <div>
                    <h3 className={styles.roleTitle}>{role.title}</h3>
                    <p className={styles.company}>
                      {role.company}
                      <span className={styles.location}> · {role.location}</span>
                    </p>
                  </div>
                  <span className={styles.period}>{role.period}</span>
                </div>
                <p className={styles.team}>{role.team}</p>
                <ul className={styles.bullets}>
                  {role.bullets.map((b, j) => (
                    <li key={j}>{b}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.dot} />
            </motion.div>
          ))}

          <div className={styles.line} />
        </div>
      </div>
    </section>
  );
}
