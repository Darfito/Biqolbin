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

export const Logout = ({nama, role, loadingState} : LogoutProps) => {
  const [loading, setLoading] = useState<boolean>(loadingState);  // Tambahkan loading state
  const router = useRouter();


  // Fungsi untuk menangani sign-out
  const handleLogout = async () => {
    const response = await fetch('/api/authentication/signout', {
      method: 'POST',
    });

    if (response.ok) {
      // Jika sign out berhasil, arahkan ke halaman login
      router.push('/authentication/login');
    } else {
      // Jika terjadi error, bisa ditangani di sini
      console.error('Error signing out');
    }
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
      }}
    >
      <Box sx={{ width: "33%", display: "flex", justifyContent: "center" }}>
        <Avatar
          src="/images/profile/user-1.jpg"
          alt="image"
          sx={{
            width: 40,
            height: 40,
          }}
        />
      </Box>
      <Box sx={{ width: "33%" }}>
        {/* Menampilkan loading spinner saat data sedang dimuat */}
        {/* {loading ? (
          <CircularProgress />
        ) : (
          <> */}
            <Typography variant="h6">{nama || "Nama tidak tersedia"}</Typography>
            <Typography variant="subtitle1">{role || "Role tidak tersedia"}</Typography>
          {/* </> */}
        {/* )} */}
      </Box>
      <Box sx={{ width: "10%" }}>
        <IconButton onClick={handleLogout}>
          <IconLogout />
        </IconButton>
      </Box>
    </Box>
  );
};
