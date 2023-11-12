import { getDashboardCourses } from "@/actions/get-dashboard-courses";
import { CoursesList } from "@/components/course-list";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { InfoCard } from "./_components/info-card";
import { CheckCircle, Clock } from "lucide-react";


const DashboardPage = async () => {

  const { userId } = auth();

  if (!userId) {
    return redirect("/")
  };

  const { compleatedCourses, coursesInProgress } = await getDashboardCourses(userId);

  return (
    <div className="p-5 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCircle}
          label="Completed"
          numberOfItems={compleatedCourses.length}
          variant="success"
        />
      </div>
      <CoursesList items={[...coursesInProgress, ...compleatedCourses]} />
    </div>
  );
};

export default DashboardPage;
