import NavbarRoutes from "@/components/navbar-routes";
import { Chapter, Course, UserProgress } from "prisma/prisma-client";
import { FC } from "react";
import { CourseMobileSidebar } from "./course-mobile-sidebar";

interface CourseNavbarProps {
    course: Course & {
        chapters: (Chapter & {
            userProgress : UserProgress[] | null
        })[]
    },
    progressCount : number
}

export const CourseNavbar: FC<CourseNavbarProps> = ({ course, progressCount }) => {
    return (
      <div className="p-4 border-b h-full flex items-center bg-white shadow-sm">
        <CourseMobileSidebar course={course} progressCount={progressCount} />
        <NavbarRoutes />
      </div>
    );
}