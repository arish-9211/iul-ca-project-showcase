import { PROGRAMMES, STATUSES, safeUrl, safeImage, repositoryName } from './projects.js';

const text = (v) => typeof v === 'string' && v.trim().length > 0;
const optionalText = (v) => v == null || v === '' || typeof v === 'string';
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function validateProjects(records) {
  if (!Array.isArray(records)) return { errors: ['Dataset must be a JSON array.'], warnings: [] };
  const errors = [],
    warnings = [];
  const seen = {
    id: new Set(),
    slug: new Set(),
    projectId: new Set(),
    repositoryName: new Set(),
    team: new Set(),
  };
  records.forEach((p, index) => {
    const at = `Record ${index + 1}${p?.id ? ` (${p.id})` : ''}`;
    const fail = (message) => errors.push(`${at}: ${message}`);
    if (!p || typeof p !== 'object' || Array.isArray(p)) {
      fail('must be an object');
      return;
    }
    for (const key of ['id', 'slug', 'title', 'academicSession', 'status'])
      if (!text(p[key])) fail(`${key} is required`);
    if (text(p.slug) && !slugPattern.test(p.slug))
      fail('slug must use lowercase letters, numbers and single hyphens');
    if (!/^\d{4}[–-]\d{4}$/.test(p.academicSession || ''))
      fail('academicSession must use YYYY–YYYY');
    else {
      const [start, end] = p.academicSession.split(/[–-]/).map(Number);
      if (end !== start + 1) fail('academicSession must span consecutive years');
    }
    if (typeof p.isSample !== 'boolean') fail('isSample must be true or false');
    if (!PROGRAMMES.includes(p.programme) && !(p.isSample && p.programme == null))
      fail('programme must be BCA or MCA (null allowed for an unassigned sample)');
    if (!STATUSES.includes(p.status)) fail('status is not supported');
    if (!Number.isInteger(p.repositoryYear) || p.repositoryYear < 2000 || p.repositoryYear > 2200)
      fail('repositoryYear must be a four-digit year');
    for (const key of ['group', 'teamId'])
      if (!p.isSample && !text(p[key])) fail(`${key} is required for directory records`);
    if (
      !p.isSample &&
      !text(p.projectId) &&
      !(p.recordType === 'unverified-allocation' && text(p.sourceProjectId) && text(p.dataNote))
    )
      fail('projectId is required, except a documented unverified source allocation');
    if (p.group && !/^[A-Z]$/.test(p.group)) fail('group must be a single uppercase letter');
    if (
      p.teamId &&
      (!/^[A-Z]\d{2}$/.test(p.teamId) || p.teamId[0] !== p.group || p.teamId.endsWith('00'))
    )
      fail('teamId must match group plus two digits, e.g. A01');
    for (const key of [
      'projectId',
      'sourceProjectId',
      'dataNote',
      'group',
      'teamId',
      'description',
      'shortDescription',
      'problemStatement',
      'solution',
      'teamName',
      'category',
      'mentor',
      'repositoryName',
      'repositoryUrl',
      'liveUrl',
      'projectThumbnail',
      'linkNote',
    ])
      if (!optionalText(p[key])) fail(`${key} must be text or null`);
    if (!Array.isArray(p.technologies) || p.technologies.some((t) => !text(t)))
      fail('technologies must be an array of nonempty strings');
    if (!Array.isArray(p.members)) fail('members must be an array');
    else {
      if (p.members.length > 5) fail('a team may have at most 5 members');
      const enrollments = new Set();
      p.members.forEach((m, i) => {
        if (!m || !text(m.name)) {
          fail(`member ${i + 1} needs a name`);
          return;
        }
        for (const key of ['role', 'enrollmentNumber'])
          if (!optionalText(m[key])) fail(`member ${i + 1} ${key} must be text`);
        for (const key of ['github', 'linkedin'])
          if (m[key] && !safeUrl(m[key]))
            fail(`member ${i + 1} ${key} must be an absolute HTTP(S) URL`);
        if (m.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m.email))
          fail(`member ${i + 1} email is invalid`);
        if (m.enrollmentNumber) {
          const number = String(m.enrollmentNumber).toUpperCase();
          if (enrollments.has(number)) fail('duplicate member enrollment number');
          enrollments.add(number);
        }
      });
    }
    for (const key of ['repositoryUrl', 'liveUrl'])
      if (p[key] && !safeUrl(p[key], key === 'repositoryUrl'))
        fail(
          `${key} must be a valid ${key === 'repositoryUrl' ? 'GitHub repository' : 'HTTP(S)'} URL`,
        );
    if (p.projectThumbnail && !safeImage(p.projectThumbnail))
      fail('projectThumbnail must be an HTTP(S) URL or a local image path starting with /');
    for (const key of ['createdAt', 'updatedAt'])
      if (
        p[key] != null &&
        (!/^\d{4}-\d{2}-\d{2}$/.test(p[key]) ||
          Number.isNaN(Date.parse(p[key])) ||
          new Date(p[key]).toISOString().slice(0, 10) !== p[key])
      )
        fail(`${key} must be a valid YYYY-MM-DD date or null`);
    if (p.createdAt && p.updatedAt && p.updatedAt < p.createdAt)
      fail('updatedAt cannot precede createdAt');
    for (const key of ['id', 'slug', 'projectId', 'repositoryName']) {
      if (!text(p[key])) continue;
      const value = p[key].toLowerCase();
      if (seen[key].has(value)) fail(`duplicate ${key}: ${p[key]}`);
      seen[key].add(value);
    }
    if (p.teamId && p.programme) {
      const scope = `${p.academicSession}/${p.programme}/${p.group}/${p.teamId}`;
      if (seen.team.has(scope)) fail(`duplicate team within session/programme/group: ${scope}`);
      seen.team.add(scope);
    }
    const expected = repositoryName(p);
    if (!p.isSample && p.repositoryName && expected && p.repositoryName !== expected)
      fail(`repositoryName should be ${expected}`);
    if (p.isSample) warnings.push(`${at}: illustrative sample; exclude from official statistics`);
  });
  if (!records.length) warnings.push('Dataset is empty.');
  return { errors, warnings };
}
