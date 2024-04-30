"use client";
import React, { useEffect, useRef, useState } from "react";
import { fetchAuthSession, signOut } from "aws-amplify/auth";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import HomeIcon from "@mui/icons-material/Home";
import { getPrivileges, sidebarItems } from "@/app/utils";
import { Amplify } from "aws-amplify";
import LogoutIcon from "@mui/icons-material/Logout";
import Loader from "../common/Loader";
import { SidebarProps } from "@/app/utils/interface";
import { useGlobalContext } from "@/app/context/global";
import { IconButton } from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { setUserDetails } = useGlobalContext();

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);
  const [modules, setModules] = useState<Array<string>>([]);

  const loadModules = () => {
    const privileges: any = getPrivileges();
    if (privileges && privileges.length > 0) {
      const sidebarList =
        privileges &&
        privileges?.map(
          (privilege: {
            module: string;
            read: boolean;
            write: boolean;
            delete: boolean;
          }) => {
            if (privilege.read) {
              return privilege.module;
            }
          }
        );
      setModules(sidebarList);
    }
  };

  let storedSidebarExpanded = "true";
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === "true"
  );

  Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID ?? "",
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_APP_CLIENT_ID ?? "",
        identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID ?? "",
        mfa: { status: "on", totpEnabled: true, smsEnabled: true },
        loginWith: { email: false, username: true },
      },
    },
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.clear();
      setUserDetails(null);
      router.replace("/");
    } catch (error) {}
  };

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener("click", clickHandler);
    return () => document.removeEventListener("click", clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ key }: KeyboardEvent) => {
      if (!sidebarOpen || key !== "Escape") return;
      setSidebarOpen(false);
    };
    document.addEventListener("keydown", keyHandler);
    return () => document.removeEventListener("keydown", keyHandler);
  });

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector("body")?.classList.add("sidebar-expanded");
    } else {
      document.querySelector("body")?.classList.remove("sidebar-expanded");
    }
  }, [sidebarExpanded]);

  useEffect(() => {
    setTimeout(() => {
      if (pathname?.includes("/")) loadModules();
    }, 3000);
  }, []);

  const handleRouteChange = async (route: string) => {
    try {
      if (typeof window !== "undefined") {
        const storedTimestamp = localStorage.getItem("loginTimestamp");
        if (storedTimestamp) {
          const storedTime = parseInt(storedTimestamp, 10);
          const currentTime = Date.now();
          const elapsedTime = (currentTime - storedTime) / 1000;
          if (elapsedTime > 86000) {
            const { tokens } = await fetchAuthSession({ forceRefresh: true });
          } else {
            router.push(window.location.pathname);
          }
        } else {
          handleSignOut();
        }
      }
    } catch (err) {
      handleSignOut();
    } finally {
    }
  };

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-screen w-65 flex-col overflow-y-hidden duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 border-r-2 border-r-[#F9F9F8] ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      style={{
        background: "#FBFBFA",
      }}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-10 lg:py-6.5">
        <Link href="/">
          <Image
            width={90}
            height={18}
            src={"/images/logo/lalals-logo.png"}
            alt="Logo"
          />
        </Link>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <svg
            className="fill-current"
            width="20"
            height="18"
            viewBox="0 0 20 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 8.175H2.98748L9.36248 1.6875C9.69998 1.35 9.69998 0.825 9.36248 0.4875C9.02498 0.15 8.49998 0.15 8.16248 0.4875L0.399976 8.3625C0.0624756 8.7 0.0624756 9.225 0.399976 9.5625L8.16248 17.4375C8.31248 17.5875 8.53748 17.7 8.76248 17.7C8.98748 17.7 9.17498 17.625 9.36248 17.475C9.69998 17.1375 9.69998 16.6125 9.36248 16.275L3.02498 9.8625H19C19.45 9.8625 19.825 9.4875 19.825 9.0375C19.825 8.55 19.45 8.175 19 8.175Z"
              fill=""
            />
          </svg>
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear h-full">
        {/* <!-- Sidebar Menu --> */}
        <nav className=" px-2 mt-2 flex flex-col justify-between h-full">
          {/* <!-- Menu Group --> */}
          <ul className=" mb-5.5 flex flex-col gap-2.5">
            <li className="flex gap-0.5">
              <div
                className={`${
                  pathname === "/" &&
                  "bg-primary h-8  w-1 border-r rounded-r-full flex left-0"
                }`}
              ></div>
              <Link
                href="/"
                className={`group ml-1 w-full relative flex text-[18px] ${
                  pathname === "/" ? "text-black ml-0 " : "text-[#7A7A7A]"
                } items-center gap-2.5  rounded-md font-medium transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) ease-in-out px-1 pl-7 py-[4px] ${
                  pathname === "/" && "bg-[#E2E4E9]"
                } hover:bg-[#E2E4E9] `}
                onClick={() => handleRouteChange("/")}
              >
                <HomeIcon />
                Home
              </Link>
            </li>
            {modules.map(
              (module, index) =>
                sidebarItems[module] && (
                  <li key={`module-${index}`} className="flex gap-0.5">
                    <div
                      className={`${
                        pathname === sidebarItems[module]?.route &&
                        "bg-primary h-8  w-1 border-r rounded-r-full flex left-0"
                      }`}
                    ></div>
                    <Link
                      href={sidebarItems[module]?.route ?? ""}
                      className={`group w-full ml-1 relative flex text-[18px] ${
                        pathname === sidebarItems[module]?.route
                          ? "text-black"
                          : "text-[#7A7A7A]"
                      } items-center gap-2.5 rounded-md font-medium duration-300 ease-in-out  pl-7 py-[4px] ${
                        pathname === sidebarItems[module]?.route &&
                        " bg-[#E2E4E9]"
                      } hover:bg-[#E2E4E9] hover:ml-1 `}
                      onClick={() =>
                        handleRouteChange(sidebarItems[module]?.route)
                      }
                    >
                      <Image
                        src={sidebarItems[module]?.content}
                        alt="denied"
                        objectFit="contain"
                        width={20}
                        className={`${
                          pathname !== sidebarItems[module]?.route
                            ? "opacity-50"
                            : ""
                        }`}
                        height={20}
                      />
                      {sidebarItems[module]?.label}
                    </Link>
                  </li>
                )
            )}
            <li className="flex gap-0.5">
              <div
                className={`${
                  pathname === "/settings" &&
                  "bg-primary h-8  w-1 border-r rounded-r-full flex left-0"
                }`}
              ></div>
              <Link
                href="/settings"
                className={`group ml-1 w-full relative flex text-[18px] ${
                  pathname === "/settings"
                    ? "text-black ml-0 "
                    : "text-[#7A7A7A]"
                } items-center gap-2.5  rounded-md font-medium transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1) ease-in-out px-1 pl-7 py-[4px] ${
                  pathname === "/settings" && "bg-[#E2E4E9]"
                } hover:bg-[#E2E4E9] `}
                onClick={() => handleRouteChange("/settings")}
              >
                <SettingsIcon />
                Settings
              </Link>
            </li>
          </ul>
          <button
            className="flex justify-center items-center m-4 p-2 text-lg font-medium rounded-lg w-30"
            onClick={handleSignOut}
          >
            Logout
          </button>
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
