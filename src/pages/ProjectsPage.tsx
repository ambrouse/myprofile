import { CodeXml, RadioTower, Search, Star } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useProjects } from '../features/github-projects/useProjects';
import { useI18n } from '../features/i18n/i18nContext';
import type { GitHubProject } from '../types/portfolio';

function formatDate(value: string) {
  return new Intl.DateTimeFormat('en', { year: 'numeric', month: 'short', day: '2-digit' }).format(new Date(value));
}

const bannerExtensions = ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'];

function repoBannerCandidates(project: GitHubProject) {
  const base = import.meta.env.BASE_URL;
  const rootCandidates = project.fullName === 'ambrouse/myprofile'
    ? bannerExtensions.map((extension) => `${base}banner.${extension}`)
    : [];
  const remoteCandidates = bannerExtensions.flatMap((extension) => [
    `https://raw.githubusercontent.com/${project.fullName}/main/banner.${extension}`,
    `https://raw.githubusercontent.com/${project.fullName}/master/banner.${extension}`
  ]);
  const localCandidates = bannerExtensions.flatMap((extension) => [
    `${base}assets/repo-banners/${project.owner}/${project.name}/banner.${extension}`,
    `${base}assets/repo-banners/${project.fullName}/banner.${extension}`,
    `${base}assets/repo-banners/${project.name}/banner.${extension}`
  ]);

  return Array.from(new Set([...rootCandidates, project.bannerImage, ...remoteCandidates, ...localCandidates].filter(Boolean) as string[]));
}

function ProjectBanner({ project }: { project: GitHubProject }) {
  const banner = project.banner ?? 'record';
  const candidates = useMemo(() => repoBannerCandidates(project), [project]);
  const [candidateIndex, setCandidateIndex] = useState(0);
  const [loadedImage, setLoadedImage] = useState<string | null>(null);
  const candidate = candidates[candidateIndex];
  const style = loadedImage ? { backgroundImage: `url(${loadedImage})` } : undefined;

  return (
    <div className={`repo-banner repo-banner-${banner} ${loadedImage ? 'repo-banner-image' : 'repo-banner-fallback'}`} style={style} aria-hidden="true">
      <div className="banner-gridline" />
      {candidate && candidate !== loadedImage && (
        <img
          key={candidate}
          src={candidate}
          alt=""
          onLoad={() => setLoadedImage(candidate)}
          onError={() => setCandidateIndex((index) => index + 1)}
        />
      )}
    </div>
  );
}

function ProjectCard({ project, featured = false }: { project: GitHubProject; featured?: boolean }) {
  const { content } = useI18n();

  return (
    <article className={featured ? 'project-card featured' : 'project-card'}>
      <ProjectBanner key={project.fullName} project={project} />
      <div className="project-body">
        <div className="project-card-top">
          <span className="project-owner">{project.owner}</span>
          <span>{project.language ?? 'Source'}</span>
        </div>
        <h3>{project.title}</h3>
        <div className="repo-compact-meta">
          <span>{formatDate(project.updatedAt)}</span>
          <span>★ {project.stars}</span>
        </div>
        <div className="project-links">
          <a className="repo-link" href={project.url} target="_blank" rel="noreferrer" aria-label={`${project.title} repository`} title={content.projects.repositoryLabel}><CodeXml size={15} strokeWidth={2.1} /></a>
          {project.homepage && <a className="live-link" href={project.homepage} target="_blank" rel="noreferrer" aria-label={`${project.title} live deployment`} title="Live"><RadioTower size={14} strokeWidth={2.2} /></a>}
        </div>
      </div>
    </article>
  );
}

export function ProjectsPage() {
  const { content } = useI18n();
  const { projects, languages, isLoading, error } = useProjects();
  const [query, setQuery] = useState('');
  const [owner, setOwner] = useState('all');
  const [language, setLanguage] = useState('all');
  const [searchOpen, setSearchOpen] = useState(false);

  const filteredProjects = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return projects.filter((project) => {
      const matchesOwner = owner === 'all' || project.owner === owner;
      const matchesLanguage = language === 'all' || project.language === language;
      const searchable = [project.title, project.name, project.description, project.summary, project.category, project.language, ...(project.keywords ?? []), ...project.topics].join(' ').toLowerCase();
      return matchesOwner && matchesLanguage && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [language, owner, projects, query]);

  const featuredProjects = filteredProjects.filter((project) => project.isFeatured).slice(0, 6);
  const standardProjects = filteredProjects.filter((project) => !featuredProjects.includes(project));

  return (
    <main className="projects-page">
      <section className="projects-hero">
        <div>
          <p className="section-label">{content.projects.eyebrow}</p>
          <h1>{content.projects.title}</h1>
        </div>
      </section>

      <div className={searchOpen || query ? 'filter-panel search-open' : 'filter-panel'}>
        <label className="search-field">
          <button type="button" onClick={() => setSearchOpen((value) => !value)} aria-label="Toggle search"><Search size={15} /></button>
          <input value={query} onFocus={() => setSearchOpen(true)} onChange={(event) => setQuery(event.target.value)} placeholder={content.projects.search} />
        </label>
        <select value={owner} onChange={(event) => setOwner(event.target.value)} aria-label="Filter by GitHub account">
          <option value="all">{content.projects.allAccounts}</option>
          <option value="ambrouse">ambrouse</option>
          <option value="baolnq-ai">baolnq-ai</option>
        </select>
        <select value={language} onChange={(event) => setLanguage(event.target.value)} aria-label="Filter by language">
          <option value="all">{content.projects.allLanguages}</option>
          {languages.map((item) => <option value={item} key={item}>{item}</option>)}
        </select>
      </div>

      {isLoading && <div className="status-card">{content.projects.loading}</div>}
      {error && <div className="status-card error-state">{error}</div>}
      {!isLoading && !error && filteredProjects.length === 0 && <div className="status-card">{content.projects.empty}</div>}

      {featuredProjects.length > 0 && (
        <section className="project-section" aria-label="Featured repositories">
          <div className="project-section-header">
            <div>
              <p className="section-label">{content.projects.source}</p>
              <h2>{content.projects.featuredTitle}</h2>
            </div>
            <span className="project-count"><Star size={13} /> {featuredProjects.length} {content.projects.selectedCount}</span>
          </div>
          <div className="featured-grid">
            {featuredProjects.map((project) => <ProjectCard key={project.id} project={project} featured />)}
          </div>
        </section>
      )}

      <section className="project-section" aria-label="All repositories">
        <div className="project-section-header">
          <div>
            <p className="section-label">{content.projects.archiveEyebrow}</p>
            <h2>{content.projects.archiveTitle}</h2>
          </div>
        </div>
        <div className="repository-grid">
          {standardProjects.map((project) => <ProjectCard key={project.id} project={project} />)}
        </div>
      </section>
    </main>
  );
}
