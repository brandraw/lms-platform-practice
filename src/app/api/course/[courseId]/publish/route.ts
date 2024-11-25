import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getSession();
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    const isAdmin =
      user?.role?.name === "ADMIN" || user?.role?.name === "TEACHER";
    if (!isAdmin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: true,
      },
    });

    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const hasPublishedChapter = course.chapters.some(
      (chapter) => chapter.isPublished
    );

    if (
      !course.title ||
      !course.description ||
      !course.categoryId ||
      !course.thumbnail ||
      !course.price ||
      !hasPublishedChapter
    ) {
      return new NextResponse("Missing Require Fields", { status: 400 });
    }

    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("[COURSE_PUBLISH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
