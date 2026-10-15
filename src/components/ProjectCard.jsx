import { Link } from 'react-router-dom';
import { ArrowUpRight, GitFork as Github, ExternalLink, Users } from 'lucide-react';
import ProjectVisual from './ProjectVisual.jsx';
import { StatusBadge, TechBadges } from './Common.jsx';

export default function ProjectCard({ project: p, showVisual = true }) {
  const href = `/projects/${p.slug}`;
  return (
    <article className={`project-card ${showVisual ? '' : 'slot-card'}`}>
      {showVisual && (
        <Link className="visual-link" to={href} tabIndex={-1} aria-hidden="true">
          <ProjectVisual project={p} />
        </Link>
      )}
      <div className="project-card-body">
        <div className="card-meta">
          <span className={`programme-badge ${p.programme === 'MCA' ? 'mca' : ''}`}>
            {p.programme || 'Unassigned'}
          </span>
          <span>{p.group ? `Group ${p.group}` : 'Allocation pending'}</span>
          {p.isSample && <span className="sample-label">Example</span>}
        </div>
        <h3>
          <Link to={href}>
            {p.title}
            <ArrowUpRight size={18} aria-hidden="true" />
          </Link>
        </h3>
        <p className="project-description">{p.shortDescription}</p>
        <TechBadges technologies={p.technologies} limit={3} />
        <div className="card-identity">
          <code>
            {p.projectId ||
              (p.sourceProjectId ? `${p.sourceProjectId} · unverified` : 'Project ID pending')}
          </code>
          <span>{p.teamId ? `Team ${p.teamId}` : 'Team pending'}</span>
        </div>
        <div className="card-status">
          <StatusBadge status={p.status} />
          <span className="member-count">
            <Users size={14} aria-hidden="true" />
            {p.members.length || '—'}
            <span className="sr-only"> members</span>
          </span>
        </div>
        <div className="card-actions">
          <Link to={href}>
            View project <ArrowRightSmall />
          </Link>
          <div>
            {p.repositoryUrl && (
              <a
                href={p.repositoryUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.isSample ? 'Reference GitHub for' : 'GitHub repository for'} ${p.title} (opens new tab)`}
                title={p.isSample ? 'Public reference repository' : 'GitHub repository'}
              >
                <Github size={17} />
              </a>
            )}
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${p.isSample ? 'Reference demo for' : 'Live demo for'} ${p.title} (opens new tab)`}
                title={p.isSample ? 'Public reference website' : 'Live demo'}
              >
                <ExternalLink size={17} />
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
function ArrowRightSmall() {
  return <ArrowUpRight size={15} aria-hidden="true" />;
}
