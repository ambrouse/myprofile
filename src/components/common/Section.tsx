import { useState } from 'react';
import { motion } from 'framer-motion';
import { RevealAfterTitle } from '../motion/RevealAfterTitle';
import { TypingText } from '../motion/TypingText';
import type { ReactNode } from 'react';

interface SectionProps {
  id?: string;
  eyebrow?: string;
  title: string;
  lead?: string;
  children: ReactNode;
}

export function Section({ id, eyebrow, title, lead, children }: SectionProps) {
  const [sectionVisible, setSectionVisible] = useState(false);
  const [titleReady, setTitleReady] = useState(false);

  return (
    <motion.section
      id={id}
      className="section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      onViewportEnter={() => setSectionVisible(true)}
    >
      <div className="section-header">
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        <TypingText as="h2" text={title} start={sectionVisible} speed={22} onDone={() => setTitleReady(true)} />
        {lead && <RevealAfterTitle ready={titleReady}><p>{lead}</p></RevealAfterTitle>}
      </div>
      <RevealAfterTitle ready={titleReady} delay={lead ? 0.04 : 0}>{children}</RevealAfterTitle>
    </motion.section>
  );
}
