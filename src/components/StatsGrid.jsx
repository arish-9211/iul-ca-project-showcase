import { FolderCode, GraduationCap, Grid2X2, Users } from 'lucide-react';

export default function StatsGrid({ stats, loading = false }) {
  const items = [
    {
      label: 'Project records',
      value: stats.total,
      detail: `${stats.described} with project details`,
      icon: FolderCode,
    },
    { label: 'Programmes', value: stats.programmes, detail: 'BCA & MCA', icon: GraduationCap },
    { label: 'Class groups', value: stats.groups, detail: 'Across both programmes', icon: Grid2X2 },
    { label: 'Team slots', value: stats.teams, detail: 'Up to 5 members per team', icon: Users },
  ];
  return (
    <div className="stats-grid" aria-busy={loading}>
      {items.map(({ label, value, detail, icon: Icon }) => (
        <div className="stat" key={label}>
          <div className="stat-title">
            {label}
            <Icon size={17} aria-hidden="true" />
          </div>
          <strong>{loading ? '—' : String(value).padStart(2, '0')}</strong>
          <span>{loading ? 'Loading session records…' : detail}</span>
        </div>
      ))}
    </div>
  );
}
