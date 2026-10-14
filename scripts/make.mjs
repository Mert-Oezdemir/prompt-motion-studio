#!/usr/bin/env node
import {writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {resolve, dirname} from 'node:path';
import {createProject, parseArgs, validateProject, inferPlatform} from './lib/storyboard.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {console.log('npm run make -- --prompt "30 saniyelik Instagram videosu: konu 1; konu 2"'); process.exit(0);}
  const project = createProject({prompt: args.prompt, duration: args.duration, title: args.title});
  const errors = validateProject(project, root);
  if (errors.length) throw new Error(errors.join('\n'));
  writeFileSync(resolve(root, 'project.json'), JSON.stringify(project, null, 2) + '\n');
  console.log('✓ project.json güncellendi · ' + project.scenes.length + ' sahne');
  console.log('npm run render -- --platform ' + inferPlatform(args.prompt));
} catch (error) {console.error('Hata: ' + error.message); process.exitCode = 1;}
