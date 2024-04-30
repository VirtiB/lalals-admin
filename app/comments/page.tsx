"use client";

import { dataGridCommonStyle } from "@/components/common/Styles";
import { SelectChangeEvent, SnackbarOrigin } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useState, useEffect, useCallback, useMemo } from "react";
import { CommentsSortByFilters, TrainingStatus } from "../utils/data";
import { commentColumns } from "../utils/tables";
import { get } from "../utils/api-helper";
import SnackBar from "../../components/common/Snackbar/index";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import Filters from "@/components/common/Filters";
import { debounce, handleSnackbarClick } from "../utils";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";

interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

const Comments = () => {
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [sortbySelect, setSortbySelect] = useState<any>(null);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [privileges, setPrivileges] = useState<any>(null);
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [comments, setComments] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalRows, setTotalRows] = useState(0);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
  const [select, setSelect] = useState(CommentsSortByFilters[0]?.value);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    getComment(page, pageSize);
  };
  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const getComment = useCallback(
    async (page?: number, pageSize?: number) => {
      setIsLoading(true);
      const pageDataObject: { [key: string]: any } = {
        limit: pageSize || 10,
        page: page || currentPage,
      };

      if (startDate) pageDataObject.start_date = startDate.toISOString();
      if (endDate) pageDataObject.end_date = endDate.toISOString();
      if (searchKeyword) pageDataObject.keyword = searchKeyword;
      if (select) pageDataObject.sortBy = [select];

      const paginationData = encodeURIComponent(JSON.stringify(pageDataObject));
      try {
        const { data } = await get(`comments?filterData=${paginationData}`);
        setComments(data?.comments);
        setTotalRows(data.count);
      } catch (error: any) {
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          "Error While Fetching Comments"
        );
      } finally {
        setIsLoading(false);
      }
    },
    [startDate, endDate, searchKeyword, select]
  );

  useEffect(() => {
    handleSearchDebounced(searchKeyword);
  }, [searchKeyword, handleSearchDebounced]);

  const resetFilterHandler = () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect(CommentsSortByFilters[0]?.value);
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("comments");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);

  useEffect(() => {
    getComment();
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);

  return (
    <>
      {privilegesLoaded && privileges?.canRead() && (
        <>
          <Filters
            label={"Comments"}
            resetFilterHandler={resetFilterHandler}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            openCalendar={openCalendar}
            setOpenCalendar={setOpenCalendar}
            dateRangeState={dateRangeState}
            setDateRangeState={setDateRangeState}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            sortbyCategory={sortbySelect}
            endDate={endDate}
            startDate={startDate}
            statusLabel={"Status"}
            privileges={privileges}
            selectFilters={TrainingStatus}
            sortByFilters={CommentsSortByFilters}
            select={select}
          />
          <DataGrid
            sx={dataGridCommonStyle}
            disableColumnMenu
            loading={isLoading}
            rows={comments}
            columns={commentColumns}
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
          <SnackBar
            setSnackbarState={setSnackbarState}
            snackbarState={snackbarState}
          />
        </>
      )}
      {privilegesLoaded && !privileges?.canRead() && (
        <Privilege name="Comments" />
      )}
    </>
  );
};

export default Comments;
