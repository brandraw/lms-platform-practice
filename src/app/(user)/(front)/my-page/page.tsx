import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function MyPage() {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session?.id,
    },
  });
  if (!user) {
    return redirect("/login");
  }

  return <div>내 강의실이에오!!</div>;
}
