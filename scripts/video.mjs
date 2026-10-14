#!/usr/bin/env node
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {inferPlatform, parseArgs} from './lib/storyboard.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {console.log('npm run video -- --prompt "30 saniyelik Instagram videosu: konu 1; konu 2"'); process.exit(0);}
  if (typeof args.prompt !== 'string' || !args.prompt.trim()) throw new Error('--prompt gerekli.');
  const platform = args.platform ?? inferPlatform(args.prompt);
  if (!['instagram', 'youtube'].includes(platform)) throw new Error('Platform instagram veya youtube olmalı.');
  const extra = [];
  if (typeof args.duration === 'string') extra.push('--duration', args.duration);
  if (typeof args.title === 'string') extra.push('--title', args.title);
  const make = spawnSync(process.execPath, ['scripts/make.mjs', '--prompt', args.prompt, ...extra], {cwd:root, stdio:'inherit'});
  if (make.error) throw make.error;
  if (make.status !== 0) {process.exitCode = make.status ?? 1;}
  else {
    const renderArgs = ['scripts/render.mjs', '--platform', platform];
    if (typeof args.output === 'string') renderArgs.push('--output', args.output);
    const render = spawnSync(process.execPath, renderArgs, {cwd:root, stdio:'inherit'});
    if (render.error) throw render.error;
    if (render.status !== 0) process.exitCode = render.status ?? 1;
  }
} catch (error) {console.error('Hata: ' + error.message); process.exitCode = 1;}
