import { GridColDef } from "@mui/x-data-grid";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import { calculateTimeDifference } from ".";
import {
  AffiliateStatusStyles,
  CommentStatusStyles,
  ConversionsStatusStyles,
  EarningRequestsStyles,
  MusicStatusStyles,
  VoiceStatusStyles,
} from "./styles";
import {
  LyricsLanguagesEnum,
  ProjectConversionType,
  VoiceStatusEnum,
} from "./enum";
import Image from "next/image";
import Link from "next/link";
import USA from "../../public/images/usa.png";

const affiliatesColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 150,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "black", fontWeight: 400 }}>{params.value}</div>
      );
    },
  },
  {
    field: "earnings",
    headerName: "Earnings",
    width: 120,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>${params.value}</div>;
    },
  },
  {
    field: "visits",
    headerName: "Visits",
    width: 120,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#8D8D8D" }}>{row?._count?.recent_visits}</div>
      );
    },
  },
  {
    field: "change",
    headerName: "Change",
    width: 120,
    sortable: false,
    renderCell: (params) => {
      const changeValue = params.value;
      let textColor = "#000";
      let icon = <TrendingDownIcon />;

      if (changeValue > 5) {
        textColor = "#1FBE6C";
      } else if (changeValue <= 5) {
        textColor = "#FF8585";
      }
      return (
        <div style={{ color: textColor }}>
          {/* <TrendingUpIcon /> */}
          {/* {changeValue > 5 ? <TrendingUpIcon /> : <TrendingDownIcon />}
          {params.value}% */}
        </div>
      );
    },
  },
];

const earningRequestsColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 170,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "black", fontWeight: 400 }}>
          {row.affiliate.name}
        </div>
      );
    },
  },
  {
    field: "earnings",
    headerName: "Earnings",
    width: 120,
    sortable: false,
    renderCell: ({ row }) => {
      return <div style={{ color: "#8D8D8D" }}>${row.amount}</div>;
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    sortable: false,
    renderCell: (params) => {
      const statusValue: "PAID" | "UNPAID" = params.row.status;

      return (
        <div
          style={{
            width: "93px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 600,
          }}
          className={EarningRequestsStyles[statusValue]}
        >
          {params.value}
        </div>
      );
    },
  },

  {
    field: "date_edited",
    headerName: "Date ",
    width: 120,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {calculateTimeDifference(row.date_edited)}
        </div>
      );
    },
  },
];

const requestsAffiliatesColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 230,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "black", fontWeight: 400 }}>{params.row.name}</div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    sortable: false,
    renderCell: ({
      row,
    }: {
      row: {
        status: "ACTIVE" | "PENDING" | "REJECTED";
      };
    }) => {
      return (
        <div
          className={`items-center justify-center flex rounded-[5px] w-[93px] text-[14px] font-semibold ${
            AffiliateStatusStyles[row.status]
          }`}
        >
          {row.status}
        </div>
      );
    },
  },
  {
    field: "date_edited",
    headerName: "Date ",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {calculateTimeDifference(row.date_edited)}
        </div>
      );
    },
  },
];

const recentReferralColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 100,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div className="text-black font-normal">{row?.affiliate?.name}</div>
      );
    },
  },
  {
    field: "cookieId",
    headerName: "Cookie ID",
    width: 100,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div className="text-black font-normal uppercase">
          {row?.id?.split("-")[0]}
        </div>
      );
    },
  },
  {
    field: "URL",
    headerName: "URL",
    width: 100,
    sortable: false,
    renderCell: ({ row }) => {
      return <div className="text-[#8D8D8D] font-normal">{row?.url}</div>;
    },
  },
  {
    field: "earnings",
    headerName: "Amount",
    width: 100,
    sortable: false,
    renderCell: ({ row }) => {
      return <div className="text-[#8D8D8D]">${row?.amount}</div>;
    },
  },

  {
    field: "date_edited",
    headerName: "Date ",
    width: 100,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div className="text-[#8D8D8D]">
          {calculateTimeDifference(row?.date_edited)}
        </div>
      );
    },
  },
];

