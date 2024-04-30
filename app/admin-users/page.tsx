"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { debounce, generateHeaders, handleSnackbarClick } from "../utils";
import {
  CreateAdminInitialValues,
  RegisterInitialValues,
} from "../utils/forms";
import SnackBar from "../../components/common/Snackbar/index";
import { dataGridCommonStyle } from "@/components/common/Styles";
import { deleted, get, patch, post } from "../utils/api-helper";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";
import AdminUserDrawer from "@/components/AdminUsers/AdminUserDrawer";
import { adminUserColumns } from "../utils/tables";
import Filters from "@/components/common/Filters";
import { ConversionsSortByFilters } from "../utils/data";
import { SnackbarState } from "../utils/interface";
import DrawerComponent from "@/components/common/Drawer";

const AdminUsers = () => {
  const [adminUsers, setAdminUsers] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
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
  const [drawerState, setDrawerState] = useState<any>(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [adminUserDetails, setAdminUserDetails] = useState<any>(
    CreateAdminInitialValues
  );
  const [privileges, setPrivileges] = useState<any>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
  const [select, setSelect] = useState(ConversionsSortByFilters[0]?.value);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  const toggleDrawer = () => {
    setDrawerState(!drawerState);
  };

  const handleCreateUser = async (values: any, { resetForm }: any) => {
    try {
      setIsLoading(true);
      if (adminUserDetails && adminUserDetails?.id) {
        if (privileges?.canWrite()) {
          const body = {
            ...values,
            privileges: Object.entries(values.modules).map(
              ([key, value]: any) => {
                return {
                  module: key,
                  ...value,
                };
              }
            ),
          };
          const payload = { ...body };
          delete payload["modules"];
          const { data } = await patch(
            `admin-users/${adminUserDetails?.id}?isAdmin=true`,
            payload,
            generateHeaders()
          );
          setIsLoading(false);
          onCloseDrawerCall();
          fetchAdminUsers();
          handleSnackbarClick(
            snackbarState,
            setSnackbarState,
            "success",
            `Admin Updated Successfully`
          );
        } else {
          onCloseDrawerCall();
          handleSnackbarClick(
            snackbarState,
            setSnackbarState,
            "error",
            `You dont have permission to update admin user`
          );
        }
      } else {
        setIsLoading(true);
        const body = {
          ...values,
          privileges: Object.entries(values.modules).map(
            ([key, value]: any) => {
              return {
                module: key,
                ...value,
              };
            }
          ),
        };
        const payload = { ...body };
        delete payload["modules"];
        const { data } = await post(
          "admin-users?isAdmin=true",
          payload,
          generateHeaders()
        );
        setAdminUsers(data);
        setIsLoading(false);
        onCloseDrawerCall();
        fetchAdminUsers();
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          `Admin Created Successfully`
        );
      }
    } catch (error) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error While ${adminUserDetails.id ? "Updating" : "Creating"} Admin`
      );
    }
  };

  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchAdminUsers(page, pageSize);
  };

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchAdminUsers = useCallback(
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
        const { data } = await get(`admin-users?filterData=${paginationData}`);
        setAdminUsers(data?.users);
        setTotalRows(data?.count);
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
      setIsLoading(false);
    },
    [startDate, endDate, searchKeyword, select]
  );

  useEffect(() => {
    handleSearchDebounced(searchKeyword);
  }, [searchKeyword, handleSearchDebounced]);

  const resetFilterHandler = async () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect(ConversionsSortByFilters[0]?.value);
    await fetchAdminUsers();
  };

  const rowData = useMemo(() => {
    if (adminUsers && adminUsers?.length > 0) {
      return adminUsers.filter((data) => {
        const matchesKeyword = JSON.stringify(data)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return matchesKeyword;
      });
    }
  }, [adminUsers, searchKeyword, startDate, endDate]);

  const deleteAdminUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await deleted(
        `admin-users/${adminUserDetails?.id}?isAdmin=true`,
        generateHeaders()
      );
      setAdminUsers(data);
      fetchAdminUsers();
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "success",
        `Admin Deleted Successfully`
      );
    } catch (err) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error While Deleting Admin`
      );
    } finally {
      setIsLoading(false);
      onCloseDrawerCall();
    }
  };

  const editAdminUser = (rowData: any) => {
    setAdminUserDetails(rowData);
    const modulesData = rowData?.privileges?.reduce(
      (acc: any, privilege: any) => {
        acc[privilege.module] = {
          read: privilege.read,
          write: privilege.write,
          delete: privilege.delete,
        };
        return acc;
      },
      {}
    );

    // Updating adminUserDetails state with modules data
    setAdminUserDetails((prevState: any) => ({
      ...prevState,
      modules: modulesData,
    }));
    setDrawerState({ right: open });
  };

  const EditDetails = {
    id: adminUserDetails?.id,
    addedDate: adminUserDetails?.date_added,
    editedDate: adminUserDetails?.date_edited,
    editedBy: adminUserDetails?.edited_by,
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("adminUsers");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);

  useEffect(() => {
    fetchAdminUsers();
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);

  const onCloseDrawerCall = () => {
    setAdminUserDetails(RegisterInitialValues);
    setIsLoading(false);
    setDrawerState(false);
  };

  return (
    <>
      {privilegesLoaded && privileges?.canRead() && (
        <>
          <Filters
            label="Admin Users"
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
            toggleDrawer={toggleDrawer}
            privileges={privileges}
            sortByFilters={ConversionsSortByFilters}
            select={select}
          />
          <DataGrid
            sx={dataGridCommonStyle}
            disableColumnMenu
            onRowClick={(rowData) => {
              editAdminUser(rowData?.row);
              toggleDrawer;
            }}
            loading={isLoading}
            rows={adminUsers}
            disableColumnFilter
            columns={adminUserColumns}
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
          <SnackBar
            setSnackbarState={setSnackbarState}
            snackbarState={snackbarState}
          />
          <DrawerComponent
            open={drawerState}
            onClose={onCloseDrawerCall}
            title={
              adminUserDetails && adminUserDetails?.id
                ? "Update Admin User"
                : "Create New Admin User"
            }
            isEdit={EditDetails}
            privileges={privileges}
          >
            <AdminUserDrawer
              drawerstate={drawerState}
              setDrawerState={setDrawerState}
              toggleDrawer={toggleDrawer}
              onCloseDrawerCall={onCloseDrawerCall}
              adminUserDetails={adminUserDetails}
              handleCreateUser={handleCreateUser}
              deleteAdminUser={deleteAdminUser}
              isLoading={isLoading}
              privileges={privileges}
            />
          </DrawerComponent>
        </>
      )}
      {privilegesLoaded && !privileges?.canRead() && (
        <Privilege name="Admin-users" />
      )}
    </>
  );
};
export default AdminUsers;
