import { signout } from "@/app/authentication/signout/action";
import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { Box, Typography, Avatar, IconButton, CircularProgress } from "@mui/material";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface LogoutProps {
  nama:string,
  role: string,
  loadingState: boolean
}

export const Logout = ({nama, role} : LogoutProps) => {

  // Fungsi untuk menangani sign-out
  const handleLogout = async () => {
    await signout();
  };

  return (
    <Box
      gap={2}
      sx={{
        m: 2,
        paddingY: 2,
        display: "flex",
        bgcolor: "rgba(241, 139, 4, 0.13)",
        borderRadius: "8px",
        alignItems: "center",
        width: "85%",
        justifyContent: "center",
      }}
    >
      {/* <Box sx={{ width: "33%", display: "flex", justifyContent: "center" }}>
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 40,
            height: 40,
          }}
        />
      </Box> */}
      <Box sx={{ width: "33%" }}>
            <Typography variant="h6">{nama || "Nama tidak tersedia"}</Typography>
            <Typography variant="subtitle1">{role || "Role tidak tersedia"}</Typography>
      </Box>
      <Box sx={{ width: "10%" }}>
        <form action={handleLogout}>
        <IconButton type='submit'>
          <IconLogout />
        </IconButton>
        </form>
      </Box>
    </Box>
  );
};