const trainingColumns: GridColDef[] = [
  {
    field: "model_name",
    headerName: "Name",
    width: 100,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "#000000", fontWeight: 400 }}>
          {params.value ?? "N/A"}
        </div>
      );
    },
    headerClassName: "custom-header-class",
  },
  {
    field: "user_id",
    headerName: "UserId",
    width: 250,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {params.value.split("-")[0].toUpperCase() ?? "N/A"}
        </div>
      );
    },
  },

  {
    field: "user_email",
    headerName: "E-Mail",
    width: 250,
    sortable: false,
  },
  {
    field: "status",
    headerName: "status",
    width: 150,
    sortable: false,
    renderCell: ({
      row,
    }: {
      row: {
        status:
          | "ACTIVE"
          | "TRAINING"
          | "HIDDEN"
          | "BROKEN"
          | "PENDING"
          | "DATASET"
          | "UPLOADED";
      };
    }) => {
      return (
        <div
          className={`font-semibold w-[81px] flex justify-center items-center rounded-[7px] h-[22px] ${
            VoiceStatusStyles[row?.status]
          } `}
        >
          {row?.status && VoiceStatusEnum[row?.status]}
        </div>
      );
    },
  },
  {
    field: "dataset",
    headerName: "Dataset",
    width: 150,
    sortable: false,
    headerAlign: "center",

    renderCell: (params) => {
      return <div className="text-[#8D8D8D]">0ac0c13dcc30.zip</div>;
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 200,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
            display: "flex",
            justifyContent: "end",
          }}
        >
          {calculateTimeDifference(row.date_added)}
        </div>
      );
    },
  },
];

const musicColumns: GridColDef[] = [
  {
    field: "avatar",
    headerName: "Picture",
    width: 100,
    sortable: false,
    renderCell: (params) => {
      return (
        <Image
          src={params?.row?.avatar || "/images/user/user-01.png"}
          height={50}
          width={50}
          alt="voice-avatar"
          className="rounded-[12px]  min-h-[50px]"
        />
      );
    },
    headerClassName: "custom-header-class",
  },
  {
    field: "name",
    headerName: "Name",
    width: 200,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#000000", fontWeight: 400 }}>{row?.name}</div>
      );
    },
    headerClassName: "custom-header-class",
  },
  {
    field: "voices",
    headerName: "Voice",
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {params?.value.map((voice: any, index: any) => {
            return <div key={index}>{voice?.voice_name}</div>;
          })}
        </div>
      );
    },
  },
  {
    field: "conversionType",
    headerName: "Type",
    width: 150,
    sortable: false,
    renderCell: (params) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
          }}
        >
          {ProjectConversionType[params?.value || "Lyrics to Music"]}
        </div>
      );
    },
  },
  {
    field: "plays",
    headerName: "Plays",
    width: 100,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
          }}
        >
          {params?.value}
        </div>
      );
    },
  },
  {
    field: "likes",
    headerName: "Likes",
    width: 100,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
          }}
        >
          {params?.value}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    sortable: false,
    renderCell: ({
      row,
    }: {
      row: {
        status: "ONGOING" | "SUCCESS" | "FAILED";
      };
    }) => {
      return (
        <div
          className={`items-center justify-center flex rounded-[5px] w-[93px] text-[14px] font-semibold ${
            MusicStatusStyles[row.status]
          }`}
        >
          {row.status}
        </div>
      );
    },
  },
  {
    field: "date_added",
    headerName: "Date",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div
          style={{ color: "#8D8D8D", display: "flex", justifyContent: "end" }}
        >
          {calculateTimeDifference(params.row.date_added)}
        </div>
      );
    },
  },
];

