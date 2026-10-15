import {NextResponse} from 'next/server';
import {Prisma} from '@prisma/client';
import {randomBytes} from 'node:crypto';
import {db} from '@/lib/db';
import {orderSchema} from '@/lib/validation';
import {quoteCart} from '@/lib/quote';
import {deliveryFee} from '@/lib/utils';
export const runtime='nodejs';
export async function POST(req:Request){
 try{
  const contentLength=Number(req.headers.get('content-length')||0);if(contentLength>40000)return NextResponse.json({error:'Слишком большой запрос'},{status:413});
  const parsed=orderSchema.safeParse(await req.json());if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Некорректные данные заказа'},{status:400});const v=parsed.data;
  // Quote is informational only. All prices and stocks are read AGAIN inside transaction.
  await quoteCart(v.items);
  const number='NW-'+new Date().toISOString().slice(0,10).replace(/-/g,'')+'-'+randomBytes(4).toString('hex').toUpperCase();
  const order=await db.$transaction(async tx=>{
   const ids=v.items.map(x=>x.variantId);
   const variants=await tx.productVariant.findMany({where:{id:{in:ids}},include:{product:{include:{images:{orderBy:{sort:'asc'},take:1}}}}});
   if(new Set(ids).size!==ids.length||variants.length!==ids.length)throw new Error('Состав корзины изменился. Обновите корзину.');
   const map=new Map(variants.map(x=>[x.id,x]));
   const lines=[];
   for(const item of v.items){
    const option=map.get(item.variantId);
    if(!option || !option.product.isActive)throw new Error('Товар больше недоступен');
    const updated=await tx.productVariant.updateMany({where:{id:item.variantId,stock:{gte:item.quantity}},data:{stock:{decrement:item.quantity}}});
    if(updated.count!==1)throw new Error(`Недостаточно товара «${option.product.name}». Обновите корзину.`);
    lines.push({productId:option.product.id,variantId:option.id,name:option.product.name,size:option.size,color:option.color,image:option.product.images[0]?.url||'/placeholder.svg',unitPrice:option.product.price,quantity:item.quantity,lineTotal:option.product.price*item.quantity});
   }
   const subtotal=lines.reduce((s,x)=>s+x.lineTotal,0);const fee=deliveryFee(subtotal,v.delivery);
   return tx.order.create({data:{number,firstName:v.firstName,lastName:v.lastName,phone:v.phone,city:v.city,address:v.address,comment:v.comment,delivery:v.delivery,payment:v.payment,subtotal,deliveryFee:fee,total:subtotal+fee,items:{create:lines}}});
  },{isolationLevel:Prisma.TransactionIsolationLevel.Serializable,maxWait:5000,timeout:15000});
  return NextResponse.json({number:order.number},{status:201,headers:{'Cache-Control':'no-store'}});
 }catch(e){if(e instanceof Prisma.PrismaClientKnownRequestError && e.code==='P2034')return NextResponse.json({error:'Заказ одновременно обновился. Попробуйте ещё раз.'},{status:409});return NextResponse.json({error:e instanceof Error&&/^(Один из товаров|Недостаточно товара|Состав корзины|Товар больше недоступен|Обнаружены повторяющиеся)/.test(e.message)?e.message:'Не удалось оформить заказ. Попробуйте позже.'},{status:409});}
}
