import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Typography,
  Divider,
  TextField,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
} from "@mui/material";
import { StatusType } from "../../app/utils/data";
import { affiliatesInitialValues } from "../../app/utils/forms";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";

const AffiliateDrawer = ({
  affiliatesValues,
  selectedRow,
  updateRequestedAffiliate,
  onCloseDrawerCall,
}: any) => {
  return (
    <>
      <CloseDrawerButton onClick={onCloseDrawerCall} />
      <Formik
        initialValues={
          selectedRow.id ? affiliatesValues : affiliatesInitialValues
        }
        onSubmit={updateRequestedAffiliate}
      >
        {({ values, errors, touched, resetForm, handleChange }: any) => {
          return (
            <div className="px-[41px] py-4">
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                style={{ fontWeight: 500, fontSize: "32px" }}
              >
                {selectedRow.name}
              </Typography>
              <Form>
                <div
                  style={{
                    overflowY: "auto",
                  }}
                >
                  <div className="py-6">
                    <div className="py-2">
                      <Field name="status">
                        {({ field }: any) => (
                          <>
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                Status
                              </InputLabel>
                              <Select
                                {...field}
                                // name="status"
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={values?.status}
                                label="Status"
                                onChange={handleChange}
                                className="w-full"
                              >
                                {StatusType.map(
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
                            defaultValue={selectedRow?.link}
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
                            defaultValue={selectedRow?.wordpress_link ?? ""}
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
                            label="Refferal Amount Percent"
                            variant="outlined"
                            placeholder="50"
                            type="number"
                            min={0}
                            defaultValue={selectedRow?.referral_amount_percent}
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
                            label="User ID"
                            variant="outlined"
                            placeholder="B7A5J8"
                            disabled
                            value={selectedRow?.user_id}
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
                            label="Email"
                            variant="outlined"
                            placeholder="myuseremail@gmail.com"
                            name="email"
                            disabled
                            value={selectedRow?.email}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="paypal_email">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Paypal Email"
                            variant="outlined"
                            placeholder="myuseremail@gmail.com"
                            defaultValue={selectedRow?.paypal_email || ""}
                          />
                        )}
                      </Field>
                    </div>
                    <div className="py-2">
                      <Field name="payout_threshold">
                        {({ field }: any) => (
                          <TextField
                            {...field}
                            className="w-full"
                            id="outlined-basic"
                            label="Payout Threshold"
                            variant="outlined"
                            placeholder="50"
                            type="number"
                            min={0}
                            defaultValue={selectedRow?.payout_threshold}
                          />
                        )}
                      </Field>
                    </div>
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

export default AffiliateDrawer;