const commentColumns: GridColDef[] = [
  {
    field: "username",
    headerName: "Username",
    width: 250,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>{params?.value}</div>;
    },
  },
  {
    field: "comment",
    headerName: "comment",
    width: 450,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>{params?.value}</div>;
    },
  },
  {
    field: "likes",
    headerName: "Likes",
    width: 150,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: (params) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
          }}
        >
          {params?.row?.likes}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: ({
      row,
    }: {
      row: {
        status: "LIVE" | "FLAGGED";
      };
    }) => {
      return (
        <div
          className={`items-center justify-center flex rounded-[5px] w-[93px] text-[14px] font-semibold ${
            CommentStatusStyles[row.status]
          }`}
        >
          {row.status}
        </div>
      );
    },
  },
  {
    field: "date_edited",
    headerName: "Date",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div
          style={{ color: "#8D8D8D", display: "flex", justifyContent: "end" }}
        >
          {calculateTimeDifference(params.row.date_edited)}
        </div>
      );
    },
  },
];

const UsersColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Username",
    width: 150,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>{params.value}</div>;
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 250,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "#000000", fontWeight: 400 }}>{params.value}</div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    sortable: false,
  },
  {
    field: "liked_projects",
    headerName: "Conversions",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {params.row?._count?.liked_projects}
        </div>
      );
    },
  },
  {
    field: "plays",
    headerName: "Plays",
    width: 80,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>100s</div>;
    },
  },
  {
    field: "credits",
    headerName: "Model Credits",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return 10;
    },
  },

  {
    field: "models",
    headerName: "Models",
    width: 80,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {/* {params.row?._count?.liked_voices} */}0
        </div>
      );
    },
  },
  {
    field: "user_date_joined",
    headerName: "Date",
    width: 140,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {calculateTimeDifference(row.date_joined)}
        </div>
      );
    },
  },
];

const lyricsColumns: GridColDef[] = [
  {
    field: "title",
    headerName: "Name",
    width: 150,
    sortable: false,

    renderCell: ({ row }) => {
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="text-black text-[14px] font-normal">
              {row?.title || ""}
            </p>
          </div>
        </>
      );
    },
  },
  {
    field: "voice_id",
    headerName: "Voice",
    width: 150,
    sortable: false,

    renderCell: ({ row }) => {
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="text-black text-[14px] font-normal">
              {row?.voice_id || "-"}
            </p>
          </div>
        </>
      );
    },
  },
  {
    field: "content",
    headerName: "Lyrics",
    width: 500,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div className="w-[81px] flex items-center rounded-[7px] h-[22px]">
          {row?.content.substring(0, 70) + "..."}
        </div>
      );
    },
  },
  {
    field: "language",
    headerName: "Language",
    width: 110,
    sortable: false,
    renderCell: ({
      row,
    }: {
      row: {
        language:
          | "ENGLISH"
          | "SPANISH"
          | "GERMAN"
          | "ITALIAN"
          | "JAPANESE"
          | "PORTUGUESE"
          | "FRENCH"
          | "KOREAN"
          | "HINDI"
          | "ARABIC"
          | "CHINESE"
          | "TURKISH"
          | "RUSSIAN"
          | "OTHER";
      };
    }) => {
      return (
        <div
          className={` w-[81px] flex justify-center items-center rounded-[7px] h-[22px]`}
        >
          {row?.language && LyricsLanguagesEnum[row?.language]}
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 130,
    sortable: false,
    renderCell: ({
      row,
    }: {
      row: {
        status:
          | "ACTIVE"
          | "TRAINING"
          | "HIDDEN"
          | "BROKEN"
          | "PENDING"
          | "DATASET"
          | "UPLOADED";
      };
    }) => {
      return (
        <div
          className={` w-[81px] flex justify-center items-center rounded-[7px] h-[22px] ${
            VoiceStatusStyles[row?.status]
          } `}
        >
          {row?.status && VoiceStatusEnum[row?.status]}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 120,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div className="text-[#8D8D8D] text-[14px] font-normal">
          {calculateTimeDifference(row.date_added)}
        </div>
      );
    },
  },
];

const adminUserColumns: GridColDef[] = [
  {
    field: "username",
    headerName: "Username",
    width: 250,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>{params.value}</div>;
    },
  },
  {
    field: "email",
    headerName: "Email",
    width: 350,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "#000000", fontWeight: 400 }}>{params.value}</div>
      );
    },
  },

  {
    field: "role",
    headerName: "Role",
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>{params.value}</div>;
    },
  },
  {
    field: "id",
    headerName: "Id",
    width: 150,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {row.id.split("-")[0].toUpperCase()}
        </div>
      );
    },
  },

  {
    field: "user_date_joined",
    headerName: "Date Registered",
    width: 200,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {calculateTimeDifference(row.date_added)}
        </div>
      );
    },
  },
];

