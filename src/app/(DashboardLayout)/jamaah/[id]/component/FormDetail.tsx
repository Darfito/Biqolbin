"use client";

import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Box,
  Grid,
  MenuItem,
  Button,
  FormControlLabel,
  Checkbox,
  Typography,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Autocomplete,
} from "@mui/material";
import * as v from "valibot";
import {
  JamaahInterface,
  JenisKelamin,
  JenisPaket,
  JenisPenerbangan,
  KontakDaruratRelation,
  KontakDaruratType,
  Maskapai,
  PaketInterface,
  StatusKepergian,
  TipeKamar,
} from "@/app/(DashboardLayout)/utilities/type";
import { updateJamaahAction } from "../../action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { KontakDaruratSection } from "../../component/KontakDaruratHandler";

interface FormDetailProps {
  isEditing: boolean; // Status edit mode
  jamaahData?: JamaahInterface | null;
  paketData: PaketInterface[];
}

interface FormErrors {
  id?: string;
  nama?: string;
  ayahKandung?: string;
  tanggalLahir?: string;
  noTelp?: string;
  // kontakDarurat?: string[];
  email?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  pernikahan?: string;
  alamat?: string;
  varianKamar?: string;
  kewarganegaraan?: string;
  pekerjaan?: string;
  kursiRoda?: string;
  riwayatPenyakit?: string;
  berangkat?: string;
  selesai?: string;
  status?: string;
}

const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  ayahKandung: v.pipe(v.string(), v.nonEmpty("Nama Ayah Kandung harus diisi")),
  tanggalLahir: v.date(),
  noTelp: v.pipe(v.string(), v.nonEmpty("No Telp harus diisi")),
  email: v.pipe(v.string(), v.nonEmpty("Email harus diisi")),
  jenisKelamin: v.pipe(v.string(), v.nonEmpty("Jenis Kelamin harus diisi")),
  tempatLahir: v.pipe(v.string(), v.nonEmpty("Tempat Lahir harus diisi")),
  pernikahan: v.boolean(),
  alamat: v.pipe(v.string(), v.nonEmpty("Alamat harus diisi")),
  varianKamar: v.pipe(v.string(), v.nonEmpty("Varian Kamar harus diisi")),
  kewarganegaraan: v.boolean(),
  pekerjaan: v.pipe(v.string(), v.nonEmpty("Pekerjaan harus diisi")),
  kursiRoda: v.boolean(),
  riwayatPenyakit: v.pipe(
    v.string(),
    v.nonEmpty("Riwayat Penyakit harus diisi")
  ),
  berangkat: v.string(),
  selesai: v.string(),
  status: v.string(),
});

