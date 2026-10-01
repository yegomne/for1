import test from 'node:test';
import assert from 'node:assert/strict';
import {modules,lessons} from '../src/curriculum.js';
import {missionGuides} from '../src/mission-guides.js';
import {normalizeState,readState,STORAGE_KEY} from '../src/learning-state.js';
import {preparedSamples,renderPreparedSample} from '../src/prepared-samples.js';

test('8개 과정과 기존 DAY 1–90 식별자·범위를 유지합니다',()=>{
  assert.deepEqual(modules.map(m=>m.id),['git','api','db','docker','arch','rag','agent','eval']);
  assert.deepEqual(modules.map(m=>m.days.length),[15,15,15,10,10,10,8,7]);
  assert.deepEqual(lessons.map(l=>l.day),Array.from({length:90},(_,i)=>i+1));
  for (const lesson of lessons) {
    assert.equal(lesson.title,modules[lesson.mi].days[lesson.li][0]);
    assert.equal(lesson.guide.day,lesson.day);
  }
});

test('90개 미션에 작은 목표·3단계·준비된 샘플·직접 확인·도움이 있습니다',()=>{
  assert.equal(missionGuides.length,90);
  assert.equal(new Set(missionGuides.map(g=>g.goal)).size,90);
  for(const guide of missionGuides) {
    for(const field of ['goal','why','start','request','result','help','extra','aiRole','userRole']) assert.ok(guide[field].length>5,`DAY ${guide.day} ${field}`);
    assert.equal(guide.steps.length,3,`DAY ${guide.day}: SQL의 세미콜론을 단계 구분자로 오해하지 않습니다`);
    assert.equal(guide.checks.length,2);
    assert.ok(guide.minutes<=15);
    assert.ok(guide.request.includes(`DAY ${guide.day}`));
    assert.equal(guide.sample.day,guide.day);
    assert.ok(!guide.steps.some(s=>/AI에 요청|대화창/.test(s.actor+s.text)));
  }
});

test('모든 날짜에 고유한 예제와 완전한 표가 있으며 외부 AI가 필요하지 않습니다',()=>{
  assert.equal(preparedSamples.length,90);
  assert.deepEqual(preparedSamples.map(s=>s.day),lessons.map(l=>l.day));
  for(const sample of preparedSamples){
    assert.ok(sample.rows.length>=2);
    assert.ok(sample.headers.length>=2);
    for(const row of sample.rows)assert.equal(row.length,sample.headers.length,`DAY ${sample.day}`);
    const rendered=renderPreparedSample(sample,'테스트 상품');
    assert.ok(!JSON.stringify(rendered.rows).includes('{상품}'));
    assert.equal(sample.flow.length,3);
    assert.ok(sample.insight.length>10);
  }
});

test('편집한 상품 이름은 JSON과 SQL 예제에서도 유효하게 반영됩니다',()=>{
  for(const day of [19,21,72]){
    const result=renderPreparedSample(preparedSamples[day-1],'컵 "특별판"');
    const json=JSON.parse(result.code);
    assert.ok(json.name.includes('"특별판"'));
  }
  assert.match(renderPreparedSample(preparedSamples[33],"O'Reilly 컵").code,/O''Reilly/);
  assert.throws(()=>renderPreparedSample(preparedSamples[0],''),/1~40/);
  assert.throws(()=>renderPreparedSample(preparedSamples[0],'a'.repeat(41)),/1~40/);
});

test('첫날은 저장소 파일 읽기만 하며 마지막 평가는 3개 질문으로 시작합니다',()=>{
  assert.match(missionGuides[0].goal,/파일 하나 찾기/);
  assert.ok(!missionGuides[0].steps.some(s=>/Commit|Merge|Branch|Diff/.test(s.text)));
  assert.match(missionGuides[83].goal,/세 개/);
  assert.match(missionGuides[83].extra,/100개/);
});

test('기존 저장 키·진도·메모를 유지합니다',()=>{
  assert.equal(STORAGE_KEY,'build90-v1');
  const previous={day:37,completed:[1,2,15,30,36],notes:{1:'기존 메모',37:'JOIN 확인'}};
  assert.deepEqual(normalizeState(previous),previous);
  assert.deepEqual(readState({getItem:key=>key===STORAGE_KEY?JSON.stringify(previous):null}),previous);
});

test('손상된 저장값이 탐색을 중단시키지 않습니다',()=>{
  const empty={day:1,completed:[],notes:{}};
  assert.deepEqual(normalizeState(null),empty);
  assert.deepEqual(readState({getItem:()=>'{broken'}),empty);
  assert.deepEqual(readState({getItem:()=>{throw new Error('blocked')}}),empty);
  assert.deepEqual(normalizeState({day:999,completed:[1,1,0,91,'2'],notes:{2:'보존',3:null}}),{day:1,completed:[1],notes:{2:'보존'}});
});
