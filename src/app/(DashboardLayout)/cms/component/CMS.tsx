"use client";

import { Box, Card, Typography } from "@mui/material";
import DashboardCard from "../../components/shared/DashboardCard";
import PageContainer from "../../components/container/PageContainer";
import KeuanganTable from "../../utilities/component/table/KeuanganTable";
import { columnsKeuangan } from "../../keuangan/component/columns/columnsKeuangan";
import { KeuanganData } from "../../keuangan/data";
import FormKeuangan from "../../keuangan/component/FormKeuangan";

const CMS = () => {
  return (
    <>
    <Box
      sx={{
        width: "100%",
      }}
    >
      <Typography variant="h2" component="h1" mb={3}>
        CMS
      </Typography>
    </Box>
    <PageContainer title="CMS">
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
export default CMS;
