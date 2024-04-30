"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { dataGridCommonStyle } from "@/components/common/Styles";
import { useGlobalContext } from "../context/global";
import { DataGrid } from "@mui/x-data-grid";
import {
  debounce,
  generateHeaders,
  getUserDetails,
  handleSnackbarClick,
} from "../utils";
import { musicColumns } from "../utils/tables";
import SnackBar from "../../components/common/Snackbar/index";
import { get, patch } from "../utils/api-helper";
import getUserRights from "@/hooks/useAdminRights";
import MusicDrawer from "@/components/Music/MusicDrawer";
import { S3Client } from "@aws-sdk/client-s3";
import "./index.css";
import Filters from "@/components/common/Filters";
import { SnackbarState } from "../utils/interface";
import Privilege from "@/components/Privilege";
import { MusicSortByFilters } from "../utils/data";
import DrawerComponent from "@/components/common/Drawer";

const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION ?? "",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? "",
  },
});

const Music = () => {
  const { setShowSidebar } = useGlobalContext();

  const [music, setMusic] = useState<Array<any>>([]);
  const [isFetchDataLoading, setIsFetchDataLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [privileges, setPrivileges] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [dateRangeState, setDateRangeState] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [selectedRow, setSelectedRow] = useState<any>("");
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [drawerState, setDrawerState] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
  const [select, setSelect] = useState(MusicSortByFilters[0]?.value);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  const toggleDrawer = (rowData: any) => {
    setSelectedRow(rowData?.row);
    setDrawerState(!drawerState);
  };

  const onCloseDrawerCall = () => {
    setDrawerState(false);
  };

  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchMusic(page, pageSize);
  };

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchMusic = useCallback(
    async (page?: number, pageSize?: number) => {
      const size = pageSize || 10;
      const pageData = encodeURIComponent(
        JSON.stringify({
          limit: size,
          page: page || currentPage,
          start_date: startDate ? startDate.toISOString() : null,
          end_date: endDate ? endDate.toISOString() : null,
        })
      );
      try {
        setIsFetchDataLoading(true);
        const { data } = await get(`music?filterData=${pageData}`);
        setMusic(data?.music);
        setTotalRows(data?.count);
      } catch (error: any) {
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          "Error While Fetching Music"
        );
      } finally {
        setIsFetchDataLoading(false);
      }
    },
    [startDate, endDate, searchKeyword, select]
  );

  useEffect(() => {
    handleSearchDebounced(searchKeyword);
  }, [searchKeyword, handleSearchDebounced]);

  const rowData = useMemo(() => {
    if (music?.length > 0) {
      return music.filter((data) => {
        const matchesKeyword = JSON.stringify(data)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return matchesKeyword;
      });
    }
  }, [music, searchKeyword, startDate, endDate]);

  const resetFilterHandler = () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect(MusicSortByFilters[0]?.value);
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      if (privileges?.canWrite()) {
        const formData = new FormData();

        const {
          voices,
          user,
          artists,
          likes,
          plays,
          plays_7d,
          speed,
          userId,
          avatar,
          status,
          ...filteredValues
        } = values;
        Object.entries(filteredValues).forEach(([key, value]) => {
          formData.append(key, value as any);
        });

        formData.append("file", uploadedFile);
        formData.append("status", values?.status);
        formData.append("likes", String(values?.likes));
        formData.append("plays", values?.plays);
        formData.append("userId", getUserDetails()?.id);

        const response = await patch(
          `music/${selectedRow?.id}?isAdmin=true`,
          formData,
          generateHeaders()
        );
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          "Music Updated Successfully"
        );
        setShowSidebar(false);
        onCloseDrawerCall();
        setUploadedFile(null);
      } else {
        onCloseDrawerCall();
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          `You dont have permission to update music`
        );
      }
    } catch (error: any) {
      onCloseDrawerCall();
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        "Error While Updating Music"
      );
    } finally {
      setIsLoading(false);
      fetchMusic();
    }
  };

  const EditDetails = {
    id: selectedRow?.id,
    addedDate: selectedRow?.date_added,
    addedBy: selectedRow?.added_by,
    editedDate: selectedRow?.date_edited,
    editedBy: selectedRow?.edited_by,
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("music");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);
  useEffect(() => {
    fetchMusic();
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);
  return (
    <>
      {privilegesLoaded && privileges?.canRead() && (
        <>
          <Filters
            label="Music"
            resetFilterHandler={resetFilterHandler}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            openCalendar={openCalendar}
            setOpenCalendar={setOpenCalendar}
            dateRangeState={dateRangeState}
            setDateRangeState={setDateRangeState}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            endDate={endDate}
            startDate={startDate}
            privileges={privileges}
            sortByFilters={MusicSortByFilters}
            select={select}
          />
          <DataGrid
            onRowClick={(rowData) => {
              toggleDrawer(rowData);
            }}
            disableColumnMenu
            loading={isFetchDataLoading}
            rows={music}
            columns={musicColumns}
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
            sx={dataGridCommonStyle}
            className="music-table"
          />
          <SnackBar
            setSnackbarState={setSnackbarState}
            snackbarState={snackbarState}
          />

          <DrawerComponent
            open={drawerState}
            onClose={toggleDrawer}
            title={"Update Music"}
            isEdit={EditDetails}
          >
            <MusicDrawer
              selectedRow={selectedRow}
              onCloseDrawerCall={onCloseDrawerCall}
              isLoading={isLoading}
              setUploadedFile={setUploadedFile}
              handleSubmit={handleSubmit}
              privileges={privileges}
            />
          </DrawerComponent>
        </>
      )}
      {privilegesLoaded && !privileges?.canRead() && <Privilege name="Music" />}
    </>
  );
};

export default Music;
