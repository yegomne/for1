import React,{useState}from'react';
import{CheckCircle2,Play,RotateCcw,ChevronRight}from'lucide-react';
import{renderPreparedSample}from'./prepared-samples';
export function PreparedSample({sample}){
 const [draft,setDraft]=useState('가상 머그컵'),[name,setName]=useState('가상 머그컵'),[previous,setPrevious]=useState(null),[message,setMessage]=useState(''),[error,setError]=useState(false);
 const result=renderPreparedSample(sample,name),hasProduct=sample.rows.flat().some(x=>String(x).includes('{상품}'))||sample.code.includes('{상품}');
 function apply(){try{renderPreparedSample(sample,draft);setPrevious(name);setName(draft.trim());setError(false);setMessage('샘플 값을 적용했습니다. 강조된 칸이 바뀐 결과입니다.')}catch(e){setError(true);setMessage(e.message)}}
 return <section className="prepared-sample" aria-label="오늘의 준비된 샘플"><div className="sample-heading"><div><span className="tiny-label">완성 예제 · DAY {sample.day}</span><h3>오늘의 샘플이 준비되어 있습니다.</h3></div><span className="lab-badge"><CheckCircle2 size={15}/>예제 준비 완료</span></div><p className="sample-caption">아래 표는 미리 만든 학습 예제입니다. 실제 서버나 AI 호출 없이 바로 확인하세요.</p>
 <div className="sample-flow" role="img" aria-label={sample.flow.join(' → ')}>{sample.flow.map((step,i)=><React.Fragment key={i}><div><span>{String(i+1).padStart(2,'0')}</span><b>{step}</b></div>{i<sample.flow.length-1&&<ChevronRight size={16}/>}</React.Fragment>)}</div>
 {hasProduct&&<div className="sample-controls"><label htmlFor={`sample-product-${sample.day}`}>샘플 상품 이름<input id={`sample-product-${sample.day}`} maxLength={40} value={draft} onChange={e=>setDraft(e.target.value)} onKeyDown={e=>{if(e.key==='Enter')apply()}}/></label><button className="primary" onClick={apply}><Play size={15}/>값 적용</button><button className="secondary" onClick={()=>{setDraft('가상 머그컵');setName('가상 머그컵');setPrevious(null);setMessage('');setError(false)}}><RotateCcw size={15}/>초기화</button></div>}
 {previous!==null&&previous!==name&&<div className="sample-diff"><span>변경 전 <b>{previous}</b></span><ChevronRight size={16}/><span>변경 후 <b>{name}</b></span></div>}
 {message&&<p className={`sample-status ${error?'is-error':''}`} role="status">{message}</p>}
 <div className="table-wrapper"><table className="sample-table"><caption>DAY {sample.day} · 완성 예제 결과</caption><thead><tr>{result.headers.map((h,i)=><th key={i}>{h}</th>)}</tr></thead><tbody>{result.rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={j} className={previous!==null&&previous!==name&&String(sample.rows[i][j]).includes('{상품}')?'changed-cell':''}>{cell}</td>)}</tr>)}</tbody></table></div>
 {result.code&&<details className="optional-details"><summary>샘플 코드 보기</summary><pre className="console">{result.code}</pre></details>}
 <div className="sample-insight"><CheckCircle2 size={18}/><div><b>핵심 이해</b><p>{result.insight}</p></div></div>
 </section>;
}
