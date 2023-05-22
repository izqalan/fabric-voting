import React, { ReactNode } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  // get current route
  const route = router.pathname;
  console.log("route", route);

  // if (route.includes("/election/result")) return <>{children}</>;
  if (route.includes("/election")) return <>{children}</>;


  if (!user && !["/election/result"].includes(route)) {
    router.push("/api/auth/login");
    return <div>Loading...</div>;
  }
  // check for public routes
  
  return <>{children}</>;
}
