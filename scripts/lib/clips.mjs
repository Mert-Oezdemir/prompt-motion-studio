export function validateTranscript(items) {
  if (!Array.isArray(items) || !items.length) throw new Error('Transkript JSON dizisi olmalı.');
  let previous = -1;
  for (const [i, item] of items.entries()) {
    if (!item || typeof item.text !== 'string' || !item.text.trim() ||
        !Number.isFinite(item.start) || !Number.isFinite(item.end) ||
        item.start < 0 || item.end <= item.start || item.start < previous) {
      throw new Error('Geçersiz transkript satırı: ' + i);
    }
    previous = item.start;
  }
  return items;
}
export function pickHighlights(items, count = 3) {
  validateTranscript(items);
  if (!Number.isInteger(count) || count < 1 || count > 20) throw new Error('Klip sayısı 1–20 olmalı.');
  const candidates = [];
  for (let i = 0; i < items.length; i++) {
    for (let j = i; j < Math.min(items.length, i + 9); j++) {
      const start = items[i].start, end = items[j].end, duration = end - start;
      if (duration > 55) break;
      if (duration < 8) continue;
      const text = items.slice(i, j + 1).map(x => x.text).join(' ');
      const triggers = (text.match(/\b(neden|nasıl|ipucu|önemli|dikkat|mutlaka|how|why|tip)\b/gi) ?? []).length;
      const numbers = (text.match(/\d+/g) ?? []).length;
      const score = triggers * 4 + Math.min(numbers, 3) * 2 + (text.match(/[!?]/g) ?? []).length +
        Math.min(text.length / 140, 2) - Math.abs(duration - 24) / 22;
      candidates.push({start,end,startIndex:i,endIndex:j,score,text});
    }
  }
  if (!candidates.length) return items.slice(0, count).map((item, index) => ({
    start:item.start,end:item.end,startIndex:index,endIndex:index,score:0,text:item.text
  }));
  candidates.sort((a,b)=>b.score-a.score || a.start-b.start);
  const chosen=[];
  for (const candidate of candidates) {
    if (chosen.length >= count) break;
    if (chosen.some(x => candidate.start < x.end && candidate.end > x.start)) continue;
    chosen.push(candidate);
  }
  return chosen.sort((a,b)=>a.start-b.start);
}
function timecode(seconds) {
  const ms = Math.round(Math.max(0, seconds)*1000);
  return [Math.floor(ms/3600000),Math.floor(ms/60000)%60,Math.floor(ms/1000)%60]
    .map(x=>String(x).padStart(2,'0')).join(':') + ',' + String(ms%1000).padStart(3,'0');
}
export function makeSrt(items, start, end) {
  const lines=[]; let i=0;
  for (const item of items) {
    if (item.end<=start || item.start>=end) continue;
    const a=Math.max(start,item.start)-start, b=Math.min(end,item.end)-start;
    if (b<=a) continue;
    lines.push(String(++i)+'\n'+timecode(a)+' --> '+timecode(b)+'\n'+item.text.replace(/\r?\n/g,' ')+'\n');
  }
  return lines.join('\n')+'\n';
}
