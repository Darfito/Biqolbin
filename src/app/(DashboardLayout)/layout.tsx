"use client";
import { styled, Container, Box } from "@mui/material";
import React, { ReactNode, useEffect, useState } from "react";
import Header from "@/app/(DashboardLayout)/layout/header/Header";
import Sidebar from "@/app/(DashboardLayout)/layout/sidebar/Sidebar";
import { ToastContainer } from "react-toastify";
import { getLoggedInUser, getUserById } from "@/libs/sessions";


const MainWrapper = styled("div")(() => ({
  display: "flex",
  minHeight: "100vh",
  width: "100%",
}));

const PageWrapper = styled("div")(() => ({
  display: "flex",
  flexGrow: 1,
  paddingBottom: "60px",
  flexDirection: "column",
  zIndex: 1,
  backgroundColor: "transparent",
}));

interface Props {
  children: ReactNode;
}



export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = await getLoggedInUser();  // Mendapatkan data user login

      if (loggedInUser) {
        // Mengambil data user berdasarkan ID setelah login
        const userDetails = await getUserById(loggedInUser.id);
        setUserData(userDetails);
        console.log("User details:", userDetails);  // Verifikasi data
      }

      setLoading(false);  // Set loading ke false setelah data selesai di-fetch
    };

    fetchUserData();
  }, []);

console.log("User data di layout:", userData);

console.log("ini nama",userData?.[0].nama); // Periksa apakah nama ada
console.log("ini role ",userData?.[0].role); // Periksa apakah role ada
  
  return (
    <MainWrapper className="mainwrapper">
      <ToastContainer />
      {/* ------------------------------------------- */}
      {/* Sidebar */}
      {/* ------------------------------------------- */}
      <Sidebar
        isSidebarOpen={isSidebarOpen}
        isMobileSidebarOpen={isMobileSidebarOpen}
        onSidebarClose={() => setMobileSidebarOpen(false)} nama={userData?.[0].nama} role={userData?.[0].role} loadingState={loading}      />
      {/* ------------------------------------------- */}
      {/* Main Wrapper */}
      {/* ------------------------------------------- */}
      <PageWrapper className="page-wrapper">
        {/* ------------------------------------------- */}
        {/* Header */}
        {/* ------------------------------------------- */}
        <Header toggleMobileSidebar={() => setMobileSidebarOpen(true)} />
        {/* ------------------------------------------- */}
        {/* PageContent */}
        {/* ------------------------------------------- */}
        <Container
          sx={{
            paddingTop: "20px",
            maxWidth: "1200px",
          }}
        >
          {/* ------------------------------------------- */}
          {/* Page Route */}
          {/* ------------------------------------------- */}
          <Box sx={{ minHeight: "calc(100vh - 170px)" }}>{children}</Box>
          {/* ------------------------------------------- */}
          {/* End Page */}
          {/* ------------------------------------------- */}
        </Container>
      </PageWrapper>
    </MainWrapper>
  );
}
