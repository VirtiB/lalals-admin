import React, { useState } from "react";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";
import { Alert } from "@mui/material";

export interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

function SnackBar({
  setSnackbarState,
  snackbarState,
}: {
  setSnackbarState: (data: any) => void;
  snackbarState: any;
}) {
  const { vertical, horizontal, open, type, message } = snackbarState;

  const handleSnackbarClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarState({ ...snackbarState, open: false });
  };

  return (
    <div>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical, horizontal }}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={type}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default SnackBar;
