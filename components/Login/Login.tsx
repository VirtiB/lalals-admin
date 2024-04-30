"use client";
import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Formik } from "formik";
import {
  confirmSignIn,
  fetchAuthSession,
  signIn,
  SignInOutput,
} from "aws-amplify/auth";
import { Amplify } from "aws-amplify";
import { QRCodeSVG } from "qrcode.react";
import ButtonLoader from "@/components/common/Loader/buttonLoader";
import SnackBar from "@/components/common/Snackbar";
import { SnackbarOrigin } from "@mui/material";
import { useGlobalContext } from "@/app/context/global";
import { LoginInitialValues, LoginValidationSchema } from "@/app/utils/forms";
import { get } from "@/app/utils/api-helper";
import { generateHeaders, handleSnackbarClick } from "@/app/utils";

interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_USER_POOL_ID ?? "",
      userPoolClientId: process.env.NEXT_PUBLIC_AWS_APP_CLIENT_ID ?? "",
      identityPoolId: process.env.NEXT_PUBLIC_AWS_IDENTITY_POOL_ID ?? "",
      mfa: { status: "on", totpEnabled: true, smsEnabled: true },
      loginWith: { email: false, username: true },
    },
  },
});

const MfaSetup = ({ setupUri }: any) => {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mb-5">
        Scan the QR code with your authenticator app to set up MFA:
      </p>
      <QRCodeSVG value={setupUri} />
    </div>
  );
};

