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

import {
  FormControl,
  InputLabel,
  TextField,
  InputAdornment,
  Drawer,
  SnackbarOrigin,
  IconButton,
  Modal,
  Button,
  Box,
  MenuItem,
} from "@mui/material";
import {
  applyDates,
  cancelDates,
  createBtn,
  resetBtn,
  searchField,
  selectDates,
  sortSelect,
  statusField,
} from "@/components/common/Styles";
import Loader from "@/components/common/Loader";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import { useGlobalContext } from "../context/global";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
import { TrainingStatus } from "../utils/data";
import TrainingDrawer from "@/components/Training/TrainingDrawer";
import TrainingTable from "@/components/Training/TrainingTable";

import {
  S3Client,
  ListBucketsCommand,
  PutObjectCommand,
} from "@aws-sdk/client-s3";
import getUserRights from "@/hooks/useAdminRights";
import Privilege from "@/components/Privilege";
const s3Client = new S3Client({
  region: process.env.NEXT_PUBLIC_AWS_REGION ?? "",
  credentials: {
    accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ?? "",
  },
});

interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

const Training = () => {
  const { setShowSidebar } = useGlobalContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [searchKeyword, setSearchKeyword] = useState<string>("");
  const [select, setSelect] = useState("");
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [dateRangeState, setDateRangeState] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
  const [sortbySelect, setSortbySelect] = useState<any>(null);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [privileges, setPrivileges] = useState<any>(null);
  const [drawerState, setDrawerState] = useState({
    right: false,
  });
  const [selectedRow, setSelectedRow] = useState<any>("");
  const [selectedFiles, setSelectedFiles] = useState<any>([]);
  const [training, setTraining] = useState<any>([]);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === "keydown" &&
        ((event as React.KeyboardEvent).key === "Tab" ||
          (event as React.KeyboardEvent).key === "Shift")
      ) {
        return;
      }
      setShowSidebar(true);
      setDrawerState({ right: open });
    };

  const resetFilterHandler = () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSelect("");
    setSortbySelect(null);
  };

  const rowData = useMemo(() => {
    return training.filter((data: any) => {
      const matchesKeyword = JSON.stringify(data)
        .toLowerCase()
        .includes(searchKeyword.toLowerCase());
      return matchesKeyword;
    });
  }, [training, searchKeyword, startDate, endDate]);

  const uploadImage = async () => {
    try {
      const s3Params = {
        Bucket: `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}` ?? "",
        Key: `datasets/${selectedFiles?.name ?? ""}`,
        Body: selectedFiles ?? null,
        ContentType: selectedFiles?.type,
      };
      const command = new PutObjectCommand(s3Params);
      const response = await s3Client.send(command);
      return response;
    } catch (error) {}
  };

  const handleSubmit = async (values: any) => {
    setIsLoading(true);
    try {
      let response;
      response = await uploadImage();

      // const { data } = await post("training", {
      //   model_name: values.model_name,
      //   user_id: values.user_id,
      //   user_email: values.user_email,
      //   total_epochs: values.epochs,
      //   sampling_rate: values.sampling_rate,
      //   version: values.version,
      //   batch_size: values.batch_size,
      //   pitch_ext_alg: values.pitch_extraction,
      // });
      // setTraining(data);
      // onCloseDrawerCall();
    } catch (e) {
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSortbySelect(event.target.value as string);
    const buildQuery = {
      status: [event.target.value],
    };
    const filterData = encodeURIComponent(JSON.stringify(buildQuery));
  };
  const onCloseDrawerCall = () => {
    setShowSidebar(false);
    setDrawerState({ right: false });
  };

  const fetchTraining = useCallback(async (query?: any) => {
    setIsLoading(true);
    try {
      const apiURL = query ? `training?filterData=${query}` : "training";
      const { data } = await get(apiURL);
      setTraining(data);
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
  }, []);

  const list = () => (
    <>
      <div className="ml-[10px]">
        <button onClick={onCloseDrawerCall}>
          <KeyboardDoubleArrowRightIcon />
        </button>
      </div>
      <Box sx={{ width: 400, paddingX: 3 }} role="presentation">
        <Box>
          <TrainingDrawer
            selectedRow={selectedRow}
            isLoading={isLoading}
            handleSubmit={handleSubmit}
            selectedFiles={selectedFiles}
            setSelectedFiles={setSelectedFiles}
            uploadedFileName={uploadedFileName}
            setUploadedFileName={setUploadedFileName}
          />
        </Box>
      </Box>
    </>
  );

  useEffect(() => {
    fetchTraining();
    setPrivileges(getUserRights("training"));
  }, [fetchTraining]);

  if (isLoading) {
    return <Loader />;
  }

  return privileges?.canRead() ? (
    <>
      <h1 className="text-4xl font-medium mb-5  text-black">Training</h1>
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
          <Box sx={statusField}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">Status</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={sortbySelect}
                label="Status"
                onChange={handleStatusChange}
                IconComponent={ExpandMoreIcon}
              >
                {TrainingStatus.map((option, index) => {
                  return (
                    <MenuItem key={`status-${index}`} value={option.value}>
                      {option.label}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
          <Button
            sx={selectDates}
            variant="outlined"
            startIcon={<CalendarTodayIcon />}
            onClick={() => setOpenCalendar(true)}
          >
            Select Dates
          </Button>
        </div>
        <div className="flex items-center gap-5">
          <Button
            sx={resetBtn}
            variant="outlined"
            onClick={resetFilterHandler}
            style={{
              visibility:
                searchKeyword || sortbySelect || startDate || endDate
                  ? "visible"
                  : "hidden",
            }}
          >
            <FilterAltOffIcon />
          </Button>
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
                // InputLabelProps={{ shrink: false }}
                sx={sortSelect}
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
            <Fragment>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "transparent",
                  color: "#868C98",
                  boxShadow: "none",
                  border: "2px solid #E2E4E9",
                  borderRadius: "10px",
                  "&:hover": { bgcolor: "#F6F8FA" },
                  textTransform: "none",
                }}
                onClick={toggleDrawer(true)}
                disabled={!privileges?.canWrite()}
              >
                + Create
              </Button>
              <Drawer
                anchor="right"
                open={drawerState["right"]}
                onClose={onCloseDrawerCall}
                sx={{
                  "& .MuiDrawer-paper": {
                    width: "420px",
                  },
                }}
              >
                {list()}
              </Drawer>
            </Fragment>
          </div>
        </div>
      </div>
      <TrainingTable
        isLoading={isLoading}
        setIsLoading={setIsLoading}
        searchKeyword={searchKeyword}
        startDate={startDate}
        endDate={endDate}
        handleSubmit={handleSubmit}
        rowData={rowData}
      />
    </>
  ) : (
    <Privilege name="Training" />
  );
};
export default Training;
