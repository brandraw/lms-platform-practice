import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function Profile() {
  const session = await getSession();
  if (!session.id) {
    return notFound();
  }

  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
  });
  if (!user) {
    return notFound();
  }

  return (
    <div className="p-5">
      <h1>Profile</h1>
      <div className="flex flex-col items-start gap-3 p-3 rounded-md border bg-orange-50">
        <div className="aspect-square size-10 rounded-full relative overflow-hidden">
          {user.avatar && (
            <Image
              src={user.avatar}
              fill
              alt="user image"
              className="object-cover"
            />
          )}
        </div>
        <div className="font-semibold">username: {user.username}</div>
        <div className="font-semibold">email: {user.email}</div>
        <div className="font-semibold">phone: {user.phone}</div>
      </div>
    </div>
  );
}
