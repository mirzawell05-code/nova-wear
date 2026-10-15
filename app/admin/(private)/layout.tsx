import {redirect} from 'next/navigation';
import {getAdmin} from '@/lib/auth';
export const dynamic='force-dynamic';
export default async function PrivateAdminLayout({children}:{children:React.ReactNode}){const user=await getAdmin();if(!user)redirect('/admin/login');return <>{children}</>}
