import { readFile } from 'node:fs/promises';

async function validateJson(path: string) {
  const raw = await readFile(path, 'utf8');
  return JSON.parse(raw) as unknown;
}

async function main() {
  const data = await validateJson('public/data/github-repos.json') as { projects?: unknown[] };
  await validateJson('src/content/profile.en.json');
  await validateJson('src/content/profile.vi.json');

  if (!Array.isArray(data.projects)) {
    throw new Error('public/data/github-repos.json must contain a projects array');
  }

  console.log(`Validated content with ${data.projects.length} GitHub projects`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
