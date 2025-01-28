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

const Map = dynamic(() => import("./Maps"), { ssr: false });

interface DashboardProps {
  roleUser: string;
  cabang: number;
  cabangData: CabangInterface[];
}

const Dashboard = ({ roleUser, cabang, cabangData }: DashboardProps) => {
  const [selectedFilter, setSelectedFilter] = useState<string>("Semua Cabang");
  const [cabangText, setCabangText] = useState<string>(
    "Menampilkan Data Semua Cabang"
  );
  const [mounted, setMounted] = useState(false);

  // Fetch semua cabang
  const { data: cabangAll } = useSWR("Cabang", getCabangAction);

  // Fetch data keuangan berdasarkan filter
  const { data: dataKeuangan } = useSWR(
    ["Keuangan", selectedFilter], // Key dinamis untuk SWR
    () => {
      if (selectedFilter === "Semua Cabang") {
        return roleUser === "Superadmin"
          ? getKeuanganAction() // Semua cabang
          : getKeuanganActionCabang(cabang); // Cabang tertentu
      } else {
        // Filter berdasarkan cabang tertentu
        const selectedCabang = cabangAll?.find(
          (item: CabangInterface) => item.nama === selectedFilter
        );
        return getKeuanganActionCabang(selectedCabang?.id || 0); // ID cabang
      }
    }
  );

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

  console.log("keuanganData di dashboard:", dataKeuangan);
  console.log("cabangAll di dashboard:", cabangAll);

  return (
    <PageContainer title="Dashboard" description="this is Dashboard">
      <DashboardHeader
        selectedFilter={selectedFilter}
        handleFilterChange={handleFilterChange}
        filters={cabangAll || []}
        cabangText={cabangText}
        roleUser={roleUser}
      />
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
