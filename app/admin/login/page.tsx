import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/auth';
import LoginForm from '@/components/admin-login';
export const metadata={title:'Вход в админ-панель',robots:{index:false,follow:false}};
export const dynamic='force-dynamic';
export default async function AdminLogin(){if(await getAdmin())redirect('/admin');return <main className="grid min-h-[85vh] place-items-center bg-cream px-5 py-20"><LoginForm/></main>}
