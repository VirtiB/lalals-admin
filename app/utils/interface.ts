import { SnackbarOrigin } from "@mui/material";
import { string } from "yup";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

interface FiltersProps {
  label: string;
  resetFilterHandler: () => void;
  searchKeyword?: any;
  setSearchKeyword?: any;
  openCalendar?: any;
  setOpenCalendar?: any;
  dateRangeState?: any;
  setDateRangeState?: any;
  setEndDate?: any;
  setStartDate?: any;
  sortbyCategory?: any;
  handleStatusChange?: (arg: any) => void;
  select?: any;
  endDate?: any;
  startDate?: any;
  handleChange?: (arg: any) => void;
  toggleDrawer?: ((anchor: any, open: boolean) => void) | undefined;
  selectFilters?: any;
  statusLabel?: string;
  privileges?: any;
  sortByFilters?: any;
}

interface SnackbarState extends SnackbarOrigin {
  open: boolean;
  type: string;
  message: string;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export type { SidebarProps, TabPanelProps, FiltersProps, SnackbarState };
