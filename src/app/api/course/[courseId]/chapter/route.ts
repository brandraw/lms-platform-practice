import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getSession();
    const isAdmin = await db.user.findUnique({
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
    if (isAdmin?.role?.name !== "ADMIN" && isAdmin?.role?.name !== "TEACHER") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { title } = await req.json();

    const lastChapter = await db.chapter.findFirst({
      where: {
        courseId: params.courseId,
      },
      orderBy: {
        position: "desc",
      },
      select: {
        position: true,
      },
    });
    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    const chapter = await db.chapter.create({
      data: {
        courseId: params.courseId,
        title,
        position: newPosition,
      },
    });

    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[CHAPTER_POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
