"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { get } from "../utils/api-helper";
import { DataGrid } from "@mui/x-data-grid";
import { SnackbarOrigin } from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { debounce, generateHeaders, handleSnackbarClick } from "../utils";
import { dataGridCommonStyle } from "@/components/common/Styles";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";
import SnackBar from "../../components/common/Snackbar/index";
import { conversionsColumns } from "../utils/tables";
import Filters from "@/components/common/Filters";
import { ConversionsSortByFilters } from "../utils/data";

interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

const Conversions = () => {
  const [conversions, setConversions] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [select, setSelect] = useState(ConversionsSortByFilters[0]?.value);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [dateRangeState, setDateRangeState] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [privileges, setPrivileges] = useState<any>(null);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchProjects(page, pageSize);
  };

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchProjects = useCallback(
    async (page?: number, pageSize?: number) => {
      try {
        setIsLoading(true);
        const size = pageSize || 10;
        const pageDataObject: { [key: string]: any } = {
          limit: size,
          page: page || currentPage,
        };
        if (startDate) pageDataObject.start_date = startDate.toISOString();
        if (endDate) pageDataObject.end_date = endDate.toISOString();
        if (searchKeyword) pageDataObject.keyword = searchKeyword;
        if (select) pageDataObject.sortBy = [select];
        const pageData = encodeURIComponent(JSON.stringify(pageDataObject));

        const apiURL = `projects/all?filterData=${pageData}`;
        const { data } = await get(apiURL, generateHeaders());
        setConversions(data.projects);
        setTotalRows(data.count);
      } catch (error) {
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          "Error While Fetching Conversions"
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
    setSelect(ConversionsSortByFilters[0]?.value);
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("conversions");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);

  return (
    <>
      {privilegesLoaded && privileges?.canRead() && (
        <>
          <Filters
            label="Conversions"
            resetFilterHandler={resetFilterHandler}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            openCalendar={openCalendar}
            setOpenCalendar={setOpenCalendar}
            dateRangeState={dateRangeState}
            setDateRangeState={setDateRangeState}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            select={select}
            endDate={endDate}
            startDate={startDate}
            handleChange={handleChange}
            privileges={privileges}
            sortByFilters={ConversionsSortByFilters}
          />
          <DataGrid
            sx={dataGridCommonStyle}
            disableColumnMenu
            loading={isLoading}
            rows={conversions}
            columns={conversionsColumns}
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
        <Privilege name="Conversions" />
      )}
    </>
  );
};
export default Conversions;
