import { prismadb } from "@/lib/db";
import { getProgress } from "./get-progress";
import { Category, Course } from "prisma/prisma-client";


type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
}

type getCourses = {
    userId: string;
    categoryId : string
}

export const getCourses = async ({
    userId,
    categoryId
}: getCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await prismadb.course.findMany({
            where: {
                isPublished : true,
                categoryId: categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPublished: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId: userId
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const coursesWithProgress: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async (course) => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress : null
                    };
                }
                const progressPercentage = await getProgress(userId, course.id);
                return {
                    ...course,
                    progress : progressPercentage
                }
            })
        )
        
        return coursesWithProgress;
        
    } catch (error) {
        console.log(error as any)
        return []
    }
}