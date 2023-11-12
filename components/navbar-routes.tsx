"use client";

import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react'
import { Button } from "./ui/button";
import SearchInput from "./search-input";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {

    const pathname = usePathname();
    const router = useRouter()
    const { userId } = useAuth();

    const isTeacherMode = pathname?.startsWith("/teacher");
    const isPlayerMode = pathname?.startsWith("/chapter");
    const isSearchPage = pathname === "/search";


    return (
        <>
            {
                isSearchPage && (
                    <div className="hidden md:block">
                        <SearchInput />
                    </div>
                )
            }
        <div className="flex items-center gap-x-3 ml-auto">
          {isTeacherMode || isPlayerMode ? (
            <Button
              variant={"ghost"}
              onClick={() => router.push("/")}
              className="flex items-center gap-x-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Exit
            </Button>
          ) : isTeacher(userId) ? (
            <div onClick={() => router.push("/teacher/courses")}>
              <Button variant={"ghost"}>Teacher Mode</Button>
            </div>
          ): null}
          <UserButton afterSignOutUrl="/" />
        </div>
      </>
    );
}

export default NavbarRoutes;