const fs=require('fs'),path=require('path');
const dist=path.resolve(__dirname,'../dist');
const {pages}=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../references/source-site/content.json')));
const home=fs.readFileSync(path.join(dist,'index.html'),'utf8');
const footer=home.match(/<footer[\s\S]*?<\/footer>/)[0];
for(const route of Object.keys(pages)){
  const file=path.join(dist,route,'index.html');
  let html=fs.readFileSync(file,'utf8').replace(/<footer[\s\S]*?<\/footer>/,footer);
  if(route==='/about'){
    let index=0;
    const sections=['about-intro','about-mission','about-values','about-people','about-credentials','about-invitation'];
    html=html.replace(/<section class="content-section[^\"]*"/g,match=>{
      const name=sections[index++];
      return name?match.replace(/ about-(?:intro|mission|values|people|credentials|invitation)/g,'').replace(/"$/,` ${name}"`):match;
    });
    html=html.replace(/<main id="main" class="source-page" class="">/,'<main id="main" class="source-page">');
    html=html.replace(/(<section[^>]*about-invitation[\s\S]*?href=")\/contact\/("[^>]*>Apply Now)/,'$1/apply/$2');
  }
  html=html.replace(/<link rel="stylesheet" href="\/(?:closing|readability)\.css[^\"]*">/g,'');
  html=html.replace(/src="\/enhance.js(?:\?[^\"]*)?"/g,'src="/enhance.js?v=20261018-visible"');
  html=html.replace('</head>','<link rel="stylesheet" href="/closing.css?v=20261018-shared"><link rel="stylesheet" href="/readability.css?v=20261018-1"></head>');
  fs.writeFileSync(file,html);
}
console.log(`Applied shared footer and readability styles to ${Object.keys(pages).length} pages.`);
