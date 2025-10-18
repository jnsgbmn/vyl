// src/middleware.ts
import { defineMiddleware } from "astro:middleware";

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname, searchParams } = new URL(context.request.url);

  // Prevent refreshing callback page without code
  if (pathname === "/callback") {
    const code = searchParams.get("code");

    if (!code) {
      // No code means user refreshed or navigated back
      return context.redirect("/");
    }
  }

  return next();
});
