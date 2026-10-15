import { usePageTitle } from '../hooks/usePageTitle.js';
import { ButtonLink } from '../components/Common.jsx';

export default function NotFound() {
  usePageTitle('Page not found');
  return (
    <section className="not-found">
      <span className="error-number" aria-hidden="true">
        404<span>.</span>
      </span>
      <p className="eyebrow">A SMALL DETOUR</p>
      <h1>This page hasn’t been built.</h1>
      <p>
        The project or page you’re looking for may have moved.
        <br />
        There are plenty of ideas waiting back in the showcase.
      </p>
      <div>
        <ButtonLink to="/projects">Explore projects</ButtonLink>
        <ButtonLink to="/" secondary>
          Back to overview
        </ButtonLink>
      </div>
    </section>
  );
}
