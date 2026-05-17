import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useI18n } from '../features/i18n/i18nContext';

const assetBase = import.meta.env.BASE_URL;

export function HomePage() {
  const { content } = useI18n();

  return (
    <main className="home-page">
      <section className="dossier-cover standalone-cover">
        <motion.div className="cover-copy" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
          <p className="section-label">{content.hero.eyebrow}</p>
          <h1>{content.hero.name}</h1>
          <p className="hero-role">{content.hero.role}</p>
          <p className="hero-lead">{content.hero.lead}</p>
          <div className="hero-actions">
            <Link className="primary-button" to="/projects">{content.hero.primaryCta}<ArrowRight size={18} /></Link>
            <Link className="secondary-button" to="/capabilities">{content.hero.secondaryCta}</Link>
          </div>
        </motion.div>

        <motion.aside className="dossier-card" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="portrait-row">
            <img src={`${assetBase}assets/images/profile.png`} alt="Nguyễn Lê Quốc Bảo" />
            <div>
              <span>Personal dossier</span>
              <strong>Applied AI Systems</strong>
              <p>Backend · RAG · Edge AI</p>
            </div>
          </div>
          <dl className="dossier-meta">
            <div><dt>Identity</dt><dd>Nguyễn Lê Quốc Bảo</dd></div>
            <div><dt>Sources</dt><dd>ambrouse · baolnq-ai</dd></div>
            <div><dt>Record</dt><dd>Public repository archive</dd></div>
          </dl>
          <div className="stat-list">
            {content.hero.stats.map((stat) => (
              <span key={stat.label}><strong>{stat.value}</strong>{stat.label}</span>
            ))}
          </div>
        </motion.aside>
      </section>
    </main>
  );
}
