#!/usr/bin/env node
import {readFileSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {validateProject} from './lib/storyboard.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const project = JSON.parse(readFileSync(resolve(root, 'project.json'), 'utf8'));
  const errors = validateProject(project, root);
  if (errors.length) throw new Error(errors.join('\n'));
  console.log('✓ Geçerli proje: ' + project.scenes.length + ' sahne');
} catch (error) {console.error('Hata: ' + error.message); process.exitCode = 1;}
