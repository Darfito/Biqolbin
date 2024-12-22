"use client";

import {
  Box,
  Button,
  Card,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import PageContainer from "../../../components/container/PageContainer";

import { useRouter } from "next/navigation";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import { IconArrowLeft } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { PaketData } from "@/app/(DashboardLayout)/jamaah/data";

interface CMSDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const CMSDetail = ({ id, breadcrumbLinks }: CMSDetailProps) => {
  const router = useRouter();
  const [paketDetail, setPaketDetail] = useState<any>(null);

  console.log("id di detail:", id);

  useEffect(() => {
    const detail = PaketData.find((paket) => paket.id === id);
    if (detail) {
      setPaketDetail(detail);
    }
  }, [id]);

  console.log("paketDetail di detail:", paketDetail);
  const handleBackClick = () => {
    router.push("/cms"); // Navigate to /keuangan page
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" component="h1" mb={3}>
          CMS
        </Typography>
        <Breadcrumb links={breadcrumbLinks} />
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ color: "white" }}
            startIcon={<IconArrowLeft />}
            onClick={handleBackClick}
          >
            Kembali ke Daftar
          </Button>
        </Box>
      </Box>
      <PageContainer title="CMS">
        <Card sx={{ mt: 3, p: 3 }}>
          {paketDetail ? (
            <>
              <Typography variant="h4" gutterBottom>
                Detail Paket: {paketDetail.nama}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {paketDetail.gambar?.url && (
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Box
                    component="img"
                    src={paketDetail.gambar.url}
                    alt="Gambar Paket"
                    sx={{
                      mt: 3,
                      maxWidth: "100%",
                      maxHeight: 300,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}
              <List>
                <ListItem>
                  <ListItemText
                    primary="Jenis Paket"
                    secondary={paketDetail.jenis}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Maskapai"
                    secondary={paketDetail.maskapai}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Jenis Penerbangan"
                    secondary={paketDetail.jenisPenerbangan}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Kereta Cepat"
                    secondary={paketDetail.keretaCepat ? "Ya" : "Tidak"}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Harga"
                    secondary={`Rp ${paketDetail.harga.toLocaleString(
                      "id-ID"
                    )}`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tanggal Keberangkatan"
                    secondary={paketDetail.tglKeberangkatan}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Tanggal Kepulangan"
                    secondary={paketDetail.tglKepulangan}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Fasilitas"
                    secondary={
                      <ul style={{ margin: 0, paddingLeft: "20px" }}>
                        {paketDetail.fasilitas.map((fasilitas : string, index: number) => (
                          <li key={index} style={{ marginBottom: "4px" }}>
                           {index + 1}. {fasilitas}
                          </li>
                        ))}
                      </ul>
                    }
                  />
                </ListItem>
              </List>
            </>
          ) : (
            <Typography variant="h6" color="error">
              Data paket tidak ditemukan.
            </Typography>
          )}
        </Card>
      </PageContainer>
    </>
  );
};
export default CMSDetail;
