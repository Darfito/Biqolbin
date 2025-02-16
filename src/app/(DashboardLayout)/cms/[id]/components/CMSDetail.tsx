"use client";

import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  IconAlignBoxLeftMiddle,
  IconArrowLeft,
  IconBed,
  IconBuilding,
  IconClipboard,
  IconPlane,
} from "@tabler/icons-react";
import { Fragment, useEffect, useState } from "react";
import FormCMS from "../../component/FormCMS";
import { toast } from "react-toastify";
import { getPaketDatabyID } from "../../action";
import {
  JenisPaket,
  JenisPenerbangan,
  Maskapai,
  PaketInterface,
} from "@/app/(DashboardLayout)/utilities/type";
import FileUploaderSingle from "@/app/(DashboardLayout)/utilities/component/uploader/FileUploaderSingle";
import { createClient } from "@/libs/supabase/client";
import useSWR from "swr";

interface CMSDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const CMSDetail = ({ id, breadcrumbLinks }: CMSDetailProps) => {
  const router = useRouter();
  const [paketDetail, setPaketDetail] = useState<PaketInterface>();
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah

  console.log("id di detail:", id);

  const handleDialogClose = () => setOpenDialog(false);
  const handleDialogOpen = () => setOpenDialog(true);

  const { data: dataPaket } = useSWR(
    id ? ["Paket", id] : null, // Key dinamis
    () => getPaketDatabyID(id) // Fetcher yang dieksekusi hanya jika `id` tersedia
  );

  useEffect(() => {
    if (dataPaket) {
      setPaketDetail(dataPaket);
    }
  }, [dataPaket]);

