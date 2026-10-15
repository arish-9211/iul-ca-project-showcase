import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProjectProvider } from './hooks/useProjects.jsx';
import ErrorBoundary from './components/ErrorBoundary.jsx';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Projects from './pages/Projects.jsx';
import Programme from './pages/Programme.jsx';
import ProjectDetails from './pages/ProjectDetails.jsx';
import About from './pages/About.jsx';
import NotFound from './pages/NotFound.jsx';

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ProjectProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="projects" element={<Projects />} />
              <Route path="projects/:slug" element={<ProjectDetails />} />
              <Route path="programmes/:programme" element={<Programme />} />
              <Route path="programmes/:programme/groups/:group" element={<Programme />} />
              <Route path="about" element={<About />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </ProjectProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
