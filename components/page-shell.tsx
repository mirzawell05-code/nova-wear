import React from 'react';
export function PageShell({eyebrow,title,children}:{eyebrow?:string,title:string,children:React.ReactNode}){return <main className="container-nova min-h-[55vh] py-12 md:py-20">{eyebrow&&<p className="eyebrow mb-4">{eyebrow}</p>}<h1 className="mb-10 text-4xl font-medium tracking-editorial md:text-6xl">{title}</h1>{children}</main>}
