"use client"

import NavbarRoutes from "@/components/navbar-routes";
import MobileSidebar from "./mobile-sidebar";

const Navbar = () => {
    return ( 
        <div className="px-5 h-[70px] flex items-center border-b bg-white">
            <MobileSidebar />
            <NavbarRoutes />
        </div>
     );
}
 
export default Navbar;