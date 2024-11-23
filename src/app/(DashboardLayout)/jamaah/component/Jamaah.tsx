'use client'

import { Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";

const Jamaah = () => {
  return (
    <>
    <PageContainer title="Jamaah">
      <DashboardCard title="Jamaah">
        <Typography>This is Jamaah Page</Typography>
      </DashboardCard>
      </PageContainer>
    </>
  );
};
export default Jamaah;
