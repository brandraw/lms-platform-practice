import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
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

  return (
    <div className="new-container">
      <div>{user.username}님 안녕하세요!</div>

      <div className="flex gap-10">
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
