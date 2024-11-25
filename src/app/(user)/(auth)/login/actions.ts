"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { UserLogin } from "@/lib/user-login";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string().min(1),
  })
  .superRefine(async ({ email, password }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      ctx.addIssue({
        code: "custom",
        message: "Email Not Exists",
        path: ["email"],
        fatal: true,
      });
      return z.NEVER;
    }

    const checkPassword = await bcrypt.compare(password, user.password || "");
    if (!checkPassword) {
      ctx.addIssue({
        code: "custom",
        message: "Password incorrect",
        path: ["password"],
        fatal: true,
      });
      return z.NEVER;
    }

    await UserLogin(user.id);
  });
export async function handleLogin(_: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 500));

  const headersList = headers();
  const fullUrl = headersList.get("referer");
  const url = new URL(fullUrl || "");
  const redirectUrl = url.searchParams.get("redirect");

  const data = Object.fromEntries(formData);
  const result = await signupSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  if (redirectUrl) {
    redirect(redirectUrl);
  }
  redirect("/profile");
}
