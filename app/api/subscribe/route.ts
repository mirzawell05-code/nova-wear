import {NextResponse} from 'next/server';
import {z} from 'zod';
import {db} from '@/lib/db';
const schema=z.object({email:z.string().trim().email().max(254)});
export async function POST(req:Request){try{const parsed=schema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:'Некорректный email'},{status:400});await db.subscriber.upsert({where:{email:parsed.data.email.toLowerCase()},update:{},create:{email:parsed.data.email.toLowerCase()}});return NextResponse.json({ok:true});}catch{return NextResponse.json({error:'Ошибка подписки'},{status:500})}}
