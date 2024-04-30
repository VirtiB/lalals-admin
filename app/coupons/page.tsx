"use client";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { deleted, get, patch, post } from "../utils/api-helper";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import SearchIcon from "@mui/icons-material/Search";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import List from "@mui/material/List";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import AddIcon from "@mui/icons-material/Add";

import {
  Box,
  Button,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Drawer,
  Divider,
  Typography,
  SnackbarOrigin,
  IconButton,
  Modal,
} from "@mui/material";
import {
  applyDates,
  cancelDates,
  confirmatioModalBox,
  createBtn,
  dataGridCommonStyle,
  resetBtn,
  searchField,
  selectDates,
  sortSelect,
  submitBtnDrawer,
} from "@/components/common/Styles";
import Loader from "@/components/common/Loader";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useGlobalContext } from "../context/global";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  createCouponInitialValues,
  createCouponValidationSchema,
} from "../utils/forms";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SnackBar from "@/components/common/Snackbar";
import { calculateTimeDifference } from "../utils";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";

interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

const CouponType = [
  {
    label: "Amount",
    value: "Amount",
  },
  {
    label: "Percentage",
    value: "Percentage",
  },
];

const Coupons = () => {
  const { setShowSidebar } = useGlobalContext();
  const [coupons, setCoupons] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [select, setSelect] = useState("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);

  const [dateRangeState, setDateRangeState] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
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
  const [couponDetails, setCouponDetails] = useState<any>(
    createCouponInitialValues
  );
  const [showDelete, setShowDelete] = useState<boolean>(false);

  const [privileges, setPrivileges] = useState<any>(null);

  const [searchKeyword, setSearchKeyword] = useState<string>("");

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  const handleSnackbarClick = (type: string, message: string) => {
    setSnackbarState({
      ...snackbarState,
      open: true,
      type: type,
      message: message,
    });
  };

  const toggleDrawer =
    (anchor: "right", open: boolean) => (event: KeyboardEvent | MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as KeyboardEvent).key === "Tab" ||
          (event as KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setShowSidebar(true);
      setDrawerState({ right: open });
      setShowDelete(false);
    };

  const fetchCoupons = useCallback(async (query?: any) => {
    setIsLoading(true);
    try {
      let apiURL = query ? `coupons?filterData=${query}` : "coupons";
      if (query) {
        apiURL += `?filterData=${JSON.stringify(query)}`;
      }
      const { data } = await get(apiURL);
      setCoupons(data);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteCoupon = async () => {
    try {
      setIsLoading(true);
      let deleteCouponId = couponDetails?.id;
      if (deleteCouponId.length > 0) {
        const { data } = await deleted(`coupons/${deleteCouponId}`);
        setShowSidebar(false);
        setOpenConfirmation(false);
      }
    } catch (err) {
    } finally {
      fetchCoupons();
      setShowDelete(false);
    }
  };

  const editCoupon = (row: any) => {
    setCouponDetails({
      ...row,
      type: row.amount_off ? "Amount" : "Percentage",
    });
    setShowSidebar(true);
    setDrawerState({ right: true });
  };

  const resetFilterHandler = async () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect("");
    await fetchCoupons();
  };

  const applyDatesHandler = async () => {
    setOpenCalendar(false);
    const buildQuery = {
      start_date: dateRangeState.selection.startDate,
      end_date: dateRangeState.selection.endDate,
    };
    try {
      await fetchCoupons(buildQuery);
    } catch (error) {}
  };

  const rowData = useMemo(() => {
    if (coupons.length > 0) {
      // return coupons.filter((data: any) =>
      //   JSON.stringify(data).toLowerCase().includes(searchKeyword.toLowerCase())
      // );
      return coupons.filter((data) => {
        // const isInRange =
        //   (!startDate || isAfter(new Date(data.date), startDate)) &&
        //   (!endDate || isBefore(new Date(data.date), endDate));
        const matchesKeyword = JSON.stringify(data)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return matchesKeyword;
        // return isInRange && matchesKeyword;
      });
    }
  }, [coupons, searchKeyword]);

  const list = () => (
    <>
      <div className="ml-[10px] flex justify-between">
        <button onClick={onCloseDrawerCall}>
          <KeyboardDoubleArrowRightIcon />
        </button>
        {couponDetails && couponDetails?.id ? (
          <div className="flex flex-col items-end">
            <svg
              onClick={() => setShowDelete(true)}
              xmlns="http://www.w3.org/2000/svg"
              fill="grey"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6 text-grey"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>
      <Box sx={{ width: 400, padding: 5 }} role="presentation">
        <div className="flex justify-between w-full">
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ fontWeight: 600, fontSize: "26px" }}
          >
            {couponDetails && couponDetails?.id
              ? "Update Coupon"
              : "Create New Coupon"}
          </Typography>
          {showDelete && (
            <Button
              variant="contained"
              sx={{
                padding: 1,
                bgcolor: "#fafafa",
                color: "#212121",
                "&:hover": { bgcolor: "#fafafa" },
                textTransform: "none",
              }}
              onClick={deleteCoupon}
            >
              Delete
            </Button>
          )}
        </div>
        <List>
          <Box>
            <Formik
              initialValues={couponDetails}
              validationSchema={createCouponValidationSchema}
              onSubmit={handleSubmit}
            >
              {({ values, errors, touched, resetForm }) => (
                <>
                  <Form>
                    <div
                      style={{
                        overflowY: "auto",
                      }}
                    >
                      <Field name="name">
                        {({ field }: any) => (
                          <>
                            <TextField
                              {...field}
                              label="Coupon Code"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                            />
                            <span className="text-meta-1">
                              <ErrorMessage name="Name" />
                            </span>
                          </>
                        )}
                      </Field>
                      {couponDetails && !couponDetails?.id && (
                        <Field name="type">
                          {({ field }: any) => (
                            <>
                              <TextField
                                select
                                {...field}
                                label="Type"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                              >
                                {CouponType.map(
                                  (option: {
                                    label: string;
                                    value: string;
                                  }) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  )
                                )}
                              </TextField>
                              <span className="text-meta-1">
                                <ErrorMessage name="type" />
                              </span>
                            </>
                          )}
                        </Field>
                      )}
                      {values.type === "Amount" && (
                        <Field name="amount_off">
                          {({ field }: any) => (
                            <>
                              <TextField
                                {...field}
                                label="Amount"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                disabled={couponDetails?.amount_off}
                              />
                              <span className="text-meta-1">
                                <ErrorMessage name="amount_off" />
                              </span>
                            </>
                          )}
                        </Field>
                      )}
                      {values.type === "Percentage" && (
                        <Field name="percent_off">
                          {({ field }: any) => (
                            <>
                              <TextField
                                {...field}
                                label="Percentage"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                type="number"
                                disabled={couponDetails?.percent_off}
                              />
                              <span className="text-meta-1">
                                <ErrorMessage name="percentage" />
                              </span>
                            </>
                          )}
                        </Field>
                      )}

                      <Field name="max_redemptions">
                        {({ field }: any) => (
                          <>
                            <TextField
                              {...field}
                              label="Max Redemptions"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              type="number"
                              disabled={couponDetails?.id}
                            />
                            <span className="text-meta-1">
                              <ErrorMessage name="max_redemptions" />
                            </span>
                          </>
                        )}
                      </Field>
                    </div>
                    <div className="mt-4 w-full">
                      <ButtonLoader
                        variant="contained"
                        type="submit"
                        isLoading={isLoading}
                        sx={submitBtnDrawer}
                        size="small"
                      >
                        Create
                      </ButtonLoader>
                    </div>
                  </Form>
                </>
              )}
            </Formik>
          </Box>
        </List>
      </Box>
    </>
  );

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsLoading(true);

    try {
      let response;
      if (couponDetails && couponDetails?.id) {
        const name = values.name;
        const { data } = await patch(`coupons/${couponDetails?.id}`, {
          // ...values,
          name: values.name,
        });
        handleSnackbarClick("success", "Coupon Updated Successfully");
        setShowSidebar(false);
        onCloseDrawerCall();
        resetForm();
      } else {
        if (values.percent_off === null) {
          delete values.percent_off;
        }
        if (values.amount_off === null) {
          delete values.amount_off;
        }
        const { data } = await post("coupons", {
          ...values,
        });
        onCloseDrawerCall();
        handleSnackbarClick("success", "Coupon Created Successfully");
        setShowSidebar(false);
        resetForm();
      }
    } catch (error: any) {
      onCloseDrawerCall();
      handleSnackbarClick("error", "Error While Creating Coupon");
    } finally {
      setIsLoading(false);
      fetchCoupons();
    }
  };

  useEffect(() => {
    fetchCoupons();
    setPrivileges(getUserRights("coupons"));
  }, []);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Coupon Code",
      width: 300,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ color: "#000000", fontWeight: 500 }}>
            {params.value}
          </div>
        );
      },
      headerClassName: "custom-header-class",
    },
    {
      field: "max_redemptions",
      headerName: "Usage",
      width: 250,
      sortable: false,
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "#8D8D8D",
              display: "flex",
              alignItems: "center",
            }}
          >
            {params.row.times_redeemed ?? 0} /{" "}
            {params?.row?.max_redemptions ? (
              params?.row?.max_redemptions
            ) : (
              <AllInclusiveIcon style={{ fontSize: "15px" }}></AllInclusiveIcon>
            )}
          </div>
        );
      },
    },
    {
      field: "amount_off",
      headerName: "Amount",
      width: 250,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        const value = params?.row?.amount_off
          ? `$${params.row.amount_off}`
          : `${params.row.percent_off}%`;
        return (
          <div
            style={{
              color: "#000",
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              fontWeight: 500,
            }}
          >
            {value}
          </div>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 350,
      sortable: false,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        return (
          <div
            style={{ color: "#8D8D8D", display: "flex", justifyContent: "end" }}
          >
            {calculateTimeDifference(params.row.date_added)}
          </div>
        );
      },
    },
  ];
  const onCloseDrawerCall = () => {
    setCouponDetails(createCouponInitialValues);
    setShowSidebar(false);
    setDrawerState({ right: false });
  };

  if (isLoading) {
    return <Loader />;
  }

  return privileges?.canRead() ? (
    <>
      <h1 className="text-4xl font-medium mb-5  text-black">Coupons</h1>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <TextField
            placeholder="Search by order number, email, userid..."
            size="small"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value.trim())}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={searchField}
          />
          <Button
            sx={selectDates}
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            onClick={() => setOpenCalendar(true)}
          >
            Select Dates
          </Button>
          {openCalendar && (
            <div className="nameCal z-1 flex absolute top-30 left-90 border-[1px] border-[#cccccc]">
              <div className="flex flex-col">
                <DateRangePicker
                  onChange={(item) => {
                    setStartDate(item.selection.startDate);
                    setEndDate(item.selection.endDate);
                    setDateRangeState({ ...dateRangeState, ...item });
                  }}
                  direction="vertical"
                  scroll={{ enabled: true }}
                  ranges={[dateRangeState.selection]}
                />
                <div className="bg-[#FAFAFA] p-3 flex justify-end pr-3">
                  <Button
                    sx={cancelDates}
                    variant="outlined"
                    onClick={() => setOpenCalendar(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    sx={applyDates}
                    variant="contained"
                    startIcon={<CalendarTodayIcon />}
                    onClick={applyDatesHandler}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            sx={resetBtn}
            variant="outlined"
            onClick={resetFilterHandler}
            style={{
              visibility:
                searchKeyword || startDate || endDate ? "visible" : "hidden",
            }}
          >
            <FilterAltOffIcon />
          </Button>
          <Box sx={{ minWidth: 160, border: "none" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                Sort by <strong className="text-[#000]">Newest</strong>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={select}
                label="select"
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                // InputLabelProps={{ shrink: false }}

                sx={sortSelect}
                onChange={handleChange}
                inputProps={{
                  style: { paddingRight: "20px" },
                }}
              >
                <MenuItem value="couponCode">Coupon Code</MenuItem>
                <MenuItem value="amount">Amount</MenuItem>
                <MenuItem value="date">Date</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Fragment>
            <Drawer
              anchor="right"
              open={drawerState["right"]}
              onClose={onCloseDrawerCall}
              sx={{
                "& .MuiDrawer-paper": {
                  width: "420px",
                },
              }}
              slotProps={{
                backdrop: { invisible: true },
              }}
            >
              {list()}
            </Drawer>
          </Fragment>
        </div>
      </div>
      <div className="h-5/6">
        <DataGrid
          sx={dataGridCommonStyle}
          onRowClick={(params) => editCoupon(params.row)}
          disableColumnMenu
          rows={coupons.length > 0 ? (rowData as any) : []}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 20,
              },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </div>

      <SnackBar
        setSnackbarState={setSnackbarState}
        snackbarState={snackbarState}
      />
    </>
  ) : (
    <Privilege name="Coupons" />
  );
};
export default Coupons;
