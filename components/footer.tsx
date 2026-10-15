'use client';
import Link from 'next/link';
import {ArrowUpRight,Instagram,Send} from 'lucide-react';
import {useState} from 'react';
import {useShop} from './shop-provider';
import {usePathname} from 'next/navigation';
const contactEmail=process.env.NEXT_PUBLIC_CONTACT_EMAIL || '';
const instagram=process.env.NEXT_PUBLIC_INSTAGRAM_URL || '';
export default function Footer(){
 const [email,setEmail]=useState(''),[loading,setLoading]=useState(false);const {notify}=useShop();const pathname=usePathname();
 async function subscribe(e:React.FormEvent){e.preventDefault();setLoading(true);try{const r=await fetch('/api/subscribe',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email})});if(!r.ok)throw Error('Ошибка подписки');setEmail('');notify('Email сохранён. Рассылка пока не подключена.');}catch{notify('Подписка недоступна. Попробуйте позже.')}finally{setLoading(false)}}
 if(pathname.startsWith('/admin'))return null;
 return <footer className="bg-[#20201e] text-white"><div className="container-nova grid gap-12 py-16 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] md:py-24">
 <div><Link href="/" className="text-2xl font-black tracking-[-.08em]">NOVA<span className="font-light">WEAR</span></Link><p className="mt-5 max-w-[240px] text-sm leading-7 text-white/55">Одежда для тех, кто выбирает свой ритм. Создано для жизни в движении.</p></div>
 <div><h3 className="footer-title">Покупателям</h3><div className="footer-links"><Link href="/catalog">Каталог</Link><Link href="/delivery">Доставка и возврат</Link><Link href="/sizes">Размерная сетка</Link><Link href="/privacy">Конфиденциальность</Link></div></div>
 <div><h3 className="footer-title">Связаться</h3><div className="footer-links"><span>Бишкек, Кыргызстан</span>{contactEmail?<a href={`mailto:${contactEmail}`}>{contactEmail}</a>:<span>Контакты магазина появятся после настройки</span>}{instagram&&<a href={instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20}/></a>}</div></div>
 <div><h3 className="footer-title">Будь в курсе</h3><p className="mb-5 text-sm leading-6 text-white/55">Новинки и специальные предложения — только по делу.</p><form onSubmit={subscribe} className="flex border-b border-white/50 pb-3"><input required type="email" placeholder="Твой email" value={email} onChange={e=>setEmail(e.target.value)} aria-label="Email для подписки" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"/><button type="submit" disabled={loading} aria-label="Подписаться"><ArrowUpRight/></button></form></div></div>
 <div className="container-nova flex flex-col justify-between gap-3 border-t border-white/15 py-7 text-[11px] text-white/45 sm:flex-row"><span>© {new Date().getFullYear()} NOVA WEAR. All rights reserved.</span><span>Современный стиль. Без компромиссов.</span></div></footer>;
}
