import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {getAdmin,isAuthorizedWrite} from '@/lib/auth';
import {productSchema} from '@/lib/validation';
import {productInclude} from '@/lib/catalog';
import {Prisma} from '@prisma/client';
export async function GET(){if(!await getAdmin())return NextResponse.json({error:'Требуется авторизация'},{status:401});return NextResponse.json(await db.product.findMany({include:productInclude,orderBy:{createdAt:'desc'}}));}
export async function POST(req:Request){if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});const parsed=productSchema.safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Некорректные данные'},{status:400});const {images,variants,...data}=parsed.data;try{const p=await db.product.create({data:{...data,images:{create:images.map((url,sort)=>({url,sort}))},variants:{create:variants}}});return NextResponse.json(p,{status:201})}catch(e){return NextResponse.json({error:e instanceof Prisma.PrismaClientKnownRequestError&&e.code==='P2002'?'Этот URL товара уже используется':'Ошибка создания товара'},{status:409})}}
