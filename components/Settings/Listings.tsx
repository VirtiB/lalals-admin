import { handleSnackbarClick } from "@/app/utils";
import { get } from "@/app/utils/api-helper";
import { SnackbarState } from "@/app/utils/interface";
import { TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const Listings = () => {
  const [trackData, setTrackData] = useState<any[]>([]);

  const [voicesData, setVoicesData] = useState<any>([]);
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    vertical: "top",
    horizontal: "right",
    type: "success",
    message: "success",
  });

  const fetchTracks = async () => {
    try {
      const { data } = await get("music");
      setTrackData(data?.music);
    } catch (e) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error while fetching tracks`
      );
    }
  };

  const fetchVoices = async () => {
    try {
      const { data } = await get("voices");
      setVoicesData(data?.voices);
    } catch (e) {
      handleSnackbarClick(
        snackbarState,
        setSnackbarState,
        "error",
        `Error while fetching voices`
      );
    }
  };

  useEffect(() => {
    fetchTracks();
    fetchVoices();
  }, []);

  const secondColumnStart = Math.ceil(trackData.length / 2);
  const secondColumnVoicesStart = Math.ceil(voicesData.length / 2);
  return (
    <div className="grid grid-cols-2 gap-16">
      <div className="grid grid-cols-2 gap-[22px]">
        {/* First 6 columns  */}
        <div className="">
          <Typography className="text-black font-normal text-[18px] w-full">
            Top {trackData.length} Tracks
          </Typography>
          {trackData
            .slice(secondColumnStart)
            .map((track: any, index: number) => (
              <div className="my-5" key={index}>
                <TextField
                  id={`track-id-${index}`}
                  name={`track_header_text_${index}`}
                  label={`Track ID ${index + 1}`}
                  variant="outlined"
                  type="text"
                  value={track?.id}
                />
              </div>
            ))}
        </div>

        {/* Second column */}
        <div className="mt-6">
          {trackData
            .slice(0, secondColumnStart)
            .map((track: any, index: number) => (
              <div className="my-5" key={index + secondColumnStart}>
                <TextField
                  id={`track-id-${index + secondColumnStart}`}
                  name={`track_header_text_${index + secondColumnStart}`}
                  label={`Track ID ${index + secondColumnStart + 1}`}
                  variant="outlined"
                  type="text"
                  value={track?.id}
                />
              </div>
            ))}
        </div>
      </div>
      {/* second  */}
      <div className="grid grid-cols-2 gap-[22px]">
        {/* first col */}
        <div className="">
          <Typography className="text-black font-normal text-[18px] w-full">
            Top {voicesData.length} Tracks
          </Typography>
          {voicesData
            .slice(0, secondColumnVoicesStart)
            .map((voice: any, index: number) => (
              <div className="my-5" key={index}>
                <TextField
                  id={`track-id-${index}`}
                  name={`track_header_text_${index}`}
                  label={`Track ID ${index + 1}`}
                  variant="outlined"
                  type="text"
                  value={voice?.id}
                />
              </div>
            ))}
        </div>
        {/* second col */}
        <div className="mt-6">
          {voicesData
            .slice(secondColumnVoicesStart)
            .map((voice: any, index: number) => (
              <div className="my-5" key={index + secondColumnVoicesStart}>
                <TextField
                  id={`track-id-${index + secondColumnVoicesStart}`}
                  name={`track_header_text_${index + secondColumnVoicesStart}`}
                  label={`Track ID ${index + secondColumnVoicesStart + 1}`}
                  variant="outlined"
                  type="text"
                  value={voice?.id}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Listings;
