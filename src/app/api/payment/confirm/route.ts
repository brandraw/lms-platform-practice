import { db } from "@/lib/db";
import { getSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    const user = await db.user.findUnique({
      where: {
        id: session?.id,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const course = await db.course.findUnique({
      where: {
        id: body.courseId,
      },
    });
    if (!course) {
      return new NextResponse("Not Found", { status: 404 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      select: {
        id: true,
      },
    });
    if (purchase) {
      return new NextResponse("이미 구매한 상품입니다.", { status: 400 });
    }

    // 쿠폰 사용시 amount가 할인된 값으로 들어옴. 추후에 체크 로직 추가해야함
    const checkAmount = Number(body.amount) === course.price;
    if (!checkAmount) {
      return new NextResponse("Amount Error", { status: 400 });
    }

    const encryptedSecretKey =
      "Basic " +
      Buffer.from(process.env.TOSS_SECRET_KEY! + ":").toString("base64");

    const response = await fetch(
      "https://api.tosspayments.com/v1/payments/confirm",
      {
        method: "POST",
        body: JSON.stringify(body),
        headers: {
          "Content-Type": "application/json",
          Authorization: encryptedSecretKey,
          "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
        },
      }
    );
    const json = await response.json();
    console.log(json);

    // 구매 생성 로직

    if (json.status === "DONE") {
      const purchase = await db.purchase.create({
        data: {
          userId: user.id,
          courseId: course.id,
        },
        select: {
          id: true,
        },
      });
    }

    return NextResponse.json(null);
  } catch (error) {
    console.log("[PAYMENT_CONFIRM_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
