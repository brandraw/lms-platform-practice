import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { Sidebar } from "@/app/(admin)/_components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session.id) {
    return redirect("/");
  }
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
    user?.role?.name === "TEACHER" || user?.role?.name === "ADMIN";
  if (!isAdmin) {
    return redirect("/");
  }

  return (
    <div>
      <Sidebar />
      {children}
    </div>
  );
}
