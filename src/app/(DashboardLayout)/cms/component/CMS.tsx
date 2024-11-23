'use client'

import { Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";

const CMS = () => {
  return (
    <>
    <PageContainer title="CMS">
      <DashboardCard title="CMS">
        <Typography>This is CMS Page</Typography>
      </DashboardCard>
      </PageContainer>
    </>
  );
};
export default CMS;
