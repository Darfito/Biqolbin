"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import * as v from "valibot";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Box,
  Grid,
  MenuItem,
  Button,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import {
  JamaahInterface,
  JenisKelamin,
  JenisPaket,
  JenisPenerbangan,
  KeuanganInterface,
  KontakDaruratRelation,
  Maskapai,
  MetodePembayaranType,
  PaketInterface,
  StatusKepergian,
  StatusType,
  TipeKamar,
} from "@/app/(DashboardLayout)/utilities/type";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { getVisaUrl, updateKeuanganAction } from "../../action";
import FileUploaderSingle from "@/app/(DashboardLayout)/utilities/component/uploader/FileUploaderSingle";
import { createClient } from "@/libs/supabase/client";

interface FormErrors {
  nama?: string;
  jenisPaket?: string;
  metodePembayaran?: string;
  uangMuka?: string;
  totalTagihan?: string;
  tenggatPembayaran?: string;
  sisaTagihan?: string;
  banyaknyaCicilan?: string; // Simpan pesan error
  jumlahBiayaPerAngsuran?: string;
  catatanPembayaran?: string;
}

type FormType = {
  id?: number;
  Jamaah: JamaahInterface;
  Paket: PaketInterface;
  jenisPaket?: string;
  metodePembayaran: MetodePembayaranType;
  uangMuka?: number;
  totalTagihan: number;
  tenggatPembayaran: string;
  sisaTagihan?: number;
  banyaknyaCicilan?: number;
  jumlahBiayaPerAngsuran?: number;
  status: StatusType;
  catatanPembayaran?: string;
  paket_id?: number;
  varianKamar: TipeKamar;
  kursiRoda: boolean;
  visa?: string;
  statusPenjadwalan: StatusKepergian;
  statusAktif: boolean;
};

// Valibot Schema
const formSchema = v.object({
  metodePembayaran: v.pipe(v.string(), v.nonEmpty("Pilih metode pembayaran")),
  tenggatPembayaran: v.pipe(
    v.string(),
    v.nonEmpty("Tenggat pembayaran harus diisi")
  ),
  totalTagihan: v.pipe(
    v.number(),
    v.minValue(1, "Total Tagihan harus lebih dari 0")
  ),
  uangMuka: v.pipe(
    v.number(),
    v.minValue(0, "Uang muka harus lebih dari atau sama dengan 0")
  ),
  banyaknyaCicilan: v.optional(
    v.pipe(v.number(), v.minValue(1, "Banyaknya cicilan harus lebih dari 0"))
  ),
  jumlahBiayaPerAngsuran: v.optional(
    v.pipe(
      v.number(),
      v.minValue(0, "Jumlah Biaya per Angsuran harus lebih dari 0")
    )
  ),
});

interface FormDetailProps {
  isEditing: boolean; // Receive isEditing from the parent component
  paketData: PaketInterface[];
  keuanganData?: KeuanganInterface | null; // Current selected data
  jamaahData: JamaahInterface[];
}

const initialFormValues: FormType = {
  Jamaah: {
    NIK: 0,
    id: "",
    nama: "",
    tanggalLahir: new Date(),
    ayahKandung: "",
    noTelp: "",
    kontakDarurat: [
      {
        id: 0,
        nama: "",
        no_telp: "",
        hubungan: KontakDaruratRelation.Lainnya,
      },
    ],
    email: "",
    jenisKelamin: JenisKelamin.LakiLaki,
    tempatLahir: "",
    pernikahan: false,
    alamat: "",
    provinsi: "",
    kewarganegaraan: false,
    pekerjaan: "",
    riwayatPenyakit: "",
    jenisDokumen: [],
    statusAktif: true,
  },
  Paket: {
    id: 0,
    nama: "",
    jenis: JenisPaket.REGULAR,
    maskapai: Maskapai.SAUDIA_ARABIA,
    customMaskapai: "",
    jenisPenerbangan: JenisPenerbangan.DIRECT,
    noPenerbangan: "",
    keretaCepat: false,
    tglKeberangkatan: "",
    tglKepulangan: "",
    fasilitas: [],
    namaMuthawif: "",
    noTelpMuthawif: "",
    Hotel: [],
    gambar_url: "",
    hargaDouble: 0,
    hargaTriple: 0,
    hargaQuad: 0,
  },
  id: 0,
  metodePembayaran: MetodePembayaranType.TUNAI,
  jenisPaket: "",
  sisaTagihan: 0,
  tenggatPembayaran: "",
  totalTagihan: 0,
  uangMuka: 0,
  banyaknyaCicilan: 0,
  jumlahBiayaPerAngsuran: 0,
  status: StatusType.BELUM_BAYAR,
  paket_id: 0,
  catatanPembayaran: "",
  kursiRoda: false,
  statusPenjadwalan: "Belum Dijadwalkan",
  varianKamar: TipeKamar.PILIHVARIANKAMAR,
  statusAktif: true,
};

