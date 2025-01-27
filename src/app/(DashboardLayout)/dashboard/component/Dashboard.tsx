"use client";
import { Grid, Box } from "@mui/material";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
// components
import SalesOverview from "@/app/(DashboardLayout)/components/dashboard/SalesOverview";
import YearlyBreakup from "@/app/(DashboardLayout)/components/dashboard/YearlyBreakup";
import MonthlyEarnings from "@/app/(DashboardLayout)/components/dashboard/MonthlyEarnings";
import { useEffect, useState } from "react";
import DashboardHeader from "./DashboardHeader";
import { CabangInterface, KeuanganInterface } from "../../utilities/type";
import useSWR from "swr";
import { getCabangAction } from "../../user/action";
import { getKeuanganAction, getKeuanganActionCabang } from "../../keuangan/action";
import Map from "./Maps";

interface DashboardProps {
  roleUser: string
  cabang:number
  cabangData: CabangInterface[];
}

const Dashboard = ({roleUser,cabang, cabangData}: DashboardProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua Cabang");
  const [dateRangeText, setDateRangeText] = useState('')
  const [mounted, setMounted] = useState(false);

  const {data: cabangAll} = useSWR('Cabang', getCabangAction)

  const { data: dataKeuangan } = useSWR(
    'Keuangan',
    () => (roleUser === 'Superadmin' ? getKeuanganAction() : getKeuanganActionCabang(cabang))
  );
  

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

  console.log("keuanganData di dashboard:", dataKeuangan);
  console.log("cabangAll di dashboard:", cabangAll);
  
  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <DashboardHeader
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange} filters={cabangAll || []}      />
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview keuanganData={dataKeuangan || []} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup keuanganData={dataKeuangan || []} />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings keuanganData={dataKeuangan || []} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      <Box sx={{ width: "100%", marginTop: "20px" }}>
        <Map cabangData={cabangData} />
      </Box>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
