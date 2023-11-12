import { prismadb } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request, { params }:
        { params: { courseId: string } })
{
    try {
        const body = await req.json();
        const { userId } = auth();
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized user", { status : 401 })
        }

        const updateCourse = await prismadb.course.update({
            where: {
                id: params.courseId,
                userId: userId
            }, data: {
                ...body
            }
        });

        return NextResponse.json(updateCourse)
    } catch (error) {
        return new NextResponse("internal server error", error as any)
    }
}