"use client";

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'
import Sidebar from './sidebar';

const MobileSidebar = () => {
    return ( 
        <Sheet>
            <SheetTrigger>
                <Menu className='md:hidden' />
            </SheetTrigger>
            <SheetContent side={"left"} className='p-0 bg-white'>
                <Sidebar />
            </SheetContent>
        </Sheet>
     );
}
 
export default MobileSidebar;