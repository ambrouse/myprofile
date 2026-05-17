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
  const [animationKey, setAnimationKey] = useState(0);

  return (
    <motion.section
      id={id}
      className="section"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: false, amount: 0.16 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      onViewportEnter={() => setSectionVisible(true)}
      onViewportLeave={() => {
        setSectionVisible(false);
        setTitleReady(false);
        setAnimationKey((value) => value + 1);
      }}
    >
      <div className="section-header">
        {eyebrow && <p className="section-label">{eyebrow}</p>}
        <TypingText key={animationKey} as="h2" text={title} start={sectionVisible} speed={11} onDone={() => setTitleReady(true)} />
        {lead && <RevealAfterTitle ready={titleReady}><p>{lead}</p></RevealAfterTitle>}
      </div>
      <RevealAfterTitle ready={titleReady} delay={lead ? 0.02 : 0}>{children}</RevealAfterTitle>
    </motion.section>
  );
}
