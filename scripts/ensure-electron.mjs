#!/usr/bin/env node
/**
 * Electron 44 pakete nebėra `postinstall` skripto, todėl `npm install` pats
 * neatisiunčia Electron binary. Šis skriptas paleidžiamas iš repo šaknies
 * `postinstall` metu ir atsiunčia binary tik tada, kai jo dar nėra.
 */
import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const desktopManifest = join(root, 'apps', 'desktop', 'package.json');
const requireFromDesktop = createRequire(pathToFileURL(desktopManifest));

let electronManifest;
try {
  electronManifest = requireFromDesktop.resolve('electron/package.json');
} catch {
  console.log('Electron package not installed; skipping binary check.');
  process.exit(0);
}

const electronDir = dirname(electronManifest);
const versionFile = join(electronDir, 'dist', 'version');

if (existsSync(versionFile)) {
  console.log(`Electron binary present: ${versionFile}`);
  process.exit(0);
}

console.log('Electron binary missing; running the Electron installer...');
const result = spawnSync(process.execPath, [join(electronDir, 'install.js')], {
  cwd: electronDir,
  stdio: 'inherit',
});

process.exit(result.status ?? 1);
