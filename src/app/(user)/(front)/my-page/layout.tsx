import { getMyPageCourses } from "@/actions/get-mypage-courses";
import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function MyPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session?.id,
    },
  });
  if (!user) {
    return redirect("/login");
  }

  const { coursesInComplete, coursesInProgress } = await getMyPageCourses(
    user.id
  );

  return (
    <div className="new-container">
      <div className="flex items-center gap-5 py-8">
        <div className="relative aspect-square w-[120px] ">
          {user.avatar ? (
            <Image
              fill
              src={user.avatar}
              alt={user.username}
              className="object-cover rounded-full"
            />
          ) : (
            <div className="w-full h-full bg-slate-300 rounded-full"></div>
          )}
        </div>
        <div className="flex flex-col gap-4">
          <h3 className="font-semibold text-lg">
            {user.username}님 안녕하세요!
          </h3>
          <div className="flex items-center gap-3 text-sm">
            <div>수강중 강의 {coursesInProgress.length}</div>
            <div>완료한 강의 {coursesInComplete.length}</div>
            <div>쿠폰 0 </div>
            <div>포인트 0</div>
          </div>
        </div>
      </div>

      <div className="flex gap-8 flex-col md:flex-row">
        <div className="max-w-[260px] w-full">
          <div className="flex flex-col">
            <Link href="/my-page/study-room">내 강의실</Link>
          </div>
        </div>
        <div className="flex-1">{children}</div>
      </div>
    </div>
  );
}
