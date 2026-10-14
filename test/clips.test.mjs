import test from 'node:test';
import assert from 'node:assert/strict';
import {makeSrt,pickHighlights,validateTranscript} from '../scripts/lib/clips.mjs';
const rows=[{start:0,end:12,text:'Neden video önemli?'},{start:12,end:25,text:'En önemli ipucu bu.'},{start:25,end:38,text:'Nasıl üretiriz?'}];
test('transkript doğrulama',()=>assert.equal(validateTranscript(rows).length,3));
test('klip seçimi',()=>assert.ok(pickHighlights(rows,2).length>0));
test('SRT zaman kodu',()=>assert.match(makeSrt(rows,0,15),/00:00:00,000 --> 00:00:12,000/));
