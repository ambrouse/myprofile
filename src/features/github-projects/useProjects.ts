import { useEffect, useMemo, useState } from 'react';
import type { GitHubProject } from '../../types/portfolio';

interface ProjectState {
  projects: GitHubProject[];
  isLoading: boolean;
  error: string | null;
}

export function useProjects() {
  const [state, setState] = useState<ProjectState>({ projects: [], isLoading: true, error: null });

  useEffect(() => {
    let isMounted = true;
    fetch(`${import.meta.env.BASE_URL}data/github-repos.json`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load projects: ${response.status}`);
        }
        return response.json() as Promise<{ projects: GitHubProject[] }>;
      })
      .then((data) => {
        if (isMounted) {
          setState({ projects: data.projects, isLoading: false, error: null });
        }
      })
      .catch((error: unknown) => {
        if (isMounted) {
          setState({ projects: [], isLoading: false, error: error instanceof Error ? error.message : 'Failed to load projects' });
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const languages = useMemo(() => {
    return Array.from(new Set(state.projects.map((project) => project.language).filter(Boolean))).sort() as string[];
  }, [state.projects]);

  return { ...state, languages };
}
