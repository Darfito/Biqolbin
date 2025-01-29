"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import UserTable from "../../utilities/component/table/UserTable";

import { CabangInterface, UserInterface } from "../../utilities/type";
import CabangTable from "../../utilities/component/table/CabangTable";
import FormCabang from "./FormCabang";

export type UserPageProps = {
  cabangData: CabangInterface[];
};

const Cabang = ({ cabangData }: UserPageProps) => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" component="h1" mb={3}>
          Cabang
        </Typography>
      </Box>
      <PageContainer title="Cabang">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCabang  />
        </Box>
        <Card sx={{ mt: 3 }}>
          <CabangTable data={cabangData ?? []} />
        </Card>
      </PageContainer>
    </>
  );
};
export default Cabang;
