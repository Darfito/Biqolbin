"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import UserTable from "../../utilities/component/table/UserTable";
import FormUser from "./FormUser";
import { UserInterface } from "../../utilities/type";


export type UserPageProps = {
  data: UserInterface[];
};

const User = ({ data }: UserPageProps) => {


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
      <PageContainer title="User">
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormUser />
        </Box>
        <Card sx={{ mt: 3 }}>
          <UserTable data={data} />
        </Card>
      </PageContainer>
    </>
  );
};
export default User;
