import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Drawer, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { dataGridCommonStyle } from "../common/Styles";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import SnackBar, { SnackbarState } from "../common/Snackbar";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { get, patch } from "@/app/utils/api-helper";
import { useGlobalContext } from "@/app/context/global";
import { trainingInitialValues } from "@/app/utils/forms";
import TrainingDrawer from "./TrainingDrawer";
import { calculateTimeDifference } from "@/app/utils";
import { trainingColumns } from "@/app/utils/tables";

const TrainingTable = ({
  isLoading,
  handleSubmit,
  searchKeyword,
  rowData,
}: any) => {
  const { setShowSidebar } = useGlobalContext();

  const [requestSearchKeyword, setRequestSearchKeyword] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<any>("");
  const [drawerState, setDrawerState] = useState({
    right: false,
  });

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const handleSnackbarClick = useCallback(
    (type: string, message: string) => {
      setSnackbarState({
        ...snackbarState,
        open: true,
        type: type,
        message: message,
      });
    },
    [snackbarState]
  );

  const trainingValues = useMemo(() => {
    const matchedData: any = {};
    for (const key in trainingInitialValues) {
      if (selectedRow.hasOwnProperty(key)) {
        matchedData[key] = selectedRow[key];
      }
    }
    return matchedData;
  }, [selectedRow]);

  const toggleDrawer = (rowData: any) => {
    setSelectedRow(rowData?.row);
    setDrawerState({ right: true });
    setShowSidebar(true);
  };

  const onCloseDrawerCall = () => {
    setShowSidebar(false);
    setDrawerState({ right: false });
  };

  const list = () => (
    <>
      <div className="ml-[10px]">
        <button onClick={onCloseDrawerCall}>
          <KeyboardDoubleArrowRightIcon />
        </button>
      </div>
      <Box sx={{ width: 420, paddingX: 3 }} role="presentation">
        <Box>
          <TrainingDrawer
            selectedRow={selectedRow}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            trainingValues={trainingValues}
          />
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <DataGrid
        sx={dataGridCommonStyle}
        onRowClick={(rowData) => toggleDrawer(rowData)}
        disableColumnMenu
        rows={rowData}
        columns={trainingColumns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 20,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
      />

      <Drawer
        anchor="right"
        open={drawerState["right"]}
        onClose={onCloseDrawerCall}
        sx={{
          "& .MuiDrawer-paper": {
            width: "420px",
          },
        }}
      >
        {list()}
      </Drawer>
      <SnackBar
        setSnackbarState={setSnackbarState}
        snackbarState={snackbarState}
      />
    </>
  );
};

export default TrainingTable;
