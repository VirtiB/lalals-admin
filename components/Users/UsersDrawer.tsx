import {
  UpdateUserValidationSchema,
  RegisterInitialValues,
  RegisterUserValidationSchema,
} from "@/app/utils/forms";
import { Typography, Divider, TextField } from "@mui/material";
import { Formik } from "formik";
import React from "react";
import ButtonLoader from "../common/Loader/buttonLoader";
import { submitBtnDrawer } from "../common/Styles";
import { formateTimeAndDate } from "@/app/utils";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";
import DeleteButton from "../common/Buttons/deleteButton";
import { EditedByTypography } from "@/app/utils/styles";

const UserDrawer = ({
  onCloseDrawerCall,
  userDetails,
  validatePassword,
  deleteUser,
  isLoading,
  handleSubmit,
  privileges,
}: any) => {
  const canWrite = () => {
    return privileges?.canWrite();
  };
  return (
    <div className="my-6">
      <Formik
        initialValues={
          userDetails && userDetails?.id ? userDetails : RegisterInitialValues
        }
        validationSchema={
          userDetails && userDetails?.id
            ? UpdateUserValidationSchema
            : RegisterUserValidationSchema
        }
        validate={validatePassword}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values, resetForm);
        }}
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
        }) => {
          return (
            <form onSubmit={handleSubmit} className={`flex flex-col w-full `}>
              <div className="px-[41px]">
                <div className="py-[10px] flex flex-col">
                  <TextField
                    id="outlined-basic"
                    name="email"
                    label="Email"
                    variant="outlined"
                    type="email"
                    value={values?.email}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={userDetails?.email}
                  />
                  {errors.email && touched.email && (
                    <span className="text-meta-1">
                      {errors.email as string | string[]}
                    </span>
                  )}
                </div>
                <div className="py-[10px] flex flex-col">
                  <TextField
                    id="outlined-basic"
                    name="name"
                    label="Username"
                    variant="outlined"
                    type="text"
                    value={values?.name}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    disabled={!canWrite()}
                  />
                  <span className="text-meta-1">
                    {errors?.name &&
                      touched?.name &&
                      (errors?.name as string | string[])}
                  </span>
                </div>
                {userDetails && !userDetails?.id && (
                  <div className="py-[10px] flex flex-col">
                    <TextField
                      id="outlined-basic"
                      name="password"
                      label="Password"
                      variant="outlined"
                      type="password"
                      value={values?.password}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={!canWrite()}
                    />
                    <span className="text-meta-1">
                      {errors?.password &&
                        touched?.password &&
                        (errors?.password as string | string[])}
                    </span>
                  </div>
                )}
                {userDetails && userDetails?.id && (
                  <>
                    <div className="py-[10px] flex flex-col">
                      <TextField
                        id="newPassword"
                        name="newPassword"
                        label="New Password"
                        variant="outlined"
                        type="password"
                        value={values?.newPassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!canWrite()}
                      />
                      {errors.newPassword && touched.newPassword && (
                        <span className="text-meta-1">
                          {errors.newPassword as string | string[]}
                        </span>
                      )}
                    </div>
                    <div className="py-[10px] flex flex-col">
                      <TextField
                        id="cpassword"
                        name="cpassword"
                        label="Confirm Password"
                        variant="outlined"
                        type="password"
                        value={values?.cpassword}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!canWrite()}
                      />

                      {errors.cpassword && (
                        <span className="text-meta-1">
                          {errors.cpassword as string | string[]}
                        </span>
                      )}
                    </div>
                  </>
                )}
                {canWrite() && (
                  <div className="py-[10px]">
                    <ButtonLoader
                      variant="contained"
                      type="submit"
                      isLoading={isLoading}
                      sx={submitBtnDrawer}
                      className="bg-black-2"
                    >
                      {values && values?.id ? "Update User" : "Create User"}
                    </ButtonLoader>
                  </div>
                )}
              </div>
            </form>
          );
        }}
      </Formik>
    </div>
  );
};

export default UserDrawer;
