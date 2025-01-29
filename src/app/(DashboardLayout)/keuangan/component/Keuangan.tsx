"use client";

import { Box, Card, Grid } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import FormKeuangan from "./FormKeuangan";

import KeuanganTable from "../../utilities/component/table/KeuanganTable";
import {
  CardStatsProps,
  JamaahInterface,
  KeuanganInterface,
  PaketInterface,
  StatusType,
} from "../../utilities/type";
import { IconUser, IconProgress, IconReceipt } from "@tabler/icons-react";
import dynamic from "next/dynamic";
import CustomHeader from "../../layout/header/CustomHeader";
import { useEffect, useState } from "react";
// const CustomHeader = dynamic(() => import("../../layout/header/CustomHeader"), {
//   ssr: false,
// });

export type KeuanganProps = {
  paketData: PaketInterface[];
  jamaahData: JamaahInterface[];
  keuanganData: KeuanganInterface[];
};

const Keuangan = ({ paketData, jamaahData, keuanganData }: KeuanganProps) => {
  const [selectedYear, setSelectedYear] = useState<string | null>(
    new Date().getFullYear().toString()
  );

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Jangan render apa-apa sampai komponen dimuat di klien
  }

  // Filter data keuangan berdasarkan tahun yang dipilih
  const filteredKeuanganData = keuanganData.filter((keuangan) => {
    // Pastikan created_at terdefinisi dan valid
    if (!keuangan.created_at) return false;

    // Parsing dan mendapatkan tahun dari created_at
    const year = new Date(keuangan.created_at).getFullYear().toString();
    return year === selectedYear;
  });

  // Statistik berdasarkan data keuangan yang difilter
  const totalJamaah = filteredKeuanganData.length;
  const belumLunas = filteredKeuanganData.filter(
    (keuangan) => keuangan.status !== StatusType.LUNAS
  ).length;
  const lunas = filteredKeuanganData.filter(
    (keuangan) => keuangan.status === StatusType.LUNAS
  ).length;

  // Konfigurasi score card
  const dynamicScoreCardKeuangan: CardStatsProps[] = [
    {
      title: "Total Jamaah",
      total: totalJamaah,
      color: "#3E74FF",
      icon: IconUser,
    },
    {
      title: "Belum Lunas",
      total: belumLunas,
      color: "#F54F63",
      icon: IconProgress,
    },
    {
      title: "Lunas",
      total: lunas,
      color: "#4CAF50",
      icon: IconReceipt,
    },
  ];

  return (
    <>
      <CustomHeader
        titleModule={"Keuangan"}
        selectedFilter={selectedYear || ""}
        handleFilterChange={(year: string) => setSelectedYear(year)} // Fungsi untuk mengubah tahun
      />
      <Box
        sx={{
          width: "100%",
        }}
      ></Box>
      <Grid
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        container
        spacing={3}
      >
        {dynamicScoreCardKeuangan.map((data, index) => {
          const IconComponent = data.icon; // Ambil komponen icon langsung
          return (
            <Grid item sm={12} md={5} lg={3} key={index}>
              <ScoreCard
                title={data.title}
                total={data.total}
                color={data.color}
                icon={IconComponent} // Gunakan komponen React langsung
              />
            </Grid>
          );
        })}
      </Grid>

      <PageContainer title="Keuangan">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormKeuangan paketData={paketData} jamaahData={jamaahData} />
        </Box>
        <Card sx={{ mt: 2 }}>
          <KeuanganTable data={filteredKeuanganData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Keuangan;
