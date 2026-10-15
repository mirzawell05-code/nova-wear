import {PageShell} from '@/components/page-shell';
import FavoritesList from '@/components/favorites-list';
import {getCatalog} from '@/lib/catalog';
export const metadata={title:'Избранное'};
export default async function Favorites(){return <PageShell eyebrow="СОХРАНЁННОЕ" title="Твой wishlist."><FavoritesList products={await getCatalog()}/></PageShell>}
