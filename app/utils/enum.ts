enum VoiceTypeEnum {
  "RAP" = "Rap",
  "SINGER" = "Singer",
  "POLITICIAN" = "Politician",
}

enum VoiceType2Enum {
  "INSPIRED" = "Inspired",
  "ORIGINAL" = "Original",
  "CUSTOM" = "Custom",
}

enum VoiceStatusEnum {
  "ACTIVE" = "Active",
  "TRAINING" = "Training",
  "HIDDEN" = "Hidden",
  "BROKEN" = "Broken",
  "PENDING" = "Pending",
  "DATASET" = "Dataset",
  "UPLOADED" = "Uploaded",
}
enum LyricsLanguagesEnum {
  "ENGLISH" = "English",
  "SPANISH" = "Spanish",
  "GERMAN" = "German",
  "ITALIAN" = "Italian",
  "JAPANESE" = "Japanese",
  "PORTUGUESE" = "Portuguese",
  "FRENCH" = "French",
  "KOREAN" = "Korean",
  "HINDI" = "Hindi",
  "ARABIC" = "Arabic",
  "CHINESE" = "Chinese",
  "TURKISH" = "Turkish",
  "RUSSIAN" = "Russian",
  "OTHER" = "Other",
}

enum VoicePermissionEnum {
  "ALL_USERS" = "Free",
  "BASIC_USERS" = "Basic",
  "PRO_USERS" = "Pro",
}

enum ProjectTypeEnum {
  "NORMAL" = "Normal",
  "COVER" = "Cover Song",
  "BEAT" = "Beat",
}

enum ProjectStatusEnum {
  "PRIVATE" = "Private",
  "PUBLIC" = "Public",
}

enum GenderEnum {
  "MALE" = "Male",
  "FEMALE" = "Female",
}

enum LanguageEnum {
  "en" = "English",
  "it" = "Italian",
  "gr" = "German",
  "sp" = "Spanish",
  "sw" = "Swedish",
  "fr" = "French",
}

type ProjectConversionType = {
  [key: string]: string;
};
const ProjectConversionType: ProjectConversionType = {
  TTS: "Text to Speech",
  VOICE_TO_VOICE: "Voice to Voice",
  COVER: "Cover Song",
  LYRICS_TO_MUSIC: "Lyrics to Music",
};
export {
  GenderEnum,
  ProjectStatusEnum,
  ProjectTypeEnum,
  VoicePermissionEnum,
  VoiceStatusEnum,
  VoiceTypeEnum,
  VoiceType2Enum,
  LanguageEnum,
  ProjectConversionType,
  LyricsLanguagesEnum,
};
