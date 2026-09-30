import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
const git='C:/Program Files/Git/cmd/git.exe',tar='C:/Windows/System32/tar.exe';
console.log('Ready for publishing JSON on stdin (input is hidden).');
let input='';for await(const data of process.stdin){input+=data;if(input.includes('\n'))break}
const {credential}=JSON.parse(input),root=process.cwd();
if(!credential?.token||credential.auth_mode!=='http_extra_header')throw Error('Unsupported source credential');
const manifest=JSON.parse(fs.readFileSync('.openai/hosting.json','utf8'));
if(!credential.remote_url.endsWith('/'+manifest.project_id+'.git'))throw Error('Project mismatch');
const env={...process.env,GIT_TERMINAL_PROMPT:'0',GIT_CONFIG_COUNT:'1',GIT_CONFIG_KEY_0:'http.extraHeader',GIT_CONFIG_VALUE_0:'Authorization: Bearer '+credential.token};
for(const k of ['GIT_TRACE','GIT_TRACE_CURL','GIT_CURL_VERBOSE'])delete env[k];
function run(bin,args,auth=false){const r=spawnSync(bin,args,{cwd:root,env:auth?env:process.env,encoding:'utf8',windowsHide:true});if(r.status!==0)throw Error((r.stderr||r.stdout||r.error?.message||'Command failed').replaceAll(credential.token,'[redacted]'));return r.stdout.trim()}
if(!fs.existsSync('.git'))run(git,['init','-b',credential.branch]);
run(git,['config','user.name','AI Builder']);run(git,['config','user.email','builder@localhost']);
const remotes=run(git,['remote']);if(!remotes.split('\n').includes('origin'))run(git,['remote','add','origin',credential.remote_url]);
if(run(git,['remote','get-url','origin'])!==credential.remote_url)throw Error('Remote mismatch');
const existing=run(git,['ls-remote','origin','refs/heads/'+credential.branch],true);
if(existing&&!fs.existsSync('.git/refs/heads/'+credential.branch)){run(git,['fetch','origin',credential.branch],true);run(git,['reset','--soft','FETCH_HEAD']);}
run(git,['add','.']);
const dirty=run(git,['status','--porcelain']);if(dirty)run(git,['commit','-m','Build 90-day interactive AI development academy']);
const sha=run(git,['rev-parse','HEAD']);run(git,['push','origin','HEAD:refs/heads/'+credential.branch],true);
const pushed=run(git,['ls-remote','origin','refs/heads/'+credential.branch],true).split(/\s/)[0];if(sha!==pushed)throw Error('Source verification failed');
run(git,['diff','--exit-code','HEAD','--','dist','.openai/hosting.json']);
const archive=path.join(root,'.sites-runtime','site.tar.gz');fs.mkdirSync(path.dirname(archive),{recursive:true});
run(tar,['-czf',archive,'.openai/hosting.json','dist']);
const files=run(tar,['-tzf',archive]);if(!files.includes('dist/index.html')||!files.includes('.openai/hosting.json'))throw Error('Archive verification failed');
console.log(JSON.stringify({project_id:manifest.project_id,commit_sha:sha,archive,files:files.split('\n').length}));
