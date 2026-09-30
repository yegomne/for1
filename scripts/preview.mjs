import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd();
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.wasm':'application/wasm','.svg':'image/svg+xml'};
http.createServer((req,res)=>{const uri=decodeURIComponent(new URL(req.url,'http://127.0.0.1').pathname);const file=uri==='/offline.html'?path.join(root,'BUILD90-교육페이지.html'):path.resolve(root,'dist','.'+(uri==='/'?'/index.html':uri));if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||fs.statSync(file).isDirectory()){res.writeHead(404);res.end('Not found');return}res.writeHead(200,{'Content-Type':types[path.extname(file)]||'application/octet-stream'});fs.createReadStream(file).pipe(res)}).listen(5174,'127.0.0.1',()=>console.log('Local: http://127.0.0.1:5174/'));
