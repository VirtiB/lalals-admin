"use client";
import { DataGrid } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { dataGridCommonStyle } from "../common/Styles";
import { Drawer } from "@mui/material";
import LyricsDrawer from "./LyricsDrawer";
import { useGlobalContext } from "@/app/context/global";
import { CreateLyricsInitialValues } from "@/app/utils/forms";
import { lyricsColumns } from "@/app/utils/tables";
import DrawerComponent from "../common/Drawer";
import { deleted } from "@/app/utils/api-helper";
import { generateHeaders } from "@/app/utils";

const LyricsTable = ({
  isFetchDataLoading,
  rowData,
  setIsLoading,
  fetchLyrics,
  handleSubmit,
  setSelectedRow,
  selectedRow,
  setDrawerState,
  isLoading,
  drawerState,
  onCloseDrawerCall,
  handleSnackbarClick,
  handlePageChange,
  totalRows,
  privileges,
  snackbarState,
  setSnackbarState,
}: any) => {
  const { setShowSidebar } = useGlobalContext();

  const lyricsValues = useMemo(() => {
    const matchedData: any = {};
    for (const key in CreateLyricsInitialValues) {
      if (selectedRow && selectedRow.hasOwnProperty(key)) {
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

  const list = () => (
    <LyricsDrawer
      onCloseDrawerCall={onCloseDrawerCall}
      setDrawerState={setDrawerState}
      lyricsValues={lyricsValues}
      selectedRow={selectedRow}
      setIsLoading={setIsLoading}
      fetchLyrics={fetchLyrics}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
      handleSnackbarClick={handleSnackbarClick}
      privileges={privileges}
      snackbarState={snackbarState}
      setSnackbarState={setSnackbarState}
    />
  );

  const deleteLyrics = async () => {
    try {
      setIsLoading(true);
      await deleted(
        `lyrics/${selectedRow?.id}?isAdmin=true`,
        generateHeaders()
      );
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "success",
        `Lyrics Deleted Successfully`
      );
      fetchLyrics();
      onCloseDrawerCall();
    } catch (err) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error While Deleting Lyrics`
      );
    } finally {
    }
  };
  const EditDetails = {
    id: selectedRow?.id,
    addedDate: selectedRow?.row?.date_added,
    editedDate: selectedRow?.row?.date_edited,
    editedBy: selectedRow?.row?.edited_by,
  };

  return (
    <div>
      <DataGrid
        onRowClick={(rowData) => {
          toggleDrawer(rowData);
          setSelectedRow(rowData);
        }}
        sx={dataGridCommonStyle}
        disableColumnMenu
        loading={isFetchDataLoading}
        rows={rowData?.lyrics}
        columns={lyricsColumns}
        paginationMode="server"
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        rowCount={totalRows}
        onPaginationModelChange={(page: any) => {
          const currentPage = page.page + 1;
          handlePageChange(currentPage, page.pageSize);
        }}
        pageSizeOptions={[5, 10, 20]}
      />
      <DrawerComponent
        open={drawerState}
        onClose={onCloseDrawerCall}
        title={selectedRow?.row?.id ? "Edit Lyrics" : "Add Lyrics"}
        isEdit={EditDetails}
        privileges={privileges}
        deleteFunction={deleteLyrics}
      >
        <LyricsDrawer
          onCloseDrawerCall={onCloseDrawerCall}
          setDrawerState={setDrawerState}
          lyricsValues={lyricsValues}
          selectedRow={selectedRow}
          setIsLoading={setIsLoading}
          fetchLyrics={fetchLyrics}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          handleSnackbarClick={handleSnackbarClick}
          privileges={privileges}
          snackbarState={snackbarState}
          setSnackbarState={setSnackbarState}
        />
      </DrawerComponent>
    </div>
  );
};

export default LyricsTable;
