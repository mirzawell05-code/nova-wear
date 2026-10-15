'use client';
import Link from 'next/link';
import {Heart} from 'lucide-react';
import {useShop} from './shop-provider';
import type {CatalogProduct} from '@/lib/types';
import ProductCard from './product-card';
export default function FavoritesList({products}:{products:CatalogProduct[]}){const {favorites,ready}=useShop();const list=products.filter(p=>favorites.includes(p.id));if(!ready)return <div className="h-72 animate-pulse bg-cream"/>;return list.length?<div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">{list.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="flex flex-col items-center gap-4 py-20 text-center"><Heart size={44} strokeWidth={1}/><h2 className="text-2xl">Здесь пока пусто</h2><p className="max-w-sm text-sm text-stone">Сохраняйте вещи, которые вам понравились, чтобы вернуться к ним позже.</p><Link href="/catalog" className="button-dark mt-4">Открыть каталог</Link></div>}
