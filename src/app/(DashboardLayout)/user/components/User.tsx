"use client";

import { Box, Card, Typography } from "@mui/material";
import PageContainer from "../../components/container/PageContainer";

import UserTable from "../../utilities/component/table/UserTable";
import FormUser from "./FormUser";
import { CabangInterface, UserInterface } from "../../utilities/type";


export type UserPageProps = {
  userData: UserInterface[];
  cabangData: CabangInterface[];
  cabangUser: number;
};



const User = ({ userData, cabangData, cabangUser }: UserPageProps) => {

  console.log("cabangUser", cabangUser);

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
          <FormUser cabangData={cabangData} />
        </Box>
        <Card sx={{ mt: 3 }}>
          <UserTable data={userData} />
        </Card>
      </PageContainer>
    </>
  );
};
export default User;
