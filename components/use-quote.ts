'use client';
import {useEffect,useState} from 'react';
import {useShop} from './shop-provider';
import type {CartItem} from '@/lib/types';
export function useQuote(){const {cart,ready}=useShop();const [quoted,setQuoted]=useState<{items:CartItem[];subtotal:number}|null>(null),[error,setError]=useState(''),[loading,setLoading]=useState(true);
 useEffect(()=>{if(!ready){return;}if(cart.length===0){setQuoted(null);setLoading(false);setError('');return;}const controller=new AbortController();setLoading(true);fetch('/api/cart/quote',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({items:cart.map(x=>({variantId:x.variantId,quantity:x.quantity}))}),signal:controller.signal}).then(async r=>{const d=await r.json();if(!r.ok)throw Error(d.error||'Не удалось проверить корзину');setQuoted(d);setError('')}).catch(e=>{if(!controller.signal.aborted){setError(e.message);setQuoted(null)}}).finally(()=>{if(!controller.signal.aborted)setLoading(false)});return()=>controller.abort();},[cart,ready]);return {quoted,error,loading};}
