import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, LayoutGrid, List } from 'lucide-react';
import { useProjects } from '../hooks/useProjects.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { filterProjects, FILTER_KEYS } from '../utils/projects.js';
import { Breadcrumbs, EmptyState, LoadingState, SampleNotice } from '../components/Common.jsx';
import FilterBar from '../components/FilterBar.jsx';
import ProjectCard from '../components/ProjectCard.jsx';

const PAGE_SIZE = 12;
export function ProjectExplorer({ programme = '', group = '' }) {
  const { projects, samples } = useProjects();
  const [params, setParams] = useSearchParams();
  const collection = programme
    ? 'directory'
    : ['samples', 'all'].includes(params.get('collection'))
      ? params.get('collection')
      : 'directory';
  const source =
    collection === 'samples'
      ? samples
      : collection === 'all'
        ? [...projects, ...samples]
        : projects;
  const scope = source.filter(
    (p) => (!programme || p.programme === programme) && (!group || p.group === group),
  );
  const filters = Object.fromEntries(FILTER_KEYS.map((key) => [key, params.get(key) || '']));
  if (programme) filters.programme = programme;
  if (group) filters.group = group;
  const sort = ['title', 'recent', 'team'].includes(params.get('sort'))
    ? params.get('sort')
    : 'team';
  const view = params.get('view') === 'list' ? 'list' : 'grid';
  const filtered = filterProjects(scope, filters).sort((a, b) =>
    sort === 'title'
      ? a.title.localeCompare(b.title)
      : sort === 'recent'
        ? (b.updatedAt || '').localeCompare(a.updatedAt || '') || a.id.localeCompare(b.id)
        : `${a.programme}${a.group}${a.teamId}`.localeCompare(
            `${b.programme}${b.group}${b.teamId}`,
          ),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const requested = Number(params.get('page'));
  const page = Math.min(pages, Number.isInteger(requested) && requested > 0 ? requested : 1);
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const update = (key, value) => {
    // History updates before a transition renders. Use the latest URL so rapid
    // consecutive changes (including reset then filter) cannot restore old values.
    const next = new URLSearchParams(window.location.search);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== 'page') next.delete('page');
    if (key === 'programme') next.delete('group');
    if (key === 'collection')
      FILTER_KEYS.forEach((k) => {
        if (k !== 'q') next.delete(k);
      });
    setParams(next, { replace: key === 'q' });
  };
  const reset = () => {
    const next = new URLSearchParams();
    if (collection !== 'directory') next.set('collection', collection);
    setParams(next);
  };
  const goPage = (n) => {
    update('page', String(n));
    document.getElementById('results-heading')?.focus({ preventScroll: true });
    document.getElementById('results-heading')?.scrollIntoView({ block: 'start' });
  };
  return (
    <>
      {!programme && (
        <div className="collection-tabs" aria-label="Record collection">
          {[
            ['directory', 'Session directory', projects.length],
            ['samples', 'Examples', samples.length],
            ['all', 'All records', projects.length + samples.length],
          ].map(([key, label, count]) => (
            <button
              key={key}
              aria-pressed={collection === key}
              onClick={() => update('collection', key === 'directory' ? '' : key)}
            >
              {label}
              <span>{count}</span>
            </button>
          ))}
        </div>
      )}
      {collection !== 'directory' ? (
        <SampleNotice />
      ) : (
        <div className="data-notice compact">
          <span className="notice-dot" />
          <p>
            Records from the public demo.{' '}
            {projects.filter((p) => p.status === 'Awaiting details').length} slots await details.
            Academic allocations and links require faculty verification.
          </p>
        </div>
      )}
      <FilterBar
        projects={scope}
        filters={filters}
        onChange={update}
        onReset={reset}
        programmeLocked={Boolean(programme)}
        groupLocked={Boolean(group)}
      />
      <div className="results-toolbar">
        <div id="results-heading" tabIndex={-1} aria-live="polite" aria-atomic="true">
          <strong>{filtered.length}</strong> {filtered.length === 1 ? 'project' : 'projects'}
          <span className="muted">{filters.q ? ` matching “${filters.q}”` : ' to explore'}</span>
        </div>
        <div className="results-controls">
          <label className="sort-control">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => update('sort', e.target.value)}>
              <option value="team">Programme & team</option>
              <option value="title">Project title A–Z</option>
              <option value="recent">Recently updated</option>
            </select>
          </label>
          <div className="view-toggle">
            <button
              aria-label="Grid view"
              aria-pressed={view === 'grid'}
              onClick={() => update('view', '')}
            >
              <LayoutGrid size={17} />
            </button>
            <button
              aria-label="List view"
              aria-pressed={view === 'list'}
              onClick={() => update('view', 'list')}
            >
              <List size={18} />
            </button>
          </div>
        </div>
      </div>
      {visible.length ? (
        <div className={`project-grid ${view === 'list' ? 'project-list' : ''}`}>
          {visible.map((p) => (
            <ProjectCard key={p.id} project={p} showVisual={p.isSample && view === 'grid'} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={reset} />
      )}
      {filtered.length > PAGE_SIZE && (
        <nav className="pagination" aria-label="Project pages">
          <span>
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of{' '}
            {filtered.length}
          </span>
          <div>
            <button
              disabled={page === 1}
              onClick={() => goPage(page - 1)}
              aria-label="Previous page"
            >
              <ArrowLeft size={16} />
            </button>
            <span>
              Page <strong>{page}</strong> of {pages}
            </span>
            <button
              disabled={page === pages}
              onClick={() => goPage(page + 1)}
              aria-label="Next page"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}

export default function Projects() {
  usePageTitle('Explore projects');
  const { loading } = useProjects();
  return (
    <>
      <Breadcrumbs items={[{ label: 'Projects' }]} />
      <div className="page-heading">
        <p className="eyebrow">THE PROJECT DIRECTORY</p>
        <h1>
          A world of ideas.
          <br />
          <span>Find your next discovery.</span>
        </h1>
        <p>Explore projects, meet the teams, and see what’s taking shape across BCA and MCA.</p>
      </div>
      {loading ? <LoadingState /> : <ProjectExplorer />}
    </>
  );
}
