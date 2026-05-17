'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Education.module.scss';

export function Education() {
  const t = useTranslations('education');
  const items = t.raw('items') as Array<{ degree: string; institution: string; period: string }>;

  return (
    <section id="education" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.tag}>05</span>
          <h2 className={styles.title}>{t('title')}</h2>
        </motion.div>

        <div className={styles.list}>
          {items.map((item, i) => (
            <motion.div
              key={i}
              className={styles.item}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={styles.itemLeft}>
                <div className={styles.dot} />
                <div>
                  <h3 className={styles.degree}>{item.degree}</h3>
                  <p className={styles.institution}>{item.institution}</p>
                </div>
              </div>
              {item.period && <span className={styles.period}>{item.period}</span>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
