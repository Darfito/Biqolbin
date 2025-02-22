"use client";
import { baselightTheme } from "@/utils/theme/DefaultColors";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

import '../app/styles/global.css';
import { ReactNode } from "react";
import { ToastContainer } from "react-toastify";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" >
      <body>
        <ThemeProvider theme={baselightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <ToastContainer />
          <CssBaseline />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
