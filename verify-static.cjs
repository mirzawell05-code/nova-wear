const ts = require('typescript');
const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
let scanned = 0, failures = [];
function walk(dir){ for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const full=path.join(dir,entry.name);if(entry.isDirectory() && !['node_modules','.next'].includes(entry.name))walk(full);else if(entry.isFile() && /\.(tsx?|mts)$/.test(entry.name)){
  const text=fs.readFileSync(full,'utf8'); const file=ts.createSourceFile(full,text,ts.ScriptTarget.Latest,true,entry.name.endsWith('.tsx')?ts.ScriptKind.TSX:ts.ScriptKind.TS);scanned++;
  if(file.parseDiagnostics.length)failures.push(...file.parseDiagnostics.map(d=>`${full}:${file.getLineAndCharacterOfPosition(d.start||0).line+1} ${ts.flattenDiagnosticMessageText(d.messageText,' ')}`));
}}}
walk(root);
const links = [];
for(const file of ['components/header.tsx','components/footer.tsx','app/page.tsx','components/product-detail.tsx']){
  const text=fs.readFileSync(path.join(root,file),'utf8');for(const match of text.matchAll(/(?:href=|href:\s*)["'](\/[a-z][^"'?]*)["']/g)){links.push(match[1]);}
}
for(const href of [...new Set(links)]){
 const rel=href.replace(/^\//,'');if(!fs.existsSync(path.join(root,'app',rel,'page.tsx'))&&!fs.existsSync(path.join(root,'app',rel,'page.ts')) && rel!=='admin')failures.push('Missing local page for '+href);
}
console.log(`Parsed ${scanned} TypeScript/TSX files; static local links checked: ${links.length}`);
if(failures.length){console.error(failures.join('\n'));process.exitCode=1}else console.log('STATIC SYNTAX + NAVIGATION CHECK: PASS');
