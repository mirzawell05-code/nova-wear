import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {assertSameOrigin,createSession} from '@/lib/auth';
import bcrypt from 'bcryptjs';
import {z} from 'zod';
export const runtime='nodejs';
const schema=z.object({email:z.string().email().max(254),password:z.string().min(1).max(200)});
export async function POST(req:Request){
 if(!await assertSameOrigin())return NextResponse.json({error:'Неправильный источник запроса'},{status:403});
 try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Неправильный email или пароль'},{status:401});const admin=await db.admin.findUnique({where:{email:parsed.data.email.trim().toLowerCase()}});if(admin?.lockedUntil && admin.lockedUntil>new Date())return NextResponse.json({error:'Слишком много попыток. Попробуйте позже.'},{status:429});const valid=admin&&await bcrypt.compare(parsed.data.password,admin.passwordHash);if(!valid){if(admin){const count=admin.failedLogins+1;await db.admin.update({where:{id:admin.id},data:{failedLogins:count>=5?0:count,lockedUntil:count>=5?new Date(Date.now()+15*60*1000):null}});}return NextResponse.json({error:'Неправильный email или пароль'},{status:401});}await db.admin.update({where:{id:admin.id},data:{failedLogins:0,lockedUntil:null}});await createSession(admin.id);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Ошибка входа'},{status:500});}
}
