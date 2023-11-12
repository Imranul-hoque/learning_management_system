import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prismadb } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title } = body;
        const { userId } = auth();
        
        if (!userId || !isTeacher(userId)) {
            return new NextResponse("Unauthorized user", { status : 401 })
        }
        if (!title) {
            return new NextResponse("Title field is required", { status : 400 })
        }

        const course = await prismadb.course.create({
            data: {
                title: title,
                userId : userId
            }
        })
        
        return NextResponse.json(course);
    } catch (error) {
        return new NextResponse("internal server error", error as any)
    }
}