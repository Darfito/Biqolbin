"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import { scoreCardKeuangan } from "../../utilities/data";
import FormKeuangan from "./FormKeuangan";

import { columnsKeuangan } from "./columns/columnsKeuangan";
import KeuanganTable from "../../utilities/component/table/KeuanganTable";
import { JamaahInterface, PaketInterface } from "../../utilities/type";

export type KeuanganProps = {
  paketData: PaketInterface[]
  jamaahData: JamaahInterface[]
}

const Keuangan = ({paketData, jamaahData}: KeuanganProps) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" component="h1" mb={3}>
          Keuangan
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
        {scoreCardKeuangan.map((data, index) => (
          <Grid item sm={12} md={5} lg={3} key={index}>
            {/* Kirim data ke komponen ScoreCard */}
            <ScoreCard
              title={data.title}
              total={data.total}
              color={data.color}
              icon={data.icon}
            />
          </Grid>
        ))}
      </Grid>

      <PageContainer title="Keuangan">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormKeuangan paketData={paketData} jamaahData={jamaahData} />
        </Box>
        <Card sx={{ mt: 2 }}>
          <KeuanganTable columns={columnsKeuangan} data={[]} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Keuangan;
