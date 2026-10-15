import CheckoutPage from '@/components/checkout-page';
import {PageShell} from '@/components/page-shell';
export const metadata={title:'Оформление заказа',robots:{index:false,follow:false}};
export default function Checkout(){return <PageShell eyebrow="ПОЧТИ ГОТОВО" title="Оформление заказа."><CheckoutPage/></PageShell>}
