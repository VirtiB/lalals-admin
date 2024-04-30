import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import MenuItem from "@mui/material/MenuItem";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import {
  Typography,
  Select,
  FormControl,
  InputLabel,
  TextField,
  Autocomplete,
} from "@mui/material";

import {
  LyricsLanguages,
  LyricsStatus,
  LyricsTagsType,
} from "../../app/utils/data";
import {
  CreateLyricsInitialValues,
  CreateLyricsValidationSchema,
  UpdateLyricsValidationSchema,
} from "../../app/utils/forms";
import { deleted } from "@/app/utils/api-helper";
import { useState } from "react";
import { useGlobalContext } from "@/app/context/global";

import { submitBtnDrawer } from "../common/Styles";
import {
  formateTimeAndDate,
  generateHeaders,
  handleSnackbarClick,
} from "@/app/utils";
import SnackBar from "../common/Snackbar";
import { SnackbarState } from "@/app/utils/interface";
import DeleteButton from "../common/Buttons/deleteButton";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";
import { EditedByTypography } from "@/app/utils/styles";

const LyricsDrawer = ({
  selectedRow,
  isLoading,
  handleSubmit,
  setIsLoading,
  fetchLyrics,
  onCloseDrawerCall,
  privileges,
  snackbarState,
  setSnackbarState,
}: any) => {
  const [selectedTags, setSelectedTags] = useState(
    selectedRow?.row?.tags.map((tag: any) => ({ label: tag, value: tag })) ?? []
  );

  const canWrite = () => {
    return privileges?.canWrite();
  };

  return (
    <>
      <div className="px-[41px]">
        <Formik
          initialValues={
            selectedRow && selectedRow.id
              ? selectedRow?.row
              : CreateLyricsInitialValues
          }
          validationSchema={
            selectedRow && selectedRow.id
              ? UpdateLyricsValidationSchema
              : CreateLyricsValidationSchema
          }
          onSubmit={(values: any) => {
            handleSubmit(values, selectedTags);
          }}
        >
          {({
            values,
            handleChange,
            errors,
            touched,
            resetForm,
            handleBlur,
          }: any) => {
            return (
              <>
                <Form>
                  <div
                    style={{
                      overflowY: "auto",
                    }}
                  >
                    <div className="py-[10px] flex flex-col">
                      <TextField
                        id="outlined-basic"
                        name="title"
                        label="Title"
                        variant="outlined"
                        type="text"
                        value={values?.title}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!canWrite()}
                      />
                      <span className="text-meta-1">
                        <ErrorMessage name="title" />
                      </span>
                    </div>

                    <div className="py-[10px] flex flex-col">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          className=""
                          name="status"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values?.status}
                          label="Status"
                          onChange={handleChange}
                          disabled={!canWrite()}
                        >
                          {LyricsStatus.map((option: any, index: any) => {
                            return (
                              <MenuItem
                                key={`status-${index}`}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <span className="text-meta-1">
                        <ErrorMessage name="status" />
                      </span>
                    </div>

                    <div className="py-[10px] flex flex-col">
                      <TextField
                        id="outlined-basic"
                        name="voice_id"
                        label="Voice ID (leave empty if none)"
                        variant="outlined"
                        type="text"
                        value={values?.voice_id}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!canWrite()}
                      />
                    </div>
                    <div className="py-[10px] flex flex-col">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Language
                        </InputLabel>
                        <Select
                          className=""
                          name="language"
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={values?.language}
                          label="language"
                          onChange={handleChange}
                          disabled={!canWrite()}
                        >
                          {LyricsLanguages.map((option: any, index: any) => {
                            return (
                              <MenuItem
                                key={`language-${index}`}
                                value={option.value}
                              >
                                {option.label}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      <span className="text-meta-1">
                        <ErrorMessage name="language" />
                      </span>
                    </div>
                    <div className="py-[10px] flex flex-col">
                      <Autocomplete
                        multiple
                        id="tags-outlined"
                        options={LyricsTagsType}
                        getOptionLabel={(option) => option.label}
                        value={selectedTags} // Use value instead of defaultValue
                        onChange={(event, newValue) =>
                          setSelectedTags(newValue)
                        }
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Tags"
                            placeholder="Tags"
                          />
                        )}
                        disabled={!canWrite()}
                      />
                    </div>

                    <div className="py-2 relative">
                      <div className="absolute -top-1 left-2 bg-white px-[5px] text-[13px] text-[#525866]">
                        Lyrics
                      </div>
                      <Field name="lyrics">
                        {({ field }: any) => (
                          <textarea
                            {...field}
                            className="flex rounded-md border border-[#c9c9cd] p-[15px] w-full h-[224px]"
                            name="lyrics"
                            placeholder="50"
                            type="text"
                            min={0}
                            value={values?.lyrics || values?.content}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                      <span className="text-meta-1">
                        <ErrorMessage name="lyrics" />
                      </span>
                    </div>
                    {canWrite() && (
                      <div className="py-[10px]">
                        <ButtonLoader
                          variant="contained"
                          type="submit"
                          isLoading={isLoading}
                          sx={submitBtnDrawer}
                          className="bg-black-2"
                        >
                          Submit
                        </ButtonLoader>
                      </div>
                    )}
                  </div>
                </Form>
              </>
            );
          }}
        </Formik>
      </div>
    </>
  );
};

export default LyricsDrawer;
