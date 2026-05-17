'use client';

import { useTranslations } from 'next-intl';
import styles from './Footer.module.scss';

export function Footer() {
  const t = useTranslations('footer');

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <span>Gustavo Dropa · {new Date().getFullYear()} · {t('made_with')}</span>
      </div>
    </footer>
  );
}
