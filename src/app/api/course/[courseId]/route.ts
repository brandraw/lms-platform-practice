import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import Mux from "@mux/mux-node";
import { NextRequest, NextResponse } from "next/server";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getSession();
    if (!session.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (user?.role?.name !== "TEACHER" && user?.role?.name !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { courseId } = params;
    const values = await req.json();

    const course = await db.course.update({
      where: {
        id: courseId,
      },
      data: {
        ...values,
      },
    });

    return NextResponse.json(course);
  } catch (error) {
    console.log("[COURSE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getSession();
    if (!session.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const user = await db.user.findUnique({
      where: {
        id: session.id,
      },
      select: {
        id: true,
        role: {
          select: {
            name: true,
          },
        },
      },
    });
    if (user?.role?.name !== "TEACHER" && user?.role?.name !== "ADMIN") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
      },
      include: {
        chapters: {
          include: {
            muxData: true,
          },
        },
      },
    });
    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    for (const chapter of course.chapters) {
      if (chapter.muxData?.assetId) {
        await mux.video.assets.delete(chapter.muxData.assetId);
      }
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_DELETE]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
