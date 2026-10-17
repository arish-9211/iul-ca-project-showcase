import { Search, RotateCcw, SlidersHorizontal, X } from 'lucide-react';
import { uniqueValues } from '../utils/projects.js';

export default function FilterBar({
  projects,
  filters,
  onChange,
  onReset,
  programmeLocked = false,
  groupLocked = false,
}) {
  const scoped = filters.programme
    ? projects.filter((p) => p.programme === filters.programme)
    : projects;
  const specs = [
    ...(!programmeLocked ? [['programme', 'Programme', ['BCA', 'MCA'], 'All programmes']] : []),
    ...(!groupLocked
      ? [['group', 'Class group', uniqueValues(scoped, 'group'), 'All groups']]
      : []),
    ['technology', 'Technology', uniqueValues(projects, 'technologies'), 'All technologies'],
    ['category', 'Category', uniqueValues(projects, 'category'), 'All categories'],
    ['status', 'Status', uniqueValues(projects, 'status'), 'All statuses'],
    ['session', 'Academic session', uniqueValues(projects, 'academicSession'), 'All sessions'],
  ];
  return (
    <div className="filter-panel">
      <div className="directory-search">
        <Search size={20} aria-hidden="true" />
        <label className="sr-only" htmlFor="directory-query">
          Search projects
        </label>
        <input
          id="directory-query"
          type="search"
          placeholder="Search by project, ID, team, student, or technology…"
          value={filters.q || ''}
          onChange={(e) => onChange('q', e.target.value)}
        />
        {filters.q && (
          <button
            className="icon-button"
            aria-label="Clear search"
            onClick={() => onChange('q', '')}
          >
            <X size={17} />
          </button>
        )}
        <span className="search-live">Search as you type</span>
      </div>
      <div className="filter-bar">
        <div className="filter-label">
          <SlidersHorizontal size={16} aria-hidden="true" />
          <span>Filter by</span>
        </div>
        <div className="filter-fields">
          {specs.map(([key, label, options, placeholder]) => (
            <label key={key}>
              <span>{label}</span>
              <select value={filters[key] || ''} onChange={(e) => onChange(key, e.target.value)}>
                <option value="">{placeholder}</option>
                {filters[key] && !options.includes(filters[key]) && (
                  <option value={filters[key]}>{filters[key]}</option>
                )}
                {options.map((value) => (
                  <option key={value} value={value}>
                    {key === 'group' ? `Group ${value}` : value}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <button className="reset-button" onClick={onReset}>
          <RotateCcw size={14} aria-hidden="true" />
          Reset filters
        </button>
      </div>
    </div>
  );
}
