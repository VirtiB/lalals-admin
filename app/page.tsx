"use client";
import ECommerce from "@/components/Dashboard/E-commerce";
import Login from "@/components/Login/Login";
import { useEffect } from "react";
import { useGlobalContext } from "./context/global";

export default function Home() {
  const { userDetails, setUserDetails } = useGlobalContext();

  useEffect(() => {
    if (localStorage.getItem("userDetails")) {
      setUserDetails(localStorage.getItem("userDetails"));
    }
  }, []);

  return <>{!userDetails ? <Login /> : <ECommerce />}</>;
}
