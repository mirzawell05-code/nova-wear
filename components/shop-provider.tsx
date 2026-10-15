'use client';
import React,{createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import {Check,Info,X} from 'lucide-react';
import type {CartItem} from '@/lib/types';
type Context={cart:CartItem[];favorites:string[];ready:boolean;cartOpen:boolean;setCartOpen:(v:boolean)=>void;add:(item:CartItem)=>void;remove:(id:string)=>void;changeQty:(id:string,n:number)=>void;clear:()=>void;toggleFavorite:(id:string)=>void;notify:(message:string)=>void};
const Context=createContext<Context|null>(null);
export function ShopProvider({children}:{children:React.ReactNode}){
  const [cart,setCart]=useState<CartItem[]>([]),[favorites,setFavorites]=useState<string[]>([]),[ready,setReady]=useState(false),[cartOpen,setCartOpen]=useState(false),[toast,setToast]=useState('');
  useEffect(()=>{
    try {const a=JSON.parse(localStorage.getItem('nova.cart.v1')||'[]');if(Array.isArray(a))setCart(a.filter(i=>i&&typeof i.variantId==='string'&&Number.isInteger(i.quantity)&&i.quantity>0));}catch{}
    try {const b=JSON.parse(localStorage.getItem('nova.favs.v1')||'[]');if(Array.isArray(b))setFavorites(b.filter(i=>typeof i==='string'));}catch{}
    setReady(true);
  },[]);
  useEffect(()=>{if(ready)localStorage.setItem('nova.cart.v1',JSON.stringify(cart));},[cart,ready]);
  useEffect(()=>{if(ready)localStorage.setItem('nova.favs.v1',JSON.stringify(favorites));},[favorites,ready]);
  useEffect(()=>{if(!toast)return;const t=setTimeout(()=>setToast(''),3200);return()=>clearTimeout(t)},[toast]);
  useEffect(()=>{document.body.style.overflow=cartOpen?'hidden':'';return()=>{document.body.style.overflow=''}},[cartOpen]);
  const notify=useCallback((msg:string)=>setToast(msg),[]);
  const add=useCallback((item:CartItem)=>{setCart(prev=>{const existing=prev.find(x=>x.variantId===item.variantId);if(!existing)return [...prev,item];return prev.map(x=>x.variantId===item.variantId?{...item,quantity:Math.min(20,item.stock,x.quantity+item.quantity)}:x)});notify('Товар добавлен в корзину');},[notify]);
  const remove=useCallback((id:string)=>setCart(a=>a.filter(x=>x.variantId!==id)),[]);
  const changeQty=useCallback((id:string,n:number)=>setCart(a=>a.map(x=>x.variantId===id?{...x,quantity:Math.max(1,Math.min(20,x.stock,n))}:x)),[]);
  const clear=useCallback(()=>setCart([]),[]);
  const toggleFavorite=useCallback((id:string)=>setFavorites(a=>a.includes(id)?a.filter(x=>x!==id):[...a,id]),[]);
  const value=useMemo(()=>({cart,favorites,ready,cartOpen,setCartOpen,add,remove,changeQty,clear,toggleFavorite,notify}),[cart,favorites,ready,cartOpen,add,remove,changeQty,clear,toggleFavorite,notify]);
  return <Context.Provider value={value}>{children}{toast&&<div role="status" className="fixed bottom-6 left-1/2 z-[90] flex -translate-x-1/2 items-center gap-3 rounded bg-ink px-5 py-4 text-sm text-white shadow-2xl"><Check size={18}/>{toast}<button onClick={()=>setToast('')} aria-label="Закрыть уведомление"><X size={16}/></button></div>}</Context.Provider>;
}
export function useShop(){const ctx=useContext(Context);if(!ctx)throw new Error('Missing ShopProvider');return ctx;}
