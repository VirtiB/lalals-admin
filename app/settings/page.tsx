"use client";
import { activeTabs } from "@/components/common/Styles";
import CustomTabPanel from "@/components/common/Tabs";
import Listings from "@/components/Settings/Listings";
import Overview from "@/components/Settings/Overview";
import Security from "@/components/Settings/Security";
import { Box, Tab, Tabs } from "@mui/material";
import { useState } from "react";

function tabProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const Settings = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <>
      <h1 className="text-4xl font-medium mb-5  text-black">Settings</h1>
      <Box sx={{ width: "100%" }}>
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            TabIndicatorProps={{
              style: { backgroundColor: "black" },
            }}
          >
            <Tab label="Overview" sx={activeTabs} {...tabProps(0)} />
            <Tab label="Security" sx={activeTabs} {...tabProps(1)} />
            <Tab label="Listings" sx={activeTabs} {...tabProps(2)} />
          </Tabs>
        </Box>
        <div className="overflow-y-auto h-[70vh]">
          <CustomTabPanel value={value} index={0}>
            <Overview />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <Security />
          </CustomTabPanel>
          <CustomTabPanel value={value} index={2}>
            <Listings />
          </CustomTabPanel>
        </div>
      </Box>
    </>
  );
};
export default Settings;
