import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function TeacherLayout({ children }: { children: React.ReactNode }) {
    const { userId } = auth();
    if (!userId) {
        return redirect("/")
    }

    if (!isTeacher(userId)) {
        return redirect("/")
    }

    return (
        <>{children}</>
    )
}