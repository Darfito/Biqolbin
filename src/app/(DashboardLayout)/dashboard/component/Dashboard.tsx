"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { KeuanganInterface } from "../../utilities/type";

interface DashboardProps {
  keuanganData: KeuanganInterface[];
}

const Dashboard = ({keuanganData}: DashboardProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua Cabang");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Jangan render apa-apa sampai komponen dimuat di klien
  }
  const handleFilterChange = (filterName: string) => {
    console.log("Filter yang dipilih:", filterName); // Debug log
    setSelectedFilter(filterName);
  };

  console.log("keuanganData di dashboard:", keuanganData);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <DashboardHeader
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange}
      />
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview keuanganData={keuanganData} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup keuanganData={keuanganData} />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
