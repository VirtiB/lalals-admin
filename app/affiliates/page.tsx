"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { get, patch } from "../utils/api-helper";
import { SnackbarState } from "@/components/common/Snackbar";
import SnackBar from "../../components/common/Snackbar/index";
import { useGlobalContext } from "../context/global";
import { affiliatesInitialValues } from "../utils/forms";
import AffiliatesMetrics from "@/components/Affiliate/AffiliatesMetrics";
import AffiliatesTable from "@/components/Affiliate/AffiliatesTable";
import RequestsAffiliatesTable from "@/components/Affiliate/RequestsAffiliatesTable";
import EarningRequestsTable from "@/components/Affiliate/EarningRequestsTable";
import RecentVisitsTable from "@/components/Affiliate/RecentVisitsTable";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";
import { debounce, generateHeaders } from "../utils";

const Affiliates = () => {
  const { setShowSidebar } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRequestedLoading, setIsRequestedLoading] = useState<boolean>(false);
  const [isEarningRequestLoading, setIsEarningRequestLoading] =
    useState<boolean>(false);
  const [isRecentVisitLoading, setIsRecentVisitLoading] =
    useState<boolean>(false);
  const [isAffiliatesLoading, setIsAffiliatesLoading] =
    useState<boolean>(false);
  const [selectedRow, setSelectedRow] = useState<any>("");
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [requestSearchKeyword, setRequestSearchKeyword] = useState<string>("");
  const [privileges, setPrivileges] = useState<any>(null);
  const [recentVisitsSearchKeyword, setRecentVisitsSearchKeyword] =
    useState<string>("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [affiliatesData, setAffiliatesData] = useState({
    affiliates: [],
    revenue: 0,
    earnings: 0,
    count: 0,
  });
  const [earningRequest, setEarningRequest] = useState({
    earningRequests: [],
    unpaid: 0,
  });
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
  const [requestedAffiliates, setRequestedAffiliates] = useState<Array<any>>(
    []
  );
  const [recentVisits, setRecentVisits] = useState<Array<any>>([]);
  const [totalAffiliatesRows, setTotalAffiliatesRows] = useState(0);
  const [totalRequestsAffiliatesRows, setTotalRequestsAffiliatesRows] =
    useState(0);
  const [earningTotalRows, setEarningTotalRows] = useState(0);
  const [recentVisitsTotalRows, setRecentVisitsTotalRows] = useState(0);
  const [recentVisitsCurrentPage, setRecentVisitsCurrentPage] = useState(1);
  const [earningRequestSearchKeyword, setEarningRequestSearchKeyword] =
    useState<string>("");
  const [requestedAffiliatesSelectedRow, setRequestedAffiliatesSelectedRow] =
    useState<any>();
  const [pageSizeOptions, setPageSizeOptions] = useState<number[]>([5, 10, 20]);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");
  const [debouncedRequestedSearchKeyword, setDebouncedRequestedSearchKeyword] =
    useState("");
  const [
    debouncedRecentVisitsSearchKeyword,
    setDebouncedRecentVisitsSearchKeyword,
  ] = useState("");
  const [debouncedEarningRequestKeyword, setDebouncedEarningRequestKeyword] =
    useState("");

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

  const handleRecentVistsPageChange = (page: any, pageSize: any) => {
    setRecentVisitsCurrentPage(page);
    getRecentVisits(page, pageSize);
  };
  const handleRecentVisitsSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedRecentVisitsSearchKeyword(value);
    }, 200),
    []
  );
  const getRecentVisits = useCallback(async (page?: number, pageSize?: any) => {
    const pageDataObject: { [key: string]: any } = {
      limit: 10,
      page: page,
    };
    if (requestSearchKeyword) pageDataObject.keyword = requestSearchKeyword;
    const pageData = encodeURIComponent(JSON.stringify(pageDataObject));
    try {
      const { data } = await get(
        `recent-visits?filterData=${pageData}&isAdmin=true`,
        generateHeaders()
      );
      setRecentVisits(data?.recentVisits);
      setRecentVisitsTotalRows(data?.count);
    } catch (error) {
      handleSnackbarClick("error", `Error While Fetching Recent Visits`);
    }
  }, []);
  useEffect(() => {
    handleAffiliateSearchDebounced(recentVisitsSearchKeyword);
  }, [recentVisitsSearchKeyword, handleRecentVisitsSearchDebounced]);

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

  const handleAffiliateSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );
  const getAffiliates = useCallback(async (page?: number) => {
    const pageDataObject: { [key: string]: any } = {
      limit: 10,
      page: page,
    };
    if (searchKeyword) pageDataObject.keyword = searchKeyword;
    const pageData = encodeURIComponent(JSON.stringify(pageDataObject));
    try {
      setIsAffiliatesLoading(true);
      const { data } = await get(
        `affiliates?filterData=${pageData}&isAdmin=true`
      );
      setAffiliatesData({
        affiliates: data?.affiliates,
        revenue: data?.revenue,
        earnings: data?.earnings,
        count: data?.count,
      });
      setTotalAffiliatesRows(data?.count);
    } catch (error) {
      handleSnackbarClick("error", `Error While Fetching Affiliates`);
      setIsAffiliatesLoading(false);
      setDrawerState({ right: false });
    } finally {
      setIsAffiliatesLoading(false);
    }
  }, []);
  useEffect(() => {
    handleAffiliateSearchDebounced(searchKeyword);
  }, [searchKeyword, handleAffiliateSearchDebounced]);

  const handleRequestedAffiliateSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedRequestedSearchKeyword(value);
    }, 200),
    []
  );
  const getRequestsAffiliates = useCallback(async (page?: number) => {
    const pageDataObject: { [key: string]: any } = {
      limit: 10,
      page: page,
    };
    if (requestSearchKeyword) pageDataObject.keyword = requestSearchKeyword;
    const pageData = encodeURIComponent(JSON.stringify(pageDataObject));
    try {
      setIsRequestedLoading(true);
      const { data } = await get(
        `affiliates/requested?filterData=${pageData}&isAdmin=true`,
        generateHeaders()
      );
      setRequestedAffiliates(data?.pendingAffiliate);
      setTotalRequestsAffiliatesRows(data?.count);
    } catch (error) {
      handleSnackbarClick("error", `Error While Fetching Requests Affiliates`);
      setIsRequestedLoading(false);
      setDrawerState({ right: false });
    } finally {
      setIsRequestedLoading(false);
    }
  }, []);

  useEffect(() => {
    handleRequestedAffiliateSearchDebounced(requestSearchKeyword);
  }, [requestSearchKeyword, handleRequestedAffiliateSearchDebounced]);

  const updateRequestedAffiliate = async (values: any) => {
    try {
      setIsRequestedLoading(true);
      await patch(
        `affiliates/${selectedRow?.id}?isAdmin=true`,
        values,
        generateHeaders()
      );
      getRequestsAffiliates();
    } catch (error) {
      handleSnackbarClick("error", `Error While Updating Requested Affiliates`);
      setIsRequestedLoading(false);
      setDrawerState({ right: false });
    } finally {
      setIsRequestedLoading(false);
      setDrawerState({ right: false });
    }
  };
  const handleEarningRequestSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedEarningRequestKeyword(value);
    }, 200),
    []
  );
  const getEarningRequest = useCallback(async (page?: number) => {
    const pageDataObject: { [key: string]: any } = {
      limit: 10,
      page: page,
    };
    if (requestSearchKeyword) pageDataObject.keyword = requestSearchKeyword;
    const pageData = encodeURIComponent(JSON.stringify(pageDataObject));
    try {
      setIsEarningRequestLoading(true);
      const { data } = await get(
        `earning-requests?filterData=${pageData}&isAdmin=true`,
        generateHeaders()
      );
      setEarningRequest(data);
      setEarningTotalRows(data?.count);
    } catch (error) {
      handleSnackbarClick("error", `Error While Fetching Earning Requests`);
      setIsEarningRequestLoading(false);
      setDrawerState({ right: false });
    } finally {
      setIsEarningRequestLoading(false);
    }
  }, []);

  useEffect(() => {
    handleEarningRequestSearchDebounced(earningRequestSearchKeyword);
  }, [earningRequestSearchKeyword, handleEarningRequestSearchDebounced]);

  const handleRowClick = (rowData: any) => {
    setSelectedRow(rowData);
  };
  const onCloseDrawerCall = () => {
    setDrawerState({ right: false });
  };

  useEffect(() => {
    getAffiliates();
    getRequestsAffiliates();
    getRecentVisits(recentVisitsCurrentPage);
    getEarningRequest();
    setPrivileges(getUserRights("affiliates"));
  }, []);

  useEffect(() => {
    getAffiliates();
  }, [debouncedSearchKeyword]);

  useEffect(() => {
    getAffiliates();
  }, [debouncedRecentVisitsSearchKeyword]);

  useEffect(() => {
    getAffiliates();
  }, [debouncedEarningRequestKeyword]);

  useEffect(() => {
    getAffiliates();
  }, [debouncedRequestedSearchKeyword]);

  return privileges?.canRead() ? (
    <>
      <AffiliatesMetrics
        earningRequest={earningRequest}
        affiliatesData={affiliatesData}
        dateRangeState={dateRangeState}
        setDateRangeState={setDateRangeState}
        setOpenCalendar={setOpenCalendar}
        openCalendar={openCalendar}
      />
      <div className="grid grid-cols-2 gap-3 mt-10">
        <div className="col-span-1">
          <AffiliatesTable
            setSearchKeyword={setSearchKeyword}
            searchKeyword={searchKeyword}
            toggleDrawer={toggleDrawer}
            isLoading={isAffiliatesLoading}
            setIsLoading={setIsAffiliatesLoading}
            affiliatesData={affiliatesData}
            rowData={affiliatesData?.affiliates}
            affiliatesValues={affiliatesValues}
            totalAffiliatesRows={totalAffiliatesRows}
          />
        </div>
        <div className="col-span-1">
          <RequestsAffiliatesTable
            drawerState={drawerState}
            toggleDrawer={toggleDrawer}
            isLoading={isRequestedLoading}
            setIsLoading={setIsRequestedLoading}
            requestedAffiliates={requestedAffiliates}
            setRequestedAffiliates={setRequestedAffiliates}
            rowDataRequestAffiliates={requestedAffiliates}
            totalRequestsAffiliatesRows={totalRequestsAffiliatesRows}
            updateRequestedAffiliate={updateRequestedAffiliate}
            setTotalRequestsAffiliatesRows={setTotalRequestsAffiliatesRows}
            handleRowClick={handleRowClick}
            onCloseDrawerCall={onCloseDrawerCall}
            requestedAffiliatesSelectedRow={requestedAffiliatesSelectedRow}
            privileges={privileges}
          />
        </div>
        <div className="col-span-1">
          <EarningRequestsTable
            earningRequest={earningRequest}
            setEarningRequest={setEarningRequest}
            toggleDrawer={toggleDrawer}
            isLoading={isEarningRequestLoading}
            setIsLoading={setIsEarningRequestLoading}
            getEarningRequest={getEarningRequest}
            earningRequestRowData={earningRequest?.earningRequests}
          />
        </div>
        <div className="col-span-1">
          <RecentVisitsTable
            toggleDrawer={toggleDrawer}
            isLoading={isRecentVisitLoading}
            recentVisits={recentVisits}
            setRecentVisits={setRecentVisits}
            recentVisitsRowData={recentVisits}
            setRecentVisitsSearchKeyword={setRecentVisitsSearchKeyword}
            recentVisitsSearchKeyword={recentVisitsSearchKeyword}
            recentVisitsTotalRows={recentVisitsTotalRows}
            handleRecentVistsPageChange={handleRecentVistsPageChange}
            pageSizeOptions={pageSizeOptions}
          />
        </div>
      </div>
      <SnackBar
        setSnackbarState={setSnackbarState}
        snackbarState={snackbarState}
      />
    </>
  ) : (
    <Privilege name="Affiliates" />
  );
};

export default Affiliates;
