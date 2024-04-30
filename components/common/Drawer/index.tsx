import React from "react";
import { Box, Drawer, Typography } from "@mui/material";
import CloseDrawerButton from "../Buttons/closeDrawerButton";
import DeleteButton from "../Buttons/deleteButton";
import { EditedByTypography } from "@/app/utils/styles";
import { formateTimeAndDate } from "@/app/utils";

const drawerWidth = 420;

const DrawerComponent = ({
  open,
  onClose,
  children,
  title,
  isEdit,
  isLoading,
  deleteFunction,
  privileges,
}: any) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        "& .MuiDrawer-paper": {
          width: drawerWidth,
        },
      }}
    >
      <div className="flex justify-between">
        <CloseDrawerButton onClick={onClose} />
        {isEdit && isEdit?.id && privileges?.canDelete() && (
          <DeleteButton onClick={deleteFunction} isLoading={isLoading} />
        )}
      </div>
      <Box px={5}>
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ fontWeight: 600, fontSize: "26px" }}
        >
          {title}
        </Typography>
      </Box>
      {children}
      <Box px={5}>
        {isEdit && isEdit?.id && (
          <div className="my-6">
            <Typography sx={EditedByTypography}>ID: {isEdit?.id}</Typography>
            <Typography sx={EditedByTypography}>
              Created: {formateTimeAndDate(isEdit?.addedDate)}{" "}
              {isEdit?.AddedBy && <> by {isEdit?.AddedBy}</>}
            </Typography>
            {isEdit?.editedDate && (
              <Typography sx={EditedByTypography}>
                Edited: {formateTimeAndDate(isEdit?.editedDate)}{" "}
                {isEdit?.editedBy && <> by {isEdit?.editedBy}</>}
              </Typography>
            )}
          </div>
        )}
      </Box>
    </Drawer>
  );
};

export default DrawerComponent;
