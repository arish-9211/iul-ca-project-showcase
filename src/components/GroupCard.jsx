import { Link } from 'react-router-dom';
import { ArrowUpRight, Users } from 'lucide-react';
import { calculateStats, uniqueValues } from '../utils/projects.js';

export default function GroupCard({ group: g }) {
  const stats = calculateStats(g.projects);
  const technologies = uniqueValues(g.projects, 'technologies');
  const teamIds = uniqueValues(g.projects, 'teamId');
  return (
    <Link
      className="group-card"
      to={`/programmes/${g.programme.toLowerCase()}/groups/${g.group.toLowerCase()}`}
    >
      <div className="group-card-top">
        <span className="group-letter">{g.group}</span>
        <ArrowUpRight size={20} aria-hidden="true" />
      </div>
      <p className="eyebrow">{g.programme}</p>
      <h3>Group {g.group}</h3>
      <p className="muted small">
        {teamIds.length ? `Teams ${teamIds[0]}–${teamIds.at(-1)}` : 'Teams awaiting allocation'}
      </p>
      <div className="group-counts">
        <span>{stats.total} project records</span>
        <span>
          <Users size={14} aria-hidden="true" />
          {stats.teams} teams
        </span>
      </div>
      {technologies.length > 0 && (
        <p className="small muted">
          {technologies.slice(0, 3).join(' · ')}
          {technologies.length > 3 ? ` +${technologies.length - 3}` : ''}
        </p>
      )}
      <span className="group-cta">
        View projects <ArrowUpRight size={15} aria-hidden="true" />
      </span>
    </Link>
  );
}
