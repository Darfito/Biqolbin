"use client";

import { Box, Grid, Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import ScoreCard from "../../utilities/component/card/ScoreCard";
import { scoreCardKeuangan } from "../data";
import KitchenSink from "../../utilities/component/table/KitchenSink";

const Keuangan = () => {
  return (
    <>
      <PageContainer title="Keuangan">
        <DashboardCard>
        <Grid sx={{ 
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
         }} container spacing={3}>
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
        </DashboardCard>
        <KitchenSink />
        <Box className="font-bold text-3xl">
          testing
        </Box>
      </PageContainer>
    </>
  );
};
export default Keuangan;
