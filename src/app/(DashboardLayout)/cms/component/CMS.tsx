"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import * as v from "valibot";

import { PaketData } from "../../jamaah/data";
import FormCMS, { formSchema } from "./FormCMS";
import CMSTable from "../../utilities/component/table/CMSTable";
import { useState } from "react";
import { toast } from "react-toastify";

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
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCMS mode={"create"}  />
        </Box>
      <Card sx={{ mt: 3}}>
        <CMSTable data={PaketData} />
      </Card>
    </PageContainer>
  </>
  );
};
export default CMS;
