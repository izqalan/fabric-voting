import React, { ReactNode } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";
import { useRouter } from "next/router";

export default function AuthWrapper({ children }: { children: ReactNode }) {
  const { user, error, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  if (!user) {
    router.push("/api/auth/login");
    return <div>Loading...</div>;
  }
  
  return <>{children}</>;
}
