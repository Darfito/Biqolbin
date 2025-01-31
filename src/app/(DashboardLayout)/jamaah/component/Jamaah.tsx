"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import ScoreCard from "../../utilities/component/card/ScoreCard";
import JamaahTable from "../../utilities/component/table/JamaahTable";
import FormJamaah from "./FormJamaah";
import {
  CardStatsProps,
  JamaahInterface,
  PaketInterface,
} from "../../utilities/type";
import {
  IconLuggage,
  IconPlaneArrival,
  IconPlaneInflight,
  IconUser,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import CustomHeader from "../../layout/header/CustomHeader";

export type JamaahProps = {
  paketData: PaketInterface[];
  jamaahData: JamaahInterface[];
  cabang_id: number;
};


const Jamaah = ({ paketData, jamaahData, cabang_id }: JamaahProps) => {
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

  console.log("jamaah data ", jamaahData);

  const filteredJamaahData = jamaahData.filter((jamaah) => {
    if (!jamaah.created_at) return false;

    const year = new Date(jamaah.created_at).getFullYear().toString();
    return year === selectedYear;
  });

  console.log("jamaah terfilter di page jamaah", filteredJamaahData);

  // const totalJamaah = jamaahData.length;
  // const belumBerangkat = jamaahData.filter(
  //   (jamaah) => jamaah.status === "Berangkat"
  // ).length;
  // const berangkat = jamaahData.filter(
  //   (jamaah) => jamaah.status === "Berangkat"
  // ).length;
  // const selesai = jamaahData.filter(
  //   (jamaah) => jamaah.status === "Selesai"
  // ).length;

  // const dynamicScoreCardJamaah = [
  //   {
  //     title: "Total Jamaah",
  //     total: totalJamaah,
  //     color: "#3E74FF",
  //     icon: IconUser,
  //   },
  //   {
  //     title: "Belum Berangkat",
  //     total: belumBerangkat,
  //     color: "#F54F63",
  //     icon: IconLuggage,
  //   },
  //   {
  //     title: "Berangkat",
  //     total: berangkat,
  //     color: "#ADD8E6",
  //     icon: IconPlaneInflight,
  //   },
  //   {
  //     title: "Selesai",
  //     total: selesai,
  //     color: "#4CAF50",
  //     icon: IconPlaneArrival,
  //   },
  // ];

  console.log("Paket data:", paketData);
  console.log("Jamaah data:", jamaahData);

  return (
    <>
      <CustomHeader
        titleModule={"Jamaah"}
        selectedFilter={selectedYear || ""}
        handleFilterChange={(year: string) => setSelectedYear(year)}
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
        {/* {dynamicScoreCardJamaah.map((data, index) => {
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
        })} */}
      </Grid>
      <PageContainer title="Jamaah">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormJamaah paketData={paketData || []} cabang_id={cabang_id} />
        </Box>
        <Card sx={{ mt: 2 }}>
          <JamaahTable data={filteredJamaahData} />
        </Card>
      </PageContainer>
    </>
  );
};

export default Jamaah;
