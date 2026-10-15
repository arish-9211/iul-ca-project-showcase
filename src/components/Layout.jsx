import { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  FolderCode,
  GraduationCap,
  BookOpen,
  ArrowUpRight,
  Menu,
  X,
  Search,
  MapPin,
  ArrowUp,
  Code2,
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects.jsx';
import site from '../data/site.json';

function Navigation({ close }) {
  const { projects } = useProjects();
  return (
    <>
      <Link className="wordmark" to="/" onClick={close}>
        <span>INTEGRAL</span>
        <span>
          UNIVERSITY<span className="wordmark-dot">.</span>
        </span>
        <small>Department of Computer Application</small>
      </Link>
      <p className="nav-label">THE SHOWCASE</p>
      <nav aria-label="Main navigation" className="nav-links">
        <NavLink to="/" end onClick={close}>
          <Home size={18} aria-hidden="true" />
          Overview
        </NavLink>
        <NavLink to="/projects" onClick={close}>
          <FolderCode size={18} aria-hidden="true" />
          All projects<span className="nav-count">{projects.length}</span>
        </NavLink>
        <p className="nav-label">PROGRAMMES</p>
        <NavLink to="/programmes/bca" onClick={close}>
          <GraduationCap size={19} aria-hidden="true" />
          BCA<span className="nav-sub">Undergraduate</span>
        </NavLink>
        <NavLink to="/programmes/mca" onClick={close}>
          <GraduationCap size={19} aria-hidden="true" />
          MCA<span className="nav-sub">Postgraduate</span>
        </NavLink>
        <p className="nav-label">RESOURCES</p>
        <NavLink to="/about" onClick={close}>
          <BookOpen size={18} aria-hidden="true" />
          About & guidelines
        </NavLink>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-note">
          <Code2 size={22} aria-hidden="true" />
          <p>Ideas into impact.</p>
          <span>A space for the next generation of builders.</span>
          <Link to="/about#contribute" onClick={close}>
            Add your project <ArrowUpRight size={15} aria-hidden="true" />
          </Link>
        </div>
        <span className="sidebar-location">
          <MapPin size={13} aria-hidden="true" /> Lucknow, Uttar Pradesh
        </span>
      </div>
    </>
  );
}

export default function Layout() {
  const dialog = useRef(null);
  const main = useRef(null);
  const previousPath = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { notices } = useProjects();
  const close = () => dialog.current?.close();
  useEffect(() => {
    if (previousPath.current === pathname) return;
    close();
    window.scrollTo(0, 0);
    if (previousPath.current !== null) main.current?.focus({ preventScroll: true });
    previousPath.current = pathname;
  }, [pathname]);
  useEffect(() => {
    const shortcut = (e) => {
      if (
        e.key === '/' &&
        !['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) &&
        !document.activeElement?.isContentEditable &&
        !dialog.current?.open
      ) {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    document.addEventListener('keydown', shortcut);
    return () => document.removeEventListener('keydown', shortcut);
  }, []);
  const search = (event) => {
    event.preventDefault();
    const query = new FormData(event.currentTarget).get('q').trim();
    navigate(
      `/projects?${new URLSearchParams({ collection: 'all', ...(query ? { q: query } : {}) })}`,
    );
    event.currentTarget.reset();
  };
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <aside className="sidebar">
        <Navigation />
      </aside>
      <dialog
        ref={dialog}
        className="mobile-menu"
        aria-label="Site navigation"
        onClick={(event) => {
          if (event.target === event.currentTarget) close();
        }}
      >
        <button className="icon-button mobile-close" onClick={close} aria-label="Close menu">
          <X size={22} />
        </button>
        <Navigation close={close} />
      </dialog>
      <div className="workspace">
        <header className="topbar">
          <div className="topbar-identity">
            <button
              className="icon-button menu-toggle"
              onClick={() => dialog.current.showModal()}
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>
            <span className="desktop-title">Student project showcase</span>
            <span className="mobile-title">Integral University</span>
          </div>
          <div className="topbar-right">
            <form className="global-search" role="search" onSubmit={search}>
              <Search size={15} aria-hidden="true" />
              <label htmlFor="global-search" className="sr-only">
                Search the entire showcase
              </label>
              <input id="global-search" name="q" placeholder="Find a project…" autoComplete="off" />
              <kbd>/</kbd>
            </form>
            <span className="session-indicator">
              <span aria-hidden="true" />
              {site.academicSession}
            </span>
          </div>
        </header>
        <main ref={main} id="main-content" tabIndex={-1} className="main-content">
          {notices.map((n) => (
            <div role="alert" className="data-notice" key={n}>
              {n}
            </div>
          ))}
          <Outlet />
        </main>
        <footer className="footer">
          <div>
            <strong>INTEGRAL UNIVERSITY</strong>
            <p>{site.department}</p>
            <span>BCA & MCA Project Showcase · {site.academicSession}</span>
          </div>
          <div>
            <Link to="/about">
              About the showcase <ArrowUpRight size={14} aria-hidden="true" />
            </Link>
            <span>{site.location}</span>
            <button
              onClick={() => {
                window.scrollTo({
                  top: 0,
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches
                    ? 'instant'
                    : 'smooth',
                });
                main.current?.focus({ preventScroll: true });
              }}
            >
              Back to top <ArrowUp size={13} aria-hidden="true" />
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
