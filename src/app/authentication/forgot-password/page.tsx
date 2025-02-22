"use client";
import { Grid, Box, Card } from "@mui/material";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import ForgotPassword from "../auth/ForgotPassword";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const ForgotPasswordPage = () => {
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleSuccess = (success: boolean) => {
    setIsSuccess(success);
    if (success) {
      toast.success("Email berhasil dikirim! Silakan periksa inbox Anda.");
    } else {
      toast.error("Gagal mengirim email. Silakan coba lagi.");
    }
  };

  return (
    <PageContainer title="Forgot Password" description="this is Login page">
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
              <ForgotPassword onSuccess={handleSuccess} title="Masukkan email Anda!" />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default ForgotPasswordPage;
