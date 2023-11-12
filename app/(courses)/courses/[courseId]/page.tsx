import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

interface CourseIdPageProps {
    params: {
        courseId: string;
    }
}

const CourseIdPage: FC<CourseIdPageProps> = async ({ params }) => {
    
    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    };
    const course = await prismadb.course.findUnique({
        where: {
            userId,
            id : params.courseId
        },
        include: {
            chapters: {
                where: {
                  isPublished : true  
                },
                orderBy: {
                    position : 'asc'
                }
            }
        }
    })

    if (!course) {
      return redirect("/");
    }

    return redirect(`/courses/${course.id}/chapters/${course.chapters[0].id}`);

}

export default CourseIdPage
