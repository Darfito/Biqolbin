"use client";

import { useState, useEffect } from "react";
import { Grid, Card, Box, Typography, Skeleton } from "@mui/material";
import YearDropdown from "./YearDropdown";

interface CustomHeaderProps {
  titleModule: string;
  selectedFilter: string;
  handleFilterChange: (filterName: string) => void;
}

const CustomHeader = ({
  titleModule,
  selectedFilter,
  handleFilterChange,
}: CustomHeaderProps) => {

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <Card sx={{ p: 3, width: "100%", mb: 6 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{ fontWeight: "600", fontSize: { xs: "24px", md: "32px" } }}
            >
              {titleModule}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {/* Menampilkan Skeleton saat year belum siap */}
              {selectedFilter ? (
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "secondary.main",
                    fontSize: { xs: "12px", md: "16px" },
                  }}
                >
                  {`Menampilkan data Tahun ${selectedFilter}`}
                </Typography>
              ) : (
                <Skeleton variant="text" width={120} height={25} />
              )}
              {selectedFilter ? (
                <YearDropdown selectedYear={selectedFilter} onYearChange={handleFilterChange} />
                
              ): (
                <Skeleton variant="text" width={120} height={25} />
              )}
            </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomHeader;
