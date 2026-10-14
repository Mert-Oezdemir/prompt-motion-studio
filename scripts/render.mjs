#!/usr/bin/env node
import {readFileSync, mkdirSync} from 'node:fs';
import {resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseArgs, validateProject} from './lib/storyboard.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {console.log('npm run render -- --platform instagram|youtube [--output out/video.mp4]'); process.exit(0);}
  const platform = args.platform ?? 'instagram';
  const ids = {instagram:'InstagramVideo', youtube:'YouTubeVideo'};
  if (!Object.hasOwn(ids, platform)) throw new Error('Platform instagram veya youtube olmalı.');
  const project = JSON.parse(readFileSync(resolve(root, 'project.json'), 'utf8'));
  const errors = validateProject(project, root);
  if (errors.length) throw new Error(errors.join('\n'));
  const output = resolve(root, args.output ?? 'out/' + platform + '.mp4');
  if (!output.toLowerCase().endsWith('.mp4')) throw new Error('Çıktı .mp4 olmalı.');
  mkdirSync(dirname(output), {recursive: true});
  const cli = resolve(root, 'node_modules', '@remotion', 'cli', 'remotion-cli.js');
  const result = spawnSync(process.execPath, [cli, 'render', 'src/index.ts', ids[platform], output, '--codec=h264', '--pixel-format=yuv420p'], {cwd: root, stdio:'inherit'});
  if (result.error) throw result.error;
  if (result.status !== 0) process.exitCode = result.status ?? 1;
  else console.log('✓ Render tamamlandı: ' + output);
} catch (error) {console.error('Hata: ' + error.message); process.exitCode = 1;}
