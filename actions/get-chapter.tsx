import { prismadb } from "@/lib/db";
import { Attachment, Chapter } from "prisma/prisma-client";

interface GetChapterProps {
    userId: string;
    courseId: string;
    chapterId : string
}

export const getChapter = async ({ userId, courseId, chapterId }: GetChapterProps) => {
    try {
        const purchase = await prismadb.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: userId,
                    courseId: courseId
                }
            }
        });

        const course = await prismadb.course.findUnique({
            where: {
                id: courseId,
                isPublished : true
            },
            select: {
                price :true
            }
        })

        const chapter = await prismadb.chapter.findUnique({
            where: {
                id: chapterId,
                isPublished: true
            }
        });
        
        if (!chapter || !course) {
            throw new Error("Couse or Chapter Not found")
        }

        let muxData = null;
        let attachments: Attachment[] = [];
        let nextChapter: Chapter | null = null
        
        if (purchase) {
            attachments = await prismadb.attachment.findMany({
                where: {
                    courseId : courseId
                }
            })
        }

        if (chapter.isFree || purchase) {
            muxData = await prismadb.muxData.findUnique({
                where: {
                    chapterId: chapterId
                }
            });

            nextChapter = await prismadb.chapter.findFirst({
                where: {
                    courseId : courseId,
                    isPublished: true,
                    position: {
                        gt : chapter.position 
                    }
                },
                orderBy: {
                    position : "asc"
                }
            })
        }

        const userProgress = await prismadb.userProgress.findUnique({
            where: {
                userId_chapterId: {
                    userId: userId,
                    chapterId : chapterId
                }
            }
        })
        return {
          chapter,
          course,
          muxData,
          attachments,
          nextChapter,
          userProgress,
          purchase,
        };


    } catch (error) {
        console.log("[GET_CHAPTER]", error);
        return {
          chapter: null,
          course: null,
          muxData: null,
          attachments: [],
          nextChapter: null,
          userProgress: null,
          purchase: null,
        };
    }
}