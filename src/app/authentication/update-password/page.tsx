"use client";
import Link from "next/link";
import { Grid, Box, Card, Stack, Typography } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import UpdatePassword from "../auth/UpdatePassword";
import { ToastContainer } from "react-toastify";

const UpdatePasswordPage = () => {
  return (
    <PageContainer title="Update-Password" description="this is Login page">
					<ToastContainer />
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            backgroundColor: "#F3F3F3",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <UpdatePassword title="Perbarui Password Anda!" />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default UpdatePasswordPage;
