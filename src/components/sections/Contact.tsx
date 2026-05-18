'use client';

import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Contact.module.scss';

export function Contact() {
  const t = useTranslations('contact');

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.inner}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
        >
          <span className={styles.tag}>06</span>
          <h2 className={styles.title}>{t('title')}</h2>
          <p className={styles.subtitle}>{t('subtitle')}</p>

          <div className={styles.buttonGroup}>
            <a
              href="https://www.linkedin.com/in/gustavo-dropa/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
              aria-label="LinkedIn"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                <circle cx="4" cy="4" r="2"/>
              </svg>
              LinkedIn
            </a>

            <a
              href="https://github.com/GuDropa"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ctaButton}
              aria-label="GitHub"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>
              </svg>
              GitHub
            </a>
          </div>

          <div className={styles.contactLinks}>
            <a
              href="mailto:gustavo.dropa@gmail.com"
              className={styles.contactLink}
            >
              gustavo.dropa@gmail.com
            </a>

            <a
              href="tel:+5542991072126"
              className={styles.contactLink}
            >
              (42) 9 9107-2126
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
