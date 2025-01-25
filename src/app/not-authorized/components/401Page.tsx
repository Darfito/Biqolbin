"use client";

import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useRouter } from "next/navigation";
import { IconLock } from "@tabler/icons-react";

const UnauthorizedPage = () => {
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Navigasi kembali ke halaman sebelumnya
  };

  return (
    <Container
    maxWidth="md"
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: "#FFCDD2",
            width: 80,
            height: 80,
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <IconLock size={40} color="#D32F2F" />
        </Box>

        <Typography variant="h3" component="h1" color="error" fontWeight="bold">
          401 Unauthorized
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
          Anda tidak memiliki izin untuk mengakses halaman ini.
        </Typography>

        <Button
          variant="contained"
          color="primary"
          onClick={handleGoBack}
          sx={{
            color: "white",
            textTransform: "none",
            px: 3,
            py: 1,
            borderRadius: 2,
            fontWeight: "bold",
          }}
        >
          Kembali ke Halaman Sebelumnya
        </Button>
      </Box>
    </Container>
  );
};

export default UnauthorizedPage;
