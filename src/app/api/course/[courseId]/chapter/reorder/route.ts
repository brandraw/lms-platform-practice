import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function PUT(
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

    const { list } = await req.json();

    for (let item of list) {
      await db.chapter.update({
        where: {
          id: item.id,
        },
        data: {
          position: item.position,
        },
        select: {
          id: true,
        },
      });
    }

    return new NextResponse("Success", { status: 200 });
  } catch (error) {
    console.log("[REORDER_PUT]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
