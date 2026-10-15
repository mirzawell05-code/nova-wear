import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {getAdmin,isAuthorizedWrite} from '@/lib/auth';
import {categorySchema} from '@/lib/validation';
export async function GET(){if(!await getAdmin())return NextResponse.json({error:'Нет доступа'},{status:401});return NextResponse.json(await db.category.findMany({orderBy:{order:'asc'},include:{_count:{select:{products:true}}}}));}
export async function POST(req:Request){if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});const p=categorySchema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({error:'Проверьте поля категории'},{status:400});try{return NextResponse.json(await db.category.create({data:p.data}),{status:201})}catch{return NextResponse.json({error:'Такой URL категории уже существует'},{status:409})}}
