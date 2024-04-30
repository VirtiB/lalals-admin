import { TextField, Typography } from "@mui/material";
import React from "react";

const Security = () => {
  return (
    <div>
      <Typography className="text-black font-normal text-[18px]">
        User Limits
      </Typography>
      <div className="grid grid-cols-4 gap-4 my-5">
        <div className="flex flex-col gap-5">
          <TextField
            id="outlined-basic"
            name="header_text"
            label="Daily Music Upload Limit"
            variant="outlined"
            type="number"
          />
          <TextField
            id="outlined-basic"
            name="header_text"
            label="Daily Comment Limit"
            variant="outlined"
            type="number"
          />
          <TextField
            id="outlined-basic"
            name="header_text"
            label="Free Seconds on sign up"
            variant="outlined"
            type="number"
          />
        </div>
        <div className="flex flex-col gap-5">
          <TextField
            id="outlined-basic"
            name="header_text"
            label="Free Seconds on sign up"
            variant="outlined"
            type="number"
          />
        </div>
      </div>
    </div>
  );
};

export default Security;
