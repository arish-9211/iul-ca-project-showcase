import { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  Leaf,
  Layers,
  CalendarDays,
  MapPin,
  BarChart3,
  Users,
  Code2,
} from 'lucide-react';

const icons = {
  'AI & Machine Learning': Sparkles,
  Education: BookOpen,
  Sustainability: Leaf,
  Productivity: Layers,
  'Campus Life': CalendarDays,
  Accessibility: MapPin,
  'Data Science': BarChart3,
};
const colors = {
  'AI & Machine Learning': 'violet',
  Education: 'blue',
  Sustainability: 'sage',
  Productivity: 'peach',
  'Campus Life': 'violet',
  Accessibility: 'sage',
  'Data Science': 'blue',
};

export default function ProjectVisual({ project, large = false }) {
  const [failed, setFailed] = useState(false);
  const Icon = icons[project.category] || (project.isSample ? Users : Code2);
  if (project.projectThumbnail && !failed)
    return (
      <div className={`project-visual image-visual ${large ? 'large' : ''}`}>
        <img
          src={project.projectThumbnail}
          alt={`${project.title} preview`}
          loading="lazy"
          onError={() => setFailed(true)}
        />
      </div>
    );
  return (
    <div
      className={`project-visual visual-${colors[project.category] || 'neutral'} ${large ? 'large' : ''}`}
      aria-hidden="true"
    >
      <div className="visual-grid" />
      <span className="visual-orbit orbit-one" />
      <span className="visual-orbit orbit-two" />
      <div className="visual-symbol">
        <Icon size={large ? 50 : 33} strokeWidth={1.3} />
      </div>
      <span className="visual-label">
        {project.category || `${project.programme} · ${project.projectId}`}
      </span>
      <span className="visual-corner">
        {project.isSample ? 'CONCEPT / 2027' : 'PROJECT / 2027'}
      </span>
    </div>
  );
}
