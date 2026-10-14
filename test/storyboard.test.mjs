import test from 'node:test';
import assert from 'node:assert/strict';
import {createProject,inferPlatform,inferSeconds,validateProject,parseArgs} from '../scripts/lib/storyboard.mjs';
test('platform algılama',()=>assert.equal(inferPlatform('YouTube için yatay'),'youtube'));
test('süre algılama',()=>assert.equal(inferSeconds('2 dakikalık video'),120));
test('proje oluşturma',()=>{const p=createProject({prompt:'30 saniyelik Instagram videosu: Bir; İki; Üç'});assert.equal(p.scenes.length,3);assert.equal(Math.round(p.scenes.reduce((x,s)=>x+s.durationSeconds,0)),30);});
test('proje doğrulama',()=>assert.deepEqual(validateProject(createProject({prompt:'Bir; İki'})),[]));
test('güvenli argüman',()=>assert.equal(parseArgs(['--platform','youtube']).platform,'youtube'));
