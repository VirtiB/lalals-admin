"use client";
import React, { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import { useGlobalContext } from "@/app/context/global";
import { usePathname } from "next/navigation";

const authRoutes = ["/login"];
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { showSidebar } = useGlobalContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathName = usePathname();
  const getUserDetail =
    typeof window !== "undefined" && localStorage.getItem("userDetails");
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    if (authRoutes.includes(pathName)) {
      setAuthState(true);
    } else if (pathName.includes("/")) {
      setAuthState(false);
    }
  }, [pathName]);

  return (
    <div>
      <div
        className="flex h-screen overflow-hidden "
        // style={{ backdropFilter: showSidebar ? "blur(8px)" : "none" }}
      >
        {/* <!-- ===== Sidebar Start ===== --> */}
        {!!getUserDetail && (
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
        {/* <!-- ===== Sidebar End ===== --> */}

        {/* <!-- ===== Content Area Start ===== --> */}
        <div className="relative flex flex-1 flex-col overflow-y-auto overflow-x-hidden bg-white">
          <main>
            <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10 bg-white">
              {children}
            </div>
          </main>
          {/* <!-- ===== Main Content End ===== --> */}
        </div>
        {/* <!-- ===== Content Area End ===== --> */}
      </div>
    </div>
  );
};

export default Layout;
