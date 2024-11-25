import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const session = await getSession();
    const courseOwner = await db.user.findUnique({
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
    if (
      courseOwner?.role?.name !== "TEACHER" &&
      courseOwner?.role?.name !== "ADMIN"
    ) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { url, name } = await req.json();
    const attachment = await db.attachment.create({
      data: {
        courseId: params.courseId,
        url,
        name: name || url.split("/").pop(),
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[COURSE_ATTACHMENT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