const conversionsColumns: GridColDef[] = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    sortable: false,
    renderCell: (params) => {
      return (
        <Link
          className="text-[#000000] font-normal"
          href={`${process.env.NEXT_PUBLIC_CONVERSION_URL}project/${params?.row?.id}`}
        >
          {params?.row?.track_name.split(".")[0].toUpperCase()}
        </Link>
      );
    },
    headerClassName: "custom-header-class",
  },

  {
    field: "voice_name",
    headerName: "Voice",
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ color: "#8D8D8D" }}>
          {(params?.row && params?.row?.voices[0]?.voice_name) || "N/A"}
        </div>
      );
    },
  },
  {
    field: "type",
    headerName: "Type",
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
          }}
        >
          {params?.row?.type || "N/A"}
        </div>
      );
    },
  },

  {
    field: "speed",
    headerName: "Speed",
    width: 230,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
          }}
        >
          40s
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 120,
    sortable: false,
    align: "right",
    headerAlign: "center",
    renderCell: ({
      row,
    }: {
      row: {
        status: "ONGOING" | "SUCCESS" | "FAILED";
      };
    }) => {
      return (
        <div
          className={`items-center justify-center flex rounded-[5px] w-[93px] text-[14px] font-semibold ${
            ConversionsStatusStyles[row?.status]
          }`}
        >
          {row?.status}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 150,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div
          style={{ color: "#8D8D8D", display: "flex", justifyContent: "end" }}
        >
          {calculateTimeDifference(params.row.date_added)}
        </div>
      );
    },
  },
];

const VoicesColumns: GridColDef[] = [
  {
    field: "avatar",
    headerName: "Picture",
    width: 100,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <Image
          src={row?.profile_picture}
          height={50}
          width={50}
          alt="voice-avatar"
          className="rounded-[12px]"
        />
      );
    },
  },
  {
    field: "name",
    headerName: "Name",
    width: 150,
    sortable: false,

    renderCell: ({ row }) => {
      return (
        <>
          <Link
            className="text-black text-[14px] font-normal"
            href={`${process.env.NEXT_PUBLIC_CONVERSION_URL}voice/${row?.slug}`}
          >
            {row?.voice_name}
          </Link>
        </>
      );
    },
  },
  {
    field: "category",
    headerName: "Category",
    width: 150,
    sortable: false,
    renderCell: ({ row }) => {
      const capitalizedType =
        row?.type?.charAt(0).toUpperCase() + row?.type?.slice(1).toLowerCase();
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="text-black text-[14px] font-normal">
              {capitalizedType}
            </p>
          </div>
        </>
      );
    },
  },
  {
    field: "plan",
    headerName: "Plan",
    width: 150,
    sortable: false,

    renderCell: ({ row }) => {
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="text-black text-[14px] font-normal">Pro</p>
          </div>
        </>
      );
    },
  },
  {
    field: "uses",
    headerName: "Uses",
    width: 150,
    sortable: false,

    renderCell: ({ row }) => {
      return (
        <>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <p className="text-black text-[14px] font-normal">
              {row?.use_count}
            </p>
          </div>
        </>
      );
    },
  },

  {
    field: "like_count",
    headerName: "Likes",
    width: 80,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: (params) => {
      return (
        <div className="text-[#8D8D8D] text-[14px] font-normal">
          {params.value}
        </div>
      );
    },
  },
  {
    field: "listeners/mo",
    headerName: "Listeners/mo",
    width: 120,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div className="text-[#8D8D8D] text-[14px] font-normal">193.432</div>
      );
    },
  },
  {
    field: "voice_status",
    headerName: "Status",
    width: 100,
    sortable: false,
    headerAlign: "center",
    align: "center",
    renderCell: ({
      row,
    }: {
      row: {
        status:
          | "ACTIVE"
          | "TRAINING"
          | "HIDDEN"
          | "BROKEN"
          | "PENDING"
          | "DATASET"
          | "UPLOADED";
      };
    }) => {
      return (
        <div
          className={`w-[81px] flex justify-center items-center rounded-[7px] h-[22px] ${
            VoiceStatusStyles[row?.status]
          } `}
        >
          {row?.status && VoiceStatusEnum[row?.status]}
        </div>
      );
    },
  },
  {
    field: "last_modified",
    headerName: "Date",
    width: 100,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div className="text-[#8D8D8D] text-[14px] font-normal">
          {calculateTimeDifference(row.date_edited)}
        </div>
      );
    },
  },
];

