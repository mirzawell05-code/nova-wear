import {db} from '@/lib/db';
import {z} from 'zod';
export const quoteItemsSchema=z.array(z.object({variantId:z.string().min(1),quantity:z.number().int().min(1).max(20)})).min(1).max(100);
export async function quoteCart(items:z.infer<typeof quoteItemsSchema>){
 const parsed=quoteItemsSchema.parse(items);
 const unique=new Set(parsed.map(x=>x.variantId));if(unique.size!==parsed.length)throw new Error('Обнаружены повторяющиеся позиции корзины');
 const variants=await db.productVariant.findMany({where:{id:{in:[...unique]}},include:{product:{include:{images:{orderBy:{sort:'asc'},take:1}}}}});
 const byId=new Map(variants.map(v=>[v.id,v]));
 const details=parsed.map(x=>{const v=byId.get(x.variantId);if(!v||!v.product.isActive)throw new Error('Один из товаров больше недоступен');if(v.stock<x.quantity)throw new Error(`Недостаточно товара «${v.product.name}» (${v.size}, ${v.color}). Доступно: ${v.stock}`);return {variantId:v.id,productId:v.productId,slug:v.product.slug,name:v.product.name,price:v.product.price,oldPrice:v.product.oldPrice,size:v.size,color:v.color,stock:v.stock,quantity:x.quantity,image:v.product.images[0]?.url||'/placeholder.svg'};});
 return {items:details,subtotal:details.reduce((s,i)=>s+i.price*i.quantity,0)};
}
