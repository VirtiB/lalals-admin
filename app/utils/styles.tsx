const VoiceTypeStyles = {
  INSPIRED: "text-[#0088FF] bg-[#E1F1FF]",
  ORIGINAL: "bg-[#FFEBCD] text-[#FF9900]",
  CUSTOM: "bg-[#DCF5E8] text-[#1FBE6C]",
};

const VoiceStatusStyles = {
  ACTIVE: "bg-[#1FBE6C] text-[#FFFFFF]",
  TRAINING: "bg-[#FFECFF] text-[#BB1FBE]",
  HIDDEN: "bg-[#FFF7EB] text-[#F79E1B]",
  BROKEN: "text-[#FF0000] bg-[#FFEAEA]",
  PENDING: "bg-[#FFF7EB] text-[#F79E1B]",
  DATASET: "bg-[#FFECFF] text-[#BB1FBE]",
  UPLOADED: "bg-[#FFECFF] text-[#BB1FBE]",
};
const CommentStatusStyles = {
  LIVE: "bg-[#E8F6EF] text-[#1FBE6C]",
  FLAGGED: "bg-[#FFEAEA] text-[#FF0000]",
};
const ConversionsStatusStyles = {
  SUCCESS: "bg-[#E8F6EF] text-[#1FBE6C]",
  FAILED: "bg-[#FFEAEA] text-[#FF0000]",
  ONGOING: "bg-[#FFF3E2] text-[#FF9900]",
};
const MusicStatusStyles = {
  SUCCESS: "bg-[#E8F6EF] text-[#1FBE6C]",
  FAILED: "bg-[#FFEAEA] text-[#FF0000]",
  ONGOING: "bg-[#FFF3E2] text-[#FF9900]",
};

const AffiliateStatusStyles = {
  PENDING: "bg-[#FFF7EB] text-[#F79E1B]",
  ACTIVE: "",
  REJECTED: "",
};

const EarningRequestsStyles = {
  PAID: "text-[#1FBE6C] bg-[#1FBE6C]",
  UNPAID: "text-[#F90] bg-[#FFF5E7]",
};

const EditedByTypography = {
  color: "#868C98",
  fontFamily: "inherit",
  fontSize: "16px",
  width: "100%",
  fontWeight: "normal",
};

export {
  VoiceTypeStyles,
  VoiceStatusStyles,
  AffiliateStatusStyles,
  EarningRequestsStyles,
  CommentStatusStyles,
  MusicStatusStyles,
  ConversionsStatusStyles,
  EditedByTypography,
};