const OrdersColumns: GridColDef[] = [
  {
    field: "order_number",
    headerName: "Order number",
    width: 150,
    sortable: false,
    renderCell: ({ row }) => {
      return (
        <div style={{ color: "#000000", fontWeight: 400 }}>
          {row.id.split("-")[0].toUpperCase()}
        </div>
      );
    },
    headerClassName: "custom-header-class",
  },
  {
    field: "email",
    headerName: "Email",
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return <div style={{ color: "#8D8D8D" }}>{params.value ?? "N/A"}</div>;
    },
  },

  {
    field: "country",
    headerName: "Country",
    width: 200,
    sortable: false,
    renderCell: (params) => {
      return (
        <div style={{ display: "flex", gap: 5 }}>
          <Image src={USA} height={30} width={30} alt="voice-avatar" />
          USA
        </div>
      );
    },
  },

  {
    field: "payment_source",
    headerName: "Method",
    width: 100,
    sortable: false,
    renderCell: (params) => {
      return <div className="capitalize text-[#8D8D8D]">{params.value}</div>;
    },
  },
  {
    field: "type",
    headerName: "Type",
    width: 150,
    sortable: false,
    renderCell: (params) => {
      const checkoutValue = params.value;
      let textColor = "#000";
      let backgroundColor = "transparent";

      if (checkoutValue === "renewal") {
        textColor = "green";
        backgroundColor = "#E8F6EF";
      } else if (checkoutValue === "checkout") {
        textColor = "#08F";
        backgroundColor = "#E1F1FF";
      }

      return (
        <div
          className={`bg-[#E8F6EF] text-[#1FBE6C]`}
          style={{
            fontWeight: 600,
            width: "93px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "7px",
          }}
        >
          Renewal
        </div>
      );
    },
  },
  {
    field: "status",
    headerName: "Status",
    width: 100,
    sortable: false,
    renderCell: (params) => {
      const statusValue = params.value.toLowerCase();
      let textColor = "#000";
      let backgroundColor = "transparent";

      if (statusValue === "active") {
        textColor = "green";
        backgroundColor = "#E8F6EF";
      } else if (statusValue === "cancelled") {
        textColor = "red";
        backgroundColor = "#FFEAEA";
      }

      const capitalizedStatus =
        statusValue.charAt(0).toUpperCase() + statusValue.slice(1);

      return (
        <div
          style={{
            color: textColor,
            backgroundColor,
            width: "93px",
            borderRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 600,
          }}
        >
          {capitalizedStatus}
        </div>
      );
    },
  },
  {
    field: "date",
    headerName: "Date",
    width: 120,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div
          style={{ color: "#8D8D8D", display: "flex", justifyContent: "end" }}
        >
          {calculateTimeDifference(row.date_added)}
        </div>
      );
    },
  },
  {
    field: "price",
    headerName: "Amount",
    width: 120,
    sortable: false,
    headerAlign: "right",
    align: "right",
    renderCell: ({ row }) => {
      return (
        <div
          style={{
            color: "#8D8D8D",
            display: "flex",
            justifyContent: "end",
            alignItems: "end",
          }}
        >
          ${row.price}
        </div>
      );
    },
  },
];

export {
  affiliatesColumns,
  earningRequestsColumns,
  recentReferralColumns,
  requestsAffiliatesColumns,
  trainingColumns,
  musicColumns,
  commentColumns,
  UsersColumns,
  lyricsColumns,
  adminUserColumns,
  conversionsColumns,
  VoicesColumns,
  OrdersColumns,
};
