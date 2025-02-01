"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLoggedInUser } from "@/libs/sessions";
import { Box, Button, Card, Typography } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  useEffect(() => {
    async function checkUser() {
      const user = await getLoggedInUser();
      if (user) {
        setIsAuthenticated(true);
      }
    }
    checkUser();
  }, []);
  
  const handleClick = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
    } else {
      router.push("/authentication/login");
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#F3F3F3",
        position: "relative",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          elevation={9}
          sx={{
            minWidth: "400px",
            padding: "2rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
            alignItems: "center",
          }}
        >
          <Typography variant="h4">Selamat Datang Di Biqolbin Dashboard!</Typography>
          <Typography variant="subtitle1">
            {isAuthenticated ? "Anda sudah masuk, menuju dashboard..." : "Tekan tombol di bawah untuk masuk"}
          </Typography>
          <Button
            sx={{
              color: "#fff",
              minWidth: "150px",
              padding: "1rem",
              maxWidth: "200px",
              fontFamily: "'Plus Jakarta Sans', sans-serif;",
            }}
            variant="contained"
            onClick={handleClick}
          >
            {isAuthenticated ? "Masuk ke Dashboard" : "Tekan Untuk Masuk"}
          </Button>
        </Card>
      </Box>
    </Box>
  );
}
