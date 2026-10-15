import {cookies,headers} from 'next/headers';
import {createHash,randomBytes} from 'node:crypto';
import {db} from '@/lib/db';
const SESSION_COOKIE = 'nova_admin';
const hash = (token:string) => createHash('sha256').update(token).digest('hex');
const maxAge = 60*60*24*7;
export async function createSession(adminId:string){
  const token = randomBytes(32).toString('hex');
  await db.session.create({data:{adminId,tokenHash:hash(token),expiresAt:new Date(Date.now()+maxAge*1000)}});
  (await cookies()).set(SESSION_COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==='production',sameSite:'lax',path:'/',maxAge});
}
export async function getAdmin(){
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  if(!token || !/^[0-9a-f]{64}$/.test(token)) return null;
  const session=await db.session.findUnique({where:{tokenHash:hash(token)},include:{admin:true}});
  if(!session || session.expiresAt<new Date()) return null;
  return {id:session.admin.id,email:session.admin.email};
}
export async function destroySession(){
  const token=(await cookies()).get(SESSION_COOKIE)?.value;
  if(token) await db.session.deleteMany({where:{tokenHash:hash(token)}});
  (await cookies()).delete(SESSION_COOKIE);
}
// SameSite cookies + explicit same-origin check for unsafe admin requests.
export async function assertSameOrigin(){
  const h=await headers();
  const origin=h.get('origin');
  const host=h.get('x-forwarded-host') || h.get('host');
  if(!origin || !host) return false;
  try { const parsed=new URL(origin); return (parsed.protocol==='https:'||process.env.NODE_ENV!=='production') && parsed.host===host; }catch{return false;}
}
export async function isAuthorizedWrite(){return Boolean(await getAdmin()) && await assertSameOrigin();}
