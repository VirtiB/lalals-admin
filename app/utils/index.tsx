"use Client";
import Image from "next/image";
import { Icon } from "@mui/material";
import { useState } from "react";
import { SnackbarState } from "./interface";

const dateFormat = (date: number) => {
  return `${new Date(date).toLocaleDateString("default", {
    month: "2-digit",
  })}/${new Date(date).toLocaleDateString("default", {
    day: "2-digit",
  })}/${new Date(date).toLocaleDateString("default", {
    year: "numeric",
  })}`;
};
const calculateTimeDifference = (createdDate: any) => {
  const convertedEndDate = new Date(createdDate).getTime();
  const convertedStartDate = new Date().getTime();

  const date1 = new Date(dateFormat(convertedStartDate));
  const date2 = new Date(dateFormat(convertedEndDate));

  const OneMonth = 3600 * 24 * 30;
  const OneWeek = 3600 * 24 * 7;
  const OneDay = 3600 * 24;
  const OneHour = 3600;
  const OneMinute = 60;
  const OneSecond = 1000;

  // To calculate the time difference of two dates
  const Difference_In_Time = (date1.getTime() - date2.getTime()) / OneSecond;
  //if date difference is less than 24 hours
  if (Difference_In_Time == 0) {
    var diff = convertedStartDate - convertedEndDate;
    var hours = Math.floor(diff / 1000 / 60 / 60);
    const minutes = Math.floor(diff / 1000 / 60);
    if (hours == 0) {
      return `${Math.floor(minutes)} Minutes ago`;
    } else {
      return `${Math.floor(hours)} Hours ago`;
    }
  }
  let response;
  // To calculate the no. of days between two dates
  if (Difference_In_Time > OneMonth) {
    response = Difference_In_Time / OneMonth;
    return `${Math.floor(response)} Months ago`;
  } else if (Difference_In_Time > OneWeek) {
    response = Difference_In_Time / OneWeek;
    return `${Math.floor(response)} Weeks ago`;
  } else if (Difference_In_Time > OneDay) {
    response = Difference_In_Time / OneDay;
    return `${Math.floor(response)} Days ago`;
  } else if (Difference_In_Time > OneHour) {
    response = Difference_In_Time / OneHour;
    return `${Math.floor(response)} Hours ago`;
  } else if (Difference_In_Time > OneMinute) {
    response = Difference_In_Time / OneMinute;
    return `${Math.floor(response)} Minutes ago`;
  }
};

const formateTimeAndDate = (createdDate: any) => {
  const date = new Date(createdDate);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const hour = String(date.getHours() + 1).padStart(2, "0");
  const minutes = String(date.getMinutes() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}.${month}.${year} @ ${hour}:${minutes}`;
};

const getPrivileges = () => {
  try {
    return JSON.parse(localStorage.getItem("userDetails") ?? "")?.privileges;
  } catch (error) {
    return [];
  }
};

const getUserDetails = () => {
  try {
    return JSON.parse(localStorage.getItem("userDetails") || "");
  } catch (error) {
    return null;
  }
};

const sidebarItems: { [key: string]: any } = {
  orders: {
    label: "Orders",
    route: "/orders",
    content: "./svg/orders.svg",
  },
  affiliates: {
    label: "Affiliates",
    route: "/affiliates",
    content: "./svg/affiliate.svg",
  },
  voices: {
    label: "Voices",
    route: "/voices",
    content: "./svg/voices.svg",
  },
  conversions: {
    label: "Conversions",
    route: "/conversions",
    content: "./svg/conversions.svg",
  },
  music: {
    label: "Music",
    route: "/music",
    content: "./svg/music.svg",
  },
  lyrics: {
    label: "Lyrics",
    route: "/lyrics",
    content: "./svg/lyrics.svg",
  },
  comments: {
    label: "Comments",
    route: "/comments",
    content: "./svg/comments.svg",
  },
  users: {
    label: "Users",
    route: "/users",
    content: "./svg/user.svg",
  },
  adminUsers: {
    label: "Admin Users",
    route: "/admin-users",
    content: "./svg/users admin.svg",
  },
};
const getAccessToken = () => {
  try {
    const userId = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_AWS_APP_CLIENT_ID}.LastAuthUser`
    );
    const accessToken = localStorage.getItem(
      `CognitoIdentityServiceProvider.${process.env.NEXT_PUBLIC_AWS_APP_CLIENT_ID}.${userId}.accessToken`
    );
    return accessToken;
    // return localStorage.getItem("accessToken");
  } catch (err) {
    return null;
  }
};
const generateHeaders = () => {
  return {
    headers: {
      Authorization: `Bearer ${getAccessToken()}`,
    },
  };
};
const CalendarIcon = (
  <Icon>
    <img alt="calendar" src="/svg/calendar.svg" />
  </Icon>
);

const handleSnackbarClick = (
  snackbarState: SnackbarState,
  setSnackbarState: React.Dispatch<React.SetStateAction<SnackbarState>>,
  type: string,
  message: string
) => {
  setSnackbarState({
    ...snackbarState,
    open: true,
    type: type,
    message: message,
  });
};

const debounce = (func: (data: string) => void, wait: number) => {
  let timeout: any;
  return (...args: [data: string]) => {
    const context = this;
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      func.apply(context, args);
    }, wait);
  };
};

export {
  calculateTimeDifference,
  getPrivileges,
  sidebarItems,
  getUserDetails,
  getAccessToken,
  generateHeaders,
  CalendarIcon,
  formateTimeAndDate,
  handleSnackbarClick,
  debounce,
};
