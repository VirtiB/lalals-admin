import React, { useCallback, useState } from "react";
import {
  Box,
  Drawer,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { affiliatesSearchField, dataGridAffiliates } from "../common/Styles";
import { DataGrid } from "@mui/x-data-grid";
import { recentReferralColumns } from "@/app/utils/tables";
import SearchIcon from "@mui/icons-material/Search";
import CommonSwitch from "../common/Switch";
import { useGlobalContext } from "@/app/context/global";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import RecentVisitsDrawer from "./RecentVisitsDrawer";
import SnackBar, { SnackbarState } from "../common/Snackbar";
import Image from "next/image";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";

const RecentVisitsTable = ({
  recentVisits,
  recentVisitsRowData,
  handlePageChange,
  recentVisitsTotalRows,
  isLoading,
  recentVisitsSearchKeyword,
  setRecentVisitsSearchKeyword,
}: any) => {
  const { setShowSidebar } = useGlobalContext();

  const [checked, setChecked] = useState<boolean>(false);
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

  const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { checked },
    } = event;
    setChecked(checked);
  };

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

  const list = () => (
    <>
      <CloseDrawerButton onClick={onCloseDrawerCall} />
      <Box sx={{ width: 420, paddingX: "41px" }} role="presentation">
        <Box>
          <RecentVisitsDrawer
            // handleSubmit={handleSubmit}
            selectedRow={selectedRow}
          />
        </Box>
      </Box>
    </>
  );
  return (
    <div>
      <div>
        <div className="flex mb-5 justify-between mr-15">
          <h1 className="text-lg font-medium  text-black w-2/5">
            Recent Visits
          </h1>
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography className="text-base font-medium text-black">
              Only show converted
            </Typography>
            <CommonSwitch handleChange={handleSwitchChange} checked={checked} />
          </Stack>
        </div>
        <div className="my-4">
          <TextField
            placeholder="Search by email, userid..."
            size="small"
            value={recentVisitsSearchKeyword}
            onChange={(e) =>
              setRecentVisitsSearchKeyword(e.target.value.trim())
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
          onRowClick={(rowData: any) => toggleDrawer("recentVisits", rowData)}
          loading={isLoading}
          disableColumnMenu
          disableColumnFilter
          rows={
            recentVisits?.length > 0
              ? checked
                ? recentVisitsRowData?.filter((data: any) => data.order_id)
                : (recentVisitsRowData as any)
              : []
          }
          columns={recentReferralColumns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
              },
            },
          }}
          paginationMode="server"
          rowCount={recentVisitsTotalRows}
          onPaginationModelChange={(page: any) => {
            const currentPage = page.page + 1;
            handlePageChange(currentPage, page.pageSize);
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

export default RecentVisitsTable;
