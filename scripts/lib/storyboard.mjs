import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
const ACCENTS = ['#8B5CF6', '#06B6D4', '#F59E0B', '#F472B6', '#34D399'];
const MEDIA_PATTERN = /^media\/(?:[a-zA-Z0-9_ -]+\/)*[a-zA-Z0-9_ .-]+\.(?:mp4|mov|webm|png|jpg|jpeg|webp|mp3|wav|m4a)$/i;
export function parseArgs(argv) {
  const result = {};
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (!arg.startsWith('--')) throw new Error('Bilinmeyen argüman: ' + arg);
    const equalAt = arg.indexOf('=');
    const key = arg.slice(2, equalAt < 0 ? undefined : equalAt);
    if (!/^[a-z][a-z-]*$/.test(key)) throw new Error('Hatalı seçenek: ' + arg);
    if (equalAt >= 0) result[key] = arg.slice(equalAt + 1);
    else if (i + 1 < argv.length && !argv[i + 1].startsWith('--')) result[key] = argv[++i];
    else result[key] = true;
  }
  return result;
}
const clean = (s) => s.replace(/\s+/g, ' ').trim();
export const inferPlatform = (prompt) => /youtube|16\s*:\s*9|yatay/i.test(prompt) ? 'youtube' : 'instagram';
export function inferSeconds(prompt) {
  const m = prompt.match(/(\d+(?:[.,]\d+)?)\s*(dakikalık|dakika|dk|saniyelik|saniye|sn)\b/i);
  if (!m) return 30;
  return Math.round(Number(m[1].replace(',', '.')) * (/^da|^dk/i.test(m[2]) ? 60 : 1));
}
export function createProject({prompt, duration, title}) {
  if (typeof prompt !== 'string' || !clean(prompt)) throw new Error('Boş prompt olamaz.');
  const seconds = duration === undefined ? inferSeconds(prompt) : Number(duration);
  if (!Number.isFinite(seconds) || seconds < 1 || seconds > 21600) throw new Error('Süre 1–21600 saniye arasında olmalı.');
  const body = clean(prompt.replace(/\d+(?:[.,]\d+)?\s*(dakikalık|dakika|dk|saniyelik|saniye|sn)\b/gi, '')
    .replace(/\b(instagram|youtube)(\s+için)?\b/gi, '').replace(/^[\s,;:-]+|[\s,;:-]+$/g, '')) || clean(prompt);
  let phrases = body.split(/(?:\n+|[.!?;]+)\s*/u).map(clean).filter(Boolean);
  if (phrases.length < 2) phrases = body.split(/,\s+/u).map(clean).filter(Boolean);
  if (!phrases.length) phrases = [body];
  const chunks = phrases.length <= 8 ? phrases : [...phrases.slice(0, 7), phrases.slice(7).join('. ')];
  const frames = Math.round(seconds * 30);
  if (chunks.length > frames) throw new Error('Sahne sayısı süreye sığmıyor.');
  const base = Math.floor(frames / chunks.length);
  let remainder = frames % chunks.length;
  const scenes = chunks.map((phrase, index) => ({
    id: 'scene-' + (index + 1),
    title: phrase.length > 66 ? phrase.slice(0, 63).trimEnd() + '…' : phrase,
    body: phrase, caption: phrase,
    durationSeconds: (base + (remainder-- > 0 ? 1 : 0)) / 30,
    accent: ACCENTS[index % ACCENTS.length],
  }));
  return {title: typeof title === 'string' && clean(title) ? clean(title) : chunks[0].slice(0, 90), fps: 30, scenes};
}
export function validateProject(project, baseDirectory = process.cwd()) {
  const errors = [];
  if (!project || typeof project !== 'object' || Array.isArray(project)) return ['Proje JSON nesnesi olmalı.'];
  if (typeof project.title !== 'string' || !project.title.trim()) errors.push('title zorunlu.');
  if (!Number.isInteger(project.fps) || project.fps < 1 || project.fps > 120) errors.push('fps 1–120 arasında olmalı.');
  if (!Array.isArray(project.scenes) || !project.scenes.length) return [...errors, 'En az bir sahne gerekiyor.'];
  const ids = new Set();
  for (const [i, s] of project.scenes.entries()) {
    const at = 'scenes[' + i + ']';
    if (!s || typeof s !== 'object') {errors.push(at + ' nesne olmalı.'); continue;}
    if (typeof s.id !== 'string' || !/^[a-zA-Z0-9_-]+$/.test(s.id) || ids.has(s.id)) errors.push(at + '.id benzersiz ve güvenli olmalı.');
    ids.add(s.id);
    for (const key of ['title', 'body']) if (typeof s[key] !== 'string' || !s[key].trim()) errors.push(at + '.' + key + ' boş olamaz.');
    if (s.caption !== undefined && typeof s.caption !== 'string') errors.push(at + '.caption metin olmalı.');
    if (typeof s.durationSeconds !== 'number' || !Number.isFinite(s.durationSeconds) || s.durationSeconds < 0.25 || s.durationSeconds > 21600) errors.push(at + '.durationSeconds geçersiz.');
    if (s.accent !== undefined && !/^#[0-9A-Fa-f]{6}$/.test(s.accent)) errors.push(at + '.accent renk olmalı.');
    for (const key of ['media', 'audio']) {
      if (s[key] === undefined) continue;
      if (typeof s[key] !== 'string' || !MEDIA_PATTERN.test(s[key]) || s[key].includes('..')) {
        errors.push(at + '.' + key + ' yalnızca public/media içinde olmalı.'); continue;
      }
      if (!existsSync(resolve(baseDirectory, 'public', s[key]))) errors.push(at + '.' + key + ' bulunamadı.');
      if (key === 'audio' && !/\.(mp3|wav|m4a)$/i.test(s[key])) errors.push(at + '.audio ses olmalı.');
      if (key === 'media' && /\.(mp3|wav|m4a)$/i.test(s[key])) errors.push(at + '.media görüntü olmalı.');
    }
  }
  return errors;
}
