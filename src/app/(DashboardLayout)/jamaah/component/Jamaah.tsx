"use client";

import { Box, Grid, Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import { scoreCardKeuangan } from "../../keuangan/data";
import ScoreCard from "../../utilities/component/card/ScoreCard";

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
        <DashboardCard title="Jamaah">
          <Typography>This is Jamaah Page</Typography>
        </DashboardCard>
      </PageContainer>
    </>
  );
};
export default Jamaah;
