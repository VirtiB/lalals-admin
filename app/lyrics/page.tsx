"use client";
import { SelectChangeEvent } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import LyricsTable from "@/components/Lyrics/LyricsTable";
import { get, patch, post } from "../utils/api-helper";
import SnackBar, { SnackbarState } from "@/components/common/Snackbar";
import getUserRights from "@/hooks/useAdminRights";
import { useGlobalContext } from "../context/global";
import LyricsDrawer from "@/components/Lyrics/LyricsDrawer";
import Privilege from "@/components/Privilege";
import {
  debounce,
  generateHeaders,
  getUserDetails,
  handleSnackbarClick,
} from "../utils";
import { ConversionsSortByFilters, LyricsStatus } from "../utils/data";
import Filters from "@/components/common/Filters";

const Lyrics = () => {
  const { setShowSidebar } = useGlobalContext();
  const [lyrics, setLyrics] = useState<any>({
    lyrics: [],
    count: 0,
  });
  const [privileges, setPrivileges] = useState<any>(null);
  const [drawerState, setDrawerState] = useState(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>(null);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [isFetchDataLoading, setIsFetchDataLoading] = useState<boolean>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [sortbySelect, setSortbySelect] = useState<any>(null);
  const [select, setSelect] = useState(ConversionsSortByFilters[0]?.value);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [dateRangeState, setDateRangeState] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };
  const handleStatusChange = (event: SelectChangeEvent) => {
    setSortbySelect(event.target.value as string);
    const buildQuery = {
      status: [event.target.value],
    };
    const filterData = encodeURIComponent(JSON.stringify(buildQuery));
  };
  const resetFilterHandler = () => {
    setSearchKeyword("");
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect("");
    setSortbySelect(null);
  };

  const rowData = useMemo(() => {
    return (
      lyrics &&
      lyrics?.lyrics?.filter((data: any) => {
        const matchesKeyword = JSON.stringify(data)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return matchesKeyword;
      })
    );
  }, [lyrics, searchKeyword]);
  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchLyrics(page, pageSize);
  };
  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchLyrics = useCallback(
    async (page?: number, pageSize?: number) => {
      try {
        setIsLoading(true);
        setIsFetchDataLoading(true);
        const pageDataObject: { [key: string]: any } = {
          limit: pageSize || 10,
          page: page || currentPage,
        };
        if (startDate) pageDataObject.start_date = startDate.toISOString();
        if (endDate) pageDataObject.end_date = endDate.toISOString();
        if (searchKeyword) pageDataObject.keyword = searchKeyword;
        if (select) pageDataObject.sortBy = [select];
        const paginationData = encodeURIComponent(
          JSON.stringify(pageDataObject)
        );
        const { data } = await get(
          `lyrics?filterData=${paginationData}`,
          generateHeaders()
        );
        setLyrics({ lyrics: data?.lyrics });
        setTotalRows(data?.count);
      } catch (error: any) {
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          "Error While Fetching Lyrics"
        );
      } finally {
        setIsFetchDataLoading(false);
        setIsLoading(false);
      }
    },
    [startDate, endDate, searchKeyword, select]
  );

  useEffect(() => {
    handleSearchDebounced(searchKeyword);
  }, [searchKeyword, handleSearchDebounced]);

  const handleSubmit = async (values: any, selectedTags: any) => {
    const tags = selectedTags?.map((tag: any, index: any) => tag.value);
    setIsLoading(true);
    try {
      if (selectedRow) {
        const { data } = await patch(
          `lyrics/${selectedRow?.id}?isAdmin=true`,
          {
            userId: getUserDetails()?.id,
            title: values?.title,
            status: values?.status,
            language: values?.language,
            content: values?.lyrics,
            voice_id: values?.voice_id,
            tags: tags,
          },
          generateHeaders()
        );
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          "Lyrics Updated Successfully"
        );
        onCloseDrawerCall();
        setDrawerState(false);
      } else {
        const { data } = await post(
          "lyrics?isAdmin=true",
          {
            userId: getUserDetails()?.id,
            title: values?.title,
            status: values?.status,
            language: values?.language,
            content: values?.lyrics,
            voice_id: values?.voice_id,
            tags: tags,
          },
          generateHeaders()
        );
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          "Lyrics Created Successfully"
        );
        onCloseDrawerCall();
        setDrawerState(false);
      }
    } catch (error: any) {
      setIsLoading(false);
      onCloseDrawerCall();
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error While ${selectedRow ? "Updating" : "Creating"} Lyrics`
      );
    } finally {
      setIsLoading(false);
      fetchLyrics();
    }
  };
  const toggleDrawer = () => {
    setDrawerState(true);
  };
  const onCloseDrawerCall = () => {
    setSelectedRow(null);
    setShowSidebar(false);
    setDrawerState(false);
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("lyrics");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);
  useEffect(() => {
    fetchLyrics();
    setPrivileges(getUserRights("lyrics"));
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);

  return (
    <>
      {privilegesLoaded && privileges?.canRead() && (
        <div>
          <Filters
            label="Lyrics"
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
            handleChange={handleChange}
            toggleDrawer={toggleDrawer}
            privileges={privileges}
            selectFilters={LyricsStatus}
            statusLabel="Category"
            select={select}
            sortByFilters={ConversionsSortByFilters}
          />
          <p className="text-sm text-[#8D8D8D] mt-2">
            Total number of lyrics: {totalRows}
          </p>
          <LyricsTable
            onCloseDrawerCall={onCloseDrawerCall}
            isLoading={isLoading}
            drawerState={drawerState}
            setDrawerState={setDrawerState}
            isFetchDataLoading={isFetchDataLoading}
            toggleDrawer={toggleDrawer}
            rowData={lyrics}
            setIsLoading={setIsLoading}
            fetchLyrics={fetchLyrics}
            handleSubmit={handleSubmit}
            selectedRow={selectedRow}
            setSelectedRow={setSelectedRow}
            handleSnackbarClick={handleSnackbarClick}
            handlePageChange={handlePageChange}
            totalRows={totalRows}
            privileges={privileges}
            snackbarState={snackbarState}
            setSnackbarState={setSnackbarState}
          />
          <SnackBar
            setSnackbarState={setSnackbarState}
            snackbarState={snackbarState}
          />
        </div>
      )}
      {privilegesLoaded && !privileges?.canRead() && (
        <Privilege name="Lyrics" />
      )}
    </>
  );
};

export default Lyrics;
