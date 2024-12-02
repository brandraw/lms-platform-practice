import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { TossPaymentsWidgetsContainer } from "./_components/toss-payments-widgets";
import { getSession } from "@/lib/session";

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: { courseId: string };
}) {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });
  if (!user) {
    return redirect("/");
  }
  if (!searchParams.courseId) {
    return redirect("/");
  }
  const course = await db.course.findUnique({
    where: {
      id: searchParams.courseId,
    },
  });
  if (!course) {
    return redirect("/");
  }

  return (
    <div className="p-5">
      <h1>{course.title}</h1>

      <TossPaymentsWidgetsContainer
        userId={user.id}
        userName={user.username}
        userEmail={user.email}
        userPhone={user.phone || undefined}
        courseId={course.id}
        courseTitle={course.title}
        coursePrice={course.price || 0}
      />
    </div>
  );
}
