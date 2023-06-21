import type { AppProps } from "next/app";
import { ChakraProvider } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { FiHome, FiTrendingUp, FiBarChart } from "react-icons/fi";
import SidebarWithHeader from "@/components/layouts/SidebarWithHeader";
import "react-datepicker/dist/react-datepicker.css";
import "../styles/date-picker.css";
import { UserProvider } from "@auth0/nextjs-auth0/client";
import AuthWrapper from "@/components/layouts/AuthWrapper";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  const LinkItems = [
    { name: "Pilihan raya", icon: FiTrendingUp, route: "/admin/election" },
    { name: "Keputusan", icon: FiBarChart, route: "/admin/result" },
  ];

  return (
    <UserProvider>
      <ChakraProvider>
        <AuthWrapper>
          {router.pathname.includes("admin") && (
            <SidebarWithHeader linkItems={LinkItems}>
              <Component {...pageProps} />
            </SidebarWithHeader>
          )}
          {!router.pathname.includes("admin") && <Component {...pageProps} />}
        </AuthWrapper>
      </ChakraProvider>
    </UserProvider>
  );
}
