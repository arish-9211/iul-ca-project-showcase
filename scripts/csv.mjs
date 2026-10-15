import { validateProjects } from '../src/utils/validation.js';

// RFC 4180-style quoted fields, including escaped quotes and embedded newlines.
export function parseCSV(source) {
  const text = source.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [],
    field = '',
    quoted = false,
    afterQuote = false;
  const endField = () => {
    row.push(field);
    field = '';
    afterQuote = false;
  };
  const endRow = () => {
    endField();
    if (row.some((v) => v !== '')) rows.push(row);
    row = [];
  };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        quoted = false;
        afterQuote = true;
      } else field += char;
    } else if (char === '"') {
      if (field || afterQuote) throw new Error('Unexpected quote in CSV field');
      quoted = true;
    } else if (char === ',') endField();
    else if (char === '\n' || char === '\r') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      endRow();
    } else {
      if (afterQuote) throw new Error('Unexpected text after closing CSV quote');
      field += char;
    }
  }
  if (quoted) throw new Error('Unterminated quoted CSV field');
  if (field || row.length || afterQuote) endRow();
  return rows;
}

export function csvToProjects(csv) {
  const [headers, ...rows] = parseCSV(csv);
  if (!headers?.length || !rows.length)
    throw new Error('CSV needs a header and at least one record');
  if (new Set(headers).size !== headers.length) throw new Error('Duplicate CSV column names');
  const allowed = new Set([
    'id',
    'slug',
    'projectId',
    'title',
    'programme',
    'academicSession',
    'repositoryYear',
    'group',
    'teamId',
    'teamName',
    'shortDescription',
    'description',
    'problemStatement',
    'solution',
    'technologies',
    'category',
    'repositoryName',
    'repositoryUrl',
    'liveUrl',
    'status',
    'members',
    'mentor',
    'projectThumbnail',
    'createdAt',
    'updatedAt',
    'isSample',
    'featured',
    'recordType',
    'linkNote',
  ]);
  if (headers.some((h) => !allowed.has(h)))
    throw new Error('Unknown CSV column: ' + headers.filter((h) => !allowed.has(h)).join(', '));
  const result = rows.map((row, index) => {
    if (row.length !== headers.length)
      throw new Error(`CSV row ${index + 2} has ${row.length} columns; expected ${headers.length}`);
    const record = Object.fromEntries(headers.map((key, i) => [key, row[i].trim()]));
    if (!['true', 'false'].includes(record.isSample))
      throw new Error(`CSV row ${index + 2}: isSample must be true or false`);
    if (record.featured && !['true', 'false'].includes(record.featured))
      throw new Error(`CSV row ${index + 2}: featured must be true or false`);
    record.isSample = record.isSample === 'true';
    record.featured = record.featured === 'true';
    record.technologies = record.technologies
      ? record.technologies
          .split('|')
          .map((s) => s.trim())
          .filter(Boolean)
      : [];
    try {
      record.members = record.members ? JSON.parse(record.members) : [];
    } catch {
      throw new Error(`CSV row ${index + 2}: members must contain a JSON array`);
    }
    record.repositoryYear = Number(record.repositoryYear);
    for (const key of [
      'programme',
      'group',
      'teamId',
      'projectId',
      'createdAt',
      'updatedAt',
      'repositoryUrl',
      'liveUrl',
      'projectThumbnail',
      'mentor',
    ])
      if (!record[key]) record[key] = null;
    return record;
  });
  const { errors } = validateProjects(result);
  if (errors.length) throw new Error(errors.join('\n'));
  return result;
}
