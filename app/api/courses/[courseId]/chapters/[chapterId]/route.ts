import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import  Mux  from "@mux/mux-node";


const { Video } = new Mux(
    process.env.MUX_TOKEN_ID!,
    process.env.MUX_TOKEN_SECRET!
)

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; chapterId : string } }
) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("unauthorized user", { status : 401 })
        }

        const courseOwn = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        })

        if (!courseOwn) {
          return new NextResponse("unauthorized user", { status: 401 });
        }

        const chapter = await prismadb.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        if (!chapter) {
          return new NextResponse("Not found", { status: 404 });
        }

        if (chapter.videoUrl) {
            const existingMuxData = await prismadb.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId);
                await prismadb.muxData.delete({
                    where: {
                        id : existingMuxData.id
                    }
                })
            }
        }

        const deletedChapter = await prismadb.chapter.delete({
            where: {
                id : params.chapterId
            }
        })

        const publishedChaptersInCourse = await prismadb.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPublished: true
            }
        });

        if (!publishedChaptersInCourse.length) {
             await prismadb.course.update({
               where: {
                 id: params.courseId,
               },
               data: {
                 isPublished: false,
               },
             });
        }

        return NextResponse.json(deletedChapter);
        
    } catch (error) {
        return new NextResponse("internal server error", {status : 500})
    }
}


export async function PATCH(
    req : Request,
    { params }: { params: { courseId: string; chapterId: string; } }
) {
    try {
        const { userId } = auth();

        const { isPublished, ...values } = await req.json();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status : 401 })
        }

        const courseOwn = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!courseOwn) {
          return new NextResponse("Unauthorized user", { status: 401 });
        }

        const updateChapter = await prismadb.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                ...values
            }
        });

        if (values.videoUrl) {
            const existingMuxData = await prismadb.muxData.findFirst({
                where: {
                    chapterId: params.chapterId
                }
            });

            if (existingMuxData) {
                await Video.Assets.del(existingMuxData.assetId)
                await prismadb.muxData.delete({
                    where: {
                       id : existingMuxData.id
                    }
                })
            }

            const asset = await Video.Assets.create({
                input: values.videoUrl,
                playback_policy: "public",
                test : false
            })

            await prismadb.muxData.create({
                data: {
                    assetId: asset.id,
                    chapterId: params.chapterId,
                    playbackId : asset.playback_ids?.[0]?.id
                }
            })
        }

        return NextResponse.json(updateChapter)

    } catch (error: any) {
        return new NextResponse("internal server error", { status : 500 })
    }
}