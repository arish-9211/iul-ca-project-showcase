import { useNavigate, Link } from 'react-router-dom';
import { ArrowUpRight, ArrowRight, Search, Code2, Braces, Sparkles } from 'lucide-react';
import { useProjects } from '../hooks/useProjects.jsx';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { calculateStats, groupProjects } from '../utils/projects.js';
import { ButtonLink, SectionHeading, SampleNotice } from '../components/Common.jsx';
import StatsGrid from '../components/StatsGrid.jsx';
import ProjectCard from '../components/ProjectCard.jsx';
import site from '../data/site.json';

function HeroArt() {
  return (
    <div className="hero-art" aria-hidden="true">
      <div className="art-orbit art-orbit-1" />
      <div className="art-orbit art-orbit-2" />
      <span className="art-dot dot-one" />
      <span className="art-dot dot-two" />
      <div className="art-caption caption-top">CURIOSITY MEETS CODE</div>
      <div className="code-layer layer-back" />
      <div className="code-layer layer-mid" />
      <div className="code-layer layer-front">
        <div className="window-dots">
          <i />
          <i />
          <i />
          <span>the next big idea</span>
        </div>
        <Braces size={68} strokeWidth={1.1} />
        <div className="code-lines">
          <i />
          <i />
          <i />
        </div>
        <span className="code-file">built_by_students</span>
      </div>
      <div className="art-tag">
        <span />
        <span>Ideas. In progress.</span>
        <Sparkles size={14} />
      </div>
      <div className="art-caption caption-bottom">
        IDEATE <span>→</span> BUILD <span>→</span> INSPIRE
      </div>
    </div>
  );
}

export default function Home() {
  usePageTitle('BCA & MCA Project Showcase');
  const { projects, samples, loading } = useProjects();
  const navigate = useNavigate();
  const current = projects.filter((p) => p.academicSession === site.academicSession);
  const stats = calculateStats(current);
  const groups = groupProjects(current);
  const featured = current.filter((p) => p.featured).slice(0, 3);
  const search = (event) => {
    event.preventDefault();
    const q = new FormData(event.currentTarget).get('query').trim();
    navigate(`/projects?${new URLSearchParams({ collection: 'all', ...(q ? { q } : {}) })}`);
  };
  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-dash" /> BCA & MCA · CLASS OF {site.repositoryYear}
          </p>
          <h1>
            Big ideas.
            <br />
            Built at <em>Integral.</em>
          </h1>
          <p className="hero-description">
            A showcase of curiosity, collaboration, and code.
            <br className="desktop-break" /> Discover what our next generation of builders is
            creating.
          </p>
          <div className="hero-actions">
            <ButtonLink to="/projects">Explore projects</ButtonLink>
            <ButtonLink to="/about" secondary>
              About the showcase
            </ButtonLink>
          </div>
          <span className="hero-credit">{site.department}</span>
        </div>
        <HeroArt />
      </section>
      <form className="hero-search" role="search" onSubmit={search}>
        <Search size={21} aria-hidden="true" />
        <label htmlFor="hero-query" className="sr-only">
          Search projects, teams, students or technologies
        </label>
        <input
          id="hero-query"
          name="query"
          placeholder="Find a project, team, student, or technology…"
        />
        <button type="submit">
          Search projects <ArrowRight size={17} aria-hidden="true" />
        </button>
      </form>
      <div className="stats-section">
        <div className="section-kicker">
          <span>THE SESSION AT A GLANCE</span>
          <span>{site.academicSession}</span>
        </div>
        <StatsGrid stats={stats} loading={loading} />
        <p className="stats-footnote">
          <span className="notice-dot" />
          Public demo records. Allocations and submissions await faculty verification; examples are
          excluded.
        </p>
      </div>
      <section className="section">
        <SectionHeading
          eyebrow="FIND YOUR PROGRAMME"
          title="Two paths. Endless possibilities."
          text="Start with a programme, then meet the teams in each class group."
        />
        <div className="programme-grid">
          {site.programmes.map((programme) => {
            const records = current.filter((p) => p.programme === programme.id);
            const count = groups.filter((g) => g.programme === programme.id).length;
            return (
              <Link
                className={`programme-card programme-${programme.id.toLowerCase()}`}
                key={programme.id}
                to={`/programmes/${programme.id.toLowerCase()}`}
              >
                <div className="programme-top">
                  <span className="programme-icon">
                    <Code2 size={23} strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <span className="programme-level">
                    {programme.id === 'BCA' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
                  </span>
                  <ArrowUpRight size={23} aria-hidden="true" />
                </div>
                <h3>{programme.id}</h3>
                <p className="programme-name">{programme.name}</p>
                <p className="programme-description">{programme.description}</p>
                <div className="programme-bottom">
                  <span>
                    <strong>{loading ? '—' : records.length}</strong> project records
                  </span>
                  <span>
                    <strong>{loading ? '—' : count}</strong> class groups
                  </span>
                  <span className="programme-cta">
                    Explore {programme.id}
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      {featured.length > 0 && (
        <section className="section">
          <SectionHeading
            eyebrow="FROM THE SESSION DIRECTORY"
            title="Ideas taking shape"
            text="Project titles recorded in the public demo. Further details are being confirmed."
            to="/projects?sort=title"
            linkText="Browse the directory"
          />
          <div className="project-grid featured-directory">
            {featured.map((p) => (
              <ProjectCard project={p} key={p.id} showVisual={false} />
            ))}
          </div>
        </section>
      )}
      {samples.length > 0 && (
        <section className="section">
          <SectionHeading
            eyebrow="EXPLORE THE POSSIBILITIES"
            title="A little inspiration goes a long way."
            text="Example records show how complete projects will look in the showcase."
            to="/projects?collection=samples"
            linkText="View examples"
          />
          <SampleNotice compact />
          <div className="project-grid">
            {samples
              .filter((p) => p.featured)
              .map((p) => (
                <ProjectCard project={p} key={p.id} />
              ))}
          </div>
        </section>
      )}
      <section className="contribute-banner">
        <div className="contribute-icon">
          <Braces size={32} strokeWidth={1.2} aria-hidden="true" />
        </div>
        <div>
          <p className="eyebrow">YOUR WORK BELONGS HERE</p>
          <h2>Build something. Share what’s next.</h2>
          <p>Work with your project coordinator to bring your team’s story to the showcase.</p>
        </div>
        <ButtonLink to="/about#contribute" secondary>
          Submission guidelines
        </ButtonLink>
      </section>
    </>
  );
}
