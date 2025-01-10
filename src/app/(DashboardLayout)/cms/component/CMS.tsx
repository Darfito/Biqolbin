"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import FormCMS from "./FormCMS";
import CMSTable from "../../utilities/component/table/CMS/CMSTable";
import { PaketInterface } from "../../utilities/type";

export type CMSPageProps = {
  data: PaketInterface[]
};

const CMS = ({data}: CMSPageProps) => {

  console.log("Paket data:", data);


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
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCMS mode={"create"}  />
        </Box>
      <Card sx={{ mt: 3}}>
        <CMSTable data={data} />
      </Card>
    </PageContainer>
  </>
  );
};
export default CMS;
