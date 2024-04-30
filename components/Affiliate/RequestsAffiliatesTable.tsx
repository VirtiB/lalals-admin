import React, { useCallback, useMemo, useState } from "react";
import { Box, Drawer, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { affiliatesSearchField, dataGridAffiliates } from "../common/Styles";
import { DataGrid } from "@mui/x-data-grid";
import { requestsAffiliatesColumns } from "@/app/utils/tables";
import SnackBar, { SnackbarState } from "../common/Snackbar";

import RequestedAffiliateDrawer from "./RequestedAffiliateDrawer";
import { useGlobalContext } from "@/app/context/global";
import { affiliatesInitialValues } from "@/app/utils/forms";
import Image from "next/image";

const RequestsAffiliatesTable = ({
  isLoading,
  handleRowClick,
  privileges,
  requestedAffiliates,
  setRequestedAffiliates,
  rowDataRequestAffiliates,
  updateRequestedAffiliate,
  onCloseDrawerCall,
  toggleDrawer,
  drawerState,
  requestedAffiliatesSelectedRow,
}: any) => {
  const [requestSearchKeyword, setRequestSearchKeyword] = useState<string>("");
  const [selectedRow, setSelectedRow] = useState<any>("");

  const [affiliatesData, setAffiliatesData] = useState({
    affiliates: [],
    revenue: 0,
    earnings: 0,
  });

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
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

  const list = () => (
    <>
      <Box sx={{ width: 420 }} role="presentation">
        <Box>
          <RequestedAffiliateDrawer
            selectedRow={selectedRow}
            updateRequestedAffiliate={updateRequestedAffiliate}
            isLoading={isLoading}
            requestedAffiliatesSelectedRow={requestedAffiliatesSelectedRow}
            affiliatesValues={affiliatesValues}
            privileges={privileges}
            onCloseDrawerCall={onCloseDrawerCall}
          />
        </Box>
      </Box>
    </>
  );

  return (
    <>
      <div className="w-1/2">
        <h1 className="text-lg font-medium mb-5 text-black ">
          Requests Affiliates
        </h1>
        <div className="my-4">
          <TextField
            placeholder="Search by email, userid..."
            size="small"
            value={requestSearchKeyword}
            onChange={(e) => setRequestSearchKeyword(e.target.value.trim())}
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
          onRowClick={(rowData) => {
            toggleDrawer("requestsAffiliates", rowData);
            setSelectedRow(rowData?.row);
            handleRowClick(rowData);
          }}
          loading={isLoading}
          disableColumnMenu
          disableColumnFilter
          rows={
            requestedAffiliates?.length > 0
              ? (rowDataRequestAffiliates as any)
              : []
          }
          columns={requestsAffiliatesColumns}
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
    </>
  );
};

export default RequestsAffiliatesTable;
