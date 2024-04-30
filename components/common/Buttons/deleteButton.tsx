import { Box, IconButton } from "@mui/material";
import Image from "next/image";
import React from "react";

const DeleteButton = ({ onClick, isLoading }: any) => {
  return (
    <Box m={1.2}>
      <IconButton onClick={onClick} disabled={isLoading} size="small">
        <Image
          src="./images/bin.png"
          alt="denied"
          objectFit="contain"
          width={20}
          height={20}
        />
      </IconButton>
    </Box>
  );
};

export default DeleteButton;