function ConfirmSignInWithTOTP() {
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });

  const [totpCode, setTotpCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { setUserDetails } = useGlobalContext();

  const getUserDetails = async (email: string) => {
    try {
      const { data }: any = await get(
        `admin-users/${email}?isAdmin=true`,
        generateHeaders()
      );
      localStorage.setItem("userDetails", JSON.stringify(data));
      localStorage.setItem("loginTimestamp", JSON.stringify(Date.now()));
      setUserDetails(JSON.stringify(data));
    } catch (error) {
      handleSnackbarClick("error", `Error While Fetching User Details`);
    }
  };

  const handleSnackbarClick = (type: string, message: string) => {
    setSnackbarState({
      ...snackbarState,
      open: true,
      type: type,
      message: message,
    });
  };

  const confirmSignInWithTOTP = async (e: any) => {
    setIsLoading(true);
    try {
      e.preventDefault();
      await confirmSignIn({ challengeResponse: totpCode });
      await getUserDetails(localStorage.getItem("email") ?? "");
    } catch (error: any) {
      setError(error.message);
      handleSnackbarClick("error", "Plese enter valid TOTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col mb-2.5 block font-medium text-black dark:text-white gap-6">
      <form>
        <h2>Confirm Sign-In with TOTP</h2>
        <label className="">Enter TOTP Code:</label>
        <input
          type="text"
          className="w-full rounded-lg border border-stroke bg-transparent mb-3 py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
          disabled={isLoading}
        />
        <ButtonLoader
          variant="contained"
          type="submit"
          isLoading={isLoading}
          onClick={(e) => confirmSignInWithTOTP(e)}
          color="primary"
          size="large"
          className="w-full mt-5 text-center cursor-pointer rounded-lg border border-primary bg-primary text-white p-5 transition hover:bg-opacity-90"
          sx={{ height: 50 }}
        >
          Confirm Sign-In
        </ButtonLoader>
      </form>
      <SnackBar
        setSnackbarState={setSnackbarState}
        snackbarState={snackbarState}
      />
    </div>
  );
}

const Login = () => {
  const [qrURI, setQrURI] = useState<any>(null);
  const [otp, setOtp] = useState<string>("");
  const [showOtp, setShowOtp] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { setShowSidebar, setUserDetails } = useGlobalContext();
  const [signInState, setSignInState] = useState({
    landing: true,
    qrCode: false,
    confirmOtp: false,
  });
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });

  useEffect(() => {
    setShowSidebar(true);
  }, [setShowSidebar]);

  const handleSignIn = async (event: any, values: any) => {
    setIsLoading(true);
    try {
      event.preventDefault();
      const { email, password } = values;
      setEmail(email);
      localStorage.setItem("email", email);
      const payload = await signIn({
        username: email,
        password,
      });
      setIsLoading(false);
      handleSignInNextSteps(payload);
    } catch (error) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error while signing in`
      );

      setIsLoading(false);
    }
  };

  const handleSignInNextSteps = (output: SignInOutput) => {
    const { nextStep } = output;
    switch (nextStep.signInStep) {
      case "CONTINUE_SIGN_IN_WITH_TOTP_SETUP":
        const totpSetupDetails = nextStep.totpSetupDetails;
        const appName = "lalals";
        const setupUri: any = totpSetupDetails.getSetupUri(appName);
        setQrURI(setupUri as string);
        setSignInState({
          confirmOtp: false,
          landing: false,
          qrCode: true,
        });
        // Open setupUri with an authenticator APP to retrieve an OTP code
        break;
      // ...

      case "CONFIRM_SIGN_IN_WITH_TOTP_CODE":
        setShowOtp(true);
        setSignInState({
          confirmOtp: true,
          landing: false,
          qrCode: false,
        });
        break;
    }
  };

  const handleSignInConfirmation = useCallback(
    async (event: any) => {
      setIsLoading(true);
      try {
        event.preventDefault();
        await confirmSignIn({ challengeResponse: otp });
        const { accessToken }: any = (await fetchAuthSession()).tokens;
        localStorage.setItem("accessToken", accessToken?.toString() ?? "");
        // const { data }: any = await get(`admin-users/${email}`);
        // localStorage.setItem("userDetails", JSON.stringify(data));
        // setUserDetails(JSON.stringify(data));
        // router.replace("/");
      } catch (error) {
        handleSnackbarClick(
          snackbarState,
          setSnackbarState,
          "error",
          `Error while signing in`
        );
      } finally {
        setIsLoading(false);
      }
    },
    [email, otp, setUserDetails]
  );

  return (
    <>
      {
        <>
          <div className="rounded-sm border border-stroke bg-white shadow-default">
            <div className="flex flex-wrap items-center">
              <div className="hidden w-full xl:block xl:w-1/2">
                <div className="px-26 py-17.5 text-center">
                  <Link className="mb-5.5 inline-block" href="/">
                    <Image
                      className="dark:hidden"
                      src={"/images/logo/lalals-logo.png"}
                      alt="Logo"
                      width={90}
                      height={18}
                    />
                  </Link>

                  <p className="2xl:px-20">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit
                    suspendisse.
                  </p>

                  <span className="mt-15 inline-block">
                    <Image
                      src="./svg/login.svg"
                      alt="404"
                      objectFit="contain"
                      width={250}
                      height={250}
                    />
                  </span>
                </div>
              </div>

              <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
                <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
                  <h2 className="mb-9 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                    Sign In to LalalsAdmin
                  </h2>

                  {signInState.landing && (
                    <Formik
                      initialValues={LoginInitialValues}
                      validationSchema={LoginValidationSchema}
                      enableReinitialize
                      onSubmit={(event, values) => {
                        handleSignIn(event, values);
                      }}
                    >
                      {({
                        values,
                        errors,
                        touched,
                        handleChange,
                        handleBlur,
                        handleSubmit,
                        isSubmitting,
                        isValid,
                      }) => (
                        <form onSubmit={handleSubmit}>
                          <div className="mb-4">
                            <label
                              className="mb-2.5 block font-medium text-black dark:text-white"
                              htmlFor="email"
                            >
                              Email
                            </label>
                            <div className="relative">
                              <input
                                name="email"
                                type="email"
                                value={values.email}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />

                              <span className="absolute right-4 top-4">
                                <svg
                                  className="fill-current"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.5">
                                    <path
                                      d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                                      fill=""
                                    />
                                  </g>
                                </svg>
                              </span>
                            </div>
                            {errors.email && touched.email && (
                              <span style={{ color: "red" }}>
                                {errors.email as string | string[]}
                              </span>
                            )}
                          </div>
                          <div className="mb-6">
                            <label
                              className="mb-2.5 block font-medium text-black dark:text-white"
                              htmlFor="password"
                            >
                              Password
                            </label>
                            <div className="relative">
                              <input
                                name="password"
                                type="password"
                                value={values.password}
                                onBlur={handleBlur}
                                onChange={handleChange}
                                placeholder="8+ Characters, 1 Capital letter"
                                className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10  outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                              />

                              <span className="absolute right-4 top-4">
                                <svg
                                  className="fill-current"
                                  width="22"
                                  height="22"
                                  viewBox="0 0 22 22"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <g opacity="0.5">
                                    <path
                                      d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                                      fill=""
                                    />
                                    <path
                                      d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                                      fill=""
                                    />
                                  </g>
                                </svg>
                              </span>
                            </div>
                            <span style={{ color: "red" }}>
                              {errors.password &&
                                touched.password &&
                                (errors.password as string | string[])}
                            </span>
                          </div>

                          <div className="mb-2">
                            <ButtonLoader
                              variant="contained"
                              type="submit"
                              isLoading={isLoading}
                              onClick={(event: any) =>
                                handleSignIn(event, values)
                              }
                              color="primary"
                              size="large"
                              className="w-full mt-5 text-center cursor-pointer rounded-lg border border-primary bg-primary text-white p-5 transition hover:bg-opacity-90"
                              // sx={{ height: 50 }}
                              // disabled={
                              //   !isValid && Object.keys(errors).length > 0
                              // }
                              disabled={isSubmitting}
                              sx={{ height: 50 }}
                            >
                              Sign In
                            </ButtonLoader>
                          </div>
                        </form>
                      )}
                    </Formik>
                  )}

                  {signInState.qrCode && (
                    <div className="flex items-center flex-col">
                      <MfaSetup setupUri={qrURI} />
                      <input
                        className=" rounded-lg mt-5 border border-stroke bg-transparent py-4 pl-6 pr-10 text-black outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                        name="otp"
                        value={otp}
                        type="number"
                        onChange={(e) => setOtp(e.target.value)}
                      />
                      <button
                        type="button"
                        className="cursor-pointer mt-5 rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90"
                        onClick={(e: any) => handleSignInConfirmation(e)}
                      >
                        Confirm OTP
                      </button>
                    </div>
                  )}

                  {signInState.confirmOtp && <ConfirmSignInWithTOTP />}
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>
  );
};

export default Login;
