"use client";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { SelectChangeEvent } from "@mui/material/Select";
import { debounce, generateHeaders, handleSnackbarClick } from "../utils";
import { SnackbarOrigin } from "@mui/material/Snackbar";
import SnackBar from "../../components/common/Snackbar/index";
import { dataGridCommonStyle } from "@/components/common/Styles";
import { deleted, get, patch, post, put } from "../utils/api-helper";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";
import { TrainingStatus, UsersSortByFilters } from "../utils/data";
import { UsersColumns } from "../utils/tables";
import UserDrawer from "@/components/Users/UsersDrawer";
import Filters from "@/components/common/Filters";
import { RegisterInitialValues } from "../utils/forms";
import DrawerComponent from "@/components/common/Drawer";
interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}
const Users = () => {
  const [users, setUsers] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [select, setSelect] = useState(UsersSortByFilters[0]?.value);
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
  const [drawerState, setDrawerState] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [userDetails, setUserDetails] = useState<any>(RegisterInitialValues);
  const [privileges, setPrivileges] = useState<any>(null);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  const toggleDrawer = () => {
    setDrawerState(true);
  };

  const onCloseDrawerCall = () => {
    setUserDetails(RegisterInitialValues);
    setDrawerState(false);
  };

  const validatePassword = (values: any) => {
    const errors: any = {};
    if (!values.newPassword && !values.cpassword) {
      return errors;
    }
    if (!values.newPassword) {
      errors.newPassword = "Password is required";
    }
    if (!values.cpassword) {
      errors.cpassword = "Please confirm your password";
    } else if (values.newPassword !== values.cpassword) {
      errors.cpassword = "Passwords must match";
    }
    return errors;
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchUsers(page, pageSize);
  };

  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchUsers = useCallback(
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
      const pageData = encodeURIComponent(JSON.stringify(pageDataObject));
      try {
        const { data } = await get(
          `user?filterData=${pageData}&isAdmin=true`,
          generateHeaders()
        );
        setUsers(data?.users);
        setTotalRows(data?.count);
      } catch (error: any) {
      } finally {
        setIsLoading(false);
      }
    },
    [startDate, endDate, searchKeyword, select]
  );

  useEffect(() => {
    handleSearchDebounced(searchKeyword);
  }, [searchKeyword, handleSearchDebounced]);

  const rowData = useMemo(() => {
    if (users?.length > 0) {
      return users.filter((data) => {
        const matchesKeyword = JSON.stringify(data)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return matchesKeyword;
      });
    }
  }, [users, searchKeyword, startDate, endDate]);

  const resetFilterHandler = async () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect("");

    await fetchUsers();
  };

  const deleteUser = async () => {
    try {
      setIsLoading(true);

      if (userDetails?.id) {
        const { data } = await deleted(
          `user/${userDetails?.id}?isAdmin=true`,
          generateHeaders()
        );
        setUsers(data);
        fetchUsers();
        onCloseDrawerCall();
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          "User Deleted Successfully"
        );
      }
    } catch (err) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error while deleting user`
      );
    } finally {
      setIsLoading(false);
    }
  };

  const editUser = (row: any) => {
    const userData = { ...row, username: row?.name };
    setUserDetails(userData?.row);
    setDrawerState(true);
  };

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    const apiEndpoint =
      userDetails && userDetails?.id
        ? `user/${userDetails?.id}?isAdmin=true`
        : "auth/signup?isAdmin=true";

    const apiPayload =
      userDetails && userDetails?.id
        ? {
            name: values?.name,
            avatar: values?.avatar,
            bio: values?.bio,
            username: values?.username,
            display_name: values?.display_name,
            password: values.newPassword || values.password,
          }
        : values;

    const requestMethod = userDetails && userDetails?.id ? patch : post;

    try {
      const res = await requestMethod(
        apiEndpoint,
        apiPayload,
        generateHeaders()
      );
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "success",
        `User ${userDetails?.id ? "Updated" : "Created"} Successfully`
      );
      fetchUsers();
      onCloseDrawerCall();
    } catch (error: any) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error While ${userDetails?.id ? "Updating" : "Creating"} User`
      );
      onCloseDrawerCall();
      resetForm();
      let errMessage = "";
      const data = error.response?.data;
      if (data?.error?.code?.includes("UsernameExistsException"))
        errMessage = "Username Already Exists!";
      else {
        errMessage = "Invalid Credentials. Please try again";
      }
    } finally {
      setIsLoading(false);
      onCloseDrawerCall();
    }
  };
  const EditDetails = {
    id: userDetails?.id,
    addedDate: userDetails?.date_joined,
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("users");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);

  useEffect(() => {
    if (privilegesLoaded) {
      fetchUsers();
    }
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);

  return (
    <>
      {" "}
      {privilegesLoaded && privileges?.canRead() && (
        <>
          <Filters
            label="Users"
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
            statusLabel={"Status"}
            selectFilters={TrainingStatus}
            sortByFilters={UsersSortByFilters}
            select={select}
          />
          <DrawerComponent
            open={drawerState}
            onClose={onCloseDrawerCall}
            title={
              userDetails && userDetails?.id ? "Update User" : "Create New User"
            }
            isEdit={EditDetails}
            privileges={privileges}
            deleteFunction={deleteUser}
          >
            <UserDrawer
              handleSubmit={handleSubmit}
              onCloseDrawerCall={onCloseDrawerCall}
              userDetails={userDetails}
              validatePassword={validatePassword}
              deleteUser={deleteUser}
              setIsLoading={setIsLoading}
              isLoading={isLoading}
              handleSnackbarClick={handleSnackbarClick}
              privileges={privileges}
            />
          </DrawerComponent>
          <DataGrid
            onRowClick={(rowData) => {
              editUser(rowData);
            }}
            loading={isLoading}
            disableColumnMenu
            disableColumnFilter
            rows={users}
            columns={UsersColumns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            rowCount={totalRows}
            paginationMode="server"
            onPaginationModelChange={(page: any) => {
              const currentPage = page.page + 1;
              handlePageChange(currentPage, page.pageSize);
            }}
            pageSizeOptions={[5, 10, 20]}
            sx={dataGridCommonStyle}
          />
          <SnackBar
            setSnackbarState={setSnackbarState}
            snackbarState={snackbarState}
          />
        </>
      )}
      {privilegesLoaded && !privileges?.canRead() && <Privilege name="Users" />}
    </>
  );
};
export default Users;