  const updateImageToSupabase = async (
    folderName: string,
    file: File,
    id: number
  ) => {
    const supabase = createClient();

    try {
      // Ambil ekstensi file
      const fileExtension = file.name.split(".").pop(); // Ekstensi file
      const newFileName = `${folderName}.${fileExtension}`; // Nama file baru dengan folderName + ekstensi
      const filePath = `${folderName}/${newFileName}`; // Path lengkap file dalam bucket

      // Hapus file lama (opsional)
      const { error: removeError } = await supabase.storage
        .from("Paket")
        .remove([filePath]);
      if (removeError) {
        console.warn("Tidak bisa menghapus gambar lama:", removeError.message);
      }

      // Upload file baru
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Paket")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
      }

      // Tambahkan query parameter unik untuk menghindari masalah cache
      const publicUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/Paket/${
        uploadData.path
      }?t=${new Date().getTime()}`;

      // Perbarui URL gambar di tabel database
      const { data: urlData, error: urlError } = await supabase
        .from("Paket")
        .update({ gambar_url: publicUrl })
        .eq("id", id)
        .select()
        .single();

      if (urlError) {
        throw new Error(
          `Gagal memperbarui URL gambar di database: ${urlError.message}`
        );
      }

      toast.success("Gambar berhasil diperbarui!");
      return { success: true, data: urlData };
    } catch (error) {
      console.error("Error updating Gambar:", error);
      toast.error("Gagal memperbarui gambar!");
      return { success: false, error: (error as Error).message };
    }
  };

  console.log("paketDetail di detail:", paketDetail);
  const handleBackClick = () => {
    router.push("/cms"); // Navigate to /keuangan page
  };

  const handleFileUpload = async (file: File, id: number) => {
    try {
      console.log("formValues.nama:", paketDetail?.nama);

      const namaPaket = paketDetail?.nama;
      if (typeof namaPaket !== "string") {
        throw new Error("Nama paket harus berupa string");
      }

      const folderName = namaPaket;
      console.log("Folder Name:", folderName);

      // Upload file baru dan hapus file lama
      const result = await updateImageToSupabase(folderName, file, id);

      if (result.success) {
        // Perbarui gambar_url di paketDetail secara langsung
        setPaketDetail((prevDetail) => ({
          ...prevDetail,
          nama: prevDetail?.nama ?? "",
          jenis: prevDetail?.jenis ?? JenisPaket.REGULAR,
          maskapai: prevDetail?.maskapai ?? Maskapai.GARUDA_INDONESIA,
          noPenerbangan: prevDetail?.noPenerbangan ?? "",
          customMaskapai: prevDetail?.customMaskapai ?? "",
          jenisPenerbangan:
            prevDetail?.jenisPenerbangan ?? JenisPenerbangan.DIRECT,
          keretaCepat: prevDetail?.keretaCepat ?? false,
          hargaDouble: prevDetail?.hargaDouble ?? 0,
          hargaTriple: prevDetail?.hargaTriple ?? 0,
          hargaQuad: prevDetail?.hargaQuad ?? 0,
          tglKeberangkatan: prevDetail?.tglKeberangkatan ?? "",
          tglKepulangan: prevDetail?.tglKepulangan ?? "",
          namaMuthawif: prevDetail?.namaMuthawif ?? "",
          noTelpMuthawif: prevDetail?.noTelpMuthawif ?? "",
          selectedFile: prevDetail?.selectedFile ?? null,
          Hotel: prevDetail?.Hotel ?? [
            {
              id: 0,
              namaHotel: "",
              alamatHotel: "",
              ratingHotel: 0,
              tanggalCheckIn: "",
              tanggalCheckOut: "",
            },
          ],
          fasilitas: prevDetail?.fasilitas ?? ([] as string[]),
          publish: prevDetail?.publish ?? false,
          gambar_url: prevDetail?.gambar_url ?? "",
        }));
      }

      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Gagal mengunggah gambar!");
    }
  };

  return (
    <>
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Typography variant="h2" component="h1" mb={3}>
          Detail Paket
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
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    justifyContent: "start",
                    alignItems: "center",
                    flexDirection: "column",
                  }}
                >
                  {paketDetail.gambar_url ? (
                    <Box
                      component="img"
                      key={paketDetail.gambar_url}
                      src={paketDetail.gambar_url}
                      alt="Gambar Paket"
                      sx={{
                        mt: 3,
                        maxWidth: "400px",
                        maxHeight: "600px",
                        borderRadius: 2,
                      }}
                    />
                  ) : (
                    <Box
                      sx={{
                        mt: 3,
                        width: "400px",
                        height: "600px",
                        borderRadius: 2,
                        backgroundColor: "#ccc",
                      }}
                    />
                  )}

                  <Box>
                    <Button
                      onClick={handleDialogOpen}
                      variant="contained"
                      sx={{ color: "#fff", marginTop: 2 }}
                    >
                      Unggah Gambar
                    </Button>
                  </Box>
                </Box>
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
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                      <IconBed size={"2rem"} />
                      <Typography variant="h5" gutterBottom>
                        Detail Harga Tipe Kamar
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "start",
                          width: "100%",
                          gap: 2, // Memberikan jarak antar elemen
                        }}
                      >
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {" "}
                          {/* Menyesuaikan jarak */}
                          <Typography variant="h6">
                            Tipe Kamar Double:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(paketDetail.hargaDouble)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {" "}
                          {/* Menyesuaikan jarak */}
                          <Typography variant="h6">
                            Tipe Kamar Triple:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(paketDetail.hargaTriple)}
                          </Typography>
                        </Box>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          {" "}
                          {/* Menyesuaikan jarak */}
                          <Typography variant="h6">
                            Tipe Kamar Quad:
                          </Typography>
                          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                            {new Intl.NumberFormat("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            }).format(paketDetail.hargaQuad)}
                          </Typography>
                        </Box>
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
                      <IconAlignBoxLeftMiddle size={"2rem"} />
                      <Typography variant="h5" gutterBottom>
                        Detail Fasilitas
                      </Typography>
                    </Box>
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
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Unggah Berkas</DialogTitle>
          <DialogContent>
            <FileUploaderSingle
              onFileUpload={(file) => {
                setUploadedFile(file); // Simpan file yang diunggah ke state
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} variant="contained" color="error">
              Ya, Batalkan
            </Button>
            <Button
              onClick={async () => {
                if (uploadedFile) {
                  // Ensure `id` is a number
                  const numericId =
                    typeof id === "string" ? parseInt(id, 10) : id;
                  await handleFileUpload(uploadedFile, numericId);
                } else {
                  console.error("No file uploaded.");
                  // Optionally, show an error message to the user
                }

                // Reset file after upload
                setUploadedFile(null);

                // Close the dialog after the upload is complete
                handleDialogClose();
              }}
              color="primary"
              variant="contained"
              sx={{ color: "white" }}
            >
              Simpan
            </Button>
          </DialogActions>
        </Dialog>
      </PageContainer>
    </>
  );
};
export default CMSDetail;
