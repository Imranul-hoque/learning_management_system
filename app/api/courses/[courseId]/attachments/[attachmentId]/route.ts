import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
    req: Request,
    { params }: { params: { courseId: string; attachmentId: string; } }
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("unauthorized user", { status : 401 })
        }

        if (!params.courseId) {
            return new NextResponse("Course id is required")
        }

        if (!params.attachmentId) {
            return new NextResponse("Attachment id is required")
        }

        const courseOwner = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Unauthorized user", { status : 401 })
        }

        const deleteAttachment = await prismadb.attachment.delete({
            where: {
                id: params.attachmentId,
                courseId: params.courseId
            }
        });

        return NextResponse.json(deleteAttachment)
        
    } catch (error) {
        return new NextResponse("Internal server error", error as any)
    }
}