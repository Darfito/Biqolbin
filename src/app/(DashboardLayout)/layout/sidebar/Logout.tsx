import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { Box, Typography, Avatar, IconButton, CircularProgress } from "@mui/material";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Logout = () => {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Tambahkan loading state
  const router = useRouter();

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

  console.log("User data:", userData);

  console.log("ini nama",userData?.[0].nama); // Periksa apakah nama ada
console.log("ini role ",userData?.[0].role); // Periksa apakah role ada

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
        {loading ? (
          <CircularProgress />
        ) : (
          <>
            <Typography variant="h6">{userData?.[0].nama || "Nama tidak tersedia"}</Typography>
            <Typography variant="subtitle1">{userData?.[0].role || "Role tidak tersedia"}</Typography>
          </>
        )}
      </Box>
      <Box sx={{ width: "10%" }}>
        <IconButton onClick={handleLogout}>
          <IconLogout />
        </IconButton>
      </Box>
    </Box>
  );
};
