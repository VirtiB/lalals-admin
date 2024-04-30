"use Client";
import { Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import CommonSwitch from "../common/Switch";

const Overview = () => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { checked },
    } = event;
    setChecked(checked);
  };
  return (
    <div>
      <Stack direction="row" spacing={1} alignItems="center">
        {/* <AntSwitch defaultChecked inputProps={{ 'aria-label': 'ant design' }} /> */}
        <CommonSwitch handleChange={handleSwitchChange} checked={checked} />

        <Typography className="text-black font-normal text-[18px]">
          Switchwide Header
        </Typography>
      </Stack>

      <div className="py-[10px]">
        <TextField
          id="outlined-basic"
          name="header_text"
          label="Header Text"
          variant="outlined"
          type="text"
        />
      </div>
    </div>
  );
};

export default Overview;
