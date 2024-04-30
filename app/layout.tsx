"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlobalContextProvider } from "./context/global";
import Loader from "@/components/common/Loader";
import Layout from "@/components/Layout";
import "./globals.css";
import { fetchAuthSession } from "aws-amplify/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState("");

  useEffect(() => {
    if (!localStorage.getItem("userDetails")) {
      router.replace("/");
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, [router]);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? (
            <Loader />
          ) : (
            <GlobalContextProvider>
              <Layout>{children}</Layout>
            </GlobalContextProvider>
          )}
        </div>
      </body>
    </html>
  );
}
