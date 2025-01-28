"use client";

import { Grid, Card, Box, Typography } from "@mui/material";


interface CustomHeaderProps {
  titleModule:string;
  filters: any[];
  selectedFilter: string;
  handleFilterChange: (filterName: string) => void;
  cabangText: string;
}

const CustomHeader = ({
  titleModule,
  filters,
  selectedFilter,
  handleFilterChange,
  cabangText,
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
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "secondary.main",
                    fontSize: { xs: "12px", md: "16px" },
                  }}
                >
                  {cabangText}
                </Typography>
                {/* <GlobalFilterDropdown
                  onSelectedFilter={handleFilterChange} // Fungsi callback
                  selectedFilterName={selectedFilter} // Filter saat ini
                  data={filters}
                /> */}
              </Box>
          </Box>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CustomHeader;
