import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { prismadb } from "@/lib/db";


export async function POST(
    req: Request,
    { params }: { params : { courseId : string } }
) {

    try {
        const { userId } = auth();
        const { url } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized user", { status  : 401})
        }

        if (!url){
            return new NextResponse("all fields are required", { status : 400})
        }

        const coursOwner = await prismadb.course.findUnique({
            where: {
                id: params.courseId,
                userId
            }
        });

        if (!coursOwner) {
            return new NextResponse("You are not creator of this course", { status : 400 })
        }


        const attachment = await prismadb.attachment.create({
            data: {
                url,
                name: url.split('/').pop(),
                courseId: params.courseId,
            }
        });

        return NextResponse.json(attachment);
        
    } catch (error) {
        return new NextResponse("internal server error", error as any)
    }
    
}