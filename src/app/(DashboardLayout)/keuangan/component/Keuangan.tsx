"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import { scoreCardKeuangan } from "../data";
import KeuanganTable from "../../utilities/component/table/KeuanganTable";
import Breadcrumb from "../../utilities/component/breadcrumb/Breadcrumb";
import FormKeuangan from "./FormKeuangan";
import { columnsKeuangan } from "../../utilities/component/table/columns";
import { KeuanganData } from "../../utilities/component/table/data";

const Keuangan = () => {
  const breadcrumbLinks = [{ label: "Keuangan", href: "/keuangan" }];
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
        <Card sx={{ mt: 3}}>
          <Box sx={{ margin: "20px" }}>
            <FormKeuangan />
          </Box>
          <KeuanganTable columns={columnsKeuangan} data={KeuanganData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Keuangan;
