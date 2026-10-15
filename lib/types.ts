import type {Prisma} from '@prisma/client';
import type {productInclude} from '@/lib/catalog';
export type CatalogProduct=Prisma.ProductGetPayload<{include:typeof productInclude}>;
export type CartItem={variantId:string;productId:string;slug:string;name:string;image:string;price:number;size:string;color:string;quantity:number;stock:number};
