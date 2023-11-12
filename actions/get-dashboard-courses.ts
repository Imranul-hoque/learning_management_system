import { prismadb } from "@/lib/db";
import { Category, Chapter, Course } from "prisma/prisma-client";
import { getProgress } from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: Chapter[];
    progress: number | null;
}

type DashboardCourses = {
    compleatedCourses: CourseWithProgressWithCategory[];
    coursesInProgress : CourseWithProgressWithCategory[]
}


export const getDashboardCourses = async (userId: string): Promise<DashboardCourses> => {
    try {
        const purchasedCourses = await prismadb.purchase.findMany({
            where: {
                userId: userId
            },
            select: {
                course: {
                    include: {
                        category: true,
                        chapters: {
                            where: {
                                isPublished: true
                            }
                        }
                    }
                }
            }
        });

        const courses = purchasedCourses.map((purchase) => purchase.course) as CourseWithProgressWithCategory[];

        for (let course of courses) {
            const progress = await getProgress(userId, course.id);
            course["progress"] = progress
        }

        const compleatedCourses = courses.filter(
          (course) => course.progress === 100
        );
        const coursesInProgress = courses.filter(
          (course) => (course.progress ?? 0) < 100
        );

        return {
            compleatedCourses,
            coursesInProgress
        }

    } catch (error) {
        console.log("DASHBOARD COURSE",error as any)
        return {
            compleatedCourses: [],
            coursesInProgress : []
        }
        
    }
}
