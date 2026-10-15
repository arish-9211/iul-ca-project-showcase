import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronRight, SearchX, LoaderCircle } from 'lucide-react';

export function ButtonLink({ to, children, secondary = false, className = '', ...props }) {
  return (
    <Link
      to={to}
      className={`button ${secondary ? 'button-secondary' : 'button-primary'} ${className}`}
      {...props}
    >
      {children}
      <ArrowUpRight size={17} aria-hidden="true" />
    </Link>
  );
}

export function SectionHeading({ eyebrow, title, text, to, linkText = 'View all' }) {
  return (
    <div className="section-heading">
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h2>{title}</h2>
        {text && <p className="muted">{text}</p>}
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {linkText}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      )}
    </div>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb" className="breadcrumbs">
      <Link to="/">Home</Link>
      {items.map((item, i) => (
        <span key={i}>
          <ChevronRight size={13} aria-hidden="true" />
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span aria-current="page">{item.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function EmptyState({
  title = 'No projects found',
  description = 'Try a different keyword or adjust your filters to discover more projects.',
  onReset,
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <SearchX size={30} aria-hidden="true" />
      </div>
      <h2>{title}</h2>
      <p>{description}</p>
      {onReset && (
        <button className="button button-secondary" onClick={onReset}>
          Reset filters
        </button>
      )}
    </div>
  );
}

export function LoadingState() {
  return (
    <div className="loading-state" role="status">
      <LoaderCircle className="spinner" size={28} aria-hidden="true" />
      <p>Opening the showcase…</p>
    </div>
  );
}

export function StatusBadge({ status }) {
  const variant =
    {
      Deployed: 'green',
      Completed: 'green',
      'In Development': 'purple',
      'Under Review': 'amber',
      Proposed: 'blue',
    }[status] || 'neutral';
  return (
    <span className={`status status-${variant}`}>
      <span className="status-dot" aria-hidden="true" />
      {status}
    </span>
  );
}

export function TechBadges({ technologies, limit = Infinity }) {
  if (!technologies.length)
    return <span className="muted small">Technology stack to be confirmed</span>;
  return (
    <div className="tech-badges">
      {technologies.slice(0, limit).map((t) => (
        <span key={t}>{t}</span>
      ))}
      {technologies.length > limit && (
        <span title={technologies.slice(limit).join(', ')}>
          +{technologies.length - limit} more
        </span>
      )}
    </div>
  );
}

export function SampleNotice({ compact = false }) {
  return (
    <div className={`data-notice ${compact ? 'compact' : ''}`}>
      <span className="notice-dot" aria-hidden="true" />
      <p>
        <strong>Illustrative examples.</strong>{' '}
        {compact
          ? 'Not official project submissions.'
          : 'Titles, team allocations, people and project scopes here are samples. They are excluded from session statistics. CareerUp AI is awaiting academic allocation.'}
      </p>
    </div>
  );
}
