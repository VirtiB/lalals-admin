"use client";
import { useCallback, useEffect, useState } from "react";
import { get } from "../utils/api-helper";
import { DataGrid } from "@mui/x-data-grid";
import { SelectChangeEvent } from "@mui/material/Select";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { dataGridCommonStyle } from "@/components/common/Styles";
import getUserRights from "@/hooks/useAdminRights";
import { SnackbarState } from "@/components/common/Snackbar";
import Privilege from "@/components/Privilege";
import { MenuItems, OrdersCategories } from "../utils/data";
import { OrdersColumns } from "../utils/tables";
import Filters from "@/components/common/Filters";
import { debounce } from "../utils";

const Orders = () => {
  const [orders, setOrders] = useState<any>({
    orders: [],
    count: 0,
    has_more: false,
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [select, setSelect] = useState(MenuItems[0]?.value);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [sortbyCategory, setSortbyCategory] = useState<any>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
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
  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };
  const [privileges, setPrivileges] = useState<any>(null);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

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

  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchOrders(page, pageSize);
  };

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchOrders = useCallback(
    async (page?: number, pageSize?: number) => {
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
        setIsLoading(true);
        const { data } = await get(`orders/all?filterData=${paginationData}`);
        setOrders({
          orders: data?.orders,
          count: data?.count,
        });
        setTotalRows(data?.count);
      } catch (error: any) {
        handleSnackbarClick("error", "Error");
      } finally {
        setIsLoading(false);
      }
    },
    [startDate, endDate, select]
  );

  useEffect(() => {
    handleSearchDebounced(searchKeyword);
  }, [searchKeyword, handleSearchDebounced]);

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSortbyCategory(event.target.value as string);
    const buildQuery = {
      status: [event.target.value],
    };
    const filterData = encodeURIComponent(JSON.stringify(buildQuery));
  };
  const resetFilterHandler = () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect("");
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("orders");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);
  return (
    <>
      {privilegesLoaded && privileges?.canRead() && (
        <>
          <Filters
            label={"Orders"}
            resetFilterHandler={resetFilterHandler}
            searchKeyword={searchKeyword}
            setSearchKeyword={setSearchKeyword}
            openCalendar={openCalendar}
            setOpenCalendar={setOpenCalendar}
            dateRangeState={dateRangeState}
            setDateRangeState={setDateRangeState}
            setEndDate={setEndDate}
            setStartDate={setStartDate}
            sortbyCategory={sortbyCategory}
            handleStatusChange={handleStatusChange}
            select={select}
            endDate={endDate}
            startDate={startDate}
            handleChange={handleChange}
            selectFilters={OrdersCategories}
            statusLabel={"Category"}
            privileges={privileges}
            sortByFilters={MenuItems}
          />
          <DataGrid
            loading={isLoading}
            sx={dataGridCommonStyle}
            disableColumnMenu
            rows={orders?.orders}
            columns={OrdersColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            paginationMode="server"
            rowCount={totalRows}
            onPaginationModelChange={(page: any) => {
              const currentPage = page.page + 1;
              handlePageChange(currentPage, page.pageSize);
            }}
            pageSizeOptions={[5, 10, 20]}
          />
        </>
      )}
      {privilegesLoaded && !privileges?.canRead() && (
        <Privilege name="Orders" />
      )}
    </>
  );
};
export default Orders;
