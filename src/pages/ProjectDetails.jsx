import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  GitFork as Github,
  ExternalLink,
  Copy,
  Check,
  ArrowLeft,
  Users,
  CalendarDays,
  UserRound,
  Link as Linkedin,
  Mail,
  FileCode2,
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import {
  Breadcrumbs,
  LoadingState,
  StatusBadge,
  TechBadges,
  SampleNotice,
  SectionHeading,
} from '../components/Common.jsx';
import ProjectVisual from '../components/ProjectVisual.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import NotFound from './NotFound.jsx';

function ProjectContent({ project: p, all }) {
  const [copyState, setCopyState] = useState('');
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(p.repositoryName);
      setCopyState('Copied');
    } catch {
      setCopyState('Copy unavailable. Select the repository name to copy it.');
    }
  };
  const related = all
    .filter(
      (x) =>
        x.id !== p.id &&
        x.isSample === p.isSample &&
        x.programme === p.programme &&
        (!p.group || x.group === p.group),
    )
    .slice(0, 3);
  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: p.isSample ? 'Examples' : 'Projects',
            to: p.isSample ? '/projects?collection=samples' : '/projects',
          },
          { label: p.projectId || p.title },
        ]}
      />
      {p.isSample && <SampleNotice />}
      {p.dataNote && (
        <div className="data-notice">
          <p>
            <strong>Allocation needs verification.</strong> {p.dataNote}
          </p>
        </div>
      )}
      <div className="detail-heading">
        <div className="detail-badges">
          <span className={`programme-badge ${p.programme === 'MCA' ? 'mca' : ''}`}>
            {p.programme || 'Programme unassigned'}
          </span>
          {p.group && (
            <Link to={`/programmes/${p.programme.toLowerCase()}/groups/${p.group.toLowerCase()}`}>
              Group {p.group}
            </Link>
          )}
          <StatusBadge status={p.status} />
        </div>
        <h1>{p.title}</h1>
        <p>{p.shortDescription}</p>
        <div className="detail-ids">
          <code>{p.projectId || 'Official project ID pending'}</code>
          <span>{p.teamId ? `Team ${p.teamId}` : 'Team allocation pending'}</span>
          <span>
            <CalendarDays size={14} aria-hidden="true" />
            {p.academicSession}
          </span>
        </div>
      </div>
      <div className="detail-layout">
        <div className="detail-main">
          <ProjectVisual key={p.id} project={p} large />
          <section className="detail-section">
            <p className="eyebrow">THE BIG PICTURE</p>
            <h2>About the project</h2>
            <p>{p.description || 'The team’s project description has not been added yet.'}</p>
          </section>
          <div className="problem-solution">
            <section>
              <span className="section-number">01 / THE CHALLENGE</span>
              <h2>Problem statement</h2>
              <p>
                {p.problemStatement ||
                  'The approved problem statement will be published after faculty review.'}
              </p>
            </section>
            <section>
              <span className="section-number">02 / THE APPROACH</span>
              <h2>Proposed solution</h2>
              <p>
                {p.solution ||
                  'The team’s solution and implementation approach are awaiting confirmation.'}
              </p>
            </section>
          </div>
          <section className="detail-section team-section">
            <div className="team-heading">
              <div>
                <p className="eyebrow">THE PEOPLE BEHIND THE PROJECT</p>
                <h2>Meet the team</h2>
              </div>
              <span>
                <Users size={16} aria-hidden="true" />
                {p.members.length} / 5
              </span>
            </div>
            {p.teamName && <p className="muted">{p.teamName}</p>}
            {p.members.length ? (
              <div className="team-grid">
                {p.members.map((member, i) => (
                  <article className="team-member" key={`${member.name}-${i}`}>
                    <div className="avatar" aria-hidden="true">
                      {member.name
                        .split(' ')
                        .map((s) => s[0])
                        .slice(0, 2)
                        .join('')}
                    </div>
                    <div>
                      <h3>{member.name}</h3>
                      <p>{member.role || 'Team member'}</p>
                      {member.enrollmentNumber && <span>{member.enrollmentNumber}</span>}
                      <div className="member-links">
                        {member.github && (
                          <a
                            aria-label={`${member.name} on GitHub (opens new tab)`}
                            href={member.github}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Github size={15} />
                          </a>
                        )}
                        {member.linkedin && (
                          <a
                            aria-label={`${member.name} on LinkedIn (opens new tab)`}
                            href={member.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <Linkedin size={15} />
                          </a>
                        )}
                        {member.email && (
                          <a aria-label={`Email ${member.name}`} href={`mailto:${member.email}`}>
                            <Mail size={15} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="pending-team">
                <Users size={25} aria-hidden="true" />
                <h3>Good work starts with a team.</h3>
                <p>
                  Member information will appear here once the project coordinator confirms the
                  team.
                </p>
              </div>
            )}
          </section>
        </div>
        <aside className="detail-sidebar" aria-label="Project information">
          <section className="info-card">
            <h2>Project at a glance</h2>
            <dl>
              {[
                ['Project ID', p.projectId || 'To be assigned'],
                ['Programme', p.programme || 'To be confirmed'],
                ['Class group', p.group ? `Group ${p.group}` : 'To be assigned'],
                ['Team ID', p.teamId || 'To be assigned'],
                ['Academic session', p.academicSession],
                ['Category', p.category || 'To be confirmed'],
              ].map(([key, value]) => (
                <div key={key}>
                  <dt>{key}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="info-card">
            <h2>Built with</h2>
            <TechBadges technologies={p.technologies} />
          </section>
          <section className="info-card">
            <h2>
              <FileCode2 size={18} aria-hidden="true" />{' '}
              {p.isSample ? 'Reference links' : 'Project links'}
            </h2>
            {p.linkNote && <p className="link-note">{p.linkNote}</p>}
            {p.repositoryUrl && (
              <a
                className="button button-secondary full-width"
                target="_blank"
                rel="noopener noreferrer"
                href={p.repositoryUrl}
              >
                <Github size={17} aria-hidden="true" />
                {p.isSample ? 'Reference GitHub' : 'GitHub repository'}
                <ExternalLink size={14} aria-hidden="true" />
                <span className="sr-only"> (opens new tab)</span>
              </a>
            )}
            {p.liveUrl && (
              <a
                className="button button-primary full-width"
                target="_blank"
                rel="noopener noreferrer"
                href={p.liveUrl}
              >
                {p.isSample ? 'Reference website' : 'Live demo'}
                <ExternalLink size={15} aria-hidden="true" />
                <span className="sr-only"> (opens new tab)</span>
              </a>
            )}
            {!p.repositoryUrl && !p.liveUrl && (
              <p className="muted small">
                Verified repository and live demo links have not been added yet.
              </p>
            )}
            {p.repositoryName && (
              <div className="repo-name">
                <span>
                  {p.isSample ? 'Reference repository name' : 'Repository naming convention'}
                </span>
                <code>{p.repositoryName}</code>
                <button onClick={copy}>
                  {copyState === 'Copied' ? <Check size={13} /> : <Copy size={13} />}Copy name
                </button>
                <span role="status" className="copy-status">
                  {copyState}
                </span>
              </div>
            )}
          </section>
          <section className="info-card mentor-card">
            <UserRound size={21} aria-hidden="true" />
            <div>
              <h2>Faculty mentor</h2>
              <p>{p.mentor || 'To be confirmed'}</p>
            </div>
          </section>
          <p className="record-note">
            {p.isSample
              ? 'Illustrative example · not an official submission'
              : 'Public demo record · pending faculty verification'}
            {p.updatedAt && (
              <>
                <br />
                Updated{' '}
                {new Intl.DateTimeFormat('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                }).format(new Date(`${p.updatedAt}T00:00:00`))}
              </>
            )}
          </p>
        </aside>
      </div>
      {related.length > 0 && (
        <section className="section">
          <SectionHeading
            eyebrow="KEEP EXPLORING"
            title={
              p.isSample ? 'More ideas to explore' : `More from ${p.programme} Group ${p.group}`
            }
          />
          <div className="project-grid">
            {related.map((r) => (
              <ProjectCard key={r.id} project={r} showVisual={r.isSample} />
            ))}
          </div>
        </section>
      )}
      <Link
        className="text-link back-link"
        to={p.isSample ? '/projects?collection=samples' : '/projects'}
      >
        <ArrowLeft size={16} aria-hidden="true" />
        Back to {p.isSample ? 'examples' : 'all projects'}
      </Link>
    </>
  );
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const { projects, samples, loading } = useProjects();
  const all = [...projects, ...samples];
  const project = all.find((p) => p.slug === slug);
  usePageTitle(project?.title || (loading ? 'Project details' : 'Page not found'));
  if (loading) return <LoadingState />;
  if (!project) return <NotFound />;
  return <ProjectContent key={project.id} project={project} all={all} />;
}