const FormDetail = ({
  isEditing,
  keuanganData,
  paketData,
  jamaahData,
}: FormDetailProps) => {
  console.log("keuanganData di detail:", keuanganData);
  const [metode, setMetode] = useState<string>(
    keuanganData?.metodePembayaran || ""
  );
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [openViewModal, setOpenViewModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [openDialog, setOpenDialog] = useState(false);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah
  const [formValues, setFormValues] = useState<FormType>(
    keuanganData ? { ...initialFormValues, ...keuanganData } : initialFormValues
  );
  const handleDialogClose = () => setOpenDialog(false);
  const handleDialogOpen = () => setOpenDialog(true);
  // Gunakan useEffect untuk memperbarui state ketika keuanganData berubah
  useEffect(() => {
    if (keuanganData && keuanganData.id !== formValues.id) {
      setMetode(keuanganData.metodePembayaran || MetodePembayaranType.TUNAI);
      setFormValues({
        Jamaah: {
          ...keuanganData.Jamaah,
        },
        Paket: keuanganData.Paket,
        id: keuanganData.id || 0,
        metodePembayaran:
          keuanganData.metodePembayaran || MetodePembayaranType.TUNAI,
        sisaTagihan: keuanganData.sisaTagihan || 0,
        tenggatPembayaran: keuanganData.tenggatPembayaran || "",
        totalTagihan: keuanganData.totalTagihan || 0,
        uangMuka: keuanganData.uangMuka || 0,
        banyaknyaCicilan: keuanganData.banyaknyaCicilan || 0,
        jumlahBiayaPerAngsuran: keuanganData.jumlahBiayaPerAngsuran || 0,
        status: keuanganData.status || StatusType.BELUM_BAYAR,
        paket_id: keuanganData.paket_id || 0,
        catatanPembayaran: keuanganData.catatanPembayaran || "",
        kursiRoda: keuanganData.kursiRoda || false,
        statusPenjadwalan:
          keuanganData.statusPenjadwalan || "Belum Dijadwalkan",
        varianKamar: keuanganData.varianKamar || TipeKamar.PILIHVARIANKAMAR,
        statusAktif: keuanganData.statusAktif || false,
      });
    }
  }, [keuanganData, formValues.id]);

  // console.log("Keuangan data di detail:", keuanganData);

  // Handle metode pembayaran selection
  const handleMetodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMetode = event.target.value as MetodePembayaranType;

    setMetode(newMetode);
    setFormValues({ ...formValues, metodePembayaran: newMetode });

    if (newMetode !== "Cicilan") {
      setFormValues((prev) => ({
        ...prev,
        metodePembayaran: newMetode,
        banyaknyaCicilan: 0,
        jumlahBiayaPerAngsuran: 0,
      }));
    }
  };

  const formatRupiah = (angka: number): string => {
    return angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  const handleChangeHarga = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // Menghapus non-numeric characters (selain angka)

    setFormValues((prevValues) => ({
      ...prevValues,
      [type]: value === "" ? 0 : Number(value),
    }));
  };

  const updateVisaToSupabase = async (foldername: string, file: File) => {
    const supabase = createClient();
  
    try {
      const fileExtension = file.name.split(".").pop();
      const newFileName = `Visa.${fileExtension}`;
      const filePath = `${foldername}/${newFileName}`;
  
      // Hapus file lama (opsional)
      const { error: removeError } = await supabase.storage
        .from("Dokumen")
        .remove([filePath]);
      if (removeError) {
        console.warn("Tidak bisa menghapus gambar lama:", removeError.message);
      }
  
      // Upload file baru
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Dokumen")
        .upload(filePath, file, { cacheControl: "3600", upsert: true });
  
      if (uploadError) {
        throw new Error(`Gagal mengunggah gambar: ${uploadError.message}`);
      }
  
      const publicUrl = `${
        process.env.NEXT_PUBLIC_SUPABASE_URL
      }/storage/v1/object/public/Dokumen/${
        uploadData.path
      }?t=${new Date().getTime()}`;
  
      // Cek apakah ada row dengan jamaah_id dan nama_dokumen = "Visa"
      const { data: existingData, error: fetchError } = await supabase
        .from("jenis_dokumen")
        .select("id")
        .eq("jamaah_id", foldername)
        .eq("nama_dokumen", "Visa");
  
      if (fetchError) {
        console.error("Gagal memeriksa data di jenis_dokumen:", fetchError.message);
        throw new Error(`Gagal memeriksa data: ${fetchError.message}`);
      }
  
      if (!existingData || existingData.length === 0) {
        // Jika tidak ada data dengan jamaah_id dan nama_dokumen = "Visa", buat entri baru
        const { error: insertError } = await supabase
          .from("jenis_dokumen")
          .insert([
            {
              jamaah_id: foldername,
              nama_dokumen: "Visa",
              lampiran: true,
              action: "Diterima",
              file: publicUrl,
            },
          ]);
  
        if (insertError) {
          throw new Error(`Gagal menyimpan URL gambar: ${insertError.message}`);
        }
      } else {
        // Jika sudah ada, update semua baris yang sesuai dengan jamaah_id dan nama_dokumen = "Visa"
        const { error: updateError } = await supabase
          .from("jenis_dokumen")
          .update({ file: publicUrl })
          .eq("jamaah_id", foldername)
          .eq("nama_dokumen", "Visa");
  
        if (updateError) {
          throw new Error(
            `Gagal memperbarui URL gambar: ${updateError.message}`
          );
        }
      }
  
      toast.success("Visa berhasil diupload");
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Gagal mengupload Visa");
    }
  };
  
  

  const handleFileUpload = async (file: File, jamaah_id: string) => {
    try {
      console.log("jamaah_id untuk di upload:", jamaah_id);

      const foldername = jamaah_id;

      await updateVisaToSupabase(foldername, file);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateAngsuran = () => {
    if (
      metode === "Cicilan" &&
      formValues.totalTagihan &&
      formValues.uangMuka &&
      formValues.banyaknyaCicilan
    ) {
      const jumlahAngsuran =
        (Number(formValues.totalTagihan) - Number(formValues.uangMuka)) /
        Number(formValues.banyaknyaCicilan);

      // Round the installment amount to whole number
      const roundedAngsuran = Math.round(jumlahAngsuran);
      setFormValues({
        ...formValues,
        jumlahBiayaPerAngsuran: roundedAngsuran,
      });
    }
  };

  useEffect(() => {
    const jumlahAngsuran =
      (Number(formValues.totalTagihan) - Number(formValues.uangMuka)) /
      Number(formValues.banyaknyaCicilan);

    if (formValues.jumlahBiayaPerAngsuran !== Math.round(jumlahAngsuran)) {
      calculateAngsuran();
    }
  }, [
    formValues.totalTagihan,
    formValues.uangMuka,
    formValues.banyaknyaCicilan,
  ]);

  const handleOpenModal = () => {
    if (!openModal) {
      setOpenModal(true); // Only open the modal if it's not already open
    }
  };

  const handleCloseModal = () => {
    if (openModal) {
      setOpenModal(false); // Close the modal if it's open
    }
  };

  const handleOpenViewModal = async (jamaah_id: string) => {
    const url = await getVisaUrl(jamaah_id);
    if (url) {
      setFileUrl(url);
      setOpenViewModal(true);
    }
  };

  const handleCloseViewModal = () => {
    if (openViewModal) {
      setOpenViewModal(false); // Close the modal if it's open
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // Kirim data ke parent
    e.preventDefault();
    console.log("data yang mau di update:", formValues);

    // Special handling based on payment method
    const methodErrors: FormErrors = {};

    // Validate metodePembayaran
    if (!formValues.metodePembayaran) {
      methodErrors.metodePembayaran = "Pilih metode pembayaran";
    }

    // Specific validations for Cicilan method
    if (formValues.metodePembayaran === "Cicilan") {
      if (!formValues.banyaknyaCicilan) {
        methodErrors.banyaknyaCicilan = "Masukkan banyaknya cicilan";
      }
    } else {
      // Clear installment-related fields for non-Cicilan methods
      setFormValues((prev) => ({
        ...prev,
        banyaknyaCicilan: 0,
        jumlahBiayaPerAngsuran: 0,
      }));
    }

    // If method errors exist, set them and return
    if (Object.keys(methodErrors).length > 0) {
      setFormErrors(methodErrors);
      return;
    }

    // Validate form data
    const result = v.safeParse(formSchema, formValues);

    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as string | undefined;
        if (path) {
          errorMap[path] = issue.message;
        }
      }),
        setFormErrors(errorMap);
      toast.error("Validation errors:", errorMap);
      return;
    }

    // Upload Visa sebelum update data
    if (uploadedFile) {
      await handleFileUpload(uploadedFile, formValues.Jamaah.id as string);
    }

    const response = await updateKeuanganAction(formValues);

    if (response.success) {
      toast.success("Data berhasil diperbarui"); // Show success toast
      handleCloseModal(); // Tutup dialog setelah selesai
    }
  };

  return (
    <DashboardCard>
      <form id="form-detail" onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {/* Pilihan Jamaah */}
              <Autocomplete
                fullWidth
                options={jamaahData}
                getOptionLabel={(option) => option.nama}
                disabled={!isEditing}
                sx={{ mb: 2 }}
                value={
                  jamaahData.find(
                    (jamaah) => jamaah.id === formValues.Jamaah.id
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormValues({
                    ...formValues,
                    Jamaah: newValue || ({} as JamaahInterface),
                  });
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Pilih Jamaah"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              {/* Pilihan Paket */}
              <Autocomplete
                fullWidth
                options={paketData}
                getOptionLabel={(option) => option.nama}
                disabled={!isEditing}
                sx={{ mb: 2 }}
                value={
                  paketData.find(
                    (paket) => paket.id === formValues.Paket?.id
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormValues({
                    ...formValues,
                    Paket: newValue || ({} as PaketInterface),
                  });
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Jenis Paket"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <CustomTextField
                select
                fullWidth
                label="Metode Pembayaran"
                value={metode}
                onChange={handleMetodeChange}
                error={formErrors.metodePembayaran}
                disabled={!isEditing} // Disable if not editing
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value="Tunai">Tunai</MenuItem>
                <MenuItem value="Tabungan">Tabungan</MenuItem>
                <MenuItem value="Cicilan">Cicilan</MenuItem>
              </CustomTextField>
              <CustomTextField
                fullWidth
                label="Total Tagihan"
                name="totalTagihan"
                sx={{ mb: 2 }}
                value={formatRupiah(formValues.totalTagihan)}
                error={!!formErrors.totalTagihan}
                helperText={formErrors.totalTagihan}
                disabled={!isEditing}
                onChange={(e: { target: { value: any } }) =>
                  setFormValues({
                    ...formValues,
                    totalTagihan: e.target.value,
                  })
                }
              />
              <CustomTextField
                fullWidth
                label="Tenggat Pembayaran"
                type="date"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formValues.tenggatPembayaran}
                error={!!formErrors.tenggatPembayaran}
                helperText={formErrors.tenggatPembayaran}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormValues({
                    ...formValues,
                    tenggatPembayaran: e.target.value,
                  })
                }
                disabled={!isEditing} // Disable if not editing
              />
              <CustomTextField
                fullWidth
                label="Uang Muka"
                name="uangMuka"
                sx={{ mb: 2 }}
                disabled={!isEditing}
                value={formatRupiah(formValues.uangMuka ?? 0)}
                error={!!formErrors.uangMuka}
                helperText={formErrors.uangMuka}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeHarga(e, "uangMuka")
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {/* Right Column Fields */}
              {metode === "Cicilan" && (
                <>
                  <CustomTextField
                    fullWidth
                    label="Banyaknya Cicilan"
                    name="banyaknyaCicilan"
                    value={formValues.banyaknyaCicilan}
                    error={!!formErrors.banyaknyaCicilan}
                    helperText={formErrors.banyaknyaCicilan}
                    sx={{ mb: 2 }}
                    disabled={!isEditing}
                    onChange={(e: { target: { value: any } }) => {
                      const value = parseInt(e.target.value, 10);
                      setFormValues({
                        ...formValues,
                        banyaknyaCicilan: isNaN(value) ? undefined : value, // Pastikan validasi angka
                      });
                    }}
                  />
                  <CustomTextField
                    fullWidth
                    sx={{ mb: 2 }}
                    label="Jumlah Biaya Per Angsuran"
                    name="jumlahBiayaPerAngsuran"
                    value={formatRupiah(formValues.jumlahBiayaPerAngsuran ?? 0)}
                    error={!!formErrors.jumlahBiayaPerAngsuran}
                    helperText={formErrors.jumlahBiayaPerAngsuran}
                    disabled
                  />
                </>
              )}
              <CustomTextField
                fullWidth
                label="Sisa Tagihan"
                name="sisaTagihan"
                sx={{ mb: 2 }}
                disabled={!isEditing}
                value={formatRupiah(formValues.sisaTagihan ?? 0)}
                error={!!formErrors.sisaTagihan}
                helperText={formErrors.sisaTagihan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeHarga(e, "sisaTagihan")
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.kursiRoda}
                    disabled={!isEditing}
                    onChange={(e) =>
                      setFormValues({
                        ...formValues,
                        kursiRoda: e.target.checked,
                      })
                    }
                  />
                }
                label="Butuh Kursi Roda"
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="Catatan Pembayaran"
                multiline
                rows={4}
                value={formValues.catatanPembayaran}
                error={formErrors.catatanPembayaran}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    catatanPembayaran: e.target.value,
                  })
                }
                disabled={!isEditing} // Disable if not editing
              />
              <Box sx={{ display: "flex", gap: 2 }}>
                <Button
                  disabled={!isEditing} // Disable if not editing
                  onClick={handleDialogOpen}
                  variant="contained"
                  sx={{ color: "#fff", marginTop: 2 }}
                >
                  Unggah Visa
                </Button>
                <Button
                  disabled={!isEditing} // Disable if not editing
                  onClick={() => {
                    if(formValues.Jamaah.id) {
                      handleOpenViewModal(formValues.Jamaah.id);
                    } else{
                      toast.error("Data visa tidak ditemukan")
                    }
                  }}
                  variant="contained"
                  sx={{ color: "#fff", marginTop: 2 }}
                >
                  Lihat Visa
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {isEditing && (
          <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
            <Button
              sx={{
                color: "#fff",
                minWidth: "150px",
                marginLeft: "24px",
                marginTop: "1rem",
              }}
              variant="contained"
              onClick={handleOpenModal}
            >
              Simpan
            </Button>
          </Box>
        )}
        {/* Dialog upload */}
        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Upload File</DialogTitle>
          <DialogContent>
            <FileUploaderSingle
              onFileUpload={(file) => {
                setUploadedFile(file); // Simpan file yang diunggah ke state
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Ya, Batalkan
            </Button>
            <Button
              onClick={async () => {
                if (uploadedFile) {
                  // Ensure `id` is a number
                  await handleFileUpload(
                    uploadedFile,
                    formValues.Jamaah.id as string
                  );
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
        {/* Dialog Melihat File */}
        <Dialog
          open={openViewModal}
          onClose={handleCloseViewModal}
          sx={{ padding: "1rem" }}
        >
          <DialogTitle>Melihat File</DialogTitle>
          <DialogContent>
            {fileUrl ? (
              // Cek ekstensi file dengan memisahkan URL dari parameter query
              fileUrl.split("?")[0].toLowerCase().endsWith(".pdf") ? (
                <iframe
                  src={fileUrl}
                  width="100%"
                  height="500px"
                  style={{ border: "none" }}
                />
              ) : (
                // Tampilkan gambar jika bukan PDF
                <Box
                  component="img"
                  src={fileUrl}
                  alt="Lampiran"
                  sx={{
                    maxWidth: "400px",
                    objectFit: "contain",
                  }}
                />
              )
            ) : (
              <Typography>File tidak tersedia.</Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseViewModal}
              sx={{ color: "white" }}
              variant="contained"
              color="error"
            >
              Close
            </Button>
          </DialogActions>
        </Dialog>
        {/* Confirmation Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Konfirmasi Perubahan</DialogTitle>
          <DialogContent>
            <Typography>
              Apakah Anda yakin ingin menyimpan perubahan ini?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
            >
              Batal
            </Button>
            <Button
              form="form-detail"
              type="submit"
              variant="contained"
              sx={{ color: "white" }}
            >
              Simpan Perubahan
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </DashboardCard>
  );
};

export default FormDetail;
