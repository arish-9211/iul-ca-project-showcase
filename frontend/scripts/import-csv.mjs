import fs from 'node:fs/promises';
import path from 'node:path';
import { csvToProjects } from './csv.mjs';

const [source, flag, destination, ...extra] = process.argv.slice(2);
if (!source || flag !== '--output' || !destination || extra.length) {
  console.error(
    'Usage: npm run import:csv -- templates/projects.csv --output imported-projects.json',
  );
  process.exitCode = 1;
} else {
  try {
    const projects = csvToProjects(await fs.readFile(source, 'utf8'));
    await fs.mkdir(path.dirname(path.resolve(destination)), { recursive: true });
    // Never silently overwrite the maintained dataset or a previous import.
    await fs.writeFile(destination, JSON.stringify(projects, null, 2) + '\n', { flag: 'wx' });
    console.log(
      `Imported ${projects.length} valid record(s) into ${destination}. Review them before merging into src/data/projects.json or samples.json.`,
    );
  } catch (error) {
    console.error(
      `Import failed: ${error.code === 'EEXIST' ? 'Output already exists. Choose a new output filename.' : error.message}`,
    );
    process.exitCode = 1;
  }
}
