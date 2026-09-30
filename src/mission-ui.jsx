import React, {useState, useEffect} from 'react';

export function MissionSummary({guide}) {
  return <div className="mission-summary">
    <span className="tiny-label">오늘은 이것 하나만 · 약 {guide.minutes}분</span>
    <h3>{guide.goal}</h3>
    <p><b>왜 필요한가요?</b> {guide.why}</p>
    <div className="start-here"><b>어디서 시작하나요?</b><p>{guide.start}</p></div>
    <p className="small-scope">기본 실습과 성공 확인까지만 하셔도 완료입니다. 심화는 선택이며, 하루에 여러 미션을 끝내지 않으셔도 됩니다.</p>
  </div>;
}

export function MissionGuide({guide}) {
  const [copyStatus, setCopyStatus] = useState('');
  useEffect(() => setCopyStatus(''), [guide.day]);
  async function copy() {
    try { await navigator.clipboard.writeText(guide.request); setCopyStatus('복사했습니다. 새 AI 대화창에 붙여 넣으세요.'); }
    catch { setCopyStatus('자동 복사가 안 됩니다. 아래 요청 칸의 글을 선택해서 복사해 주세요.'); }
  }
  return <section className="mission-guide" aria-label="오늘의 작은 실습 안내">
    <MissionSummary guide={guide}/>
    <div className="role-split"><div><b>AI에게 맡길 일</b><p>{guide.aiRole}</p></div><div><b>내가 할 일</b><p>{guide.userRole}</p></div></div>
    <h3>한 단계씩 해 보세요</h3>
    <ol className="mission-steps">{guide.steps.map((step,i)=><li key={i}><span>{step.actor}</span><p>{step.text}</p></li>)}</ol>
    <div className="prompt-title"><b>복사해서 AI에게 물어보세요</b><button className="secondary" onClick={copy}>AI 요청 복사</button></div>
    <textarea className="mission-prompt" aria-label="복사 가능한 AI 요청" value={guide.request} readOnly spellCheck={false}/>
    {copyStatus&&<p role="status" className="copy-status">{copyStatus}</p>}
    <div className="expected-result"><b>이 결과가 나오면 됩니다</b><p>{guide.result}</p><ul>{guide.checks.map(check=><li key={check}>{check}</li>)}</ul></div>
    <details className="help-details"><summary>막혔을 때는 이렇게 해 보세요</summary><p>{guide.help}</p><p>그래도 어렵다면 위 요청 뒤에 “지금 막힌 단계만 더 작은 행동 두 개로 나눠 주세요”를 붙이세요. 오류는 비밀값을 지운 뒤 보여 주세요.</p></details>
    <details className="optional-details"><summary>선택 심화 · 지금 건너뛰셔도 됩니다</summary><p>{guide.extra}</p></details>
  </section>;
}
