"use client";
import Image from 'next/image';

const Logo = () => {
    return ( 
        <Image
            alt="Logo"
            src={"/logo.svg"}
            width={35}
            height={35}
        />
     );
}
 
export default Logo;