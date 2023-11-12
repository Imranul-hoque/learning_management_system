import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { prismadb } from "@/lib/db";

import { DataTable } from "./_components/data-table";
import { Columns } from "./_components/columns";

const CoursesPage = async () => {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }

  const courses = await prismadb.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <DataTable columns={Columns} data={courses} />
    </div>
  );
};

export default CoursesPage;
