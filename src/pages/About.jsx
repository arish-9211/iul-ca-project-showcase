import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUpRight, BookOpen, Check, GitBranch } from 'lucide-react';
import { usePageTitle } from '../hooks/usePageTitle.js';
import { Breadcrumbs, ButtonLink } from '../components/Common.jsx';
import site from '../data/site.json';

export default function About() {
  usePageTitle('About & guidelines');
  const { hash } = useLocation();
  useEffect(() => {
    if (hash) requestAnimationFrame(() => document.getElementById(hash.slice(1))?.scrollIntoView());
  }, [hash]);
  return (
    <>
      <Breadcrumbs items={[{ label: 'About & guidelines' }]} />
      <div className="page-heading about-heading">
        <p className="eyebrow">A SHARED SPACE FOR STUDENT WORK</p>
        <h1>
          Built by students.
          <br />
          <span>Discovered by everyone.</span>
        </h1>
        <p>
          The BCA & MCA Project Showcase brings the work of the Department of Computer Application
          into one accessible directory.
        </p>
      </div>
      <div className="about-grid">
        <section className="about-panel">
          <BookOpen size={24} aria-hidden="true" />
          <h2>One department. Every project.</h2>
          <p>
            Faculty, evaluators, students, and visitors can explore projects by programme, class
            group, and team. Project records bring together the idea, the people, the technology,
            and links to the work.
          </p>
          <p>
            This portal is a directory. Individual applications, including CareerUp AI, remain
            independent student projects.
          </p>
          <span className="session-pill">Academic session {site.academicSession}</span>
        </section>
        <section className="about-panel">
          <GitBranch size={24} aria-hidden="true" />
          <h2>Clear records. Simple maintenance.</h2>
          <p>
            The coordinator maintains a structured project record for each team. New submissions can
            be added as a JSON record or imported from the supplied CSV template.
          </p>
          <p>
            Updates are reviewed, validated, and published with the next website build. No account
            or backend service is needed.
          </p>
          <a className="text-link" href="#contribute">
            How to contribute <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </section>
      </div>
      <section className="guideline-section" id="naming">
        <div>
          <p className="eyebrow">CONSISTENCY MATTERS</p>
          <h2>A name that tells the whole story.</h2>
          <p>
            Repository names combine the programme, repository year, project ID, and team ID. The
            academic session and repository year are kept as separate fields.
          </p>
        </div>
        <div className="naming-example">
          <code>
            <span>BCA2027</span>
            <b>-</b>
            <span>PUGID26001</span>
            <b>-</b>
            <span>A01</span>
          </code>
          <div>
            <span>PROGRAMME + YEAR</span>
            <span>PROJECT ID</span>
            <span>TEAM ID</span>
          </div>
          <p>Example format only. Use the IDs approved by your project coordinator.</p>
        </div>
      </section>
      <section className="guideline-section contribute-section" id="contribute">
        <div>
          <p className="eyebrow">SUBMISSION GUIDELINES</p>
          <h2>Bring your team’s work to the showcase.</h2>
          <p>
            Share your details with the project in-charge. This site does not collect submissions or
            personal information through an online form.
          </p>
        </div>
        <ol className="guideline-steps">
          <li>
            <span>01</span>
            <div>
              <h3>Confirm your academic allocation</h3>
              <p>
                Get your programme, class group, project ID, and team ID from your teacher. Team IDs
                use a group letter and two digits, such as A01. The same team ID can appear in
                different programmes or sessions.
              </p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <h3>Prepare a clear project record</h3>
              <p>
                Include the title, description, problem statement, solution, technologies, category,
                and current status. Add up to five members and the confirmed faculty mentor. Publish
                only contact details that members have agreed to share.
              </p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <h3>Share working links and a preview</h3>
              <p>
                Add your GitHub repository and live demo URL when available. A missing link is fine.
                An original project thumbnail is optional; the showcase provides a visual fallback.
              </p>
            </div>
          </li>
          <li>
            <span>04</span>
            <div>
              <h3>Review, validate, and publish</h3>
              <p>
                The coordinator updates the project data, runs validation, checks the website, and
                publishes the new build. Detailed instructions and a CSV template are included in
                the project README.
              </p>
            </div>
          </li>
        </ol>
      </section>
      <section className="about-data-note">
        <div>
          <Check size={22} aria-hidden="true" />
          <h2>Understand the current dataset</h2>
        </div>
        <p>
          The initial directory preserves 225 public demo allocations: 180 BCA records across groups
          A–L and 45 MCA records across groups A–C. Two records have titles; most details and all
          student identities remain unconfirmed. These are public demo allocations, not a claim of
          verified submissions.
        </p>
        <p>
          The source assigns PUGID26044 to both BCA C14 and H12. Both records retain that source ID
          with an unverified label; their official IDs require confirmation. The G08 healthcare
          record links to a different project and team, so those links are withheld. Example records
          are clearly labeled and excluded from session statistics. CareerUp AI has no assigned
          programme, group, project ID, team, or mentor in the example collection.
        </p>
        <p>
          Source:{' '}
          <a href={site.dataSourceUrl} target="_blank" rel="noopener noreferrer">
            public reference dataset <ArrowUpRight size={13} aria-hidden="true" />
            <span className="sr-only"> (opens new tab)</span>
          </a>{' '}
          · Retrieved {site.retrievedAt}. Verify the source allocations before official use.
        </p>
      </section>
      <div className="about-bottom">
        <h2>Ready to see what’s taking shape?</h2>
        <ButtonLink to="/projects">Explore the directory</ButtonLink>
      </div>
    </>
  );
}
