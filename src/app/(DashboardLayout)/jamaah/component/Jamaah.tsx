"use client";

import { Box, Card, Grid, Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { KeuanganData, scoreCardKeuangan } from "../../keuangan/data";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import { columnsKeuangan } from "../../keuangan/component/columns/columnsKeuangan";
import FormKeuangan from "../../keuangan/component/FormKeuangan";
import KeuanganTable from "../../utilities/component/table/KeuanganTable";

const Jamaah = () => {
  const breadcrumbLinks = [{ label: "Jamaah", href: "/jamaah" }];
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
        <Card sx={{ mt: 3 }}>
          <Box sx={{ margin: "20px" }}>
            <FormKeuangan />
          </Box>
          <KeuanganTable columns={columnsKeuangan} data={KeuanganData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Jamaah;
