'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import { useState } from 'react';
import styles from './About.module.scss';

export function About() {
  const t = useTranslations('about');
  const [imgError, setImgError] = useState(false);

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
          <div className={styles.grid}>
            <div className={styles.photoCol}>
              <div className={styles.photoWrapper}>
                {!imgError ? (
                  <Image
                    src="/avatar.jpg"
                    alt="Gustavo Dropa"
                    fill
                    sizes="(max-width: 767px) 200px, 280px"
                    className={styles.photo}
                    priority
                    onError={() => setImgError(true)}
                  />
                ) : (
                  <div className={styles.avatarFallback}>GD</div>
                )}
                <div className={styles.photoOverlay} />
                <div className={styles.photoBorder} />
              </div>
            </div>

            <div className={styles.textCol}>
              <span className={styles.tag}>01</span>
              <h2 className={styles.title}>{t('title')}</h2>

              <div className={styles.divider}>
                <svg width="100%" height="24" viewBox="0 0 600 24" fill="none" preserveAspectRatio="none">
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
                  <strong>5+</strong>
                  <span>{t('stat_years_label')}</span>
                </div>
                <div className={styles.stat}>
                  <strong>R$3M</strong>
                  <span>{t('stat_raised_label')}</span>
                </div>
                <div className={styles.stat}>
                  <strong>10+</strong>
                  <span>{t('stat_companies_label')}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
