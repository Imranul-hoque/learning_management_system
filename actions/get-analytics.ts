import { prismadb } from "@/lib/db";
import { Course, Purchase } from "prisma/prisma-client";

type PurchaseWithCourse = Purchase & {
    course : Course
}

const groupByCourse = (purchases: PurchaseWithCourse[]) => {
    const grouped: { [courseTitle: string]: number } = {};

    purchases.forEach((purchase) => {
        const courseTitle = purchase.course.title;

        if (!grouped[courseTitle]) {
            grouped[courseTitle] = 0
        }
        grouped[courseTitle] += purchase.course.price!
    })

    return grouped;
}

export const getAnalytics = async (userId: string) => {
    try {
        const purchases = await prismadb.purchase.findMany({
            where: {
                course: {
                    userId: userId
                }
            },
            include: {
                course: true
            }
        });

        const totalEarning = groupByCourse(purchases);

        const data = Object.entries(totalEarning).map(([courseTitle, total]) => ({
            name: courseTitle,
            total: total
        }));

        const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
        const totalSales = purchases.length;

        return {
            data,
            totalRevenue,
            totalSales
        }

    } catch (error) {
        console.log("ANALYTICS", error as any)
        return {
          data: [],
          totalRevenue: 0,
          totalSales : 0
        };
    }
}