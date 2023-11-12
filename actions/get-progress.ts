import { prismadb } from "@/lib/db";

export const getProgress = async (userId: string, courseId: string): Promise<number> => {
    try {
        const publishedChapters = await prismadb.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true
            },
            select: {
                id: true
            }
        });

        const publishedChapterIds = publishedChapters.map((chapter) => chapter.id);

        const validCompletedChapters = await prismadb.userProgress.count({
            where: {
                userId: userId,
                chapterId: {
                    in : publishedChapterIds
                },
                isCompleted : true
            }
        })

        const progressPercentage = (validCompletedChapters / publishedChapterIds.length) * 100;
        return progressPercentage;
    } catch (error) {
        console.log(error as any)
        return 0;
    }
}