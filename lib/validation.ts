import { z } from 'zod';
const text = (max:number) => z.string().trim().min(1).max(max);
export const orderSchema = z.object({
  firstName:text(60),lastName:text(60),phone:z.string().trim().regex(/^\+?[0-9 ()-]{9,20}$/,'Проверьте номер телефона'),city:text(80),address:text(200),comment:z.string().trim().max(500).optional().default(''),delivery:z.enum(['COURIER','PICKUP']),payment:z.literal('CASH_ON_DELIVERY'),items:z.array(z.object({variantId:z.string().min(1),quantity:z.number().int().min(1).max(20)})).min(1).max(100)
});
export const productSchema = z.object({
  name:text(150),slug:z.string().trim().regex(/^[a-z0-9-]{3,150}$/),description:text(5000),fabric:text(350),gender:z.enum(['men','women','unisex']),categoryId:z.string().min(1),price:z.number().int().min(1).max(10000000),oldPrice:z.number().int().min(1).max(10000000).nullable(),badge:z.enum(['NEW','HIT','SALE','NONE']),isActive:z.boolean(),featured:z.boolean(),popularity:z.number().int().min(0).max(10000000),images:z.array(z.string().refine(s=>s.startsWith('/uploads/')|| /^https:\/\/images\.unsplash\.com\//.test(s))).min(1).max(10),variants:z.array(z.object({size:text(20),color:text(40),colorHex:z.string().regex(/^#[0-9a-fA-F]{6}$/),stock:z.number().int().min(0).max(1000000)})).min(1).max(100)
}).refine(v=>!v.oldPrice||v.oldPrice>v.price,{message:'Старая цена должна быть выше новой',path:['oldPrice']}).refine(v=>new Set(v.variants.map(x=>x.size+'|'+x.color)).size===v.variants.length,{message:'Повторяющиеся размеры и цвета',path:['variants']});
export const categorySchema = z.object({name:text(70),slug:z.string().regex(/^[a-z0-9-]{2,80}$/),order:z.number().int().min(0).max(9999)});
