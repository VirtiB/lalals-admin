import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Box, Drawer, InputAdornment, TextField } from "@mui/material";
import { affiliatesSearchField, dataGridAffiliates } from "../common/Styles";
import { DataGrid } from "@mui/x-data-grid";
import { earningRequestsColumns } from "@/app/utils/tables";
import SearchIcon from "@mui/icons-material/Search";
import EarningRequestsDrawer from "./EarningRequestsDrawer";
import { useGlobalContext } from "@/app/context/global";

import { get, patch } from "@/app/utils/api-helper";
import { affiliatesInitialValues } from "@/app/utils/forms";
import SnackBar, { SnackbarState } from "../common/Snackbar";
import Image from "next/image";
import { handleSnackbarClick } from "@/app/utils";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";

const EarningRequestsTable = ({
  earningRequest,
  setEarningRequest,
  setIsLoading,
  isLoading,
  getEarningRequest,
  earningRequestRowData,
}: any) => {
  const { setShowSidebar } = useGlobalContext();

  const [selectedRow, setSelectedRow] = useState<any>("");
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [earningRequestSearchKeyword, setEarningRequestSearchKeyword] =
    useState<string>("");
  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const affiliatesValues = useMemo(() => {
    const matchedData: any = {};
    for (const key in affiliatesInitialValues) {
      if (selectedRow.hasOwnProperty(key)) {
        matchedData[key] = selectedRow[key];
      }
    }
    return matchedData;
  }, [selectedRow]);

  // const earningRequestRowData = useMemo(() => {
  //   if (earningRequest?.earningRequests?.length > 0) {
  //     return earningRequest?.earningRequests?.filter((data: any) => {
  //       const matchesKeyword = JSON.stringify(data)
  //         .toLowerCase()
  //         .includes(earningRequestSearchKeyword.toLowerCase());
  //       return matchesKeyword;
  //     });
  //   }
  // }, [earningRequest, earningRequestSearchKeyword]);

  const toggleDrawer = (type: any, rowData: any) => {
    setSelectedRow(rowData?.row);
    setDrawerState({ right: true });
    setShowSidebar(true);
  };

  const onCloseDrawerCall = () => {
    setShowSidebar(false);
    setDrawerState({ right: false });
  };

  // const getEarningRequest = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     const { data } = await get(`earning-requests?isAdmin=true`);
  //     setEarningRequest(data);
  //   } catch (error) {
  //     handleSnackbarClick(
  //       snackbarState,
  //       setSnackbarState,
  //       "error",
  //       `Error While Deleting Admin`
  //     );
  //     setIsLoading(false);
  //     setDrawerState({ right: false });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, [setEarningRequest, setIsLoading]);

  // useEffect(() => {
  //   getEarningRequest();
  // }, [getEarningRequest]);

  const list = () => (
    <>
      <CloseDrawerButton onClick={onCloseDrawerCall} />
      <Box sx={{ width: 420, paddingX: 3 }} role="presentation">
        <Box>
          <EarningRequestsDrawer
            affiliatesValues={affiliatesValues}
            // handleSubmit={handleSubmit}
            selectedRow={selectedRow}
            isLoading={isLoading}
            getEarningRequest={getEarningRequest}
          />
        </Box>
      </Box>
    </>
  );
  return (
    <div>
      <div className="w-1/2">
        <h1 className="text-lg font-medium mb-5 text-black ">
          Earning Requests
        </h1>
        <div className="my-4">
          <TextField
            placeholder="Search by email, userid..."
            size="small"
            value={earningRequestSearchKeyword}
            onChange={(e) =>
              setEarningRequestSearchKeyword(e.target.value.trim())
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={affiliatesSearchField}
          />
        </div>
        <DataGrid
          onRowClick={(rowData) => toggleDrawer("earningRequests", rowData)}
          loading={isLoading}
          disableColumnMenu
          disableColumnFilter
          rows={
            earningRequest?.earningRequests?.length > 0
              ? (earningRequestRowData as any)
              : []
          }
          columns={earningRequestsColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
          sx={dataGridAffiliates}
        />
      </div>
      <Drawer
        anchor="right"
        open={drawerState["right"]}
        onClose={onCloseDrawerCall}
        sx={{
          "& .MuiDrawer-paper": {
            width: "440px",
          },
        }}
        slotProps={{
          backdrop: { invisible: true },
        }}
      >
        {list()}
      </Drawer>
      <SnackBar
        setSnackbarState={setSnackbarState}
        snackbarState={snackbarState}
      />
    </div>
  );
};

export default EarningRequestsTable;
