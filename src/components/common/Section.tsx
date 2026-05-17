import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, lead, children }: SectionProps) {
  return (
    <motion.section
      id={id}
      className="section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      <div className="section-header">
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        <h2>{title}</h2>
        {lead && <p>{lead}</p>}
      </div>
      {children}
    </motion.section>
  );
}
