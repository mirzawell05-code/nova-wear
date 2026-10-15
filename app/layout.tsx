import './globals.css';
import type {Metadata} from 'next';
import {ShopProvider} from '@/components/shop-provider';
import Header from '@/components/header';
import Footer from '@/components/footer';
import MiniCart from '@/components/mini-cart';
export const metadata:Metadata={metadataBase:new URL(process.env.NEXT_PUBLIC_SITE_URL||'http://localhost:3000'),title:{default:'NOVA WEAR — Твой стиль. Твои правила.',template:'%s | NOVA WEAR'},description:'Стильная современная одежда. Новые коллекции, качественные материалы и доставка по Кыргызстану.',robots:{index:true,follow:true}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="ru"><body><ShopProvider><Header/>{children}<Footer/><MiniCart/></ShopProvider></body></html>}
