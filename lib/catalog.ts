import {db} from '@/lib/db';
export const productInclude={images:{orderBy:{sort:'asc' as const}},variants:true,category:true};
export async function getCatalog(){return db.product.findMany({where:{isActive:true},include:productInclude,orderBy:{createdAt:'desc'}});}
export async function getCategories(){return db.category.findMany({orderBy:{order:'asc'}});}
