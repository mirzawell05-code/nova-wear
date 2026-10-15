import {PageShell} from '@/components/page-shell';
import CartPage from '@/components/cart-page';
export const metadata={title:'Корзина'};
export default function Cart(){return <PageShell eyebrow="ВАШ ВЫБОР" title="Корзина."><CartPage/></PageShell>}
