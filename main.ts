// make.fun entrypoint for best-national-statistics-site-20261126-0539
// Node 22, standard library only: copies app/ + screenshots/ to output, writes dossier.json
// Run: mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Revised: added validation of required files, explicit error messages, and LICENSE copy

import { cpSync, existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Validate required source files exist before copying
const requiredFiles = ['app/index.html', 'app/main.js', 'app/views.js', 'app/data.js', 'app/style.css'];
for (const f of requiredFiles) {
  if (!existsSync(join(here, f))) {
    throw new Error(`Missing required file: ${f}`);
  }
}

mkdirSync(out, { recursive: true });

// Clean previous output
if (existsSync(join(out, 'app'))) rmSync(join(out, 'app'), { recursive: true, force: true });
if (existsSync(join(out, 'screenshots'))) rmSync(join(out, 'screenshots'), { recursive: true, force: true });

cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// Copy LICENSE to output root (required by competition)
if (existsSync(join(here, 'LICENSE'))) {
  cpSync(join(here, 'LICENSE'), join(out, 'LICENSE'));
}

// Scorer caps: text_max_bytes shapes output; others only refuse entries the scorer would refuse
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { 
    text_max_bytes: 163840, 
    screenshots: { max: 4, max_bytes: 262144 }, 
    app_max_files: 993, 
    app_max_bytes: 16777216 
  }),
);

console.log(`Entry prepared in ${out}`);
console.log(`  app/ copied (${requiredFiles.length} core files)`);
console.log(`  screenshots/ copied`);
console.log(`  dossier.json written`);