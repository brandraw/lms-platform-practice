import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { PurchaseActions } from "./_components/purchase-actions";
import Image from "next/image";
import { formatPrice } from "@/lib/format";

export default async function CourseDetail({
  params,
}: {
  params: { courseId: string };
}) {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }

  const session = await getSession();
  const isLoggedIn = Boolean(session.id);
  const user = session.id
    ? await db.user.findUnique({
        where: {
          id: session.id,
        },
        select: {
          purchase: {
            select: {
              courseId: true,
            },
          },
        },
      })
    : null;
  const isPurchase = user?.purchase?.[0]?.courseId === params.courseId;

  return (
    <main className="new-container">
      <div className="flex gap-10 flex-col-reverse md:flex-row ">
        <div className="flex flex-1">
          <div className="relative aspect-video w-full">
            <Image
              fill
              src={course.thumbnail || ""}
              alt={course.title}
              className="object-cover rounded-lg"
            />
          </div>
        </div>
        <div className="max-w-full md:max-w-[400px] w-full">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl font-semibold">{course.title}</h1>
            <div className="font-bold text-2xl">
              {course.price ? formatPrice(course.price) : "무료!"}원
            </div>
            <div className="w-full flex flex-col">
              <PurchaseActions
                courseId={course.id}
                chapters={course.chapters}
                isPurchase={isPurchase}
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
