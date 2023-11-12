import { LucideIcon } from 'lucide-react';
import { FC } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
    icon: LucideIcon,
    href: string;
    label: string;
}

const SidebarItem: FC<SidebarItemProps> = ({ 
    icon : Icon,
    href,
    label
}) => {
    
    const pathname = usePathname();

    const active = (
        pathname === '/' && href === '/'
    ) || pathname === href ||
    pathname.includes(`${href}/`)

    return (
      <Link href={href}
        className={cn(
          "relative flex hover:cursor-pointer hover:bg-slate-300/20 items-center gap-x-3 p-3 w-full",
          active && "bg-sky-200/20"
        )}
      >
        <Icon size={22} className={cn(active && "text-sky-700")} />
        <p className={cn(active && "text-sky-700")}>{label}</p>
        <div className={cn("w-1 absolute  h-full bg-sky-700 right-0 opacity-0", active && "opacity-100" )} />
      </Link>
    );
}
 
export default SidebarItem;