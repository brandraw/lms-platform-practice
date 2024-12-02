import { db } from "@/lib/db";
import { Course, Purchase } from "@prisma/client";

type PurchasesWithCourse = Purchase & {
  course: Course;
};

function groupByCourse(purchases: PurchasesWithCourse[]) {
  const group: { [courseTitle: string]: number } = {};

  purchases.forEach((purchase) => {
    const courseTitle = purchase.course.title;
    if (!group[courseTitle]) {
      group[courseTitle] = 0;
    }
    group[courseTitle] += purchase.course.price || 0;
  });

  return group;
}

export async function getAnalytics() {
  try {
    const purchases = await db.purchase.findMany({
      include: {
        course: true,
      },
    });

    const groupedRevenue = groupByCourse(purchases);

    const data = Object.entries(groupedRevenue).map(([courseTitle, total]) => ({
      name: courseTitle,
      total,
    }));

    const totalRevenue = data.reduce((acc, curr) => acc + curr.total, 0);
    const totalSales = purchases.length;

    return {
      data,
      totalRevenue,
      totalSales,
    };
  } catch (error) {
    console.log("[GET_ANALYTICS]", error);
    return {
      data: [],
      totalRevenue: 0,
      totalSales: 0,
    };
  }
}
