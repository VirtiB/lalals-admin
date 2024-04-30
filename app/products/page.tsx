"use client";
import { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { get, post } from "../utils/api-helper";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { InputAdornment, TextField, Typography } from "@mui/material";
import { Formik, Field, Form, FieldArray, ErrorMessage } from "formik";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import { calculateTimeDifference } from "../utils";
import {
  CreateProductInitialValues,
  CreateProductValidationSchema,
} from "../utils/forms";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import SearchIcon from "@mui/icons-material/Search";
import {
  addButton,
  applyDates,
  cancelDates,
  createBtn,
  crossBtn,
  dataGridCommonStyle,
  errorMessage,
  field,
  inputFieldStyle,
  inputStyle,
  resetBtn,
  searchField,
  selectDates,
  sortSelect,
} from "@/components/common/Styles";
import { useGlobalContext } from "../context/global";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import Loader from "@/components/common/Loader";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";

type Anchor = "right";

const Products = () => {
  const { setShowSidebar } = useGlobalContext();

  const [products, setProducts] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [select, setSelect] = useState("");
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
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

  const [privileges, setPrivileges] = useState<any>(null);

  const toggleDrawer =
    (anchor: Anchor, open: boolean) =>
    (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setShowSidebar(true);
      setDrawerState({ ...drawerState, [anchor]: open });
    };

  const resetFilterHandler = () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect("");
  };

  const rowData = useMemo(() => {
    if (products.length > 0) {
      return products.filter((data) => {
        const matchesKeyword = JSON.stringify(data)
          .toLowerCase()
          .includes(searchKeyword.toLowerCase());
        return matchesKeyword;
      });
    }
  }, [products, searchKeyword, startDate, endDate]);

  const list = (anchor: Anchor) => (
    <>
      <div style={{ marginLeft: 10 }}>
        <button onClick={toggleDrawer(anchor, false)}>
          <KeyboardDoubleArrowRightIcon />
        </button>
      </div>
      <Box sx={{ width: 400, padding: 5 }} role="presentation">
        <Typography
          id="modal-modal-title"
          variant="h6"
          component="h2"
          style={{ fontWeight: 600, fontSize: "26px" }}
        >
          Create New Product
        </Typography>
        <List>
          <Box>
            <Formik
              initialValues={CreateProductInitialValues}
              validationSchema={CreateProductValidationSchema}
              onSubmit={(values) => {
                //Removed Create Product API call as we manage product creation from Paddle dashboard only - 5/3/24
                // createProduct(values);
              }}
              enableReinitialize
            >
              {({ values, isValid }) => (
                <Form>
                  <div style={field as any}>
                    <div style={field as any}>
                      <label htmlFor="name">Name</label>
                      <Field
                        id="name"
                        name="name"
                        placeholder="Name"
                        style={inputStyle}
                      />
                      <ErrorMessage
                        name="name"
                        component="div"
                        className="error-message"
                      />
                    </div>
                    <div style={field as any}>
                      <label htmlFor="description">Description</label>
                      <Field
                        id="description"
                        name="description"
                        placeholder="Description"
                        type="textArea"
                        style={inputStyle}
                      />
                    </div>

                    <div style={field as any}>
                      <label htmlFor="type">Type</label>
                      <Field as="select" name="type" style={inputFieldStyle}>
                        <option value="">Select Type</option>
                        <option value="ONE_TIME">One-Time</option>
                        <option value="SUBSCRIPTION">Subscription</option>
                      </Field>
                      <ErrorMessage
                        name="type"
                        component="div"
                        className="error-message"
                      />
                    </div>

                    <FieldArray name="plans">
                      {({ insert, remove, push }) => (
                        <div>
                          {values.type === "SUBSCRIPTION" && (
                            <div
                              style={{ display: "flex", justifyContent: "end" }}
                            >
                              <button
                                type="button"
                                className="secondary"
                                onClick={() =>
                                  push({ amount: "", duration: "" })
                                }
                                style={addButton}
                              >
                                + Add
                              </button>
                            </div>
                          )}
                          {values.plans.map((friend, index) => (
                            <div className="row" key={index}>
                              {values.type === "SUBSCRIPTION" && (
                                <>
                                  <div style={{}}>
                                    <div className="col" style={field as any}>
                                      <label htmlFor={`plans.${index}.amount`}>
                                        Price
                                      </label>
                                      <Field
                                        name={`plans.${index}.amount`}
                                        placeholder="Price"
                                        type="text"
                                        style={inputStyle}
                                      />
                                      <ErrorMessage
                                        name={`plans.${index}.amount`}
                                        component="div"
                                        className="field-error"
                                      />
                                    </div>
                                    <div style={{ display: "flex" }}>
                                      <div
                                        className="inputField"
                                        style={field as any}
                                      >
                                        <label
                                          htmlFor={`plans.${index}.duration`}
                                        >
                                          Duration
                                        </label>
                                        <Field
                                          style={inputFieldStyle}
                                          as="select"
                                          name={`plans.${index}.duration`}
                                        >
                                          <option value="">
                                            Select Duration
                                          </option>
                                          <option value="MONTH">Monthly</option>
                                          <option value="YEAR">Annually</option>
                                        </Field>
                                        <ErrorMessage
                                          name={`plans.${index}.duration`}
                                          component="div"
                                          className="field-error"
                                        />
                                      </div>
                                      <div className="col">
                                        <button
                                          type="button"
                                          className="secondary"
                                          onClick={() => remove(index)}
                                          style={crossBtn}
                                        >
                                          X
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </FieldArray>
                    {values.type === "ONE_TIME" && (
                      <div className="col" style={field as any}>
                        <label htmlFor={`amount`}>Price</label>
                        <Field
                          name={`amount`}
                          placeholder="Price"
                          type="text"
                          style={inputFieldStyle}
                        />
                        <ErrorMessage
                          name={`amount`}
                          component="div"
                          className="field-error"
                        />
                      </div>
                    )}
                  </div>

                  <div className="m-3">
                    <ButtonLoader
                      variant="contained"
                      type="submit"
                      isLoading={isLoading}
                      // onClick={() => createProduct(values)}
                      sx={{ width: 150 }}
                    >
                      Submit
                    </ButtonLoader>
                  </div>
                </Form>
              )}
            </Formik>
          </Box>
        </List>
        <Divider />
      </Box>
    </>
  );

  const fetchProducts = useCallback(async (query?: any) => {
    try {
      setIsLoading(true);

      const apiURL = query
        ? `products/all?filterData=${query}`
        : "products/all";
      const { data } = await get(apiURL);
      setProducts(data);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };

  useEffect(() => {
    fetchProducts();
    setPrivileges(getUserRights("products"));
  }, [fetchProducts]);

  const columns: GridColDef[] = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      sortable: false,
      renderCell: (params) => {
        return (
          <div style={{ color: "#000000", fontWeight: 400 }}>
            {params.row.name}
          </div>
        );
      },
      headerClassName: "custom-header-class",
    },
    {
      field: "description",
      headerName: "Description",
      width: 200,
      sortable: false,
      headerClassName: "custom-header-class",
    },
    {
      field: "type",
      headerName: "Type",
      width: 300,
      sortable: false,
      // editable: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "#8D8D8D",
              width: "93px",
              display: "flex",
              justifyContent: "start",
              alignItems: "center",
            }}
          >
            {params.row.type}
          </div>
        );
      },
    },

    {
      field: "date",
      headerName: "Date",
      width: 170,
      sortable: false,
      // editable: true,
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
    {
      field: "price",
      headerName: "Amount",
      width: 150,
      // editable: true,
      headerAlign: "right",
      align: "right",
      renderCell: (params) => {
        return (
          <div
            style={{
              color: "#8D8D8D",
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
            }}
          >
            ${params.row.amount}
          </div>
        );
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 150,
      // editable: true,
      headerAlign: "right",
      align: "right",
      sortable: false,
      renderCell: (params) => {
        const capitalizedDuration = params.row.duration
          ? params.row.duration.charAt(0).toUpperCase() +
            params.row.duration.slice(1).toLowerCase()
          : "N/A";

        return (
          <div
            style={{
              color: "#8D8D8D",
              display: "flex",
              justifyContent: "end",
              alignItems: "end",
              // textTransform: "lowercase",
            }}
          >
            {capitalizedDuration}
          </div>
        );
      },
    },
  ];

  if (isLoading) {
    return <Loader />;
  }

  return privileges?.canRead() ? (
    <>
      <h1 className="text-4xl font-medium mb-5 text-black">Products</h1>
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
            <div className="bg-[#FAFAFA] p-3 flex justify-end pr-3">
              <div className="flex flex-col">
                {" "}
                <DateRangePicker
                  onChange={(item) => {
                    setStartDate(item.selection.startDate);
                    setEndDate(item.selection.endDate);
                    setDateRangeState({ ...dateRangeState, ...item });
                  }}
                  // minDate={addDays(new Date(), -300)}
                  // maxDate={addDays(new Date(), 900)}
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
                    onClick={() => {
                      setOpenCalendar(false);
                      const buildQuery = {
                        start_date: dateRangeState.selection.startDate,
                        end_date: dateRangeState.selection.endDate,
                      };
                      const filterData = encodeURIComponent(
                        JSON.stringify(buildQuery)
                      );
                      fetchProducts(filterData);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center gap-5">
          <div className="block">
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
          </div>
          <Box sx={{ minWidth: 150, border: "none" }}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label" shrink={false}>
                Sort by <strong>Date</strong>
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={select}
                label="select"
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                sx={sortSelect}
                onChange={handleChange}
                inputProps={{
                  style: { paddingRight: "20px" },
                }}
              >
                <MenuItem value="name">Name</MenuItem>
                <MenuItem value="description">Description</MenuItem>
                <MenuItem value="type">Type</MenuItem>
              </Select>
            </FormControl>
          </Box>

          <div>
            {(["right"] as const).map((anchor) => (
              <Fragment key={anchor}>
                <Button
                  variant="contained"
                  sx={createBtn}
                  // onClick={handleOpen}
                  // onClick={toggleDrawer(anchor, true)}
                  disabled={!privileges?.canWrite()}
                >
                  + Create
                </Button>
                <Drawer
                  anchor={anchor}
                  open={drawerState[anchor]}
                  onClose={toggleDrawer(anchor, false)}
                  slotProps={{
                    backdrop: { invisible: true },
                  }}
                >
                  {list(anchor)}
                </Drawer>
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      <DataGrid
        sx={dataGridCommonStyle}
        disableColumnMenu
        rows={products.length > 0 ? (rowData as any) : []}
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
    </>
  ) : (
    <Privilege name="Products" />
  );
};
export default Products;
