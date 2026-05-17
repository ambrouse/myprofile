import { useState } from 'react';
import { Code2, Mail, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { RevealAfterTitle } from '../components/motion/RevealAfterTitle';
import { TypingText } from '../components/motion/TypingText';
import { useI18n } from '../features/i18n/i18nContext';

export function ContactPage() {
  const { content } = useI18n();
  const [titleReady, setTitleReady] = useState(false);

  return (
    <main className="contact-page">
      <motion.section className="contact-panel" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <p className="section-label">{content.nav.contact}</p>
          <TypingText text={content.contact.title} onDone={() => setTitleReady(true)} />
          <RevealAfterTitle ready={titleReady}>
            <p>{content.contact.lead}</p>
            <div className="contact-note">
              <strong>Best fit</strong>
              <span>AI prototypes, backend/API work, repository review, deployment cleanup, and practical automation.</span>
            </div>
          </RevealAfterTitle>
        </div>
        <div className="contact-stack">
          <a className="zalo-card" href="https://zalo.me/0326032296" target="_blank" rel="noreferrer" aria-label="Open Zalo contact">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https%3A%2F%2Fzalo.me%2F0326032296" alt="Zalo QR code" />
            <strong>Zalo</strong>
            <small>{content.contact.phone}</small>
          </a>
          <div className="footer-links contact-links">
            <a href={`mailto:${content.contact.email}`}><Mail size={17} />{content.contact.email}</a>
            <a href="https://github.com/ambrouse" target="_blank" rel="noreferrer"><Code2 size={17} />{content.contact.github}</a>
            <a href={`tel:${content.contact.phone}`}><Phone size={17} />{content.contact.phone}</a>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
