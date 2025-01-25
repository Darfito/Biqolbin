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
import {
  IconArrowLeft,
  IconBuilding,
  IconClipboard,
  IconHotelService,
  IconPlane,
} from "@tabler/icons-react";
import { Fragment, useEffect, useState } from "react";
import FormCMS, { formSchema } from "../../component/FormCMS";
import * as v from "valibot";
import { toast } from "react-toastify";
import { getPaketDatabyID } from "../../action";
import { PaketInterface } from "@/app/(DashboardLayout)/utilities/type";

interface CMSDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const CMSDetail = ({ id, breadcrumbLinks }: CMSDetailProps) => {
  const router = useRouter();
  const [paketDetail, setPaketDetail] = useState<PaketInterface>();

  console.log("id di detail:", id);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        const data = await getPaketDatabyID(id); // Panggil fungsi yang sudah dipisah
        if (data) setPaketDetail(data);
      };
      fetchData();
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
        <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
          <FormCMS initialValues={paketDetail} mode={"edit"} />
        </Box>
        <Card sx={{ mt: 3, p: 3 }}>
          {paketDetail ? (
            <>
              <Typography variant="h4" gutterBottom>
                Nama Paket: {paketDetail.nama}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                      src={paketDetail.gambar_url}
                      alt="Gambar Paket"
                      sx={{
                        mt: 3,
                        maxWidth: "400px",
                        maxHeight: "600px",
                        borderRadius: 2,
                      }}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <IconClipboard size={"2rem"} />
                      <Typography variant="h5">
                        Detail Paket Secara Umum
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          width: "100%",
                        }}
                      >
                        <ListItem>
                          <ListItemText
                            primary={paketDetail.namaMuthawif}
                            secondary={paketDetail.noTelpMuthawif}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1.2rem",
                                fontWeight: 600,
                                color: "#000",
                                marginBottom: 1,
                              },
                              "& .MuiListItemText-secondary": {
                                fontSize: "1rem",

                                color: "#000",
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Jenis Paket"
                            secondary={paketDetail.jenis}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1rem",
                                marginBottom: 1,
                              },
                              "& .MuiListItemText-secondary": {
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#000",
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Kereta Cepat"
                            secondary={paketDetail.keretaCepat ? "Ya" : "Tidak"}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1rem",
                                marginBottom: 1,
                              },
                              "& .MuiListItemText-secondary": {
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#000",
                              },
                            }}
                          />
                        </ListItem>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <ListItem>
                        <ListItemText
                          primary="Tanggal Keberangkatan"
                          secondary={paketDetail.tglKeberangkatan}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "1rem",
                              marginBottom: 1,
                            },
                            "& .MuiListItemText-secondary": {
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              color: "#000",
                            },
                          }}
                        />
                      </ListItem>
                      <ListItem>
                        <ListItemText
                          primary="Tanggal Kepulangan"
                          secondary={paketDetail.tglKepulangan}
                          sx={{
                            "& .MuiListItemText-primary": {
                              fontSize: "1rem",
                              marginBottom: 1,
                            },
                            "& .MuiListItemText-secondary": {
                              fontSize: "1.1rem",
                              fontWeight: 600,
                              color: "#000",
                            },
                          }}
                        />
                      </ListItem>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      mt: 3,
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <IconPlane size={"2rem"} />
                      <Typography variant="h5" gutterBottom>
                        Detail Penerbangan
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <ListItem>
                          <ListItemText
                            primary="Nomor Penerbangan"
                            secondary={paketDetail.noPenerbangan || "Tidak Ada"}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1rem",
                                marginBottom: 1,
                              },
                              "& .MuiListItemText-secondary": {
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#000",
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Jenis Penerbangan"
                            secondary={paketDetail.jenisPenerbangan}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1rem",
                                marginBottom: 1,
                              },
                              "& .MuiListItemText-secondary": {
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#000",
                              },
                            }}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Maskapai"
                            secondary={paketDetail.maskapai}
                            sx={{
                              "& .MuiListItemText-primary": {
                                fontSize: "1rem",
                                marginBottom: 1,
                              },
                              "& .MuiListItemText-secondary": {
                                fontSize: "1.1rem",
                                fontWeight: 600,
                                color: "#000",
                              },
                            }}
                          />
                        </ListItem>
                        {paketDetail.customMaskapai && (
                          <Grid item xs={6}>
                            <ListItem>
                              <ListItemText
                                primary="Custom Maskapai"
                                secondary={paketDetail.customMaskapai}
                                sx={{
                                  "& .MuiListItemText-primary": {
                                    fontSize: "1rem",
                                    marginBottom: 1,
                                  },
                                  "& .MuiListItemText-secondary": {
                                    fontSize: "1.1rem",
                                    fontWeight: 600,
                                    color: "#000",
                                  },
                                }}
                              />
                            </ListItem>
                          </Grid>
                        )}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <IconBuilding size={"2rem"} />
                      <Typography variant="h5" gutterBottom>
                        Detail Hotel
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      {paketDetail.Hotel?.map((hotel, index) => (
                        <Fragment key={index}>
                          <Box
                            display="flex"
                            flexDirection="row"
                            mb={2}
                            sx={{
                              alignItems: "center",
                            }}
                          >
                            <Box flex={1} pr={2}>
                              <ListItem>
                                <ListItemText
                                  primary={hotel.namaHotel}
                                  secondary={`${hotel.ratingHotel} - Star Hotel`}
                                  sx={{
                                    "& .MuiListItemText-primary": {
                                      fontSize: "1.1rem",
                                      fontWeight: 600,
                                      color: "#000",
                                      marginBottom: 1,
                                    },
                                    "& .MuiListItemText-secondary": {
                                      fontSize: "0.85rem",
                                      color: "#000",
                                    },
                                  }}
                                />
                              </ListItem>
                            </Box>
                            <Box flex={1} pr={2}>
                              <Typography
                                variant="body1"
                                sx={{ fontSize: "1rem" }}
                              >
                                {hotel.alamatHotel}
                              </Typography>
                            </Box>
                          </Box>
                          <Box display="flex" flexDirection="row" mb={2}>
                            <Box flex={1} pr={2}>
                              <ListItem>
                                <ListItemText
                                  primary="Check In Hotel"
                                  secondary={hotel.tanggalCheckIn}
                                  sx={{
                                    "& .MuiListItemText-primary": {
                                      fontSize: "1rem",
                                    },
                                    "& .MuiListItemText-secondary": {
                                      fontSize: "1rem",
                                    },
                                  }}
                                />
                              </ListItem>
                            </Box>

                            <Box flex={1} pr={2}>
                              <ListItem>
                                <ListItemText
                                  primary="Check Out Hotel"
                                  secondary={hotel.tanggalCheckOut}
                                  sx={{
                                    "& .MuiListItemText-primary": {
                                      fontSize: "1rem",
                                    },
                                    "& .MuiListItemText-secondary": {
                                      fontSize: "1rem",
                                    },
                                  }}
                                />
                              </ListItem>
                            </Box>
                          </Box>
                        </Fragment>
                      ))}
                    </Box>
                  </Box>
                  <Box
                    sx={{
                      mt: 3,
                      display: "flex",
                      justifyContent: "center",
                      flexDirection: "column",
                      width: "100%",
                    }}
                  >
                    <Typography variant="h5" gutterBottom>
                      Detail Fasilitas
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "start",
                          width: "100%",
                        }}
                      >
                        <Box sx={{ paddingLeft: "20px" }}>
                          {paketDetail.fasilitas.map(
                            (fasilitas: string, index: number) => (
                              <Box
                                key={index}
                                sx={{
                                  display: "flex",
                                  alignItems: "flex-start",
                                  marginBottom: "4px",
                                }}
                              >
                                <Typography
                                  variant="body1"
                                  sx={{
                                    fontSize: "1rem",
                                    marginRight: "8px",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {index + 1}.
                                </Typography>
                                <Typography
                                  variant="body1"
                                  sx={{ fontSize: "1rem" }}
                                >
                                  {fasilitas}
                                </Typography>
                              </Box>
                            )
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
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
