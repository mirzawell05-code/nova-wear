// Run against a started Next.js server after database migration + seed: npm run smoke
const host=process.env.SMOKE_BASE_URL||'http://localhost:3000';
const checks=[
  ['Home page', '/', 200],
  ['Product catalog', '/catalog', 200],
  ['Cart', '/cart', 200],
  ['Checkout', '/checkout', 200],
  ['Login page', '/admin/login', 200],
  ['Unauthorized admin orders API', '/api/admin/orders', 401],
  ['Product search API', '/api/products?q=%D1%85%D1%83%D0%B4%D0%B8', 200]
];
let fails=0;
for(const [label,url,expected] of checks){
 try{const r=await fetch(host+url,{redirect:'manual'});const okay=r.status===expected;console.log(`${okay?'PASS':'FAIL'} ${label}: ${r.status} (expected ${expected})`);if(!okay)fails++;}catch(e){console.log(`FAIL ${label}: ${e.message}`);fails++;}
}
try{
 const r=await fetch(host+'/api/cart/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:[]})});
 const ok=r.status===400;console.log(`${ok?'PASS':'FAIL'} Rejects empty cart: ${r.status}`);if(!ok)fails++;
}catch(e){console.log('FAIL Quote API: '+e.message);fails++;}
if(fails){console.error(`${fails} failed check(s).`);process.exitCode=1;}else console.log('HTTP SMOKE TESTS PASSED');
