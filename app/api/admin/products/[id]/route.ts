import {NextResponse} from 'next/server';
import {db} from '@/lib/db';
import {isAuthorizedWrite} from '@/lib/auth';
import {productSchema} from '@/lib/validation';
import {Prisma} from '@prisma/client';
type Context={params:Promise<{id:string}>};
export async function PUT(req:Request,{params}:Context){
 if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});
 const {id}=await params;const parsed=productSchema.safeParse(await req.json().catch(()=>null));
 if(!parsed.success)return NextResponse.json({error:parsed.error.issues[0]?.message||'Некорректные данные'},{status:400});
 const {images,variants,...data}=parsed.data;
 try{
  const product=await db.$transaction(async tx=>{
   const existing=await tx.productVariant.findMany({where:{productId:id}});
   // Remove only obsolete variants; keep IDs for unchanged size/color combinations.
   const obsolete=existing.filter(x=>!variants.some(v=>v.size===x.size&&v.color===x.color)).map(x=>x.id);
   if(obsolete.length)await tx.productVariant.deleteMany({where:{id:{in:obsolete}}});
   for(const v of variants){
    const current=existing.find(x=>x.size===v.size&&x.color===v.color);
    if(current){await tx.productVariant.update({where:{id:current.id},data:{stock:v.stock,colorHex:v.colorHex}});}
    else{await tx.productVariant.create({data:{...v,productId:id}});}
   }
   await tx.productImage.deleteMany({where:{productId:id}});
   return tx.product.update({where:{id},data:{...data,images:{create:images.map((url,sort)=>({url,sort}))}}});
  });return NextResponse.json(product);
 }catch(e){return NextResponse.json({error:e instanceof Prisma.PrismaClientKnownRequestError&&e.code==='P2002'?'Этот URL товара уже используется':'Не удалось обновить товар'},{status:409})}
}
export async function DELETE(req:Request,{params}:Context){if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});const {id}=await params;try{await db.product.delete({where:{id}});return NextResponse.json({ok:true})}catch{return NextResponse.json({error:'Не удалось удалить товар'},{status:400})}}
