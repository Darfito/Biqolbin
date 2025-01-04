"use client";

import {
  Box,
  Button,
  Card,
  Divider,
  Grid,
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
import FormCMS, { formSchema } from "../../component/FormCMS";
import * as v from "valibot";
import { toast } from "react-toastify";

interface CMSDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const CMSDetail = ({ id, breadcrumbLinks }: CMSDetailProps) => {
  const router = useRouter();
  const [paketDetail, setPaketDetail] = useState<any>(null);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});


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

  const handleEditSubmit = (values: Record<string, any>) => {
    setFormErrors({}); // Clear previous errors

    // Validasi menggunakan Valibot
    const result = v.safeParse(formSchema, values);

    if (!result.success) {
      // Jika ada error, perbarui state `formErrors`
      const errorMap: Record<string, string> = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as string | undefined;
        if (path) {
          errorMap[path] = issue.message;
        }
      });

      setFormErrors(errorMap); // Kirim error ke komponen bawah
      console.error("Validation errors:", errorMap);
      return;
    }

    // Jika validasi berhasil
    console.log("Form berhasil di Update!", values);
    toast.success("Form berhasil di Update!");
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
      <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCMS initialValues={paketDetail} mode={"edit"}  />
        </Box>
        <Card sx={{ mt: 3, p: 3 }}>
          {paketDetail ? (
            <>
              <Typography variant="h4" gutterBottom>
                Detail Paket: {paketDetail.nama}
              </Typography>
              <Divider sx={{ my: 2 }} />
              {paketDetail.gambar_url && (
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
              <Grid container spacing={2} sx={{ mt: 3 }}>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Jenis Paket"
                      secondary={paketDetail.jenis}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Jenis Penerbangan"
                      secondary={paketDetail.jenisPenerbangan}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Kereta Cepat"
                      secondary={paketDetail.keretaCepat ? "Ya" : "Tidak"}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Harga"
                      secondary={`Rp ${paketDetail.harga.toLocaleString(
                        "id-ID"
                      )}`}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Maskapai"
                      secondary={paketDetail.maskapai}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                {paketDetail.customMaskapai && (
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Custom Maskapai"
                        secondary={paketDetail.customMaskapai}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                )}
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Nomor Penerbangan"
                      secondary={paketDetail.noPenerbangan || "Tidak Ada"}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Tanggal Keberangkatan"
                      secondary={paketDetail.tglKeberangkatan}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Tanggal Kepulangan"
                      secondary={paketDetail.tglKepulangan}
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ mt: 2, marginLeft: "32px" }}>
                  <Typography variant="h3">Akomodasi</Typography>
                </Box>
                <Grid container spacing={2} sx={{ marginLeft: "2px" }}>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Nama Muthawif"
                        secondary={paketDetail.namaMuthawif}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Nomor Telepon Muthawif"
                        secondary={paketDetail.noTelpMuthawif}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Nama Hotel"
                        secondary={paketDetail.namaHotel}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Alamat Hotel"
                        secondary={paketDetail.alamatHotel}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Rating Hotel"
                        secondary={paketDetail.ratingHotel}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Tanggal Check In Hotel"
                        secondary={paketDetail.tanggalCheckIn}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                  <Grid item xs={6}>
                    <ListItem>
                      <ListItemText
                        primary="Tanggal Check out Hotel"
                        secondary={paketDetail.tanggalCheckOut}
                        sx={{
                          "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                          "& .MuiListItemText-secondary": { fontSize: "1rem" },
                        }}
                      />
                    </ListItem>
                  </Grid>
                </Grid>
                <Grid item xs={6}>
                  <ListItem>
                    <ListItemText
                      primary="Fasilitas"
                      secondary={
                        <ul
                          style={{
                            margin: 0,
                            paddingLeft: "20px",
                            fontSize: "1rem",
                          }}
                        >
                          {paketDetail.fasilitas.map(
                            (fasilitas: string, index: number) => (
                              <li key={index} style={{ marginBottom: "4px" }}>
                                {index + 1}. {fasilitas}
                              </li>
                            )
                          )}
                        </ul>
                      }
                      sx={{
                        "& .MuiListItemText-primary": { fontSize: "1.1rem" },
                        "& .MuiListItemText-secondary": { fontSize: "1rem" },
                      }}
                    />
                  </ListItem>
                </Grid>
              </Grid>
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
