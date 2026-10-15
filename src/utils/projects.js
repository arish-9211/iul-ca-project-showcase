export const PROGRAMMES = ['BCA', 'MCA'];
export const STATUSES = [
  'Awaiting details',
  'Proposed',
  'In Development',
  'Under Review',
  'Completed',
  'Deployed',
];
export const FILTER_KEYS = [
  'q',
  'programme',
  'group',
  'technology',
  'category',
  'status',
  'session',
];
const clean = (value) => (typeof value === 'string' ? value.trim() : '');

export function safeUrl(value, githubOnly = false) {
  if (!clean(value)) return '';
  try {
    const url = new URL(value);
    if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password) return '';
    if (
      githubOnly &&
      (url.hostname !== 'github.com' || url.pathname.split('/').filter(Boolean).length < 2)
    )
      return '';
    return url.href;
  } catch {
    return '';
  }
}

export function safeImage(value) {
  const path = clean(value);
  return /^\/(?!\/)[a-zA-Z0-9/_ .-]+\.(png|jpe?g|webp|avif|svg)$/i.test(path) || safeUrl(path)
    ? path
    : '';
}

// Normalization protects every view from optional or malformed fields.
export function normalizeProjects(records) {
  if (!Array.isArray(records)) return [];
  const seen = new Set();
  return records.flatMap((record) => {
    if (
      !record ||
      typeof record !== 'object' ||
      !clean(record.id) ||
      !clean(record.slug) ||
      !clean(record.title)
    )
      return [];
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug) || seen.has(record.slug)) return [];
    seen.add(record.slug);
    const fields = [
      'id',
      'slug',
      'title',
      'projectId',
      'sourceProjectId',
      'dataNote',
      'group',
      'teamId',
      'teamName',
      'academicSession',
      'description',
      'shortDescription',
      'problemStatement',
      'solution',
      'category',
      'repositoryName',
      'mentor',
      'createdAt',
      'updatedAt',
      'linkNote',
    ];
    const p = Object.fromEntries(fields.map((key) => [key, clean(record[key])]));
    for (const key of ['createdAt', 'updatedAt'])
      if (!/^\d{4}-\d{2}-\d{2}$/.test(p[key]) || Number.isNaN(Date.parse(p[key]))) p[key] = '';
    return [
      {
        ...p,
        programme: PROGRAMMES.includes(record.programme) ? record.programme : '',
        repositoryYear: Number.isInteger(record.repositoryYear) ? record.repositoryYear : null,
        isSample: record.isSample === true,
        recordType: clean(record.recordType),
        featured: record.featured === true,
        status: STATUSES.includes(record.status) ? record.status : 'Awaiting details',
        shortDescription:
          p.shortDescription || p.description || 'Project information is awaiting confirmation.',
        technologies: Array.isArray(record.technologies)
          ? [...new Set(record.technologies.filter((t) => clean(t)).map(clean))]
          : [],
        members: Array.isArray(record.members)
          ? record.members
              .filter((m) => m && clean(m.name))
              .map((m) => ({
                name: clean(m.name),
                enrollmentNumber: clean(m.enrollmentNumber),
                role: clean(m.role),
                github: safeUrl(m.github),
                linkedin: safeUrl(m.linkedin),
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email || '') ? m.email : '',
              }))
          : [],
        repositoryUrl: safeUrl(record.repositoryUrl, true),
        liveUrl: safeUrl(record.liveUrl),
        projectThumbnail: safeImage(record.projectThumbnail),
      },
    ];
  });
}

export function searchText(p) {
  return [
    p.title,
    p.projectId,
    p.sourceProjectId,
    p.teamId,
    p.teamName,
    p.repositoryName,
    p.programme,
    p.group ? `group ${p.group}` : '',
    p.category,
    ...p.technologies,
    ...p.members.map((m) => `${m.name} ${m.enrollmentNumber}`),
  ]
    .join(' ')
    .toLocaleLowerCase();
}

export function filterProjects(projects, filters = {}) {
  const query = clean(filters.q).toLocaleLowerCase();
  const namedGroup = query.match(/\bgroup\s+([a-z])\b/)?.[1]?.toUpperCase();
  const tokens = query
    .replace(/\bgroup\s+([a-z])\b/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return projects.filter((p) => {
    if (namedGroup && p.group !== namedGroup) return false;
    if (tokens.length && !tokens.every((token) => searchText(p).includes(token))) return false;
    return (
      (!filters.programme || p.programme === filters.programme) &&
      (!filters.group || p.group === filters.group) &&
      (!filters.technology || p.technologies.includes(filters.technology)) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.status || p.status === filters.status) &&
      (!filters.session || p.academicSession === filters.session)
    );
  });
}

export function uniqueValues(projects, key) {
  return [
    ...new Set(
      projects.flatMap((p) => (Array.isArray(p[key]) ? p[key] : [p[key]])).filter(Boolean),
    ),
  ].sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
}

export function calculateStats(projects) {
  const groups = new Set(),
    teams = new Set(),
    members = new Set();
  for (const p of projects) {
    if (p.group && p.programme) groups.add(`${p.academicSession}/${p.programme}/${p.group}`);
    if (p.teamId && p.programme)
      teams.add(`${p.academicSession}/${p.programme}/${p.group}/${p.teamId}`);
    p.members.forEach((m, i) =>
      members.add(
        m.enrollmentNumber
          ? `${p.academicSession}/${m.enrollmentNumber.toUpperCase()}`
          : `${p.id}/${i}`,
      ),
    );
  }
  return {
    total: projects.length,
    programmes: uniqueValues(projects, 'programme').length,
    groups: groups.size,
    teams: teams.size,
    students: members.size,
    repositories: projects.filter((p) => p.repositoryUrl).length,
    live: projects.filter((p) => p.liveUrl).length,
    described: projects.filter((p) => p.title !== 'Project details pending').length,
    bca: projects.filter((p) => p.programme === 'BCA').length,
    mca: projects.filter((p) => p.programme === 'MCA').length,
  };
}

export function groupProjects(projects) {
  const groups = new Map();
  projects.forEach((p) => {
    if (!p.programme || !p.group) return;
    const key = `${p.programme}/${p.group}`;
    if (!groups.has(key)) groups.set(key, { programme: p.programme, group: p.group, projects: [] });
    groups.get(key).projects.push(p);
  });
  return [...groups.values()].sort((a, b) =>
    `${a.programme}${a.group}`.localeCompare(`${b.programme}${b.group}`),
  );
}

export function repositoryName(p) {
  return p.programme && p.repositoryYear && p.projectId && p.teamId
    ? `${p.programme}${p.repositoryYear}-${p.projectId}-${p.teamId}`
    : '';
}
