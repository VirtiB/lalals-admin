import React from "react";
import Image from "next/image";
import { Box, IconButton } from "@mui/material";

const CloseDrawerButton = ({ onClick }: any) => {
  return (
    <Box m={1.2}>
      <IconButton onClick={onClick} size="small">
        <Image
          src="/svg/fast-forward 1.svg"
          width={13}
          height={13}
          alt="picture"
        />
      </IconButton>
    </Box>
  );
};

export default CloseDrawerButton;
