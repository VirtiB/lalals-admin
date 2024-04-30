const VoiceType = [
  {
    label: "Rap",
    value: "RAP",
  },
  { label: "Singer", value: "SINGER" },
  {
    label: "Politician",
    value: "POLITICIAN",
  },
  {
    label: "Character",
    value: "CHARACTER",
  },
  {
    label: "Influencer",
    value: "INFLUENCER",
  },
  {
    label: "Celebrity",
    value: "CELEBRITY",
  },
];

const VoiceType2 = [
  {
    label: "Inspired",
    value: "INSPIRED",
  },
  {
    label: "Original",
    value: "ORIGINAL",
  },
  {
    label: "Custom",
    value: "CUSTOM",
  },
];

const VoiceStatus = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Training",
    value: "TRAINING",
  },
  {
    label: "Hidden",
    value: "HIDDEN",
  },
  {
    label: "Broken",
    value: "BROKEN",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Dataset",
    value: "DATASET",
  },
  {
    label: "Uploaded",
    value: "UPLOADED",
  },
];
const VoiceSortByFilters = [
  {
    label: "Newest",
    value: "date_added",
  },
  {
    label: "Uses",
    value: "use_count",
  },
  {
    label: "Likes",
    value: "like_count",
  },
  // {
  //   label: "Listeners /mo",
  //   value: "LISTENERS/MO",
  // },
];

const ConversionsSortByFilters = [
  {
    label: "Newest",
    value: "date_added",
  },
];
const MusicSortByFilters = [
  {
    label: "Plays",
    value: "plays_count",
  },
  {
    label: "Likes",
    value: "like_count",
  },
  {
    label: "Newest",
    value: "date_added",
  },
];
const CommentsSortByFilters = [
  {
    label: "Newest",
    value: "date_added",
  },
  {
    label: "Likes",
    value: "like_count",
  },
];

const UsersSortByFilters = [
  {
    label: "Newest",
    value: "NEWEST",
  },
  {
    label: "Followers",
    value: "FOLLOWERS",
  },
  {
    label: "Lifetime Seconds",
    value: "LIFETIME_SECONDS",
  },
];
const MenuItems = [
  { value: "Newest", label: "Newest" },
  { value: "Description", label: "Description" },
  { value: "Type", label: "Type" },
];
const OrdersCategories = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Training",
    value: "TRAINING",
  },
  {
    label: "Hidden",
    value: "HIDDEN",
  },
];
const TrainingStatus = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Training",
    value: "TRAINING",
  },
];
const LyricsStatus = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
];
const LyricsLanguages = [
  {
    label: "English",
    value: "ENGLISH",
  },
  {
    label: "Spanish",
    value: "SPANISH",
  },
  {
    label: "German",
    value: "GERMAN",
  },
  {
    label: "Italian",
    value: "ITALIAN",
  },
  {
    label: "Japanese",
    value: "JAPANESE",
  },
  {
    label: "Portuguese",
    value: "PORTUGUESE",
  },
  {
    label: "French",
    value: "FRENCH",
  },
  {
    label: "Korean",
    value: "KOREAN",
  },
  {
    label: "Hindi",
    value: "HINDI",
  },
  {
    label: "Arabic",
    value: "ARABIC",
  },
  {
    label: "Chinese",
    value: "CHINESE",
  },
  {
    label: "Turkish",
    value: "TURKISH",
  },
  {
    label: "Russian",
    value: "RUSSIAN",
  },
  {
    label: "Other",
    value: "OTHER",
  },
];

const VoicePermission = [
  {
    label: "Free",
    value: "ALL_USERS",
  },
  {
    label: "Basic",
    value: "BASIC_USERS",
  },
  {
    label: "Pro",
    value: "PRO_USERS",
  },
];

const Gender = [
  {
    label: "Male",
    value: "MALE",
  },
  {
    label: "Female",
    value: "FEMALE",
  },
];

