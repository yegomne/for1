import React from 'react';
import {PreparedSample} from './sample-ui';

export function MissionSummary({guide}) {
  return <div className="mission-summary">
    <span className="tiny-label">오늘은 이것 하나만 · 약 {guide.minutes}분</span>
    <h3>{guide.goal}</h3>
    <p><b>왜 필요한가요?</b> {guide.why}</p>
    <div className="start-here"><b>어디서 시작하나요?</b><p>{guide.start}</p></div>
    <p className="small-scope">준비된 예제와 성공 기준만 확인해도 됩니다. 직접 조작과 심화는 필요한 만큼 하세요.</p>
  </div>;
}

export function MissionGuide({guide}) {
  return <section className="mission-guide" aria-label="오늘의 작은 실습 안내">
    <PreparedSample key={guide.day} sample={guide.sample}/>
    <details className="optional-details"><summary>한 단계씩 보는 실습 안내</summary>
      <ol className="mission-steps">{guide.steps.map((step,i)=><li key={i}><span>{step.actor}</span><p>{step.text}</p></li>)}</ol>
    </details>
    <div className="expected-result"><b>오늘 확인할 결과</b><p>{guide.result}</p><ul>{guide.checks.map(check=><li key={check}>{check}</li>)}</ul></div>
    <details className="help-details"><summary>막혔을 때</summary><p>{guide.help}</p></details>
    <details className="optional-details"><summary>선택 심화 · 지금 건너뛰셔도 됩니다</summary><p>{guide.extra}</p></details>
  </section>;
}
