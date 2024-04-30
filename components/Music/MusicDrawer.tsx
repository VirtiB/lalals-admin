import { MusicStatus, MusicType } from "@/app/utils/data";
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import React, { useState } from "react";
import ButtonLoader from "../common/Loader/buttonLoader";
import { submitBtnDrawer } from "../common/Styles";
import Image from "next/image";
import { UpdateMusicValidationSchema } from "@/app/utils/forms";

const MusicDrawer = ({
  selectedRow,
  isLoading,
  setUploadedFile,
  handleSubmit,
  privileges,
}: any) => {
  const canWrite = () => {
    return privileges?.canWrite();
  };

  const handleImageChange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      setUploadedFile(file);
    }
  };
  return (
    <>
      <Formik
        initialValues={selectedRow && selectedRow?.id ? selectedRow : ""}
        validationSchema={UpdateMusicValidationSchema}
        onSubmit={(values: any) => {
          handleSubmit(values);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          setFieldValue,
          handleSubmit,
          isSubmitting,
        }) => (
          <Form onSubmit={handleSubmit}>
            <div className=" py-6 px-[41px] flex flex-col gap-4">
              <p className="pt-1">Profile Picture</p>
              <Field name="profile_picture">
                {({ field, setFieldValue }: any) => (
                  <>
                    <div style={{}}>
                      {selectedRow && selectedRow?.avatar && (
                        <div className="flex justify-between items-center py-2">
                          <p>Old Preview</p>
                          <Image
                            src={selectedRow?.avatar ?? ""}
                            alt="voice-avatar"
                            height={40}
                            width={40}
                          />
                        </div>
                      )}
                      <div>
                        <Field
                          name="image"
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          disabled={!canWrite()}
                        />
                        <ErrorMessage
                          name="avatar"
                          component="div"
                          className="error"
                        />
                      </div>
                    </div>
                  </>
                )}
              </Field>
              <div className=" flex flex-col w-full">
                <TextField
                  id="outlined-basic"
                  name="name"
                  label="Name"
                  variant="outlined"
                  type="text"
                  value={values?.name}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!canWrite()}
                />
                {errors.name && touched.name && (
                  <span className="text-meta-1 sticky">
                    {errors.name as string | string[]}
                  </span>
                )}
              </div>
              <div className=" flex flex-col w-full">
                <TextField
                  id="outlined-basic"
                  name="voices[0].voice_name"
                  label="Voice"
                  variant="outlined"
                  type="text"
                  value={values.voices?.[0]?.voice_name || ""}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  disabled={!canWrite()}
                />
              </div>

              <>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Type</InputLabel>
                  <Select
                    className=""
                    name="conversionType"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values?.conversionType}
                    label="Type"
                    onChange={handleChange}
                    disabled={!canWrite()}
                  >
                    {MusicType.map(
                      (
                        option: { label: string; value: string },
                        index: any
                      ) => {
                        return (
                          <MenuItem key={`type-${index}`} value={option.value}>
                            {option.label}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
                {errors && touched && errors.status && touched.status && (
                  <span className="text-meta-1">{errors.status as any}</span>
                )}
              </>

              <div className="flex flex-col w-full">
                <TextField
                  id="outlined-basic"
                  name="plays"
                  label="Plays"
                  variant="outlined"
                  type="number"
                  value={values?.plays}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  disabled={!canWrite()}
                />
              </div>
              <div className="flex flex-col w-full">
                <TextField
                  id="outlined-basic"
                  name="likes"
                  label="Likes"
                  variant="outlined"
                  type="number"
                  value={values?.likes}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  inputProps={{ min: 0 }}
                  disabled={!canWrite()}
                />
              </div>
              <>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Status</InputLabel>
                  <Select
                    className=""
                    name="status"
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={values?.status || ""}
                    label="Status"
                    onChange={handleChange}
                    disabled={!canWrite()}
                  >
                    {MusicStatus.map(
                      (
                        option: { label: string; value: string },
                        index: any
                      ) => {
                        return (
                          <MenuItem
                            key={`status-${index}`}
                            value={option.value}
                          >
                            {option.label}
                          </MenuItem>
                        );
                      }
                    )}
                  </Select>
                </FormControl>
                {errors && touched && errors.status && touched.status && (
                  <span className="text-meta-1">{errors.status as any}</span>
                )}
              </>
            </div>
            {canWrite() && (
              <div className="mt-4 px-[41px] ">
                <ButtonLoader
                  variant="contained"
                  type="submit"
                  isLoading={isLoading}
                  sx={submitBtnDrawer}
                  style={{ background: "black" }}
                >
                  Submit
                </ButtonLoader>
              </div>
            )}
          </Form>
        )}
      </Formik>
    </>
  );
};

export default MusicDrawer;
