import {NextResponse} from 'next/server';
import {assertSameOrigin,destroySession} from '@/lib/auth';
export async function POST(){if(!await assertSameOrigin())return NextResponse.json({error:'Forbidden'},{status:403});await destroySession();return NextResponse.json({ok:true});}
