'use client';

import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { motion } from 'framer-motion';
import styles from './Skills.module.scss';

const SkillsGraph2D = dynamic(
  () => import('@/components/canvas/SkillsGraph2D').then(m => m.SkillsGraph2D),
  { ssr: false }
);

export function Skills() {
  const t = useTranslations('skills');
  const categories = t.raw('categories') as Array<{ label: string; items: string[] }>;

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
        >
          <span className={styles.tag}>03</span>
          <h2 className={styles.title}>{t('title')}</h2>
        </motion.div>

        <motion.div
          className={styles.graphWrapper}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <SkillsGraph2D categories={categories} />
        </motion.div>
      </div>
    </section>
  );
}
