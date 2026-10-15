export const formatPrice = (price: number) => new Intl.NumberFormat('ru-RU').format(price) + ' сом';
export const deliveryFee = (subtotal:number, method:'COURIER'|'PICKUP') => method === 'PICKUP' || subtotal >= 5000 ? 0 : 300;
export const FREE_SHIPPING_AT = 5000;
export const slugify = (s:string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9а-яё\s-]/gi,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'');
export const img = (id:string, w=1100) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=82`;
