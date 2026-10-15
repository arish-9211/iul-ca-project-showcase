import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {
  normalizeProjects,
  filterProjects,
  calculateStats,
  groupProjects,
  safeUrl,
  repositoryName,
} from '../src/utils/projects.js';
import { validateProjects } from '../src/utils/validation.js';
import { parseCSV, csvToProjects } from '../scripts/csv.mjs';

const raw = JSON.parse(
  fs.readFileSync(new URL('./fixtures/projects.json', import.meta.url), 'utf8'),
);
const samplesRaw = JSON.parse(
  fs.readFileSync(new URL('./fixtures/samples.json', import.meta.url), 'utf8'),
);
const projects = normalizeProjects(raw),
  samples = normalizeProjects(samplesRaw);
const clone = (record) => structuredClone(record);
test('public directory and examples pass structural validation', () => {
  for (const name of ['projects', 'samples'])
    assert.deepEqual(
      validateProjects(
        JSON.parse(fs.readFileSync(new URL(`../src/data/${name}.json`, import.meta.url), 'utf8')),
      ).errors,
      [],
    );
});
test('directory statistics scope programmes and groups without counting unknown students', () => {
  assert.deepEqual(calculateStats(projects), {
    total: 7,
    programmes: 2,
    groups: 7,
    teams: 7,
    students: 0,
    repositories: 0,
    live: 0,
    described: 2,
    bca: 5,
    mca: 2,
  });
  assert.equal(
    groupProjects(projects).find((g) => g.programme === 'MCA' && g.group === 'C').projects.length,
    1,
  );
});
test('search is case-insensitive and covers titles, IDs, teams, repository names and programme/group', () => {
  assert.equal(filterProjects(projects, { q: 'smart HEALTHCARE' })[0].projectId, 'PUGID26191');
  assert.equal(filterProjects(projects, { q: 'bca g08' })[0].projectId, 'PUGID26191');
  assert.equal(filterProjects(projects, { q: 'BCA2027-PUGID26001-A01' }).length, 1);
  assert.equal(filterProjects(projects, { q: 'bca group l' }).length, 1);
  assert.equal(filterProjects(projects, { q: 'ppgid26001' }).length, 1);
});
test('search covers members, technology and team name', () => {
  assert.equal(filterProjects(samples, { q: 'sample learner 06' })[0].title, 'LibraryLens');
  assert.ok(filterProjects(samples, { q: 'react' }).length > 2);
  assert.equal(filterProjects(samples, { q: 'Example Taskflow team' })[0].title, 'Taskflow');
});
test('all filters intersect with search', () => {
  const results = filterProjects(samples, {
    q: 'react',
    programme: 'BCA',
    group: 'B',
    technology: 'CSS',
    category: 'Sustainability',
    status: 'In Development',
    session: '2026–2027',
  });
  assert.deepEqual(
    results.map((p) => p.title),
    ['EcoTrack'],
  );
  assert.equal(filterProjects(samples, { q: 'react', status: 'Completed' }).length, 0);
});
test('reset restores all records and empty searches do not exclude data', () => {
  assert.equal(filterProjects(projects, {}).length, 7);
  assert.equal(filterProjects(projects, { q: '   ' }).length, 7);
  assert.equal(filterProjects(projects, { q: 'not-a-real-title' }).length, 0);
});
test('malformed arrays and optional fields do not crash rendering helpers', () => {
  assert.deepEqual(normalizeProjects(null), []);
  const result = normalizeProjects([
    null,
    {},
    {
      ...samplesRaw[0],
      technologies: null,
      members: [null, {}, 'wrong'],
      description: 12,
      repositoryUrl: 'javascript:alert(1)',
      projectThumbnail: 42,
    },
  ]);
  assert.equal(result.length, 1);
  assert.deepEqual(result[0].technologies, []);
  assert.deepEqual(result[0].members, []);
  assert.equal(result[0].repositoryUrl, '');
  assert.doesNotThrow(() => filterProjects(result, { q: 'test' }));
});
test('normalization suppresses duplicate and unsafe slugs', () => {
  assert.equal(
    normalizeProjects([samplesRaw[0], samplesRaw[0], { ...samplesRaw[0], slug: '../../oops' }])
      .length,
    1,
  );
});
test('only safe web URLs are clickable and GitHub repositories need an owner/repo', () => {
  for (const url of [
    'javascript:alert(1)',
    'data:text/html,bad',
    'https://user:pass@github.com/a/b',
    'ftp://example.com',
  ])
    assert.equal(safeUrl(url), '');
  assert.equal(safeUrl('https://github.com/owner', true), '');
  assert.equal(safeUrl('https://github.com.evil.test/a/b', true), '');
  assert.equal(safeUrl('https://github.com/owner/repo', true), 'https://github.com/owner/repo');
});
test('validation catches duplicates within an academic scope', () => {
  const copy = clone(raw[0]);
  copy.id = 'different';
  copy.slug = 'different';
  const errors = validateProjects([raw[0], copy]).errors.join(' ');
  assert.match(errors, /duplicate projectId/);
  assert.match(errors, /duplicate repositoryName/);
  assert.match(errors, /duplicate team/);
});
test('team IDs may repeat between programmes, groups and sessions', () => {
  assert.deepEqual(validateProjects([raw[0], raw.find((p) => p.programme === 'MCA')]).errors, []);
  const later = {
    ...raw[0],
    id: 'next-year',
    slug: 'next-year',
    projectId: 'NEXT-ID',
    academicSession: '2027–2028',
    repositoryYear: 2028,
    repositoryName: 'BCA2028-NEXT-ID-A01',
  };
  assert.deepEqual(validateProjects([raw[0], later]).errors, []);
});
test('validation identifies missing fields, invalid programmes, URLs and team structure', () => {
  const bad = {
    ...clone(raw[0]),
    title: '',
    programme: 'MBA',
    teamId: 'B00',
    repositoryUrl: 'https://example.com',
    liveUrl: 'not a url',
    status: 'Made up',
  };
  const errors = validateProjects([bad]).errors.join(' ');
  for (const expected of ['title', 'programme', 'teamId', 'repositoryUrl', 'liveUrl', 'status'])
    assert.match(errors, new RegExp(expected));
});
test('validation handles invalid record types and excessive members', () => {
  assert.ok(validateProjects({}).errors.length);
  assert.ok(validateProjects([null, 4, []]).errors.length >= 3);
  const bad = {
    ...clone(raw[0]),
    members: Array.from({ length: 6 }, () => ({ name: 'Example' })),
    technologies: [12],
    createdAt: '2026-02-30',
  };
  const errors = validateProjects([bad]).errors.join(' ');
  assert.match(errors, /at most 5/);
  assert.match(errors, /technologies/);
  assert.match(errors, /createdAt/);
});
test('statistics scope teams and deduplicate known student enrollment numbers', () => {
  const a = { ...samples[1], members: [{ name: 'Sample A', enrollmentNumber: 'DEMO-01' }] };
  const b = { ...samples[2], members: [{ name: 'Sample A', enrollmentNumber: 'demo-01' }] };
  assert.equal(calculateStats([a, b]).students, 1);
  assert.equal(calculateStats([a, b]).teams, 2);
});
test('CareerUp AI remains unassigned and is excluded from directory data', () => {
  const p = samplesRaw.find((p) => p.title === 'CareerUp AI');
  for (const key of ['programme', 'projectId', 'group', 'teamId', 'mentor'])
    assert.equal(p[key], null);
  assert.equal(p.isSample, true);
  assert.equal(repositoryName(p), '');
  assert.equal(
    projects.some((p) => p.title === 'CareerUp AI'),
    false,
  );
});
test('conflicting reference links are withheld, with an explanation', () => {
  const p = projects.find((p) => p.projectId === 'PUGID26191');
  assert.equal(p.repositoryUrl, '');
  assert.equal(p.liveUrl, '');
  assert.match(p.linkNote, /different project ID/);
});
test('CSV parsing supports BOM, commas, escaped quotes and embedded newlines', () => {
  assert.deepEqual(parseCSV('\uFEFFa,b\r\n"hello, world","a ""quote""\nand a line"\r\n'), [
    ['a', 'b'],
    ['hello, world', 'a "quote"\nand a line'],
  ]);
  assert.throws(() => parseCSV('a,b\n"unfinished'), /Unterminated/);
  assert.throws(() => parseCSV('a,b\n"closed"bad,x'), /Unexpected/);
});
test('CSV template converts to a valid sample project', () => {
  const csv = fs.readFileSync(new URL('../templates/projects.csv', import.meta.url), 'utf8');
  const imported = csvToProjects(csv);
  assert.equal(imported.length, 1);
  assert.equal(imported[0].isSample, true);
  assert.deepEqual(imported[0].technologies, ['React', 'JavaScript']);
  assert.equal(imported[0].members[0].name, 'Sample learner');
});
test('CSV rejects duplicate headers and unknown properties', () => {
  assert.throws(() => csvToProjects('id,id\na,b'), /Duplicate/);
  assert.throws(() => csvToProjects('id,mystery\na,b'), /Unknown/);
});
