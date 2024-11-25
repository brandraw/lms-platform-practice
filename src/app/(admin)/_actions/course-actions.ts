"use server";

import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { z } from "zod";

const courseSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  price: z.coerce.number().optional(),
  thumbnail: z.string().optional(),
});

export async function addCourse(_: any, formData: FormData) {
  const data = Object.fromEntries(formData);

  const result = courseSchema.safeParse(data);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }

  const course = await db.course.create({
    data: {
      title: result.data.title,
      description: result.data.description,
      price: result.data.price,
      thumbnail: result.data.thumbnail,
    },
    select: {
      id: true,
    },
  });

  redirect(`/dashboard/course/${course.id}`);
}

export async function updateCourse(_: any, formData: FormData) {
  const data = Object.fromEntries(formData);

  const result = courseSchema.safeParse(data);
  if (!result.success) {
    return {
      errors: result.error.flatten().fieldErrors,
    };
  }
}
