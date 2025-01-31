import { Box, Button } from "@mui/material";

export default async function Home() {
    return (
       <Box sx={{ width: "100%", height: "100vh" }}>
        <Box sx={{ width: "100%", height: "100%",display: "flex", justifyContent: "center", alignItems: "center"}}>
            <Button  sx={{ color: "#fff", minWidth: "150px", padding: "1rem"}}  variant="contained">
                Tekan Untuk Masuk
            </Button>
        </Box>
       </Box>
    )
}