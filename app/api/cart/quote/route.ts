import {NextResponse} from 'next/server';
import {quoteCart} from '@/lib/quote';
import {z} from 'zod';
export async function POST(req:Request){try {const data=await req.json();const quote=await quoteCart(data.items);return NextResponse.json(quote,{headers:{'Cache-Control':'no-store'}});}catch(e){return NextResponse.json({error:e instanceof z.ZodError?'Некорректный состав корзины':e instanceof Error&&/^(Один из товаров|Недостаточно товара|Обнаружены повторяющиеся)/.test(e.message)?e.message:'Не удалось проверить корзину'},{status:400});}}
