"use CLient";
import React, { Fragment, useEffect, useRef, useState } from "react";
import {
  createBtn,
  resetBtn,
  searchField,
  selectDates,
  sortByNewestStyles,
  sortSelect,
  statusField,
} from "../Styles";
import {
  Box,
  Button,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  InputAdornment,
  Select,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { CalendarIcon } from "@/app/utils";
import { DateRangePicker } from "react-date-range";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterAltOffIcon from "@mui/icons-material/FilterAltOff";
import AddIcon from "@mui/icons-material/Add";
import { FiltersProps } from "@/app/utils/interface";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import "./customDateRangeStyles.css";
import {
  DateRangePickerStyles,
  FilterBtnStyles,
  FiltersBoxStyles,
  LabelStyle,
} from "./style";

const Filters = ({
  label,
  resetFilterHandler,
  searchKeyword,
  setSearchKeyword,
  openCalendar,
  setOpenCalendar,
  dateRangeState,
  setDateRangeState,
  setEndDate,
  setStartDate,
  sortbyCategory,
  handleStatusChange,
  select,
  endDate,
  startDate,
  handleChange,
  selectFilters,
  statusLabel,
  toggleDrawer,
  privileges,
  sortByFilters,
}: FiltersProps) => {
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setOpenCalendar(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <>
      <Typography variant="h1" sx={LabelStyle}>
        {label}
      </Typography>
      <Stack sx={FiltersBoxStyles}>
        <Box sx={FilterBtnStyles}>
          <TextField
            placeholder="Search..."
            size="small"
            value={searchKeyword}
            onChange={(e) => {
              setSearchKeyword(e.target.value);
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={searchField}
          />
          <Box sx={{ position: "relative" }}>
            <Button
              sx={selectDates}
              variant="outlined"
              startIcon={CalendarIcon}
              onClick={() => setOpenCalendar(!openCalendar)}
            >
              Select Dates
            </Button>
            {openCalendar && (
              <Paper ref={pickerRef} sx={DateRangePickerStyles}>
                <DateRangePicker
                  ranges={[dateRangeState.selection]}
                  onChange={(item) => {
                    setStartDate(item.selection.startDate);
                    setEndDate(item.selection.endDate);
                    setDateRangeState({ ...dateRangeState, ...item });
                  }}
                />
              </Paper>
            )}
          </Box>
          {selectFilters && (
            <Box sx={statusField}>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  {statusLabel}
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sortbyCategory}
                  label={statusLabel}
                  onChange={handleStatusChange}
                  IconComponent={ExpandMoreIcon}
                  className="select-root"
                >
                  {selectFilters.map((option: any, index: any) => {
                    return (
                      <MenuItem key={`filter-${index}`} value={option.value}>
                        {option.label}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
        <Box sx={FilterBtnStyles}>
          <Button
            sx={resetBtn}
            variant="outlined"
            onClick={resetFilterHandler}
            style={{
              visibility:
                searchKeyword || startDate || endDate ? "visible" : "hidden",
            }}
          >
            <FilterAltOffIcon />
          </Button>
          <InputLabel
            id="demo-simple-select-label"
            shrink={false}
            sx={{
              fontSize: "inherit",
            }}
          >
            Sort by
          </InputLabel>
          <Box sx={sortByNewestStyles}>
            <FormControl fullWidth>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={select}
                label="select"
                variant="outlined"
                IconComponent={ExpandMoreIcon}
                sx={sortSelect}
                onChange={handleChange}
              >
                {sortByFilters?.map((item: any, index: number) => (
                  <MenuItem key={index} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Fragment>
            {privileges?.canWrite() && (
              <Button
                variant="outlined"
                sx={createBtn}
                onClick={() => toggleDrawer && toggleDrawer("right", true)}
                disabled={!privileges?.canWrite()}
                startIcon={<AddIcon />}
              >
                Create
              </Button>
            )}
          </Fragment>
        </Box>
      </Stack>
    </>
  );
};

export default Filters;
