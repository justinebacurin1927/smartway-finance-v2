const fs=require('node:fs');
const path=require('node:path');
function removeBreadcrumbs(){
 const dist=path.resolve(__dirname,'../dist');
 const files=directory=>fs.readdirSync(directory,{withFileTypes:true}).flatMap(entry=>entry.isDirectory()?files(path.join(directory,entry.name)):entry.name.endsWith('.html')?[path.join(directory,entry.name)]:[]);
 let changed=0;
 for(const file of files(dist)){
  const original=fs.readFileSync(file,'utf8');
  const html=original.replace(/<nav\b(?=[^>]*(?:class="[^"]*\b(?:breadcrumbs|ap-breadcrumb)\b|aria-label="Breadcrumb"))[^>]*>[\s\S]*?<\/nav>\s*/g,'');
  if(html!==original){fs.writeFileSync(file,html);changed++;}
 }
 return changed;
}
module.exports=removeBreadcrumbs;
if(require.main===module)console.log(`Removed breadcrumbs from ${removeBreadcrumbs()} pages.`);
