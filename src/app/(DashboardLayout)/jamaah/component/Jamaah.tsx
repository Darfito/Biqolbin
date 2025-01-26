"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import ScoreCard from "../../utilities/component/card/ScoreCard";
import JamaahTable from "../../utilities/component/table/JamaahTable";
import FormJamaah from "./FormJamaah";
import { CardStatsProps, JamaahInterface, PaketInterface } from "../../utilities/type";
import { IconLuggage, IconPlaneArrival, IconUser } from "@tabler/icons-react";
import { useState, useEffect } from "react";


export type JamaahProps = {
  paketData: PaketInterface[]
  jamaahData: JamaahInterface[]
  scoreCardData: CardStatsProps[]
}


// Peta ikon
const iconMap: Record<string, React.ElementType> = {
  IconUser: IconUser,
  IconLuggage: IconLuggage,
  IconPlaneArrival: IconPlaneArrival,
};
const Jamaah = ({ paketData, jamaahData, scoreCardData  }: JamaahProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Jangan render apa-apa sampai komponen dimuat di klien
  }
  console.log("Paket data:", paketData);
  console.log("Jamaah data:", jamaahData);


  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" mb={3}>
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
      {scoreCardData.map((data, index) => {
  const IconComponent = iconMap[data.icon] || null; // Pastikan null jika tidak valid
  return (
    <Grid item sm={12} md={5} lg={3} key={index}>
      <ScoreCard
        title={data.title}
        total={data.total}
        color={data.color}
        icon={IconComponent} // Kirim null jika tidak valid
      />
    </Grid>
  );
})}
      </Grid>
      <PageContainer title="Jamaah">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormJamaah paketData={paketData || []} />
        </Box>
        <Card sx={{ mt: 2 }}>
          <JamaahTable data={jamaahData} />
        </Card>
      </PageContainer>
    </>
  );
};

export default Jamaah;
