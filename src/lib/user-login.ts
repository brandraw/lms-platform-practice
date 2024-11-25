import { redirect } from "next/navigation";
import { getSession } from "./session";

export async function UserLogin(userId: number, redirectUrl?: string) {
  const session = await getSession();
  session.id = userId;
  await session.save();

  if (redirectUrl) {
    return redirect(redirectUrl);
  }
}
