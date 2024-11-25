import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

const handleAuth = async () => {
  const session = await getSession();
  const user = await db.user.findUnique({
    where: {
      id: session.id,
    },
    select: {
      id: true,
    },
  });
  if (!user?.id) throw new Error("Unauthorized");
  return { userId: user.id };
};

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  courseDetailImages: f({ image: { maxFileSize: "32MB" } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  courseAttachment: f(["image", "text", "pdf", "video", "audio"])
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
  courseVideo: f({ video: { maxFileCount: 1, maxFileSize: "64GB" } })
    .middleware(handleAuth)
    .onUploadComplete(() => {}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
