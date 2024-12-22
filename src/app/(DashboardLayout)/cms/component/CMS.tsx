"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";


import { PaketData } from "../../jamaah/data";
import FormKeuangan from "./FormCMS";
import FormCMS from "./FormCMS";
import CMSTable from "../../utilities/component/table/CMSTable";

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
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCMS />
        </Box>
        <CMSTable data={PaketData} />
      </Card>
    </PageContainer>
  </>
  );
};
export default CMS;
