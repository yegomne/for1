import fs from 'node:fs';
import path from 'node:path';
const root=process.cwd(),dist=path.join(root,'dist');
let html=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const script=html.match(/<script[^>]+src="([^"]+)"[^>]*><\/script>/);
const css=html.match(/<link[^>]+href="([^"]+\.css)"[^>]*>/);
if(!script||!css)throw new Error('Built assets missing');
const asset=p=>fs.readFileSync(path.join(dist,p.replace(/^\//,'')),'utf8');
let js=asset(script[1]);
for(const file of fs.readdirSync(path.join(dist,'assets')).filter(x=>x.endsWith('.wasm'))){
 const data='data:application/wasm;base64,'+fs.readFileSync(path.join(dist,'assets',file)).toString('base64');
 js=js.split('/assets/'+file).join(data);
}
html=html.replace(script[0],()=>'<script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'</script>');
html=html.replace(css[0],()=>'<style>'+asset(css[1])+'</style>');
const favicon='data:image/svg+xml,'+encodeURIComponent(fs.readFileSync(path.join(dist,'favicon.svg'),'utf8'));
html=html.replace('/favicon.svg',favicon);
const output=path.join(root,'BUILD90-교육페이지.html');
fs.writeFileSync(output,html);
console.log(JSON.stringify({output,bytes:fs.statSync(output).size}));
