import { Formik, Form, Field, ErrorMessage } from "formik";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import {
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { AffiliateStatus } from "../../app/utils/data";
import { affiliatesInitialValues } from "../../app/utils/forms";
import { submitBtnDrawer } from "../common/Styles";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";

const RequestedAffiliateDrawer = ({
  affiliatesValues,
  selectedRow,
  updateRequestedAffiliate,
  isLoading,

  privileges,
  onCloseDrawerCall,
}: any) => {
  const canWrite = () => {
    return privileges?.canWrite();
  };
  return (
    <>
      <CloseDrawerButton onClick={onCloseDrawerCall} />
      <Formik
        initialValues={
          selectedRow.id ? affiliatesValues : affiliatesInitialValues
        }
        onSubmit={updateRequestedAffiliate}
      >
        {({ values, errors, touched, resetForm, handleChange }) => {
          return (
            <div className="px-[41px]">
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                style={{ fontWeight: 500, fontSize: "32px" }}
              >
                Accept Affiliate
              </Typography>
              <Form>
                <div
                  style={{
                    overflowY: "auto",
                  }}
                >
                  <div className="py-4  flex flex-col gap-4">
                    <div className="flex flex-col w-full">
                      <Field name="status">
                        {({ field }: any) => (
                          <>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Status
                              </InputLabel>
                              <Select
                                {...field}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={values?.status}
                                label="Status"
                                className="w-full"
                                onChange={handleChange}
                                disabled={!canWrite()}
                              >
                                {AffiliateStatus.map(
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
                            <span className="text-meta-1">
                              <ErrorMessage name="type" />
                            </span>
                          </>
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="link">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Link"
                            variant="outlined"
                            placeholder="?r=melker"
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="wordpress_link">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Wordpress Link"
                            variant="outlined"
                            placeholder="/ref/MHA"
                            defaultValue={selectedRow?.wordpress_link}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="coupon_code">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Coupon Code"
                            variant="outlined"
                            placeholder="MHA10"
                            defaultValue={selectedRow?.coupon_code}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="referral_amount_percent">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Referral amount in %"
                            variant="outlined"
                            placeholder="50"
                            type="number"
                            defaultValue={selectedRow?.referral_amount_percent}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="user_id">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Coupon Code"
                            variant="outlined"
                            placeholder="B7A5J8"
                            defaultValue={selectedRow?.user_id}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="email">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="User Email"
                            variant="outlined"
                            placeholder="myuseremail@gmail.com"
                            defaultValue={selectedRow?.email}
                            disabled={!canWrite()}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <div>Application text</div>
                      <p className="flex  py-[6px] w-full">
                        {selectedRow?.application_text ?? ""}
                      </p>
                    </div>
                    {canWrite() && (
                      <div className="mb-4">
                        <ButtonLoader
                          variant="contained"
                          type="submit"
                          isLoading={isLoading}
                          color="primary"
                          sx={submitBtnDrawer}
                          className="bg-black-2"
                        >
                          Submit
                        </ButtonLoader>
                      </div>
                    )}
                  </div>
                </div>
              </Form>
            </div>
          );
        }}
      </Formik>
    </>
  );
};
export default RequestedAffiliateDrawer;
