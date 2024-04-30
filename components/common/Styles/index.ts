import zIndex from "@mui/material/styles/zIndex";

export const dataGridCommonStyle = {
  height: "70vh",
  border: "none",
  color: "#8D8D8D",
  marginTop: "10px",
  "&:hover": { cursor: "pointer" },
  "& .MuiDataGrid-cell": {
    borderBottom: "none !important",
  },
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
  "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
    {
      outline: "none !important",
    },
  "&.MuiDataGrid-virtualScroller": {
    height: "200px",
  },
};
export const dataGridAffiliates = {
  height: "50vh",
  width: "35vw",
  border: "none",
  color: "#8D8D8D",
  marginTop: "10px",
  "& .MuiDataGrid-cell": {
    borderBottom: "none !important",
  },
  "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
    outline: "none !important",
  },
  "&.MuiDataGrid-root .MuiDataGrid-columnHeader:focus, .MuiDataGrid-root .MuiDataGrid-cell:focus":
    {
      outline: "none !important",
    },
};

export const confirmatioModalBox = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 450,
  bgcolor: "background.paper",
  boxShadow: 34,
  borderRadius: 1,
};

export const createAdminModal = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxHeight: 600,
  width: 750,
  bgcolor: "background.paper",
  boxShadow: 34,
  borderRadius: 1,
};

export const searchField = {
  "& .MuiOutlinedInput-root": {
    bgcolor: "transparent",
    color: "#868C98",
    border: "1px solid #E2E4E9",
    borderRadius: "10px",
    paddingY: "0",
    "&:hover": {
      bgcolor: "#F6F8FA",
      border: "1px solid #E2E4E9",
    },
    textTransform: "none",
    "& fieldset": {
      border: " #E2E4E9",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#E2E4E9",
    },
    "@media (min-width: 1024px)": {
      width: "200px",
    },
    "@media (min-width: 1280px)": {
      width: "353px",
    },
  },
};
export const affiliatesSearchField = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "14px",
    paddingLeft: "10px",
    width: "525px",
    borderColor: "#cccccc",
  },
};
export const statusField = {
  "& .MuiInputLabel-root": {
    color: "#868C98",
    "&.Mui-focused": {
      color: "#868C98",
    },
  },
  "& .MuiOutlinedInput-root": {
    minWidth: "120px",
    borderRadius: "10px",
    ".MuiOutlinedInput-notchedOutline": {
      borderColor: "#E2E4E9",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E2E4E9",
      bgcolor: "#F6F8FA",
      zIndex: "000",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#E2E4E9",
    },
  },
  "& .MuiSelect-icon": {
    zIndex: "999",
  },
};

export const sortByNewestStyles = {
  // width: "150px",
  fontSize: "16px",
  paddingRight: "5px",
  "@media (min-width: 1024px) and (max-width: 1280px)": {
    fontSize: "14px",
    paddingRight: "15px",
  },
  display: "flex",
  alignItems: "center",
  fontWeight: 500,
};

export const selectDates = {
  text: "16px",
  textTransform: "none",
  padding: 1,
  paddingX: 2,
  bgcolor: "transparent",
  color: "#868C98",
  border: "1px solid #E2E4E9",
  borderRadius: "10px",
  "&:hover": {
    bgcolor: "#F6F8FA",
    border: "1px solid #E2E4E9",
  },

  "@media (min-width: 1024px)": {
    padding: 1,
    paddingX: 1,
    text: "14px",
  },
  "@media (min-width: 1280px)": {
    padding: 1,
    paddingX: 2,
    text: "16px",
  },
};

export const cancelDates = {
  border: "none",
  color: "black",
  marginRight: "5px",
};

export const applyDates = {
  borderColor: "#cccccc",
  color: "white",
  background: "green",
};

export const resetBtn = {
  padding: 1,
  borderRadius: 3,
};

export const sortSelect = {
  "& .MuiOutlinedInput-notchedOutline": {
    border: "none",
    width: "auto",
  },
  "& .MuiSelect-icon": {},
  "& .MuiSelect-select:focus": {
    transition: "none",
    transform: "none",
  },
  fontSize: "inherit",
};
export const statusSelect = {
  "& .MuiOutlinedInput-notchedOutline": {},
  "& .MuiSelect-icon": {},
  "& .MuiSelect-select:focus": {
    transition: "none",
    transform: "none",
  },
};

export const createBtn = {
  bgcolor: "transparent",
  color: "#868C98",
  boxShadow: "none",
  border: "1px solid #E2E4E9",
  borderRadius: "10px",
  "&:hover": {
    bgcolor: "#F6F8FA",
    border: "1px solid #E2E4E9",
  },
  textTransform: "none",
};
export const submitBtnDrawer = {
  height: 40,
  borderRadius: 2,
  backgroundColor: "black",
  fontWeight: 500,
  textTransform: "capitalize",
  fontSize: "16px",
  "&:hover": {
    backgroundColor: "black",
  },
};

export const inputStyle = {
  border: "1px solid #b8b9ba",
  padding: "10px",
  width: "280px",
  margin: 10,
  background: "#f2f2f2",
  borderRadius: 10,
};

export const inputFieldStyle = {
  border: "1px solid #b8b9ba",
  padding: "10px",
  width: "280px",
  margin: 10,
  background: "#f2f2f2",
  borderRadius: 10,
};

export const addButton = {
  border: "1px solid #0088FF",
  padding: "8px",
  width: "80px",
  margin: 10,
  background: "#fff",
  color: "#0088FF",
  borderRadius: 15,
  marginLeft: 40,
};

export const errorMessage: any = {
  color: "red",
  font: "12px",
  paddingLeft: 10,
};

export const crossBtn = {
  border: "1px solid red",
  padding: "8px",
  width: "30px",
  background: "#fff",
  color: "red",
  borderRadius: 10,
  marginTop: 35,
};

export const field = {
  display: "flex",
  flexDirection: "column",
};
export const activeTabs = {
  "&.Mui-selected": {
    color: "black",
  },
  padding: 0,
};
