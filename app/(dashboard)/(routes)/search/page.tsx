import { prismadb } from "@/lib/db";
import { auth } from "@clerk/nextjs"
import { redirect } from "next/navigation";
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { CoursesList } from "@/components/course-list";


interface SearchPageProps {
    searchParams: {
        title: string;
        categoryId: string;
    }
}

const MainSearchPage = async ({
    searchParams
}: SearchPageProps) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/")
    };

    const categories = await prismadb.category.findMany({
        orderBy: {
            name: "asc"
        }
    });

    const courses = await getCourses({ userId: userId, categoryId: searchParams.categoryId });
    

    return (
        <div>
            <div className="px-6 pt-6 md:hidden md:mb-0 block">
                <SearchInput />
            </div>
            <div className="p-5 space-y-4">
                <Categories items={categories} />
                <CoursesList items={courses} />
            </div>
        </div>
    )
}
export default MainSearchPage;

