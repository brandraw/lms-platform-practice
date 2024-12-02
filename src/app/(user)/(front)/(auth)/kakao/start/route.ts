export async function GET(req: Request) {
  const referer = req.headers.get("referer");
  const url = referer ? new URL(referer) : null;
  const redirectData = url ? url.searchParams.get("redirect") : null;
  if (redirectData?.startsWith("http")) {
    return Response.redirect("/login");
  }

  const searchParams = new URLSearchParams({
    client_id: process.env.KAKAO_CLIENT_ID!,
    redirect_uri: process.env.KAKAO_REDIRECT_URI!,
    response_type: "code",
  }).toString();

  const redirectPath = redirectData
    ? `&state=${encodeURIComponent(redirectData)}`
    : "";
  return Response.redirect(
    `https://kauth.kakao.com/oauth/authorize?${searchParams}${redirectPath}`
  );
}
