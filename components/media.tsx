import Image from 'next/image';
export default function Media({src,alt,priority=false,className='',sizes='(max-width: 640px) 50vw, 25vw'}:{src:string;alt:string;priority?:boolean;className?:string;sizes?:string}){
 return <Image src={src} alt={alt} fill priority={priority} sizes={sizes} className={`object-cover transition-transform duration-700 group-hover:scale-[1.045] ${className}`} />;
}
