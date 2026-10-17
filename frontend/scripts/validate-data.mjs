import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateProjects } from '../src/utils/validation.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const sources = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['src/data/projects.json', 'src/data/samples.json'];
let failed = false;
const ids = new Set(),
  slugs = new Set();
for (const source of sources) {
  try {
    const records = JSON.parse(await fs.readFile(path.resolve(root, source), 'utf8'));
    const { errors, warnings } = validateProjects(records);
    if (Array.isArray(records))
      for (const record of records) {
        if (!record || typeof record !== 'object') continue;
        for (const [key, seen] of [
          ['id', ids],
          ['slug', slugs],
        ]) {
          if (!record[key]) continue;
          if (seen.has(record[key])) errors.push(`Cross-file duplicate ${key}: ${record[key]}`);
          seen.add(record[key]);
        }
        if (source.endsWith('projects.json') && record.isSample)
          errors.push(`${record.id}: samples belong in samples.json, not the session directory`);
        if (source.endsWith('samples.json') && !record.isSample)
          errors.push(`${record.id}: every record in samples.json must have isSample: true`);
        if (record.projectThumbnail?.startsWith('/')) {
          const resolved = path.resolve(root, 'public', `.${record.projectThumbnail}`);
          const publicRoot = path.resolve(root, 'public') + path.sep;
          if (!resolved.startsWith(publicRoot))
            errors.push(`${record.id}: image path must stay inside public/`);
          else
            try {
              await fs.access(resolved);
            } catch {
              errors.push(
                `${record.id}: thumbnail file does not exist: ${record.projectThumbnail}`,
              );
            }
        }
      }
    if (errors.length) {
      failed = true;
      console.error(
        `${source}: ${errors.length} error(s)\n${errors.map((e) => `  - ${e}`).join('\n')}`,
      );
    } else
      console.log(
        `${source}: ${records.length} records valid${warnings.length ? ` (${warnings.length} sample/empty-dataset notices)` : ''}`,
      );
  } catch (error) {
    failed = true;
    console.error(`${source}: unable to read valid JSON: ${error.message}`);
  }
}
if (failed) process.exitCode = 1;
else
  console.log('Data validation passed. Public source allocations still need faculty verification.');
