import { getToken } from "next-auth/jwt";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const {
    nextUrl: { searchParams },
  } = request;
  const paramsRef = searchParams.get("ref");
  const referrer = paramsRef;
  const cookiesList = cookies();
  const session = await getToken({ req: request });

  function isProtectedRoute() {
    let isProtected = [false];
    const matcher = [
      "/user",
      "/product/add",
      "/product/edit",
      "/admin/",
      "/referral",
    ];

    matcher.forEach((route) => {
      if (request.nextUrl.pathname.startsWith(route)) {
        isProtected.push(true);
      }
    });

    return isProtected.includes(true);
  }

  function validCookie(cookie: string) {
    return !!cookiesList.get(cookie);
  }

  if (referrer) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 1);

    const url = request.nextUrl.clone();
    url.searchParams.delete("ref");

    if (validCookie("marketplace.referral")) {
      const response = NextResponse.redirect(new URL(url));
      response.cookies.delete("marketplace.referral");
      response.headers.append(
        "Set-Cookie",
        `marketplace.referral=${referrer}; Expires=${expirationDate.toUTCString()}; Path=/; SameSite=Strict; Secure; HttpOnly;`
      );
      return response;
    } else {
      const response = NextResponse.redirect(new URL(url));
      response.headers.append(
        "Set-Cookie",
        `marketplace.referral=${referrer}; Expires=${expirationDate.toUTCString()}; Path=/; SameSite=Strict; Secure; HttpOnly;`
      );
      return response;
    }
  } else {
    if (isProtectedRoute() && !session) {
      const loginUrl = request.nextUrl.clone();
      const callbackUrl = request.nextUrl.clone();
      loginUrl.pathname = "/auth/login";
      loginUrl.searchParams.set("callbackUrl", callbackUrl.toString());

      return NextResponse.redirect(loginUrl);
    }

    if (session) {
      const clonedUrl = request.nextUrl.clone();
      const callbackUrl = clonedUrl.searchParams.get("callbackUrl");
      if (callbackUrl) {
        const url = new URL(callbackUrl);
        return NextResponse.redirect(url);
      } else {
        return NextResponse.next();
      }
    }
  }
}
