"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import { scoreCardKeuangan } from "../../utilities/data";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import { columnsJamaah } from "./columns/columnsJamaah";
import JamaahTable from "../../utilities/component/table/JamaahTable";
import jamaahData from "../data";
import FormJamaah from "./FormJamaah";
import { PaketInterface } from "../../utilities/type";


export type JamaahProps = {
  paketData: PaketInterface[]
}

const Jamaah = ({paketData}: JamaahProps) => {
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
      <PageContainer title="Jamaah">
      <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormJamaah paketData={ paketData||[]} />
      </Box>
        <Card sx={{ mt: 2 }}>
          <JamaahTable columns={columnsJamaah} data={jamaahData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Jamaah;
