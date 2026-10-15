import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {getAdmin} from '@/lib/auth';
export async function GET(){if(!await getAdmin())return NextResponse.json({error:'Нет доступа'},{status:401});const orders=await db.order.findMany({include:{items:true},orderBy:{createdAt:'desc'},take:300});return NextResponse.json(orders,{headers:{'Cache-Control':'no-store'}})}
