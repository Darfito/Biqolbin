"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";
import * as v from "valibot";

import { PaketData } from "../../jamaah/data";

import CMSTable from "../../utilities/component/table/CMSTable";
import { useState } from "react";
import { toast } from "react-toastify";
import UserTable from "../../utilities/component/table/UserTable";
import { userData } from "../../utilities/data";
import FormUser from "./FormUser";
import { columnsUser } from "./columnsUser";

const User = () => {
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" component="h1" mb={3}>
          User
        </Typography>
      </Box>
      <PageContainer title="CMS">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormUser/>
        </Box>
        <Card sx={{ mt: 3 }}>
          <UserTable data={userData} columns={columnsUser} />
        </Card>
      </PageContainer>
    </>
  );
};
export default User;
