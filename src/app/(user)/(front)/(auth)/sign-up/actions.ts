"use server";

import { db } from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { UserLogin } from "@/lib/user-login";
import { redirect } from "next/navigation";

const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Too Short")
      .max(10, "Too long")
      .toLowerCase(),
    email: z
      .string()
      .email()
      .refine(
        async (email) => {
          const user = await db.user.findUnique({
            where: {
              email,
            },
            select: {
              id: true,
            },
          });
          return !Boolean(user);
        },
        {
          message: "Email Already Exists",
        }
      ),
    password: z.string().min(1),
    password_confirm: z.string().min(1),
  })
  .refine(
    ({ password, password_confirm }) => {
      return password === password_confirm;
    },
    {
      message: "Password not same",
      path: ["password_confirm"],
    }
  );

export async function handleSignup(_: any, formData: FormData) {
  await new Promise((r) => setTimeout(r, 500));

  const data = Object.fromEntries(formData);
  const result = await signupSchema.safeParseAsync(data);

  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const hashedPassword = await bcrypt.hash(result.data.password, 12);
  const user = await db.user.create({
    data: {
      username: result.data.username,
      email: result.data.email,
      password: hashedPassword,
    },
    select: {
      id: true,
    },
  });

  await UserLogin(user.id);
  redirect("/profile");
}
