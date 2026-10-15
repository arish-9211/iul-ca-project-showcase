import { Link, useParams } from 'react-router-dom';
import { ArrowUpRight, FolderCode, Users, Grid2X2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { calculateStats, groupProjects } from '../utils/projects.js';
import { Breadcrumbs, LoadingState, SectionHeading, EmptyState } from '../components/Common.jsx';
import GroupCard from '../components/GroupCard.jsx';
import { ProjectExplorer } from './Projects.jsx';
import NotFound from './NotFound.jsx';
import site from '../data/site.json';

export default function Programme() {
  const { programme: param, group: groupParam } = useParams();
  const programme = param?.toUpperCase();
  const group = groupParam?.toUpperCase();
  const info = site.programmes.find((p) => p.id === programme);
  const { projects, loading } = useProjects();
  const current = projects.filter(
    (p) => p.programme === programme && p.academicSession === site.academicSession,
  );
  const groups = groupProjects(current);
  const validGroup = !group || groups.some((g) => g.group === group);
  const stats = calculateStats(group ? current.filter((p) => p.group === group) : current);
  usePageTitle(
    !info || (!loading && !validGroup)
      ? 'Page not found'
      : group
        ? `${programme} · Group ${group}`
        : `${programme} projects`,
  );
  if (!info || (!loading && !validGroup)) return <NotFound />;
  return (
    <>
      <Breadcrumbs
        items={
          group
            ? [{ label: programme, to: `/programmes/${param}` }, { label: `Group ${group}` }]
            : [{ label: `${programme} projects` }]
        }
      />
      <section className={`programme-hero programme-${param}`}>
        <div>
          <p className="eyebrow">
            {group
              ? 'MEET THE TEAMS'
              : programme === 'BCA'
                ? 'UNDERGRADUATE SHOWCASE'
                : 'POSTGRADUATE SHOWCASE'}{' '}
            · {site.academicSession}
          </p>
          <h1>
            {programme}
            {group ? <span> / Group {group}</span> : <span> Projects</span>}
          </h1>
          <h2>{info.name}</h2>
          <p>
            {group
              ? `Discover every project record allocated to ${programme} Group ${group}. Search by team, project ID, or student to find a record.`
              : info.description}
          </p>
        </div>
        <svg className="programme-watermark" viewBox="0 0 350 175" aria-hidden="true">
          <text x="345" y="145" textAnchor="end" fill="currentColor">
            {group || programme}
          </text>
        </svg>
      </section>
      {loading ? (
        <LoadingState />
      ) : (
        <>
          <div className="mini-stats">
            <span>
              <FolderCode size={18} aria-hidden="true" />
              <strong>{stats.total}</strong> project records
            </span>
            <span>
              <Users size={18} aria-hidden="true" />
              <strong>{stats.teams}</strong> team slots
            </span>
            <span>
              <Grid2X2 size={18} aria-hidden="true" />
              <strong>{stats.groups}</strong> {stats.groups === 1 ? 'class group' : 'class groups'}
            </span>
          </div>
          {!group ? (
            <section className="section programme-groups">
              <SectionHeading
                eyebrow="START EXPLORING"
                title="Choose a class group"
                text="Every team has a place. Select a group to explore its project records."
                to={`/projects?programme=${programme}`}
                linkText={`View all ${programme} projects`}
              />
              {groups.length ? (
                <div className="groups-grid">
                  {groups.map((g) => (
                    <GroupCard key={g.group} group={g} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Groups are being prepared"
                  description="Group records will appear here once the coordinator adds them."
                />
              )}
            </section>
          ) : (
            <>
              <div className="group-switcher">
                <span>Jump to group</span>
                {groups.map((g) => (
                  <Link
                    aria-current={g.group === group ? 'page' : undefined}
                    key={g.group}
                    to={`/programmes/${param}/groups/${g.group.toLowerCase()}`}
                  >
                    {g.group}
                  </Link>
                ))}
              </div>
              <ProjectExplorer programme={programme} group={group} />
            </>
          )}
          <div className="programme-note">
            <p>Looking for an example of a completed record?</p>
            <Link className="text-link" to="/projects?collection=samples">
              Explore the sample collection <ArrowUpRight size={16} aria-hidden="true" />
            </Link>
          </div>
        </>
      )}
    </>
  );
}
