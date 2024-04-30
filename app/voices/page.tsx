"use client";
import { useState, useCallback, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { SnackbarOrigin } from "@mui/material";
import { VoiceSortByFilters, VoiceStatus } from "../utils/data";
import { CreateVoiceInitialValues } from "../utils/forms";
import { VoiceStatusEnum } from "../utils/enum";
import { deleted, get, patch, post } from "../utils/api-helper";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { SelectChangeEvent } from "@mui/material/Select";
import {
  debounce,
  generateHeaders,
  getUserDetails,
  handleSnackbarClick,
} from "../utils";
import React from "react";
import SnackBar from "../../components/common/Snackbar/index";
import { dataGridCommonStyle } from "@/components/common/Styles";
import { useGlobalContext } from "../context/global";
import getUserRights from "@/hooks/useAdminRights";
import "./index.css";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import Privilege from "@/components/Privilege";
import { VoicesColumns } from "../utils/tables";
import Filters from "@/components/common/Filters";
import VoicesDrawer from "@/components/Voices/VoicesDrawer";
import DrawerComponent from "@/components/common/Drawer";
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
const Voices = () => {
  const [voices, setVoices] = useState<Array<any>>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [voiceDetails, setVoiceDetails] = useState<any>(
    CreateVoiceInitialValues
  );
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openCalendar, setOpenCalendar] = useState<boolean>(false);
  const [select, setSelect] = useState(VoiceSortByFilters[0]?.value);
  const [searchKeyword, setSearchKeyword] = useState<any>("");
  const [startDate, setStartDate] = useState<Date | null | undefined>(null);
  const [endDate, setEndDate] = useState<Date | null | undefined>(null);
  const [dateRangeState, setDateRangeState] = useState<any>({
    selection: {
      startDate: new Date(),
      endDate: null,
      key: "selection",
    },
  });
  const [drawerState, setDrawerState] = useState(false);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });
  const [sortbySelect, setSortbySelect] = useState<any>(null);
  const [privileges, setPrivileges] = useState<any>(null);
  const [privilegesLoaded, setPrivilegesLoaded] = useState(false);
  const [debouncedSearchKeyword, setDebouncedSearchKeyword] = useState("");

  const toggleDrawer = () => {
    setDrawerState(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    setSelect(event.target.value as string);
  };
  const handlePageChange = (page: any, pageSize: number) => {
    setCurrentPage(page);
    fetchVoices(page, pageSize);
  };
  const handleSearchDebounced = useCallback(
    debounce((value: string) => {
      setDebouncedSearchKeyword(value);
    }, 200),
    []
  );

  const fetchVoices = useCallback(
    async (page?: number, pageSize?: number) => {
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
      try {
        setIsLoading(true);
        const { data } = await get(`voices?filterData=${pageData}`);
        setVoices(data.voices);
        setTotalRows(data.count);
      } catch (error) {
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          "Error While Fetching Voices"
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

  const handleSubmit = async (values: any, { resetForm }: any) => {
    setIsLoading(true);
    try {
      let response;
      if (uploadedFile) {
        response = await uploadImage();
      }
      if (voiceDetails && voiceDetails?.id) {
        if (privileges?.canWrite()) {
          const { music, _count, ...filteredValues } = values;
          await patch(
            `voices/${voiceDetails?.id}?isAdmin=true`,
            {
              ...filteredValues,
              profile_picture: response ? response : values.profile_picture,
              status: values?.status ?? VoiceStatusEnum["ACTIVE"],
              user_id: getUserDetails()?.id,
            },
            generateHeaders()
          );
          handleSnackbarClick(
            snackbarState,
            setSnackbarState,
            "success",
            "Voice Updated Successfully"
          );
          onCloseDrawerCall();
          resetForm();
          setUploadedFile(null);
        } else {
          onCloseDrawerCall();
          handleSnackbarClick(
            snackbarState,
            setSnackbarState,
            "error",
            `You dont have permission to update voices`
          );
        }
      } else {
        await post(
          "voices/create?isAdmin=true",
          {
            ...values,
            profile_picture: response,
            status: values?.status ?? VoiceStatusEnum["ACTIVE"],
            slug: values?.voice_name?.toLowerCase().split(" ").join("-"),
            user_id: getUserDetails()?.id,
          },
          generateHeaders()
        );
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          "Voice Created Successfully"
        );
        onCloseDrawerCall();
        resetForm();
      }
      resetForm();
      setUploadedFile(null);
    } catch (error: any) {
      onCloseDrawerCall();
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        "An error occurred"
      );
    } finally {
      setIsLoading(false);
      fetchVoices();
    }
  };

  const resetFilterHandler = () => {
    setSearchKeyword("");
    setStartDate(null);
    setEndDate(null);
    setSortbySelect(null);
    setSelect(VoiceSortByFilters[0]?.value);
    fetchVoices();
  };

  const deleteVoice = async () => {
    try {
      setIsLoading(true);
      if (voiceDetails?.id.length > 0) {
        const { data } = await deleted(
          `voices/${voiceDetails?.id}?isAdmin=true`,
          generateHeaders()
        );
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "success",
          "Voice Deleted Successfully"
        );
        onCloseDrawerCall();
      }
    } catch (err) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        "Error While Deleting Voice"
      );
    } finally {
      setIsLoading(false);
      fetchVoices();
    }
  };

  const editVoice = (row: any) => {
    setVoiceDetails(row);
    setDrawerState(true);
  };

  const uploadImage = async () => {
    try {
      const s3Params = {
        Bucket: `${process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME}` ?? "",
        Key: `images/${uploadedFile?.name ?? ""}`,
        Body: uploadedFile ?? null,
        ContentType: uploadedFile?.type,
      };
      const command = new PutObjectCommand(s3Params);
      const response = await s3Client.send(command);
      if (response)
        return `${process.env.NEXT_PUBLIC_AWS_S3_OBJECT_URL}images/${uploadedFile?.name}`;
      // return response; // Returning the response
    } catch (error) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        "Error While Uploading Image"
      );
    }
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setSortbySelect(event.target.value as string);
    const buildQuery = {
      status: [event.target.value],
    };
    const filterData = encodeURIComponent(JSON.stringify(buildQuery));
    fetchVoices();
  };

  const onCloseDrawerCall = () => {
    setVoiceDetails(CreateVoiceInitialValues);
    setDrawerState(false);
  };

  const EditDetails = {
    id: voiceDetails?.id,
    addedDate: voiceDetails?.date_added,
    addedBy: voiceDetails?.added_by,
    editedDate: voiceDetails?.date_edited,
    editedBy: voiceDetails?.edited_by,
  };

  useEffect(() => {
    const fetchPrivileges = async () => {
      const userPrivileges = getUserRights("voices");
      setPrivileges(userPrivileges);
      setPrivilegesLoaded(true);
    };
    fetchPrivileges();
  }, []);

  useEffect(() => {
    fetchVoices();
  }, [privilegesLoaded, startDate, endDate, debouncedSearchKeyword, select]);

  return (
    <>
      {privileges?.canRead() && (
        <>
          <Filters
            label={"Voices"}
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
            handleStatusChange={handleStatusChange}
            select={select}
            endDate={endDate}
            startDate={startDate}
            handleChange={handleChange}
            selectFilters={VoiceStatus}
            statusLabel={"Status"}
            sortByFilters={VoiceSortByFilters}
            toggleDrawer={toggleDrawer}
            privileges={privileges}
          />
          <DataGrid
            onRowClick={(params) => editVoice(params.row)}
            sx={dataGridCommonStyle}
            disableColumnMenu
            loading={isLoading}
            rows={voices}
            columns={VoicesColumns}
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
            className="voices-table"
          />
          <DrawerComponent
            open={drawerState}
            onClose={onCloseDrawerCall}
            title={
              voiceDetails && voiceDetails?.id
                ? "Update Voice"
                : "Create New Vocie"
            }
            isEdit={EditDetails}
            privileges={privileges}
            deleteFunction={deleteVoice}
          >
            <VoicesDrawer
              voiceDetails={voiceDetails}
              setUploadedFile={setUploadedFile}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
              privileges={privileges}
            />
          </DrawerComponent>
          <SnackBar
            setSnackbarState={setSnackbarState}
            snackbarState={snackbarState}
          />
        </>
      )}
      {privilegesLoaded && !privileges?.canRead() && (
        <Privilege name="Voices" />
      )}
    </>
  );
};
export default Voices;
