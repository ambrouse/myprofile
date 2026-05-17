export type Locale = 'en' | 'vi';

export type ThemeMode = 'dark' | 'light';

export interface Capability {
  title: string;
  description: string;
}

export interface ExperienceCase {
  id: string;
  label: string;
  title: string;
  role: string;
  duration: string;
  summary: string;
  bullets: string[];
  stack: string[];
  image: string;
}

export interface ProfileContent {
  nav: {
    home: string;
    projects: string;
    capabilities: string;
    contact: string;
  };
  hero: {
    eyebrow: string;
    name: string;
    role: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    stats: Array<{ value: string; label: string }>;
  };
  about: {
    eyebrow: string;
    title: string;
    body: string;
    highlights: string[];
  };
  capabilities: {
    eyebrow: string;
    sectionEyebrow: string;
    title: string;
    lead: string;
    items: Capability[];
  };
  cases: {
    eyebrow: string;
    title: string;
    lead: string;
    items: ExperienceCase[];
  };
  projects: {
    title: string;
    lead: string;
    search: string;
    allAccounts: string;
    allLanguages: string;
    empty: string;
    updated: string;
    source: string;
    viewRepo: string;
    viewLive: string;
    eyebrow: string;
    summary: string;
    featuredTitle: string;
    featuredLead: string;
    selectedCount: string;
    archiveEyebrow: string;
    archiveTitle: string;
    archiveCount: string;
    loading: string;
    repositoryLabel: string;
    liveLabel: string;
  };
  contact: {
    title: string;
    lead: string;
    email: string;
    phone: string;
    github: string;
  };
}

export interface GitHubProject {
  id: string;
  owner: 'ambrouse' | 'baolnq-ai' | string;
  name: string;
  fullName: string;
  title: string;
  description: string;
  url: string;
  homepage?: string;
  language?: string;
  topics: string[];
  stars: number;
  forks: number;
  isFork: boolean;
  isArchived: boolean;
  isFeatured: boolean;
  updatedAt: string;
  pushedAt: string;
  summary?: string;
  category?: string;
  keywords?: string[];
  banner?: string;
  bannerImage?: string;
}
