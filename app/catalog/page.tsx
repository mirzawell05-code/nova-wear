import {Suspense} from 'react';
import CatalogBrowser from '@/components/catalog-browser';
import {getCatalog,getCategories} from '@/lib/catalog';
import {PageShell} from '@/components/page-shell';
export const metadata={title:'Каталог одежды'};
export default async function Catalog(){const [products,categories]=await Promise.all([getCatalog(),getCategories()]);return <PageShell eyebrow="NOVA WEAR / ОДЕЖДА" title="Все вещи. Твой выбор."><Suspense fallback={<div className="min-h-96 animate-pulse bg-cream"/>}><CatalogBrowser products={products} categories={categories}/></Suspense></PageShell>}
