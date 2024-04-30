import React, { useCallback, useMemo, useState } from "react";
import { Box, Drawer, InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { affiliatesSearchField, dataGridAffiliates } from "../common/Styles";
import { DataGrid } from "@mui/x-data-grid";
import { affiliatesColumns } from "@/app/utils/tables";
import { useGlobalContext } from "@/app/context/global";

import AffiliateDrawer from "./AffiliateDrawer";
import { affiliatesInitialValues } from "@/app/utils/forms";
import { get, patch } from "@/app/utils/api-helper";
import SnackBar, { SnackbarState } from "../common/Snackbar";
import Image from "next/image";

const AffiliatesTable = ({
  setSearchKeyword,
  searchKeyword,
  affiliatesData,
  setAffiliatesData,
  rowData,
  isLoading,
  setIsLoading,
}: any) => {
  const { setShowSidebar } = useGlobalContext();

  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [selectedRow, setSelectedRow] = useState<any>("");
  const [requestedAffiliates, setRequestedAffiliates] = useState<Array<any>>(
    []
  );

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

  const toggleDrawer = (type: any, rowData: any) => {
    setSelectedRow(rowData?.row);
    setDrawerState({ right: true });
    setShowSidebar(true);
  };

  const onCloseDrawerCall = () => {
    // setCouponDetails(createCouponInitialValues);
    setShowSidebar(false);
    setDrawerState({ right: false });
  };

  const updateRequestedAffiliate = async (values: any) => {
    try {
      setIsLoading(true);
      await patch(`affiliates/${selectedRow.id}`, values);
      setDrawerState({ right: false });
    } catch (error) {
      handleSnackbarClick("error", `Error While Updating Requested Affiliates`);
      setIsLoading(false);
      setDrawerState({ right: false });
    } finally {
      setIsLoading(false);
    }
  };

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

  const getAffiliates = useCallback(async () => {
    try {
      const { data } = await get("affiliates");
      const pendingAffiliates = data.data.filter(
        (affiliate: any) => affiliate.status == "PENDING"
      );
      setRequestedAffiliates(pendingAffiliates);
      const activeAffiliates = data.data.filter(
        (affiliate: any) => affiliate.status == "ACTIVE"
      );
      setAffiliatesData({
        affiliates: activeAffiliates,
        revenue: data.revenue,
        earnings: data.earnings,
      });
    } catch {
      handleSnackbarClick("error", `Error While Fetching Affiliates`);
    }
  }, [handleSnackbarClick, setAffiliatesData]);

  const list = () => (
    <>
      <Box sx={{ width: 420 }} role="presentation">
        <Box>
          <AffiliateDrawer
            selectedRow={selectedRow}
            updateRequestedAffiliate={updateRequestedAffiliate}
            isLoading={isLoading}
            affiliatesValues={affiliatesValues}
            onCloseDrawerCall={onCloseDrawerCall}
          />
        </Box>
      </Box>
    </>
  );
  return (
    <>
      {" "}
      <div>
        <div className="">
          <h1 className="text-lg font-medium mb-5 text-black">Affiliates</h1>
          <div className="my-4">
            <TextField
              placeholder="Search by email, userid..."
              size="small"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value.trim())}
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
            onRowClick={(rowData) => toggleDrawer("Affiliates", rowData)}
            loading={isLoading}
            disableColumnMenu
            disableColumnFilter
            rows={
              affiliatesData?.affiliates?.length > 0 ? (rowData as any) : []
            }
            columns={affiliatesColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            sx={dataGridAffiliates}
          />
        </div>
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

export default AffiliatesTable;
