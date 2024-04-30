import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import { Typography, Divider, Input } from "@mui/material";
import { TrainingStatus } from "../../app/utils/data";
import {
  CreateTrainingValidationSchema,
  trainingInitialValues,
} from "../../app/utils/forms";
import { useRef, useState } from "react";
import { Label } from "@mui/icons-material";
import { v4 as uuidv4 } from "uuid";
import InputAdornment from "@mui/material/InputAdornment";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";

const TrainingDrawer = ({
  handleSubmit,
  selectedRow,
  isLoading,
  selectedFiles,
  setSelectedFiles,
  trainingValues,
}: any) => {
  const [zipFileName, setZipFileName] = useState("");

  const handleZipChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file: any = event.target.files && event.target.files[0];
    setZipFileName(file?.name);

    const uuid = uuidv4();
    const fileName = `${uuid}.${file?.name.split(".").pop()}`;

    const updatedFile = new File([file], fileName, {
      type: file?.type,
    });
    setSelectedFiles(updatedFile);
  };

  return (
    <Formik
      initialValues={selectedRow.id ? trainingValues : trainingInitialValues}
      onSubmit={handleSubmit}
      validationSchema={CreateTrainingValidationSchema}
    >
      {({
        values,
        errors,
        touched,
        resetForm,
        handleBlur,
        handleChange,
        handleSubmit,
      }) => {
        return (
          <>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ fontWeight: 500, fontSize: "32px" }}
            >
              New Training
            </Typography>
            <Form onSubmit={handleSubmit}>
              <div
                style={{
                  overflowY: "auto",
                }}
              >
                <Divider />
                <div className="flex gap-2 py-3">
                  <Image
                    src="/affiliate-memoji.png"
                    width={20}
                    height={20}
                    alt="Picture"
                  />
                  <span className="flex w-full text-[14px]">
                    The Customer wanted improved data
                  </span>
                </div>
                <div className="flex gap-2 pb-3">
                  <Image
                    src="/affiliate-memoji.png"
                    width={20}
                    height={20}
                    alt="Picture"
                  />
                  <input
                    className="flex  w-full"
                    placeholder="Add a comment..."
                  />
                </div>
                <Divider />
                <div className="py-2">
                  <div>Model Name</div>
                  <Field name="model_name">
                    {({ field }: any) => (
                      <>
                        <input
                          {...field}
                          className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                          placeholder="MyModel123"
                          handleBlur={handleBlur}
                          onChange={handleChange}
                          value={
                            selectedRow.id
                              ? selectedRow.model_name
                              : values?.modelName
                          }
                        />
                      </>
                    )}
                  </Field>
                  {errors.model_name && touched.model_name && (
                    <span className="text-meta-1">
                      {errors.model_name as string | string[]}
                    </span>
                  )}
                </div>
                <div className="py-2">
                  <div>User ID</div>
                  <Field name="user_id">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="B7A5J8"
                        handleBlur={handleBlur}
                        onChange={handleChange}
                        value={selectedRow?.user_id}
                      />
                    )}
                  </Field>
                  {errors.user_id && touched.user_id && (
                    <span className="text-meta-1">
                      {errors.user_id as string | string[]}
                    </span>
                  )}
                </div>
                <div className="py-2">
                  <div>User Email</div>
                  <Field name="user_email">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="myuseremail@gmail.com"
                        handleBlur={handleBlur}
                        onChange={handleChange}
                        value={selectedRow?.user_email}
                      />
                    )}
                  </Field>
                  {errors.user_email && touched.user_email && (
                    <span className="text-meta-1">
                      {errors.user_email as string | string[]}
                    </span>
                  )}
                </div>
                <div className="py-2">
                  <div>Dataset</div>
                  <Field name="dataSet">
                    {({ field }: any) => (
                      <>
                        <>
                          <div className="relative">
                            <input
                              type="file"
                              accept=".zip"
                              onChange={handleZipChange}
                              onBlur={handleBlur}
                              className="absolute inset-0 opacity-0 z-10"
                            />
                            <div className="flex items-center justify-between rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full">
                              <span>{zipFileName || "Choose file"}</span>
                              <ArrowUpwardIcon color="disabled" />
                            </div>
                          </div>
                        </>
                      </>
                    )}
                  </Field>
                  {errors.dataSet && touched.dataSet && (
                    <span className="text-meta-1">
                      {errors.dataSet as string | string[]}
                    </span>
                  )}
                </div>
                <div className="py-2">
                  <div>Epochs</div>
                  <Field name="epochs">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="250"
                        value={
                          selectedRow.id ? selectedRow?.epochs : values?.epochs
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="py-2">
                  <div>Sampling Rate</div>
                  <Field name="sampling_rate">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="48000"
                        value={
                          selectedRow.id
                            ? selectedRow?.sampling_rate
                            : values?.sampling_rate
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="py-2">
                  <div>Version</div>
                  <Field name="version">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="V2"
                        value={
                          selectedRow.id
                            ? selectedRow?.version
                            : values?.version
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="py-2">
                  <div>Batch Size</div>
                  <Field name="batch_size">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="36"
                        value={
                          selectedRow.id
                            ? selectedRow?.batch_size
                            : values?.batch_size
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="py-2">
                  <div>Pitch Extraction</div>
                  <Field name="pitch_extraction">
                    {({ field }: any) => (
                      <input
                        {...field}
                        className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full"
                        placeholder="rmvpe"
                        value={
                          selectedRow.id
                            ? selectedRow?.pitch_extraction
                            : values?.pitch_extraction
                        }
                      />
                    )}
                  </Field>
                </div>
                <div className="py-2">
                  <div>Status</div>
                  <Field name="status">
                    {({ field }: any) => (
                      <>
                        <select
                          {...field}
                          className="flex rounded-2xl border-2 border-[#E3E3E3] p-[6px] w-full pr-2"
                          placeholder="Status"
                          value={selectedRow?.status}
                        >
                          {TrainingStatus.map(
                            (
                              option: { label: string; value: string },
                              index
                            ) => (
                              <option
                                // selected={index == 0 ? true : false}
                                key={option.value}
                                defaultValue={option.value}
                              >
                                {option.label}
                              </option>
                            )
                          )}
                        </select>
                      </>
                    )}
                  </Field>
                </div>

                <div className="m-4 flex justify-center">
                  <ButtonLoader
                    onClick={() => handleSubmit(values)}
                    variant="contained"
                    type="submit"
                    isLoading={isLoading}
                    color="primary"
                    sx={{ width: 200, height: 35, borderRadius: 10 }}
                    className="bg-[#08F]"
                  >
                    Start Training
                  </ButtonLoader>
                </div>
              </div>
            </Form>
          </>
        );
      }}
    </Formik>
  );
};
export default TrainingDrawer;
