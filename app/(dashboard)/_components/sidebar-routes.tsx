"use client";
import { LayoutDashboard, Compass, List, BarChart } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const SidebarRoutes = () => {

    const pathname = usePathname()

    const guestRoutes = [
        {
            icon: LayoutDashboard,
            label: "Dashboard",
            href : '/'
        },
        {
            icon: Compass,
            label: "Browse",
            href : '/search'
        }
    ]

    const teacterRoutes = [
        {
            icon: List,
            label: "Courses",
            href : '/teacher/courses'
            
        },
        {
            icon: BarChart,
            label: "Analytics",
            href : "/teacher/analytics"
        }
    ]

    const isTeacher = pathname.includes('/teacher/')

    const routes = isTeacher ? teacterRoutes : guestRoutes;

    return (
        <div className="flex flex-col space-y-3 ">
            {
                routes.map((route: any) => (
                    <SidebarItem
                        key={route.href}
                        icon={route.icon}
                        href={route.href}
                        label={route.label}
                    />
                ))
            }
        </div>
    )
}

export default SidebarRoutes;