import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params } : { params : { courseId : string } }
) {
    try {
        const { title } = await req.json();
        const { userId } = auth();

        if (!title) {
            return new NextResponse("Title is required", { status : 400 })
        }
        if (!userId) {
            return new NextResponse("Unauthorized", { status : 401 })
        }
        if (!params.courseId) {
            return new NextResponse("CourseId is required", { status : 400 })
        }

        const courseOwner = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!courseOwner) {
          return new NextResponse("Unauthorized", { status: 401 });
        }

        const lastChapter = await prismadb.chapter.findFirst({
            where: {
                courseId: params.courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await prismadb.chapter.create({
            data: {
                title: title,
                courseId: params.courseId,
                position: newPosition
            }
        });

        return NextResponse.json(chapter);
        
    } catch (error) {
        return new NextResponse("internal server error", error as any)
    }
}