const FormDetail = ({ isEditing, jamaahData, paketData }: FormDetailProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formValues, setFormValues] = useState<JamaahInterface>(
    jamaahData || {
      id: 0,
      nama: "",
      ayahKandung: "",
      noTelp: "",
      tanggalLahir: new Date(),
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
      varianKamar: TipeKamar.DOUBLE,
      kewarganegaraan: true,
      pekerjaan: "",
      kursiRoda: false,
      riwayatPenyakit: "",
      jenisDokumen: [],
      jenisPaket: {
        id: 0, // Mengambil hanya properti yang relevan
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
        publish: false,
        namaMuthawif: "",
        noTelpMuthawif: "",
        Hotel: [],
        gambar_url: "",
        hargaDouble: 0,
        hargaTriple: 0,
        hargaQuad: 0,
      },
      berangkat: "",
      selesai: "",
      status: "Dijadwalkan",
    }
  );

  useEffect(() => {
    if (jamaahData) setFormValues(jamaahData);
  }, [jamaahData]);

  const handleInputChange = (field: keyof JamaahInterface, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleOpenModal = () => {
    if (!openModal) {
      setOpenModal(true); // Only open the modal if it's not already open
    }
  };

  // Close the confirmation modal
  const handleCloseModal = () => {
    if (openModal) {
      setOpenModal(false); // Close the modal if it's open
    }
  };

  const handleContactChange = (
    index: number,
    field: keyof KontakDaruratType,
    value: string
  ) => {
    const updatedContacts = [...(formValues.kontakDarurat ?? [])];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormValues({ ...formValues, kontakDarurat: updatedContacts });
  };

  const handleAddContact = () => {
    setFormValues((prev) => ({
      ...prev,
      kontakDarurat: [
        ...(prev.kontakDarurat ?? []), // Jika undefined, default ke array kosong
        {
          id: prev.kontakDarurat?.length ?? 0, // Cegah akses undefined
          nama: "",
          no_telp: "",
          hubungan: KontakDaruratRelation.Lainnya,
        },
      ],
    }));
  };

  const handleRemoveContact = (indexToRemove: number) => {
    // Pastikan kontakDarurat bukan undefined
    if ((formValues.kontakDarurat?.length ?? 0) > 1) {
      setFormValues((prev) => ({
        ...prev,
        kontakDarurat: prev.kontakDarurat!.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("data yang mau di update:", formValues);

    // Validate form data
    const result = v.safeParse(formSchema, formValues);

    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as string | undefined;
        if (path) {
          errorMap[path] = issue.message;
        }
      });
      setFormErrors(errorMap);
      console.error("Validation errors:", errorMap);
      return;
    }

    const response = await updateJamaahAction(formValues);

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
            {/* Kolom Kiri */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Nama Jamaah"
                value={formValues.nama}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("nama", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="Nama Ayah Kandung"
                value={formValues.ayahKandung}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("ayahKandung", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="No Telepon"
                value={formValues.noTelp}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("noTelp", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                <FormLabel component="legend">Jenis Kelamin</FormLabel>
                <RadioGroup
                  value={formValues.jenisKelamin}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    handleInputChange("jenisKelamin", e.target.value)
                  }
                  row
                >
                  <FormControlLabel
                    value={JenisKelamin.LakiLaki}
                    control={<Radio />}
                    label="Laki-Laki"
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value={JenisKelamin.Perempuan}
                    control={<Radio />}
                    label="Perempuan"
                    disabled={!isEditing}
                  />
                </RadioGroup>
              </FormControl>
              <CustomTextField
                fullWidth
                label="Tanggal Lahir"
                type="date"
                required
                disabled={!isEditing}
                value={
                  formValues.tanggalLahir instanceof Date
                    ? formValues.tanggalLahir.toISOString().split("T")[0]
                    : formValues.tanggalLahir || "" // Jika sudah string, langsung pakai
                }
                InputLabelProps={{
                  shrink: true, // Memastikan label tetap di atas
                }}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    tanggalLahir: new Date(e.target.value),
                  })
                }
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="Tempat Lahir"
                value={formValues.tempatLahir}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("tempatLahir", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="Email"
                value={formValues.email}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("email", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />

              <CustomTextField
                fullWidth
                multiline
                rows={4}
                label="Alamat"
                value={formValues.alamat}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("alamat", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <Box>
                <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                  <FormLabel component="legend">Status Perkawinan</FormLabel>
                  <RadioGroup
                    value={
                      formValues.pernikahan ? "Sudah Menikah" : "Belum Menikah"
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleInputChange(
                        "pernikahan",
                        e.target.value === "Sudah Menikah"
                      )
                    }
                    row
                  >
                    <FormControlLabel
                      value="Sudah Menikah"
                      control={<Radio />}
                      label="Sudah Menikah"
                      disabled={!isEditing}
                    />
                    <FormControlLabel
                      value="Belum Menikah"
                      control={<Radio />}
                      label="Belum Menikah"
                      disabled={!isEditing}
                    />
                  </RadioGroup>
                </FormControl>
              </Box>
            </Grid>

            {/* Kolom Kanan */}
            <Grid item xs={12} sm={6}>
              <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                <FormLabel component="legend">Status Bernegara</FormLabel>
                <RadioGroup
                  value={formValues.kewarganegaraan ? "WNI" : "WNA"}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setFormValues({
                      ...formValues,
                      kewarganegaraan: e.target.value === "WNI",
                    })
                  }
                  row
                >
                  <FormControlLabel
                    value="WNI"
                    control={<Radio />}
                    label="WNI"
                    disabled={!isEditing}
                  />
                  <FormControlLabel
                    value="WNA"
                    control={<Radio />}
                    label="WNA"
                    disabled={!isEditing}
                  />
                </RadioGroup>
              </FormControl>
              <CustomTextField
                fullWidth
                label="Pekerjaan"
                value={formValues.pekerjaan}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({ ...formValues, pekerjaan: e.target.value })
                }
                sx={{ marginBottom: 2 }}
                disabled={!isEditing}
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
                label="Riwayat Penyakit"
                value={formValues.riwayatPenyakit}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    riwayatPenyakit: e.target.value,
                  })
                }
                sx={{ marginBottom: 2 }}
                disabled={!isEditing}
              />
              {/* Jenis Paket */}
              <Autocomplete
                fullWidth
                options={paketData}
                disabled={!isEditing}
                getOptionLabel={(option) => option.nama} // Menampilkan nama paket
                value={
                  paketData.find((paket) => paket.id === formValues.paket_id) ||
                  null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormValues({
                      ...formValues,
                      jenisPaket: newValue || ({} as PaketInterface),
                    });
                  } else {
                    setFormValues({
                      ...formValues,
                      jenisPaket: {} as PaketInterface,
                    });
                  }
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Jenis Paket"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: 2 }}
                  />
                )}
              />
              <CustomTextField
                select
                fullWidth
                label="Varian Kamar"
                value={formValues.varianKamar}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    varianKamar: e.target.value as TipeKamar,
                  })
                }
                sx={{ marginBottom: 2 }}
                disabled={!isEditing}
              >
                <MenuItem value={TipeKamar.QUAD}>QUAD</MenuItem>
                <MenuItem value={TipeKamar.TRIPLE}>TRIPLE</MenuItem>
                <MenuItem value={TipeKamar.DOUBLE}>DOUBLE</MenuItem>
              </CustomTextField>

              {/* Tanggal Berangkat */}
              <CustomTextField
                fullWidth
                disabled
                label="Tanggal Berangkat"
                type="date"
                value={formValues.berangkat} // Sudah otomatis terisi dari jenisPaket
                InputLabelProps={{
                  shrink: true, // Memastikan label tetap di atas
                }}
                sx={{ marginBottom: 2 }}
              />
              {/* Tanggal Selesai */}
              <CustomTextField
                fullWidth
                disabled
                label="Tanggal Selesai"
                type="date"
                value={formValues.selesai} // Sudah otomatis terisi dari jenisPaket
                InputLabelProps={{
                  shrink: true, // Memastikan label tetap di atas
                }}
                sx={{ marginBottom: 2 }}
              />

              <CustomTextField
                select
                fullWidth
                label="Status Perjalanan"
                value={formValues.status}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    status: e.target.value as StatusKepergian,
                  })
                }
                sx={{ marginBottom: 2 }}
                disabled={!isEditing}
              >
                <MenuItem value="Dijadwalkan">Dijadwalkan</MenuItem>
                <MenuItem value="Berangkat">Berangkat</MenuItem>
                <MenuItem value="Selesai">Selesai</MenuItem>
              </CustomTextField>
            </Grid>

            {/* Kontak Darurat */}
            <Grid item xs={12}>
              <KontakDaruratSection
                isEditing={isEditing}
                kontakDarurat={formValues.kontakDarurat ?? []}
                handleContactChange={handleContactChange}
                handleAddContact={handleAddContact}
                handleRemoveContact={handleRemoveContact}
              />
            </Grid>
            {isEditing && (
              <Box
                sx={{ width: "100%", display: "flex", justifyContent: "end" }}
              >
                <Button
                  sx={{ color: "#fff", minWidth: "150px", marginLeft: "24px" }}
                  variant="contained"
                  onClick={handleOpenModal}
                >
                  Simpan
                </Button>
              </Box>
            )}
          </Grid>
        </Box>
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
