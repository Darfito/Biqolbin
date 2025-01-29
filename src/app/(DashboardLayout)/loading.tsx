import React from "react";
import { Box, CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    // <Typography>
    //   Halaman sedang dimuat
    // </Typography>
    <Box
      display="flex"
      sx={{ height: "100vh", width: "100%" }}
      justifyContent="center"
      alignItems="center"
    >
      <CircularProgress size={60} />
    </Box>
  );
};

export default Loading;
