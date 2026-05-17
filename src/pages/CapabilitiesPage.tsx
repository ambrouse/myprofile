import { useState } from 'react';
import { RevealAfterTitle } from '../components/motion/RevealAfterTitle';
import { TypingText } from '../components/motion/TypingText';
import { Section } from '../components/common/Section';
import { useI18n } from '../features/i18n/i18nContext';

function CaseImage({ src, title }: { src: string; title: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <div className="case-image-fallback" aria-label={title} />;
  }

  return <img src={src} alt="" onError={() => setFailed(true)} />;
}

export function CapabilitiesPage() {
  const { content } = useI18n();
  const [titleReady, setTitleReady] = useState(false);

  return (
    <main className="capabilities-page">
      <section className="capabilities-hero">
        <p className="section-label">{content.capabilities.eyebrow}</p>
        <TypingText text={content.capabilities.title} onDone={() => setTitleReady(true)} />
      </section>

      <RevealAfterTitle ready={titleReady}>
      <Section eyebrow={content.about.eyebrow} title={content.about.title}>
        <div className="summary-grid">
          {content.about.highlights.map((highlight, index) => <article key={highlight}><span>{String(index + 1).padStart(2, '0')}</span>{highlight}</article>)}
        </div>
      </Section>

      <Section eyebrow={content.capabilities.sectionEyebrow} title={content.capabilities.title}>
        <div className="expertise-grid">
          {content.capabilities.items.map((item, index) => (
            <article className="expertise-card" key={item.title}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </Section>

      <Section eyebrow={content.cases.eyebrow} title={content.cases.title}>
        <div className="case-grid case-grid-five">
          {content.cases.items.map((item) => (
            <article className="case-card" key={item.id}>
              <CaseImage src={item.image} title={item.title} />
              <div>
                <span>{item.label}</span>
                <h3>{item.title}</h3>
                <p className="case-meta">{item.role} · {item.duration}</p>
                <ul>
                  {item.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                </ul>
                <div className="tag-row">
                  {item.stack.map((tech) => <em key={tech}>{tech}</em>)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>
      </RevealAfterTitle>
    </main>
  );
}
