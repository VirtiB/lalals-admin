import Image from "next/image";
import { Formik, Form, Field, ErrorMessage } from "formik";
import {
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  TextField,
} from "@mui/material";
import { PayoutRequestStatus } from "../../app/utils/data";
import {
  createCouponInitialValues,
  createCouponValidationSchema,
} from "../../app/utils/forms";
const EarningRequestsDrawer = ({ selectedRow, getEarningRequest }: any) => {
  return (
    <Formik
      initialValues={createCouponInitialValues}
      validationSchema={createCouponValidationSchema}
      onSubmit={getEarningRequest}
    >
      {({ values, errors, touched, resetForm }) => (
        <>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{
              fontWeight: 500,
              fontSize: "32px",
              paddingLeft: "31px",
              paddingRight: "31px",
              marginTop: "20px",
            }}
          >
            Payout request
          </Typography>
          <Form>
            <div
              className="px-[31px] py-6 "
              style={{
                overflowY: "auto",
              }}
            >
              <div className="pt-4">
                <Field name="status">
                  {({ field }: any) => (
                    <>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={selectedRow.status}
                          label="Status"
                          className="w-full"
                        >
                          {PayoutRequestStatus.map(
                            (option: { label: string; value: string }) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            )
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
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="PayPal Payment Email"
                  variant="outlined"
                  placeholder="myuseremail@gmail.com"
                  value={selectedRow.paypal_email}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  placeholder="$50"
                  value={`$${selectedRow?.amount}`}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="User Email"
                  variant="outlined"
                  placeholder="myuseremail@gmail.com"
                  value={selectedRow.user_email}
                />
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};
export default EarningRequestsDrawer;
