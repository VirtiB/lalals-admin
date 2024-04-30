import * as Yup from "yup";
import { emailRegex, passwordRegex } from "./regex";
import { privilegesList } from "./data";

const MESSAGES = {
  ERROR: {
    REQUIRED: (field: string) => `${field} is required`,
    INVALID: (field: string) => `Please enter a valid ${field}`,
    STRONG_PASSWORD: () => `Please enter a strong password.`,
  },
};

const CreateVoiceInitialValues = {
  voice_name: "",
  profile_picture: null,
  type: null,
  type2: null,
  status: null,
  permission: null,
  use_count: 0,
  like_count: 0,
  gender: null,
  country: "",
  language: null,
  info: "",
  voice_id_api: "",
};

const CreateProductInitialValues = {
  name: "",
  description: "",
  amount: "",
  type: "",
  plans: [{ amount: "", duration: "" }],
};

const CreateProductValidationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  description: Yup.string(),
  amount: Yup.number().required("Price is required"),
  type: Yup.string().required("Type is required"),
  plans: Yup.array(),
  //TODO Build error
  // plans: Yup.array().of(
  //   Yup.object({
  //     amount: Yup.number().required("Price is required"),
  //     type: Yup.string().required("Type is required"),
  //     duration: Yup.string().when("type", {
  //       is: "Subscription",
  //       then: Yup.string().required("Duration is required for Subscription"),
  //       otherwise: Yup.string().notRequired(),
  //     }),
  //   })
  // ),
});

const CreateVoiceValidationSchema = Yup.object({
  voice_name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Voice Name")),
  type: Yup.string().required(MESSAGES.ERROR.REQUIRED("Type")),
  type2: Yup.string().required(MESSAGES.ERROR.REQUIRED("Type 2")),
  permission: Yup.string().required(MESSAGES.ERROR.REQUIRED("Permission")),
  gender: Yup.string().required(MESSAGES.ERROR.REQUIRED("Gender")),
  language: Yup.string().required(MESSAGES.ERROR.REQUIRED("Language")),
  voice_id_api: Yup.string().required(MESSAGES.ERROR.REQUIRED("API")),
});

const RegisterValidationSchema = Yup.object({
  email: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Email"))
    .matches(emailRegex, MESSAGES.ERROR.INVALID("email")),
  password: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Password"))
    .matches(passwordRegex, MESSAGES.ERROR.STRONG_PASSWORD),
  username: Yup.string().required(MESSAGES.ERROR.REQUIRED("Username")),
});

const RegisterUserValidationSchema = Yup.object({
  email: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Email"))
    .matches(emailRegex, MESSAGES.ERROR.INVALID("email")),
  password: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Password"))
    .matches(passwordRegex, MESSAGES.ERROR.STRONG_PASSWORD),
  name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Username")),
});

const UpdateMusicValidationSchema = Yup.object({
  // image: Yup.string().required(MESSAGES.ERROR.REQUIRED("Image")),
  name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Name")),
  // voice_name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Voice Name")),
  conversionType: Yup.string().required(
    MESSAGES.ERROR.REQUIRED("Conversion Type")
  ),
});

const createCouponValidationSchema = Yup.object({
  name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Name")),
});

const UpdateUserValidationSchema = Yup.object({
  name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Username")),
  newPassword: Yup.string().matches(
    passwordRegex,
    MESSAGES.ERROR.STRONG_PASSWORD
  ),
  cpassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Passwords do not match"
  ),
});

const RegisterInitialValues = {
  email: "",
  password: "",
  username: "",
};
const CreateAdminInitialValues = {
  email: "",
  password: "",
  username: "",
  role: "",

  modules: Object.keys(privilegesList).map((privilege) => {
    return { [privilege]: { read: false, write: false, delete: false } };
  }),
};

const createCouponInitialValues = {
  name: "",
  type: "",
  amount_off: null,
  percent_off: null,
  max_redemptions: "",
};

const affiliatesInitialValues = {
  status: "",
  link: "",
  wordpress_link: "",
  coupon_code: "",
  referral_amount_percent: 0,
  user_id: "",
  email: "",
  paypal_email: "",
  payout_threshold: 0,
  application_text: "",
};
const CreateLyricsInitialValues = {
  title: "",
  status: "ACTIVE",
  voice_id: "",
  tags: [""],
  lyrics: "",
  language: "ENGLISH",
};

const LoginInitialValues = {
  email: "",
  password: "",
};

const LoginValidationSchema = Yup.object({
  email: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Email"))
    .matches(emailRegex, MESSAGES.ERROR.INVALID("email")),
  password: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Password"))
    .matches(passwordRegex, MESSAGES.ERROR.STRONG_PASSWORD),
});

const UpdateAdminValidationSchema = Yup.object({
  username: Yup.string().required(MESSAGES.ERROR.REQUIRED("Username")),
  newPassword: Yup.string().matches(
    passwordRegex,
    MESSAGES.ERROR.STRONG_PASSWORD
  ),
  cpassword: Yup.string().oneOf(
    [Yup.ref("newPassword")],
    "Passwords do not match"
  ),
});
const CreateLyricsValidationSchema = Yup.object({
  title: Yup.string().required(MESSAGES.ERROR.REQUIRED("title")),
  status: Yup.string().required(MESSAGES.ERROR.REQUIRED("status")),
  lyrics: Yup.string().required(MESSAGES.ERROR.REQUIRED("lyrics")),
});
const UpdateLyricsValidationSchema = Yup.object({
  title: Yup.string().required(MESSAGES.ERROR.REQUIRED("title")),
  status: Yup.string().required(MESSAGES.ERROR.REQUIRED("status")),
  content: Yup.string().required(MESSAGES.ERROR.REQUIRED("lyrics")),
});

const trainingInitialValues = {
  model_name: "",
  user_id: "",
  user_email: "",
  dataset: "",
  epochs: 400,
  sampling_rate: 48000,
  version: "V2",
  batch_size: 24,
  pitch_extraction: "rmvp",
  status: "",
};

const CreateTrainingValidationSchema = Yup.object({
  model_name: Yup.string().required(MESSAGES.ERROR.REQUIRED("Model Name")),
  user_id: Yup.string().required(MESSAGES.ERROR.REQUIRED("Iser Id")),
  user_email: Yup.string()
    .required(MESSAGES.ERROR.REQUIRED("Email"))
    .matches(emailRegex, MESSAGES.ERROR.INVALID("email")),
  dataSet: Yup.string().required(MESSAGES.ERROR.REQUIRED("Dataset")),
});

export {
  MESSAGES,
  CreateVoiceInitialValues,
  CreateVoiceValidationSchema,
  CreateProductInitialValues,
  CreateProductValidationSchema,
  RegisterValidationSchema,
  RegisterInitialValues,
  createCouponInitialValues,
  CreateAdminInitialValues,
  UpdateUserValidationSchema,
  createCouponValidationSchema,
  LoginInitialValues,
  LoginValidationSchema,
  UpdateAdminValidationSchema,
  affiliatesInitialValues,
  trainingInitialValues,
  CreateTrainingValidationSchema,
  CreateLyricsInitialValues,
  CreateLyricsValidationSchema,
  RegisterUserValidationSchema,
  UpdateMusicValidationSchema,
  UpdateLyricsValidationSchema,
};
