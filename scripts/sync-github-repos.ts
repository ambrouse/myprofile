import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { Buffer } from 'node:buffer';

interface GitHubRepoResponse {
  id: number;
  owner: { login: string };
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  homepage: string | null;
  language: string | null;
  topics?: string[];
  stargazers_count: number;
  forks_count: number;
  fork: boolean;
  archived: boolean;
  updated_at: string;
  pushed_at: string;
  default_branch: string;
}

interface GitHubReadmeResponse {
  content?: string;
  encoding?: string;
}

interface GitHubContentItem {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
}

interface ProjectOverrideFile {
  featured: string[];
  overrides: Record<string, Partial<{ title: string; description: string; summary: string; featured: boolean }>>;
}

interface PresentationMetadata {
  category: string;
  keywords: string[];
  banner: string;
}

const owners = ['ambrouse', 'baolnq-ai'];
const outputPath = resolve('public/data/github-repos.json');
const overridesPath = resolve('src/content/projects.overrides.json');

function createHeaders() {
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'nguyen-le-quoc-bao-portfolio-sync'
  };

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  return headers;
}

function toTitle(name: string) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ');
}

function describeRepo(repo: GitHubRepoResponse) {
  const title = toTitle(repo.name);
  const language = repo.language ? `${repo.language} ` : '';
  const text = [repo.name, repo.language ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase();

  if (/(agent|chatbot|rag|llm|ai)/.test(text)) {
    return `${title} focuses on agent or AI workflow implementation, useful for reviewing orchestration, model integration and application boundaries.`;
  }

  if (/(frontend|react|vue|web|profile)/.test(text)) {
    return `${title} is a ${language}web interface repository, useful for reading UI structure, client routing and deployment practice.`;
  }

  if (/(backend|api|server|service)/.test(text)) {
    return `${title} is a ${language}service repository, useful for reviewing API boundaries, persistence flow and deployment ownership.`;
  }

  if (/(yolo|vision|detect|face|object|camera)/.test(text)) {
    return `${title} records applied computer-vision work, with value in model usage, inference flow and scenario-specific detection logic.`;
  }

  if (/(notebook|recommend|transformer|encode|ml)/.test(text) || repo.language === 'Jupyter Notebook') {
    return `${title} is a machine-learning study record, useful for tracing data preparation, modelling choices and experiment output.`;
  }

  return `${title} is a ${language || 'software '}repository kept for implementation reference, code structure and deployment history.`;
}

function isFeatured(repo: GitHubRepoResponse, featuredKeywords: string[]) {
  const haystack = [repo.name, repo.description ?? '', repo.language ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase();
  return featuredKeywords.some((keyword) => haystack.includes(keyword.toLowerCase()));
}

function inferPresentation(repo: GitHubRepoResponse, description: string): PresentationMetadata {
  const text = [repo.name, description, repo.language ?? '', ...(repo.topics ?? [])].join(' ').toLowerCase();

  if (/(rag|chatbot|agent|llm|riva|audio2face|nvidia|ai)/.test(text)) {
    return { category: 'Applied AI system', keywords: ['AI', 'agent workflow', repo.language ?? 'system'], banner: 'ai' };
  }

  if (/(face|yolo|object|detection|vision|camera|gesture|thu ngu|te nga)/.test(text)) {
    return { category: 'Computer vision study', keywords: ['vision', 'inference', repo.language ?? 'model'], banner: 'vision' };
  }

  if (/(warehouse|commerce|retail|provider|product|fashion|chungcu|quanly)/.test(text)) {
    return { category: 'Applied operations system', keywords: ['operations', 'workflow', repo.language ?? 'application'], banner: 'operations' };
  }

  if (/(frontend|web|profile|note|react|vue|scss|javascript|typescript)/.test(text)) {
    return { category: 'Web application', keywords: ['interface', 'frontend', repo.language ?? 'web'], banner: 'web' };
  }

  if (/(config|cloud|server|microservice|backend|api)/.test(text)) {
    return { category: 'Backend and infrastructure', keywords: ['backend', 'deployment', repo.language ?? 'service'], banner: 'backend' };
  }

  if (/(notebook|transformer|encode|du doan|recommendation|de xuat)/.test(text) || repo.language === 'Jupyter Notebook') {
    return { category: 'Machine-learning notebook', keywords: ['notebook', 'modelling', 'analysis'], banner: 'notebook' };
  }

  if (/(tool|auto|browser|brouser|script|build)/.test(text)) {
    return { category: 'Automation utility', keywords: ['automation', 'utility', repo.language ?? 'script'], banner: 'automation' };
  }

  return { category: 'Repository record', keywords: [repo.language ?? 'source', 'public repo', repo.owner.login], banner: 'record' };
}

async function fetchRepos(owner: string): Promise<GitHubRepoResponse[]> {
  const headers = createHeaders();
  const repos: GitHubRepoResponse[] = [];
  let page = 1;

  while (true) {
    const url = `https://api.github.com/users/${owner}/repos?per_page=100&page=${page}&sort=updated`;
    const response = await fetch(url, { headers });
    if (!response.ok) {
      throw new Error(`GitHub API failed for ${owner}: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as GitHubRepoResponse[];
    repos.push(...data);

    if (data.length < 100) {
      break;
    }
    page += 1;
  }

  return repos;
}

function normalizeReadmeImageUrl(src: string, repo: GitHubRepoResponse) {
  const decodedSrc = src.trim().replace(/^<|>$/g, '').replace(/&amp;/g, '&');
  if (/^(data:|javascript:|#)/i.test(decodedSrc)) {
    return undefined;
  }

  if (/^https:\/\/raw\.githubusercontent\.com\//i.test(decodedSrc)) {
    return decodedSrc;
  }

  if (/^https:\/\/github\.com\/user-attachments\/assets\//i.test(decodedSrc)) {
    return decodedSrc;
  }

  if (/^https:\/\/github\.com\//i.test(decodedSrc)) {
    const rawUrl = decodedSrc.replace('https://github.com/', 'https://raw.githubusercontent.com/').replace('/blob/', '/').replace('/raw/', '/');
    return /\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(rawUrl) ? rawUrl : undefined;
  }

  if (/^https?:\/\//i.test(decodedSrc)) {
    return undefined;
  }

  const cleanSrc = decodedSrc.replace(/^\.\//, '').replace(/^\//, '').split('#')[0];
  if (!/\.(png|jpe?g|webp|gif|svg)(\?.*)?$/i.test(cleanSrc)) {
    return undefined;
  }

  return `https://raw.githubusercontent.com/${repo.full_name}/${repo.default_branch}/${encodeURI(cleanSrc)}`;
}

function extractReadmeImageSources(markdown: string) {
  const sources: Array<{ src: string; context: string }> = [];
  const markdownImagePattern = /!\[([^\]]*)\]\((<[^>]+>|[^)]+)\)/gi;
  const htmlImagePattern = /<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi;

  for (const match of markdown.matchAll(markdownImagePattern)) {
    const rawSource = match[2].trim().replace(/^<|>$/g, '').split(/\s+(?=["'])/)[0];
    sources.push({ src: rawSource, context: `${match[1]} ${rawSource}`.toLowerCase() });
  }

  for (const match of markdown.matchAll(htmlImagePattern)) {
    sources.push({ src: match[1], context: match[0].toLowerCase() });
  }

  return sources;
}

function chooseImageCandidate(candidates: Array<{ url: string; context: string }>) {
  const ignored = /(badge|shield|license|npm|version|build|coverage|stars|fork|visitor|counter|icon|logo)/i;
  const usable = candidates.filter((image) => !ignored.test(image.context));
  const explicitBanner = usable.find((image) => /(^|\/)banner\.(png|jpe?g|webp|gif|svg)$/i.test(image.context));
  const preferred = usable.find((image) => /(banner|cover|hero|preview|screenshot|screen|demo|assets\/images|docs\/images|public\/)/i.test(image.context));
  return explicitBanner?.url ?? preferred?.url ?? usable[0]?.url ?? candidates[0]?.url;
}

async function fetchDirectoryEntries(repo: GitHubRepoResponse, path = '') {
  const response = await fetch(`https://api.github.com/repos/${repo.full_name}/contents/${path}`, { headers: createHeaders() });
  if (!response.ok) {
    return undefined;
  }

  return response.json() as Promise<GitHubContentItem[]>;
}

async function fetchDirectoryImage(repo: GitHubRepoResponse, path = '', depth = 0): Promise<string | undefined> {
  if (depth > 2) {
    return undefined;
  }

  const entries = await fetchDirectoryEntries(repo, path);
  if (!entries) {
    return undefined;
  }
  const candidates = entries
    .filter((entry) => entry.type === 'file' && entry.download_url && /\.(png|jpe?g|webp|gif|svg)$/i.test(entry.name))
    .map((entry) => ({ url: entry.download_url as string, context: `${entry.path} ${entry.name}`.toLowerCase() }));

  const chosen = chooseImageCandidate(candidates);
  if (chosen) {
    return chosen;
  }

  const imageDirectories = entries.filter((entry) => entry.type === 'dir' && /(asset|assets|image|images|img|screenshot|screenshots|docs|public|static)/i.test(entry.name));
  for (const directory of imageDirectories) {
    const image = await fetchDirectoryImage(repo, directory.path, depth + 1);
    if (image) {
      return image;
    }
  }

  return undefined;
}

async function fetchExplicitBanner(repo: GitHubRepoResponse) {
  const entries = await fetchDirectoryEntries(repo);
  return entries?.find((entry) => entry.type === 'file' && entry.download_url && /^banner\.(png|jpe?g|webp|gif|svg)$/i.test(entry.name))?.download_url ?? undefined;
}

async function fetchReadmeBanner(repo: GitHubRepoResponse) {
  const explicitBanner = await fetchExplicitBanner(repo);
  if (explicitBanner) {
    return explicitBanner;
  }

  const response = await fetch(`https://api.github.com/repos/${repo.full_name}/readme`, { headers: createHeaders() });
  if (response.ok) {
    const data = await response.json() as GitHubReadmeResponse;
    if (data.encoding === 'base64' && data.content) {
      const markdown = Buffer.from(data.content, 'base64').toString('utf8');
      const candidates = extractReadmeImageSources(markdown)
        .map((image) => ({ ...image, url: normalizeReadmeImageUrl(image.src, repo) }))
        .filter((image): image is { src: string; context: string; url: string } => Boolean(image.url));

      const chosen = chooseImageCandidate(candidates);
      if (chosen) {
        return chosen;
      }
    }
  }

  return fetchDirectoryImage(repo);
}

async function readOverrides(): Promise<ProjectOverrideFile> {
  const raw = await readFile(overridesPath, 'utf8');
  return JSON.parse(raw) as ProjectOverrideFile;
}

async function main() {
  const overrides = await readOverrides();
  const repos = (await Promise.all(owners.map(fetchRepos))).flat().filter((repo) => !repo.archived);
  const bannerEntries = await Promise.all(repos.map(async (repo) => [repo.full_name, await fetchReadmeBanner(repo)] as const));
  const bannerByRepo = Object.fromEntries(bannerEntries.filter(([, banner]) => Boolean(banner)));
  const projects = repos
    .map((repo) => {
      const override = overrides.overrides[repo.full_name] ?? overrides.overrides[repo.name] ?? {};
      const description = override.description ?? repo.description ?? describeRepo(repo);
      const presentation = inferPresentation(repo, description);
      return {
        id: String(repo.id),
        owner: repo.owner.login,
        name: repo.name,
        fullName: repo.full_name,
        title: override.title ?? toTitle(repo.name),
        description,
        url: repo.html_url,
        homepage: repo.homepage || undefined,
        language: repo.language || undefined,
        topics: repo.topics ?? [],
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        isFork: repo.fork,
        isArchived: repo.archived,
        isFeatured: override.featured ?? isFeatured(repo, overrides.featured),
        updatedAt: repo.updated_at,
        pushedAt: repo.pushed_at,
        summary: override.summary,
        category: presentation.category,
        keywords: presentation.keywords,
        banner: presentation.banner,
        bannerImage: bannerByRepo[repo.full_name]
      };
    })
    .sort((a, b) => Number(b.isFeatured) - Number(a.isFeatured) || Date.parse(b.pushedAt) - Date.parse(a.pushedAt));

  await mkdir(dirname(outputPath), { recursive: true });
  await writeFile(outputPath, `${JSON.stringify({ generatedAt: new Date().toISOString(), owners, projects }, null, 2)}\n`, 'utf8');
  console.log(`Synced ${projects.length} repositories from ${owners.join(', ')}`);
}

main().catch(async (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  if (/rate limit/i.test(message)) {
    try {
      await readFile(outputPath, 'utf8');
      console.warn(`${message}. Reusing existing ${outputPath}.`);
      return;
    } catch {
      console.error(message);
      process.exitCode = 1;
      return;
    }
  }

  console.error(message);
  process.exitCode = 1;
});