const Languages = [
  {
    label: "English",
    value: "en",
  },
  {
    label: "Italian",
    value: "it",
  },
  {
    label: "German",
    value: "gr",
  },
  {
    label: "Swedish",
    value: "sw",
  },
  {
    label: "Spanish",
    value: "sp",
  },
  {
    label: "French",
    value: "fr",
  },
];
const StatusType = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Paid",
    value: "PAID",
  },
];
const LyricsStatusType = [
  {
    label: "ACTIVE",
    value: "ACTIVE",
  },
  {
    label: "PENDING",
    value: "PENDING",
  },
];
const LyricsTagsType = [
  {
    label: "Rap",
    value: "Rap",
  },
  {
    label: "Trap",
    value: "Trap",
  },
  {
    label: "Pop",
    value: "Pop",
  },
  {
    label: "Reggaeton",
    value: "Reggaeton",
  },
  {
    label: "Deep House",
    value: "Deep House",
  },
  {
    label: "Drill",
    value: "Drill",
  },
  {
    label: "EDM",
    value: "EDM",
  },
  {
    label: "Ambient",
    value: "Ambient",
  },
  {
    label: "Aucustic",
    value: "Aucustic",
  },
  {
    label: "Chilled",
    value: "Chilled",
  },
  {
    label: "Classical",
    value: "Classical",
  },
  {
    label: "Deutschrap",
    value: "Deutschrap",
  },
  {
    label: "Guitar",
    value: "Guitar",
  },
  {
    label: "House",
    value: "House",
  },
  {
    label: "Hip Hop",
    value: "Hip Hop",
  },
  {
    label: "Jazz",
    value: "Jazz",
  },
  {
    label: "K-pop",
    value: "K-pop",
  },
  {
    label: "Latin",
    value: "Latin",
  },
  {
    label: "Lo-fi",
    value: "Lo-fi",
  },
  {
    label: "Melodic",
    value: "Melodic",
  },
  {
    label: "Orchestral",
    value: "Orchestral",
  },
  {
    label: "Rock",
    value: "Rock",
  },
  {
    label: "R&B",
    value: "R&B",
  },
  {
    label: "Techno",
    value: "Techno",
  },
  {
    label: "Upbeat",
    value: "Upbeat",
  },
  {
    label: "Seductive",
    value: "Seductive",
  },
  {
    label: "Sultry",
    value: "Sultry",
  },
  {
    label: "80s",
    value: "80s",
  },
];
const VoicesSortByFilter = [
  {
    label: "Newest",
    value: "Newest",
  },
  {
    label: " Uses (highest)",
    value: " Uses (highest)",
  },
  {
    label: "Likes(highest)",
    value: "Likes(highest)",
  },
  {
    label: "Listeners /mo(highest)",
    value: "Listeners /mo(highest)",
  },
];
const LyricsLanguageType = [
  {
    label: "English",
    value: "English",
  },
  {
    label: "Spanish",
    value: "Spanish",
  },
  {
    label: "German",
    value: "German",
  },
  {
    label: "Italian",
    value: "Italian",
  },
  {
    label: "Japanese",
    value: "Japanese",
  },
  {
    label: "Portuguese",
    value: "Portuguese",
  },
  {
    label: "French",
    value: "French",
  },
  {
    label: "Korean",
    value: "Korean",
  },
  {
    label: "Hindi",
    value: "Hindi",
  },
  {
    label: "Arabic",
    value: "Arabic",
  },
  {
    label: "Chinese",
    value: "Chinese",
  },
  {
    label: "Turkish",
    value: "Turkish",
  },
  {
    label: "Russian",
    value: "Russian",
  },
  {
    label: "Other",
    value: "Other",
  },
];

const PayoutRequestStatus = [
  {
    label: "Unpaid",
    value: "UNPAID",
  },
  {
    label: "Paid",
    value: "PAID",
  },
];
const MusicType = [
  {
    label: "Lyrics to Music",
    value: "LYRICS_TO_MUSIC",
  },
  {
    label: "Voice to Voice",
    value: "VOICE_TO_VOICE",
  },
  {
    label: "Cover Song",
    value: "COVER",
  },
  {
    label: "Lyrics to Music",
    value: "LYRICS_TO_MUSIC",
  },
];
const MusicStatus = [
  {
    label: "Success",
    value: "SUCCESS",
  },
  {
    label: "Ongoing",
    value: "ONGOING",
  },
];

const AffiliateStatus = [
  {
    label: "Active",
    value: "ACTIVE",
  },
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Rejected",
    value: "REJECTED",
  },
];

const RecentVisitStatus = [
  {
    label: "Pending",
    value: "PENDING",
  },
  {
    label: "Paid",
    value: "PAID",
  },
  {
    value: "SUCCESS",
    label: "Success",
  },
];

const privilegesList = {
  orders: { id: "orders", name: "Orders" },
  // coupons: { id: "coupons", name: "Coupons" },
  affiliates: { id: "affiliates", name: "Affiliates" },
  voices: { id: "voices", name: "Voices" },
  conversions: { id: "conversions", name: "Conversions" },
  products: { id: "products", name: "Products" },
  training: { id: "training", name: "Training" },
  lyrics: { id: "lyrics", name: "Lyrics" },
  music: { id: "music", name: "Music" },
  comments: { id: "comments", name: "Comments" },
  adminUsers: { id: "adminUsers", name: "Admin Users" },
  users: { id: "users", name: "users" },
};

export {
  VoicePermission,
  VoiceStatus,
  VoiceType,
  VoiceType2,
  Gender,
  Languages,
  StatusType,
  AffiliateStatus,
  PayoutRequestStatus,
  RecentVisitStatus,
  TrainingStatus,
  privilegesList,
  LyricsStatusType,
  LyricsTagsType,
  LyricsLanguageType,
  OrdersCategories,
  VoicesSortByFilter,
  MusicStatus,
  LyricsStatus,
  MusicType,
  LyricsLanguages,
  MenuItems,
  VoiceSortByFilters,
  ConversionsSortByFilters,
  MusicSortByFilters,
  CommentsSortByFilters,
  UsersSortByFilters,
};
