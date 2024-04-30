import Image from "next/image";
import { RecentVisitStatus, StatusType } from "@/app/utils/data";
import {
  createCouponInitialValues,
  createCouponValidationSchema,
} from "@/app/utils/forms";
import { Typography, Divider, TextField, MenuItem } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";

const RecentVisitsDrawer = ({ handleSubmit, selectedRow }: any) => {
  return (
    <Formik
      initialValues={createCouponInitialValues}
      validationSchema={createCouponValidationSchema}
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, resetForm }) => (
        <>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ fontWeight: 600, fontSize: "26px", marginTop: "20px" }}
          >
            Visit #{selectedRow?.id?.split("-")[0]}
          </Typography>
          <Form>
            <div
              style={{
                overflowY: "auto",
              }}
            >
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Name"
                  variant="outlined"
                  placeholder="Melker"
                  value={selectedRow?.affiliate?.name}
                />
              </div>
              <div className="pt-6">
                <Field name="status">
                  {({ field }: any) => (
                    <TextField
                      select
                      value={selectedRow?.status}
                      label="Status"
                      variant="outlined"
                      fullWidth
                      margin="normal"
                    >
                      {RecentVisitStatus.map(
                        (option: { label: string; value: string }) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        )
                      )}
                    </TextField>
                  )}
                </Field>
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Referral URL"
                  variant="outlined"
                  value={selectedRow?.url}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Amount"
                  variant="outlined"
                  value={`$${selectedRow?.amount}`}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Affiliate Amount"
                  variant="outlined"
                  value={selectedRow?.affiliate_amount}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Affiliate Amount"
                  variant="outlined"
                  value={selectedRow?.percentage_amount}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Order ID (Paddle)"
                  variant="outlined"
                  value={selectedRow?.order_id}
                />
              </div>
              <div className="pt-6">
                <TextField
                  className="w-full"
                  id="outlined-basic"
                  label="Cookie ID"
                  variant="outlined"
                  value={selectedRow?.id?.split("-")[0]}
                />
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
};
export default RecentVisitsDrawer;
