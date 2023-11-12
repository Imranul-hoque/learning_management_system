import { redirect } from "next/navigation";
import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { getProgress } from "@/actions/get-progress";
import { CourseNavbar } from "./_components/course-navbar";
import { CourseSidebar } from "./_components/course-sidebar";

export default async function CourseLayout(
    {
        children,
        params
    }: {
            children: React.ReactNode;
            params : { courseId : string }
    }
) {
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    }
    const courses = await prismadb.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                where: {
                    isPublished: true
                },
                include: {
                    userProgress: {
                        where: {
                            userId: userId
                        }
                    }
                },
                orderBy: {
                    position: "asc"
                }
            }
        }
    });

    if (!courses) {
        return redirect("/")
    }

    const progressCount = await getProgress(userId, courses.id);

    return (
      <div className="h-full">
        <div className="h-[80px] md:pl-80 fixed inset-y-0 w-full z-50">
          <CourseNavbar course={courses} progressCount={progressCount} />
        </div>
        <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
          <CourseSidebar course={courses} progressCount={progressCount} />
        </div>
        <main className="md:pl-80 pt-[80px] h-full">{children}</main>
      </div>
    );
}