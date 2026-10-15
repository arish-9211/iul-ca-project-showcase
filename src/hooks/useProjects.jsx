import { createContext, useContext, useEffect, useState } from 'react';
import { normalizeProjects } from '../utils/projects.js';

const DataContext = createContext(null);
const files = import.meta.glob(['../data/projects.json', '../data/samples.json']);

export function ProjectProvider({ children }) {
  const [data, setData] = useState({ projects: [], samples: [], loading: true, notices: [] });
  useEffect(() => {
    let active = true;
    Promise.allSettled(
      ['projects', 'samples'].map((name) => {
        const loader = files[`../data/${name}.json`];
        return loader ? loader() : Promise.reject(new Error('Dataset missing'));
      }),
    ).then((results) => {
      if (!active) return;
      const next = { loading: false, notices: [] };
      results.forEach((result, index) => {
        const key = index === 0 ? 'projects' : 'samples';
        const raw = result.status === 'fulfilled' ? result.value.default : null;
        next[key] = normalizeProjects(raw);
        if (!Array.isArray(raw))
          next.notices.push(
            `The ${key === 'projects' ? 'session directory' : 'example collection'} could not be loaded. Please refresh or contact the project coordinator.`,
          );
        else if (next[key].length !== raw.length)
          next.notices.push(
            'Some incomplete records were omitted. The coordinator should run data validation.',
          );
      });
      setData(next);
    });
    return () => {
      active = false;
    };
  }, []);
  return <DataContext.Provider value={data}>{children}</DataContext.Provider>;
}

export function useProjects() {
  return useContext(DataContext);
}
