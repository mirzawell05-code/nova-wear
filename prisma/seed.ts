import 'dotenv/config';
import {PrismaClient,ProductBadge} from '@prisma/client';
import bcrypt from 'bcryptjs';
const prisma=new PrismaClient();
const photo=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1100&q=82`;
const categories=[['Футболки','futbolki'],['Худи и свитшоты','hudi'],['Брюки и джинсы','bryuki'],['Куртки','kurtki'],['Рубашки','rubashki'],['Обувь и аксессуары','aksessuary']] as const;
type SeedProduct = {name:string;slug:string;cat:number;price:number;oldPrice?:number;badge?:ProductBadge;gender?:string;images:string[];description:string;fabric:string;colors?:[string,string][];sizes?:string[];featured?:boolean};
const catalog:SeedProduct[]=[
  {name:'Футболка Essential Heavyweight',slug:'essential-heavyweight',cat:0,price:1890,badge:'HIT',gender:'unisex',images:['photo-1503341455253-b2e723bb3dbb','photo-1576566588028-4147f3842f27'],description:'Базовая футболка свободного кроя с плотной посадкой и мягкой текстурой. Основа капсульного гардероба.',fabric:'100% хлопок, 240 г/м²',colors:[['Молочный','#EEE9DF'],['Чёрный','#242424']]},
  {name:'Футболка Studio Boxy',slug:'studio-boxy',cat:0,price:1690,badge:'NEW',gender:'women',images:['photo-1529139574466-a303027c1d8b','photo-1483985988355-763728e1935b'],description:'Укороченный современный силуэт и минималистичная отделка для ежедневных сочетаний.',fabric:'95% хлопок, 5% эластан',colors:[['Белый','#F4F4F1'],['Графит','#575653']]},
  {name:'Футболка Daily Relaxed',slug:'daily-relaxed',cat:0,price:1490,gender:'men',images:['photo-1583743814966-8936f5b7be1a','photo-1503341455253-b2e723bb3dbb'],description:'Универсальная футболка свободного силуэта на каждый день.',fabric:'100% хлопок',colors:[['Чёрный','#222222'],['Белый','#F7F7F5']]},
  {name:'Худи Oversized Form',slug:'oversized-form',cat:1,price:4290,badge:'HIT',gender:'unisex',images:['photo-1556821840-3a63f95609a7','photo-1578681994506-b8f463449011'],description:'Объёмный капюшон, мягкий футер и продуманный крой. Для прохладных дней и уютных вечеров.',fabric:'80% хлопок, 20% полиэстер, футер с начёсом',colors:[['Песочный','#CEBCA7'],['Чёрный','#272727']]},
  {name:'Свитшот Core Crew',slug:'core-crew',cat:1,price:3490,badge:'NEW',gender:'men',images:['photo-1578681994506-b8f463449011','photo-1556821840-3a63f95609a7'],description:'Свитшот с аккуратной горловиной и мягким внутренним слоем, без лишних деталей.',fabric:'85% хлопок, 15% полиэстер',colors:[['Серый','#A9AAA8'],['Бежевый','#D4C4B4']]},
  {name:'Худи City Layers',slug:'city-layers',cat:1,price:3990,oldPrice:4990,badge:'SALE',gender:'women',images:['photo-1556821840-3a63f95609a7','photo-1529139574466-a303027c1d8b'],description:'Мягкое худи для многослойных образов. Сочетается с джинсами и широкими брюками.',fabric:'70% хлопок, 30% полиэстер',colors:[['Кремовый','#E6E0D4'],['Чёрный','#232323']]},
  {name:'Джинсы Wide Leg',slug:'wide-leg-denim',cat:2,price:4590,badge:'HIT',gender:'women',images:['photo-1541099649105-f69ad21f3246','photo-1598032895397-b9472444bf93'],description:'Свободные джинсы с высокой посадкой, чистой линией и комфортным объёмом.',fabric:'100% хлопковый деним',colors:[['Синий','#55738C'],['Графит','#595D62']]},
  {name:'Брюки Tailored Relaxed',slug:'tailored-relaxed',cat:2,price:3990,badge:'NEW',gender:'men',images:['photo-1598032895397-b9472444bf93','photo-1542272604-787c3835535d'],description:'Расслабленные брюки с архитектурными складками — баланс строгости и повседневности.',fabric:'65% полиэстер, 33% вискоза, 2% эластан',colors:[['Песочный','#B7A38B'],['Чёрный','#1F1F1F']]},
  {name:'Джинсы Straight Everyday',slug:'straight-everyday',cat:2,price:3690,oldPrice:4390,badge:'SALE',gender:'unisex',images:['photo-1542272604-787c3835535d','photo-1541099649105-f69ad21f3246'],description:'Прямой крой и плотный качественный деним, который хорошо держит форму.',fabric:'98% хлопок, 2% эластан',colors:[['Индиго','#384A69'],['Чёрный','#272727']]},
  {name:'Куртка Urban Shell',slug:'urban-shell',cat:3,price:7990,badge:'NEW',gender:'men',images:['photo-1591047139829-d91aecb6caea','photo-1539109136881-3be0616acf4b'],description:'Лаконичная верхняя одежда с продуманными карманами и защитой от ветра.',fabric:'100% полиэстер, подкладка из вискозы',colors:[['Хаки','#777969'],['Чёрный','#292929']]},
  {name:'Куртка Minimal Bomber',slug:'minimal-bomber',cat:3,price:6890,badge:'HIT',gender:'unisex',images:['photo-1539109136881-3be0616acf4b','photo-1591047139829-d91aecb6caea'],description:'Современный бомбер со спущенной линией плеча и регулируемым низом.',fabric:'90% полиэстер, 10% нейлон',colors:[['Чёрный','#232323'],['Кофейный','#867360']]},
  {name:'Тренч Soft Structure',slug:'soft-structure',cat:3,price:9990,gender:'women',images:['photo-1483985988355-763728e1935b','photo-1515886657613-9f3515b0c78f'],description:'Лёгкий тренч с поясом и свободным силуэтом для городских образов.',fabric:'100% хлопок, водоотталкивающая пропитка',colors:[['Бежевый','#CFC0AA']]},
  {name:'Рубашка Oxford Modern',slug:'oxford-modern',cat:4,price:3290,badge:'NEW',gender:'men',images:['photo-1596755094514-f87e34085b2c','photo-1603252109303-2751441dd157'],description:'Плотная хлопковая рубашка со свободной посадкой и аккуратным воротником.',fabric:'100% хлопок Oxford',colors:[['Белый','#F6F5EF'],['Голубой','#B9C9D3']]},
  {name:'Рубашка Linen Air',slug:'linen-air',cat:4,price:3590,badge:'HIT',gender:'women',images:['photo-1603252109303-2751441dd157','photo-1596755094514-f87e34085b2c'],description:'Дышащая рубашка из натурального льна с мягким воротником и свободными рукавами.',fabric:'55% лён, 45% хлопок',colors:[['Молочный','#F1EBDD'],['Песочный','#CDB99F']]},
  {name:'Рубашка Everyday Stripe',slug:'everyday-stripe',cat:4,price:2990,oldPrice:3790,badge:'SALE',gender:'unisex',images:['photo-1596755094514-f87e34085b2c','photo-1603252109303-2751441dd157'],description:'Классическая рубашка с тонкой полоской — для многослойных сочетаний.',fabric:'100% хлопок',colors:[['Голубой','#8CAFC4']]},
  {name:'Кеды Off-Duty',slug:'off-duty-sneakers',cat:5,price:5290,badge:'HIT',gender:'unisex',images:['photo-1525966222134-fcfa99b8ae77','photo-1549298916-b41d501d3772'],description:'Удобные повседневные кеды с лаконичным силуэтом и мягкой стелькой.',fabric:'Верх: текстиль и экокожа; подошва: резина',colors:[['Кремовый','#EFEDE6'],['Чёрный','#292929']],sizes:['36','37','38','39','40','41','42','43','44']},
  {name:'Кроссовки Mono Runner',slug:'mono-runner',cat:5,price:6490,badge:'NEW',gender:'unisex',images:['photo-1549298916-b41d501d3772','photo-1525966222134-fcfa99b8ae77'],description:'Лёгкие городские кроссовки с амортизирующей подошвой.',fabric:'Верх: текстиль, сетка; подошва: EVA',colors:[['Белый','#EFEDE7'],['Графит','#4A4A49']],sizes:['36','37','38','39','40','41','42','43','44']},
  {name:'Сумка Daily Carry',slug:'daily-carry-bag',cat:5,price:2490,gender:'women',images:['photo-1548036328-c9fa89d128fa','photo-1535632066927-ab7c9ab60908'],description:'Компактная сумка для ежедневных вещей с регулируемым ремнём.',fabric:'Экокожа, текстильная подкладка',colors:[['Чёрный','#262626'],['Бежевый','#C4AA8F']],sizes:['ONE SIZE']},
];
async function main(){
  if(!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.includes('REPLACE_') || process.env.ADMIN_PASSWORD.length<16) throw new Error('Set a unique ADMIN_EMAIL and ADMIN_PASSWORD (16+ chars) in .env before seeding.');
  const adminEmail=process.env.ADMIN_EMAIL.toLowerCase().trim();
  await prisma.admin.upsert({where:{email:adminEmail},update:{passwordHash:await bcrypt.hash(process.env.ADMIN_PASSWORD,12)},create:{email:adminEmail,passwordHash:await bcrypt.hash(process.env.ADMIN_PASSWORD,12)}});
  const ids=[];
  for(let i=0;i<categories.length;i++) {
    const [name,slug]=categories[i];
    const c=await prisma.category.upsert({where:{slug},update:{name,order:i},create:{name,slug,order:i}});
    ids.push(c.id);
  }
  for(let i=0;i<catalog.length;i++){
    const p=catalog[i];
    const sizes=p.sizes||['XS','S','M','L','XL'];
    const colors=p.colors||[['Чёрный','#202020']];
    await prisma.product.upsert({where:{slug:p.slug},update:{},create:{name:p.name,slug:p.slug,categoryId:ids[p.cat],description:p.description,fabric:p.fabric,gender:p.gender||'unisex',price:p.price,oldPrice:p.oldPrice,badge:p.badge||'NONE',featured:p.featured??i<9,popularity:100-i*4,images:{create:p.images.map((id,k)=>({url:photo(id),sort:k}))},variants:{create:colors.flatMap(([color,colorHex])=>sizes.map((size,k)=>({size,color,colorHex,stock:8+(i+k)%14})))}}});
  }
  console.log(`Seed completed: ${catalog.length} products, ${categories.length} categories, admin ${adminEmail}`);
}
main().catch(e=>{console.error(e);process.exitCode=1}).finally(()=>prisma.$disconnect());
