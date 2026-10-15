import {NextResponse} from 'next/server';
import {isAuthorizedWrite} from '@/lib/auth';
import {randomUUID} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
export const runtime='nodejs';
const allow:{[key:string]:string}={'image/jpeg':'jpg','image/png':'png','image/webp':'webp'};
export async function POST(req:Request){
 if(!await isAuthorizedWrite())return NextResponse.json({error:'Нет доступа'},{status:403});
 try{const form=await req.formData();const file=form.get('file');if(!(file instanceof File))return NextResponse.json({error:'Файл не получен'},{status:400});if(!allow[file.type]||file.size>5*1024*1024||file.size===0)return NextResponse.json({error:'Разрешены JPG, PNG, WEBP до 5 МБ'},{status:400});const buffer=Buffer.from(await file.arrayBuffer());const jpg=buffer[0]===0xff&&buffer[1]===0xd8&&buffer[2]===0xff;const png=buffer.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10]));const webp=buffer.toString('ascii',0,4)==='RIFF'&&buffer.toString('ascii',8,12)==='WEBP';if(!(file.type==='image/jpeg'&&jpg||file.type==='image/png'&&png||file.type==='image/webp'&&webp))return NextResponse.json({error:'Формат файла не соответствует содержимому'},{status:400});const name=randomUUID()+'.'+allow[file.type],folder=path.join(process.cwd(),'public','uploads');await mkdir(folder,{recursive:true});await writeFile(path.join(folder,name),buffer,{flag:'wx'});return NextResponse.json({url:'/uploads/'+name});}catch{return NextResponse.json({error:'Ошибка загрузки файла'},{status:500})}
}
