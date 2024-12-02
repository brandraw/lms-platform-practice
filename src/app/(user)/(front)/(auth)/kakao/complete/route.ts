import { db } from "@/lib/db";
import { UserLogin } from "@/lib/user-login";
import { NextRequest } from "next/server";
import crypto from "crypto";

async function getToken(code: string) {
  const searchParams = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    code,
  }).toString();
  const response = await fetch(
    `https://kauth.kakao.com/oauth/token?${searchParams}`,
    {
      method: "POST",
      headers: {
        content_type: "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  const { access_token } = await response.json();

  return access_token;
}

async function getUser(token: string) {
  const response = await fetch(`https://kapi.kakao.com/v2/user/me`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      Content_type: "application/x-www-form-urlencoded;charset=utf-8",
    },
  });
  return await response.json();
}

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");
  if (!code) {
    return new Response(null, {
      status: 400,
    });
  }

  const redirectPath = req.nextUrl.searchParams.get("state");
  const redirectUrl = redirectPath
    ? decodeURIComponent(redirectPath)
    : "/profile";

  const token = await getToken(code);
  if (!token) {
    return new Response("token not exists", {
      status: 400,
    });
  }

  const userData = await getUser(token);

  const kakaoId = userData.id + "";
  const kakaoName = userData.kakao_account.name;
  const kakaoEmail = userData.kakao_account.email;
  const kakaoPhone = userData.kakao_account.phone_number;
  const kakaoProfileImg = userData.kakao_account.profile.thumbnail_image_url;

  const ckeckKakaoUser = await db.user.findUnique({
    where: {
      kakaoId,
    },
    select: {
      id: true,
    },
  });
  if (ckeckKakaoUser) {
    const user = await db.user.update({
      where: {
        kakaoId,
      },
      data: {
        phone: kakaoPhone,
        avatar: kakaoProfileImg,
      },
      select: {
        id: true,
      },
    });

    await UserLogin(user.id, redirectUrl);
    // Redirect
  }

  const checkEmail = await db.user.findUnique({
    where: {
      email: kakaoEmail,
    },
    select: {
      id: true,
    },
  });
  if (checkEmail) {
    const user = await db.user.update({
      where: {
        id: checkEmail.id,
      },
      data: {
        phone: kakaoPhone,
        avatar: kakaoProfileImg,
      },
      select: {
        id: true,
      },
    });

    return await UserLogin(user.id, redirectUrl);
    // redirect
  }

  const user = await db.user.create({
    data: {
      kakaoId,
      username: `kakao-${crypto.randomBytes(8).toString("hex")}`,
      email: kakaoEmail,
      avatar: kakaoProfileImg,
    },
    select: {
      id: true,
    },
  });

  await UserLogin(user.id, redirectUrl);

  // redirect
}
