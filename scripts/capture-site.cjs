const fs = require('node:fs');
const path = require('node:path');
const {execFile} = require('node:child_process');
const {promisify} = require('node:util');
const exec = promisify(execFile);
const html = require('/home/nami/.claude/skills/gstack/node_modules/htmlparser2');
const dom = html.DomUtils;
const root = path.resolve(__dirname, '..');
const archive = path.join(root, 'references/source-site');
fs.mkdirSync(archive, {recursive:true});
const origin = 'https://www.swfin.com.au';
const normalize = url => new URL(url, origin).pathname.replace(/\/$/, '') || '/';
const pages = {};
const failures = [];
const assets = new Map();
async function download(url, file) {
  const result = await exec('curl', ['-fsSL', '--max-time', '120', url, '-o', file], {maxBuffer:1024*1024});
  return result;
}
function text(node) { return dom.getText(node).replace(/\s+/g, ' ').trim(); }
function serialize(node) {
  if(node.type === 'text') return node.data;
  if(!node.name || ['script','style','noscript'].includes(node.name)) return null;
  const attrs = Object.fromEntries(Object.entries(node.attribs || {}).filter(([key]) => ['class','id','href','src','alt','type','name','value','placeholder','required','min','max','step','for','role','aria-label','aria-expanded','colspan'].includes(key)));
  return {tag:node.name, attrs, children:(node.children||[]).map(serialize).filter(x=>x!==null)};
}
async function capture(route) {
  const slug = route === '/' ? 'home' : route.slice(1).replaceAll('/', '__');
  const file = path.join(archive, slug+'.html');
  try {
    await download(origin+(route==='/'?'/':route),file);
    const source=fs.readFileSync(file,'utf8');
    const doc=html.parseDOM(source,{decodeEntities:true});
    const main=dom.getElementsByTagName('main',doc,true)[0];
    const footer=dom.getElementsByTagName('footer',doc,true)[0];
    const h1=dom.getElementsByTagName('h1',doc,true)[0];
    if(!main || !h1 || text(h1)==='404') throw new Error('No usable main/h1');
    const images=dom.getElementsByTagName('img',main.children,true).map(el=>{
      let src=el.attribs.src;
      if(!src) return null;
      const parsed=new URL(src,origin);
      if(parsed.pathname==='/_next/image') src=parsed.searchParams.get('url');
      const url=new URL(src,origin).href;
      const filename=path.basename(new URL(url).pathname);
      const local='/assets/site/'+filename;
      assets.set(url,local);
      return {url,local,alt:el.attribs.alt||''};
    }).filter(Boolean);
    const links=dom.getElementsByTagName('a',doc,true).map(e=>e.attribs.href).filter(Boolean);
    pages[route]={route,url:origin+route,title:text(h1),description:dom.getElementsByTagName('meta',doc,true).find(e=>e.attribs.name==='description')?.attribs.content||'',main:serialize(main),footer:footer?serialize(footer):null,text:text(main),images,links};
    console.log(route+' '+pages[route].text.length+' chars');
  } catch(error) { failures.push({route,error:error.message}); }
}
async function pool(items, task, limit=4) {
  let next=0;
  await Promise.all(Array.from({length:Math.min(limit,items.length)},async()=>{while(next<items.length) await task(items[next++]);}));
}
(async()=>{
  const sitemap=path.join(archive,'sitemap.xml');
  await download(origin+'/sitemap.xml',sitemap);
  const xml=fs.readFileSync(sitemap,'utf8');
  const routes=[...new Set([...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(m=>normalize(m[1])).concat(['/terms']))];
  await pool(routes,capture);
  const extras=[...new Set(Object.values(pages).flatMap(p=>p.links).filter(url=>url.startsWith('/')&&!url.startsWith('/_')&&!/\.[a-z]+(?:\?|$)/i.test(url)).map(normalize))].filter(route=>!routes.includes(route));
  await pool(extras,capture);
  fs.mkdirSync(path.join(root,'dist/assets/site'),{recursive:true});
  const assetFailures=[];
  await pool([...assets],async([url,local])=>{try{await download(url,path.join(root,'dist',local));}catch(e){assetFailures.push({url,error:e.message});}});
  for(const pdf of ['/privacy-disclosure.pdf','/credit-guide-and-quote.pdf']) {
    try { await download(origin+pdf,path.join(root,'dist',pdf)); } catch(e){assetFailures.push({url:origin+pdf,error:e.message});}
  }
  fs.writeFileSync(path.join(archive,'content.json'),JSON.stringify({capturedAt:new Date().toISOString(),pages,failures,assetFailures},null,2));
  console.log(JSON.stringify({pages:Object.keys(pages).length,images:assets.size,failures,assetFailures}));
})();
