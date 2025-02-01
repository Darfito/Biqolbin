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
import {
  getKeuanganAction,
  getKeuanganActionCabang,
} from "../../keuangan/action";
import dynamic from "next/dynamic";
import UmurCategoryChart from "../../components/dashboard/UmurChart";
import PaketPieChart from "../../components/dashboard/PaketChart";
import GapKeberangkatan from "../../components/dashboard/GapKeberangkatan";
import { getJamaahAction, getJamaahCabangAction } from "../../jamaah/action";

const Map = dynamic(() => import("./Maps"), { ssr: false });

interface DashboardProps {
  roleUser: string;
  cabang: number;
  cabangData: CabangInterface[];
}

const Dashboard = ({ roleUser, cabang, cabangData }: DashboardProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua Cabang");
  const [selectedYear, setSelectedYear] = useState<string | null>(
    new Date().getFullYear().toString()
  );
  const [cabangText, setCabangText] = useState<string>(
    "Menampilkan Data Semua Cabang"
  );
  const [mounted, setMounted] = useState(false);

  // Fetch semua cabang
  const { data: cabangAll } = useSWR("Cabang", getCabangAction);

  // Fetch data keuangan berdasarkan filter
  const { data: dataKeuanganAll } = useSWR(["Keuangan", selectedFilter], () => {
    if (selectedFilter === "Semua Cabang") {
      return roleUser === "Superadmin"
        ? getKeuanganAction() // Semua cabang
        : getKeuanganActionCabang(cabang); // Cabang tertentu
    } else {
      const selectedCabang = cabangAll?.find(
        (item: CabangInterface) => item.nama === selectedFilter
      );
      return getKeuanganActionCabang(selectedCabang?.id || 0); // ID cabang
    }
  });

  const {data: dataJamaahAll} = useSWR(["Jamaah", selectedFilter], () => {
    if (selectedFilter === "Semua Cabang") {
      return roleUser === "Superadmin"
      ? getJamaahAction()
      : getJamaahCabangAction(cabang);
    } else {
      const selectedCabang = cabangAll?.find(
        (item: CabangInterface) => item.nama === selectedFilter
      );
      return getJamaahCabangAction(selectedCabang?.id || 0)
    }
  })

  // Filter data keuangan berdasarkan selectedYear di frontend
  const filteredKeuanganData = dataKeuanganAll?.filter((keuangan) => {
    if (!keuangan.created_at) return false;

    const year = new Date(keuangan.created_at).getFullYear().toString();
    return year === selectedYear;
  });

  const filteredJamaahData = dataJamaahAll?.filter((jamaah) => {
    if (!jamaah.created_at) return false;

    const year = new Date(jamaah.created_at).getFullYear().toString();
    return year === selectedYear;
  })



  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Jangan render apa-apa sampai komponen dimuat di klien
  }

  const handleFilterChange = (filterName: string) => {
    setSelectedFilter(filterName);
    setCabangText(
      filterName === "Semua Cabang"
        ? "Menampilkan Data Semua Cabang"
        : `Menampilkan Data Cabang ${filterName}`
    );
  };



  console.log("keuanganData di dashboard:", filteredKeuanganData);
  console.log("cabangAll di dashboard:", cabangAll);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <DashboardHeader
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange}
        filters={cabangAll || []}
        cabangText={cabangText}
        roleUser={roleUser} 
        selectedYear={selectedYear ||""} 
        handleFilterYearChange={(year: string) => setSelectedYear(year) }      />
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={8}>
            <SalesOverview keuanganData={filteredKeuanganData || []} />
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <YearlyBreakup keuanganData={filteredKeuanganData || []} />
              </Grid>
              <Grid item xs={12}>
                <MonthlyEarnings keuanganData={filteredKeuanganData || []} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid sx={{ marginTop: "20px" }} container spacing={3}>
          <Grid item xs={8} lg={8}>
            <UmurCategoryChart filteredJamaahData={filteredJamaahData || []} />
          </Grid>
          <Grid item xs={4} lg={4}>
            <PaketPieChart filteredKeuanganData={filteredKeuanganData || []} />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Box sx={{ width: "100%", marginTop: "20px" }}></Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Box sx={{ width: "100%", marginTop: "20px" }}>
              <GapKeberangkatan keuanganData={filteredKeuanganData || []} />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <Box sx={{ width: "100%", marginTop: "20px" }}>
              <Map cabangData={cabangData} />
            </Box>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default Dashboard;
