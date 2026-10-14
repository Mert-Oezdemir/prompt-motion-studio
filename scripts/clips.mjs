#!/usr/bin/env node
import {readFileSync, existsSync, mkdirSync, writeFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {parseArgs} from './lib/storyboard.mjs';
import {makeSrt, pickHighlights, validateTranscript} from './lib/clips.mjs';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {console.log('npm run clips -- --input public/media/long.mp4 --transcript examples/transcript.json --count 3'); process.exit(0);}
  if (typeof args.input !== 'string' || typeof args.transcript !== 'string') throw new Error('--input ve --transcript gerekli.');
  const input = resolve(root, args.input), transcriptFile = resolve(root, args.transcript);
  if (!existsSync(input) || !existsSync(transcriptFile)) throw new Error('Video veya transkript bulunamadı.');
  const format = args.format ?? 'portrait';
  if (!['portrait','landscape'].includes(format)) throw new Error('--format portrait veya landscape olmalı.');
  const count = args.count === undefined ? 3 : Number(args.count);
  const transcript = validateTranscript(JSON.parse(readFileSync(transcriptFile, 'utf8')));
  const highlights = pickHighlights(transcript, count);
  const outDir = resolve(root, typeof args.out === 'string' ? args.out : 'out/clips');
  mkdirSync(outDir, {recursive:true});
  const scale = format === 'portrait'
    ? 'scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920'
    : 'scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080';
  for (const [index, clip] of highlights.entries()) {
    const base = 'clip-' + String(index+1).padStart(2,'0'), srt=base+'.srt', mp4=base+'.mp4';
    writeFileSync(resolve(outDir,srt),makeSrt(transcript,clip.start,clip.end));
    const subtitleFilter = scale + ',subtitles=' + srt + ":force_style='FontName=Arial,FontSize=20,Outline=2,Shadow=0,Alignment=2,MarginV=65'";
    const flags=['-hide_banner','-loglevel','error','-y','-ss',String(clip.start),
      '-i',input,'-t',String(clip.end-clip.start),'-map','0:v:0','-map','0:a?',
      '-vf',args['no-burn'] ? scale : subtitleFilter,'-c:v','libx264','-preset','medium',
      '-crf','21','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',mp4];
    const run=spawnSync('ffmpeg',flags,{cwd:outDir,stdio:'inherit'});
    if (run.error) throw run.error;
    if (run.status!==0) throw new Error('FFmpeg hata verdi: '+mp4);
    console.log('✓ '+mp4+' + '+srt);
  }
} catch(error) {console.error('Hata: '+error.message);process.exitCode=1;}
