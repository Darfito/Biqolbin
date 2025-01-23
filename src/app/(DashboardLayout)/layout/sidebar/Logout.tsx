import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { IconLogout } from "@tabler/icons-react";
import { useRouter } from "next/navigation";


export const Logout = () => {
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
        <Typography variant="h6">John Doe</Typography>
        <Typography variant="subtitle1">Admin</Typography>
      </Box>
      <Box sx={{ width: "10%" }}>
        <IconButton onClick={handleLogout}>
          <IconLogout />
        </IconButton>
      </Box>
    </Box>
  );
};


      {/* <Box >
                    <Typography variant="h5" sx={{ width: "80px" }} fontSize='16px' mb={1}>Haven&apos;t account ?</Typography>
                    <Button color="primary" target="_blank" disableElevation component={Link} href="/authentication/register" variant="contained" aria-label="logout" size="small">
                        Sign Up
                    </Button>
                </Box> */}
      {/* <Box mt="-35px" >
                    <Image alt="Remy Sharp" src='/images/backgrounds/rocket.png' width={100} height={100} />
                </Box> */}
      {/* </> */}