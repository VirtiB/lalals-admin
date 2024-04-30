import { privilegesList } from "@/app/utils/data";
import {
  CreateAdminInitialValues,
  UpdateAdminValidationSchema,
  RegisterValidationSchema,
} from "@/app/utils/forms";
import { Typography, FormControlLabel, Switch, TextField } from "@mui/material";
import { Formik, Form } from "formik";
import React from "react";
import ButtonLoader from "../common/Loader/buttonLoader";
import { submitBtnDrawer } from "../common/Styles";
import Image from "next/image";
import { formateTimeAndDate } from "@/app/utils";
import CloseDrawerButton from "../common/Buttons/closeDrawerButton";
import DeleteButton from "../common/Buttons/deleteButton";
import { EditedByTypography } from "@/app/utils/styles";

const AdminUserDrawer = ({
  onCloseDrawerCall,
  adminUserDetails,
  handleCreateUser,
  isLoading,
  deleteAdminUser,
  privileges,
}: any) => {
  const canWrite = () => {
    return privileges?.canWrite();
  };
  return (
    <div>
      <>
        <Formik
          initialValues={
            adminUserDetails && adminUserDetails?.id
              ? adminUserDetails
              : CreateAdminInitialValues
          }
          validationSchema={
            adminUserDetails && adminUserDetails?.id
              ? UpdateAdminValidationSchema
              : RegisterValidationSchema
          }
          onSubmit={(values: any, { resetForm }: any) => {
            handleCreateUser(values, resetForm);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
            isSubmitting,
          }) => (
            <Form>
              <div className=" py-6">
                <div className="px-[41px]  flex flex-col gap-4">
                  <div className=" flex flex-col w-full">
                    <TextField
                      id="outlined-basic"
                      name="email"
                      label="Email"
                      variant="outlined"
                      type="email"
                      value={values.email}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={!canWrite()}
                    />
                    {errors.email && touched.email && (
                      <span className="text-meta-1 sticky">
                        {errors.email as string | string[]}
                      </span>
                    )}
                  </div>
                  <div className=" flex flex-col w-full">
                    <TextField
                      id="outlined-basic"
                      name="username"
                      label="Username"
                      variant="outlined"
                      type="text"
                      value={values.username}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={!canWrite()}
                    />

                    <span className="text-meta-1">
                      {errors.username &&
                        touched.username &&
                        (errors.username as string | string[])}
                    </span>
                  </div>
                  <div className="flex flex-col w-full">
                    <TextField
                      id="outlined-basic"
                      name="role"
                      label="Role Name"
                      variant="outlined"
                      type="text"
                      value={values.role}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      disabled={!canWrite()}
                    />

                    <span className="text-meta-1">
                      {errors.role &&
                        touched.role &&
                        (errors.role as string | string[])}
                    </span>
                  </div>
                  {adminUserDetails && !adminUserDetails?.id && (
                    <div className=" flex flex-col w-full">
                      <TextField
                        id="outlined-basic"
                        name="password"
                        label="Password"
                        variant="outlined"
                        type="password"
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        disabled={!canWrite()}
                      />

                      <span className="text-meta-1">
                        {errors.password &&
                          touched.password &&
                          (errors.password as string | string[])}
                      </span>
                    </div>
                  )}
                  {adminUserDetails && adminUserDetails?.id && (
                    <>
                      <div className=" flex flex-col w-full">
                        <TextField
                          id="outlined-basic"
                          name="newPassword"
                          label="New Password"
                          variant="outlined"
                          type="password"
                          value={values.newPassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!canWrite()}
                        />

                        <span className="text-meta-1">
                          {errors.newPassword &&
                            touched.newPassword &&
                            (errors.newPassword as string | string[])}
                        </span>
                      </div>
                      <div className="flex flex-col w-full">
                        <TextField
                          id="outlined-basic"
                          name="cpassword"
                          label="Confirm Password"
                          variant="outlined"
                          type="password"
                          value={values.cpassword}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          disabled={!canWrite()}
                        />

                        <span className="text-meta-1">
                          {errors.cpassword &&
                            touched.cpassword &&
                            (errors.cpassword as string | string[])}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                <div className="px-[41px] pb-6">
                  <div className=" flex w-full">
                    <div className="grid grid-cols-6 gap-4">
                      <div className="col-span-12 lg:col-span-6">
                        <div>
                          {Object.values(privilegesList).map((module) => (
                            <div
                              className="col-span-12 lg:col-span-6"
                              key={module.id}
                            >
                              <label htmlFor={module.id}>{module.name}</label>
                              <div className="grid grid-cols-12 gap-5">
                                {["read", "write", "delete"].map((i) => (
                                  <FormControlLabel
                                    className="col-span-4"
                                    control={
                                      <Switch
                                        disabled={!canWrite()}
                                        checked={
                                          values.modules &&
                                          values.modules[module.id] &&
                                          values.modules[module.id][i]
                                        }
                                        onChange={(e) => {
                                          const updatedModules = {
                                            ...values.modules,
                                            [module.id]: {
                                              ...values.modules[module.id],
                                              [i]: e.target.checked,
                                            },
                                          };
                                          setFieldValue(
                                            "modules",
                                            updatedModules
                                          );
                                        }}
                                      />
                                    }
                                    label={
                                      i.charAt(0).toUpperCase() + i.slice(1)
                                    }
                                    key={i}
                                    id={`${module.id}-${i}`}
                                    name={`${module.id}-${i}`}
                                  />
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {canWrite() && (
                <div className="px-[41px] py-4">
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
            </Form>
          )}
        </Formik>
      </>
    </div>
  );
};

export default AdminUserDrawer;
