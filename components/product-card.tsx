'use client';
import Link from 'next/link';
import {Heart,Plus,Check} from 'lucide-react';
import Media from './media';
import type {CatalogProduct} from '@/lib/types';
import {formatPrice} from '@/lib/utils';
import {useShop} from './shop-provider';
import {useState} from 'react';
const badges:{[key:string]:string}={NEW:'Новинка',HIT:'Хит',SALE:'Sale'};
export default function ProductCard({product:p}:{product:CatalogProduct}){
 const {favorites,toggleFavorite,add,notify}=useShop();const [size,setSize]=useState('');
 const active=p.variants.filter(v=>v.stock>0);const chosen=active.find(v=>v.size===size)||active[0];
 function quickAdd(){if(!chosen){notify('Товара нет в наличии');return;}add({variantId:chosen.id,productId:p.id,slug:p.slug,name:p.name,image:p.images[0]?.url||'',price:p.price,size:chosen.size,color:chosen.color,quantity:1,stock:chosen.stock});}
 return <article className="group min-w-0">
   <div className="relative aspect-[3/4] overflow-hidden bg-[#eeeae4]">
     <Link href={`/product/${p.slug}`} aria-label={`Подробнее: ${p.name}`} className="absolute inset-0 z-[1]"><Media src={p.images[0]?.url||'/placeholder.svg'} alt={p.name} /></Link>
     {p.badge!=='NONE'&&<span className="absolute left-3 top-3 z-[2] bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.17em]">{badges[p.badge]}</span>}
     <button onClick={()=>toggleFavorite(p.id)} aria-label={favorites.includes(p.id)?'Убрать из избранного':'Добавить в избранное'} className="absolute right-3 top-3 z-[3] flex h-9 w-9 items-center justify-center rounded-full bg-white/95 transition hover:scale-110"><Heart size={17} fill={favorites.includes(p.id)?'#1d1d1b':'none'}/></button>
     <div className="absolute bottom-0 left-0 right-0 z-[3] translate-y-full bg-white/95 p-2 transition-transform duration-300 group-hover:translate-y-0 max-md:translate-y-0 max-md:bg-white/90">
       <div className="flex items-center gap-2"><select value={size} onChange={e=>setSize(e.target.value)} aria-label={`Размер для ${p.name}`} className="min-w-0 flex-1 bg-transparent px-2 py-2 text-xs outline-none"><option value="">Размер: {chosen?.size||'Нет'}</option>{[...new Set(active.map(v=>v.size))].map(s=><option value={s} key={s}>{s}</option>)}</select><button onClick={quickAdd} disabled={!chosen} className="flex items-center gap-1 bg-ink px-3 py-2 text-[11px] text-white disabled:opacity-40"><Plus size={14}/>В корзину</button></div>
     </div>
   </div>
   <div className="pt-4"><div className="mb-1.5 text-[10px] uppercase tracking-widest text-stone">{p.category.name}</div><Link className="text-sm font-medium hover:underline" href={`/product/${p.slug}`}>{p.name}</Link><div className="mt-2 flex flex-wrap items-center gap-2 text-sm"><strong>{formatPrice(p.price)}</strong>{p.oldPrice&&<span className="text-stone line-through">{formatPrice(p.oldPrice)}</span>}</div></div>
 </article>;
}
