import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

// export { default } from "next-auth/middleware";

// export const config = {
//   matcher: [
//     "/user/:path*",
//     "/product/add",
//     "/product/edit/:path*",
//     "/admin/:path*",
//   ],
// };

export function middleware(request: NextRequest) {
  const {
    nextUrl: { searchParams },
  } = request;
  const paramsRef = searchParams.get("ref");
  const referrer = paramsRef;
  const cookiesList = cookies();
  const session = cookiesList.get("next-auth.session-token");

  function isProtectedRoute() {
    let isProtected = [false];
    const matcher = ["/user", "/product/add", "/product/edit", "/admin/"];

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

  if (isProtectedRoute() && !session) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/auth/login";

    return NextResponse.rewrite(loginUrl);
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
    return NextResponse.next();
  }
}
