import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {isAuthorizedWrite} from '@/lib/auth';
import {categorySchema} from '@/lib/validation';
type C={params:Promise<{id:string}>};
export async function PUT(req:Request,{params}:C){if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});const p=categorySchema.safeParse(await req.json().catch(()=>null));if(!p.success)return NextResponse.json({error:'Проверьте поля категории'},{status:400});try{return NextResponse.json(await db.category.update({where:{id:(await params).id},data:p.data}))}catch{return NextResponse.json({error:'Не удалось обновить категорию'},{status:409})}}
export async function DELETE(req:Request,{params}:C){if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});try{await db.category.delete({where:{id:(await params).id}});return NextResponse.json({ok:true})}catch{return NextResponse.json({error:'Нельзя удалить категорию, пока в ней есть товары'},{status:409})}}
