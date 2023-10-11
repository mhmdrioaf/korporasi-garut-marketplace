export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/user/:path*",
    "/product/add",
    "/product/edit/:path*",
    "/admin/:path*",
  ],
};
