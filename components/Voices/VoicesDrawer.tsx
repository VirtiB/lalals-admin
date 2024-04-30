import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import MenuItem from "@mui/material/MenuItem";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import { TextField, Box, List } from "@mui/material";
import {
  Gender,
  Languages,
  VoicePermission,
  VoiceStatus,
  VoiceType,
  VoiceType2,
} from "../../app/utils/data";
import { CreateVoiceValidationSchema } from "../../app/utils/forms";
import { submitBtnDrawer } from "../common/Styles";

const VoicesDrawer = ({
  isLoading,
  handleSubmit,
  voiceDetails,
  setUploadedFile,
  privileges,
}: any) => {
  const canWrite = () => {
    return privileges?.canWrite();
  };
  return (
    <>
      <Box sx={{ width: 400, paddingX: 5, paddingY: 1 }} role="presentation">
        <List>
          <Box>
            <Formik
              initialValues={voiceDetails}
              validationSchema={CreateVoiceValidationSchema}
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
                      <p className="pt-1">Profile Picture</p>
                      <Field name="profile_picture">
                        {({ field }: any) => (
                          <>
                            <div style={{}}>
                              {voiceDetails &&
                                voiceDetails?.profile_picture && (
                                  <div className="flex justify-between items-center py-2">
                                    <p>Old Preview</p>
                                    <Image
                                      src={voiceDetails?.profile_picture ?? ""}
                                      alt="voice-avatar"
                                      height={40}
                                      width={40}
                                    />
                                  </div>
                                )}
                              <input
                                type="file"
                                accept="image/*"
                                onChange={(event: any) =>
                                  setUploadedFile(event.target?.files[0])
                                }
                                disabled={!canWrite()}
                              />
                            </div>
                          </>
                        )}
                      </Field>
                      <Field name="voice_name">
                        {({ field }: any) => (
                          <>
                            <TextField
                              {...field}
                              value={values?.voice_name}
                              label="Name"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              disabled={!canWrite()}
                            />
                            <span className="text-meta-1">
                              <ErrorMessage name="voice_name" />
                            </span>
                          </>
                        )}
                      </Field>
                      <Field name="voice_id_api">
                        {({ field }: any) => (
                          <>
                            <TextField
                              {...field}
                              label="API"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              disabled={!canWrite()}
                            />
                            <span className="text-meta-1">
                              <ErrorMessage name="voice_id_api" />
                            </span>
                          </>
                        )}
                      </Field>
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
                              disabled={!canWrite()}
                            >
                              {VoiceType.map(
                                (option: { label: string; value: string }) => (
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
                      <Field name="type2">
                        {({ field }: any) => (
                          <>
                            <TextField
                              select
                              {...field}
                              label="Type 2"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              disabled={!canWrite()}
                            >
                              {VoiceType2.map(
                                (option: { label: string; value: string }) => (
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
                              <ErrorMessage name="type2" />
                            </span>
                          </>
                        )}
                      </Field>
                      <Field name="status">
                        {({ field }: any) => (
                          <TextField
                            select
                            {...field}
                            label="Status"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            disabled={!canWrite()}
                          >
                            {VoiceStatus.map(
                              (option: { label: string; value: string }) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              )
                            )}
                          </TextField>
                        )}
                      </Field>
                      <Field name="permission">
                        {({ field }: any) => (
                          <>
                            <TextField
                              select
                              {...field}
                              label="Permission"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              disabled={!canWrite()}
                            >
                              {VoicePermission.map((option) => (
                                <MenuItem
                                  key={option.value}
                                  value={option.value}
                                >
                                  {option.label}
                                </MenuItem>
                              ))}
                            </TextField>
                            <span className="text-meta-1">
                              <ErrorMessage name="permission" />
                            </span>
                          </>
                        )}
                      </Field>
                      <Field name="use_count">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            label="Use Count"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            inputProps={{ min: 0 }}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                      <Field name="like_count">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            label="Like Count"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            type="number"
                            inputProps={{ min: 0 }}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                      <Field name="gender">
                        {({ field }: any) => (
                          <>
                            <TextField
                              select
                              {...field}
                              label="Gender"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              disabled={!canWrite()}
                            >
                              {Gender.map(
                                (option: { label: string; value: string }) => (
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
                              <ErrorMessage name="gender" />
                            </span>
                          </>
                        )}
                      </Field>
                      <Field name="language">
                        {({ field }: any) => (
                          <>
                            <TextField
                              select
                              {...field}
                              label="Language"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              disabled={!canWrite()}
                            >
                              {Languages.map(
                                (option: { label: string; value: string }) => (
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
                              <ErrorMessage name="language" />
                            </span>
                          </>
                        )}
                      </Field>
                    </div>
                    {canWrite() && (
                      <div className="mt-4">
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
                  </Form>
                </>
              )}
            </Formik>
          </Box>
        </List>
      </Box>
    </>
  );
};

export default VoicesDrawer;
