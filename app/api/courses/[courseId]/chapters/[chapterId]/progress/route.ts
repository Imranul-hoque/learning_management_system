import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prismadb } from "@/lib/db";

export async function PUT(
    req: Request,
    { params }: { params: { courseId: string; chapterId : string } } 
)
{
    try {
        const { userId } = auth();
        const { isCompleted } = await req.json();
        if (!userId) {
            return new NextResponse("unauthorized user", { status : 401 })
        }

        if (!isCompleted) {
            return new NextResponse("All fields are required", { status : 404 })
        }

        const userProgress = await prismadb.userProgress.upsert({
            where: {
                userId_chapterId: {
                    userId,
                    chapterId: params.chapterId
                }
            },
            update: {
                isCompleted: isCompleted
            },
            create: {
                userId,
                chapterId: params.chapterId,
                isCompleted: isCompleted
            }
        });
        return NextResponse.json(userProgress)
    } catch (error) {
        return new NextResponse("internal server error", { status : 500 })
    }

    }