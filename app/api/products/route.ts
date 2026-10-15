import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {productInclude} from '@/lib/catalog';
export async function GET(req:Request){const url=new URL(req.url);const q=(url.searchParams.get('q')||'').trim().slice(0,80);if(!q)return NextResponse.json([]);const products=await db.product.findMany({where:{isActive:true,OR:[{name:{contains:q,mode:'insensitive'}},{category:{name:{contains:q,mode:'insensitive'}}}]},include:productInclude,take:7,orderBy:{popularity:'desc'}});return NextResponse.json(products,{headers:{'Cache-Control':'no-store'}});}
