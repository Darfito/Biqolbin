"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import ScoreCard from "../../utilities/component/card/ScoreCard";
import { columnsJamaah } from "./columns/columnsJamaah";
import JamaahTable from "../../utilities/component/table/JamaahTable";
import jamaahData from "../data";
import FormJamaah from "./FormJamaah";
import { JamaahInterface, PaketInterface } from "../../utilities/type";
import { useMemo } from "react";
import { scoreCardJamaah } from "../../utilities/data";
import { IconLoader, IconPlaneArrival, IconUser } from "@tabler/icons-react";


export type JamaahProps = {
  paketData: PaketInterface[]
  jamaahData: JamaahInterface[]
}

const Jamaah = ({paketData, jamaahData}: JamaahProps) => {
  const stablePaketData = useMemo(() => paketData || [], [paketData]);
  const stableJamaahData = useMemo(() => jamaahData || [], [jamaahData]);

  console.log("Paket data:", stablePaketData);
  console.log("Jamaah data:", stableJamaahData);


  // Hitung statistik
  const totalJamaah = stableJamaahData.length;
  const belumBerangkat = stableJamaahData.filter(
    (jamaah) => jamaah.status === "Berangkat"
  ).length;
  const selesai = stableJamaahData.filter(
    (jamaah) => jamaah.status === "Selesai"
  ).length;

  const dynamicScoreCardJamaah = [
    {
      title: "Total Jamaah",
      total: totalJamaah,
      color: "#3E74FF",
      icon: IconUser,
    },
    {
      title: "Belum Berangkat",
      total: belumBerangkat,
      color: "#F54F63",
      icon: IconLoader,
    },
    {
      title: "Selesai",
      total: selesai,
      color: "#F5BD4F",
      icon: IconPlaneArrival,
    },
  ];
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" component="h1" mb={3}>
          Jamaah
        </Typography>
      </Box>
      <Grid
        sx={{
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
        container
        spacing={3}
      >
        {dynamicScoreCardJamaah.map((data, index) => (
          <Grid item sm={12} md={5} lg={3} key={index}>
            <ScoreCard
              title={data.title}
              total={data.total}
              color={data.color}
              icon={data.icon}
            />
          </Grid>
        ))}
      </Grid>
      <PageContainer title="Jamaah">
      <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormJamaah paketData={ stablePaketData|| []} />
      </Box>
        <Card sx={{ mt: 2 }}>
          <JamaahTable columns={columnsJamaah} data={stableJamaahData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Jamaah;
