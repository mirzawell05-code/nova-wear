import {notFound} from 'next/navigation';
import type {Metadata} from 'next';
import ProductDetail from '@/components/product-detail';
import {db} from '@/lib/db';
import {productInclude} from '@/lib/catalog';
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const p=await db.product.findUnique({where:{slug}});return {title:p?.name||'Товар не найден',description:p?.description||''};}
export default async function ProductPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const p=await db.product.findUnique({where:{slug,isActive:true},include:productInclude});if(!p)notFound();const similar=await db.product.findMany({where:{isActive:true,categoryId:p.categoryId,id:{not:p.id}},include:productInclude,take:4});return <ProductDetail p={p} similar={similar}/>}
