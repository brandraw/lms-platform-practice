import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { UserLogout } from "@/lib/user-logout";
import { Search } from "lucide-react";
import Link from "next/link";

export const Header = async () => {
  const session = await getSession();
  const isLoggedIn = Boolean(session.id);
  const user = session.id
    ? await db.user.findUnique({
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
      })
    : null;
  const isTeacher = user?.role?.name === "TEACHER";

  return (
    <header className="flex items-center justify-between p-5 bg-neutral-50">
      <Link href="/">Home</Link>
      <nav className="flex items-center gap-3 text-sm">
        <Link href="/search">
          <Search className="size-5" />
        </Link>
        {isLoggedIn && (
          <>
            <Link href="/my-page">내 강의실</Link>
            <Link href="/profile">Profile</Link>
            <form action={UserLogout}>
              <button>Log Out</button>
            </form>
          </>
        )}
        {!isLoggedIn && (
          <>
            <Link href="/login">Login</Link>
            <Link href="/sign-up">Sign Up</Link>
          </>
        )}
        {isTeacher && (
          <Link
            href="/dashboard"
            className="text-xs py-2 px-3 bg-slate-100 rounded-md"
          >
            Teacher Mode
          </Link>
        )}
      </nav>
    </header>
  );
};
