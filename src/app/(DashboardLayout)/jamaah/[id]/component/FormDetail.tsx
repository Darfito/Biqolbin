import React, { useEffect, useState } from "react";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Grid, MenuItem, Button } from "@mui/material";
import { JamaahProps, JenisKelamin, KontakDaruratRelation, TipeKamar } from "@/app/(DashboardLayout)/utilities/type";

interface FormDetailProps {
  isEditing: boolean; // Status edit mode
  onSaveChanges: (data: JamaahProps) => void; // Kirim data ke parent
  jamaahData?: JamaahProps | null; 
}

const FormDetail = ({ isEditing, onSaveChanges, jamaahData }: FormDetailProps) => {
  const [formValues, setFormValues] = useState<JamaahProps>(
    jamaahData || {
      id: 0,
      nama: "",
      ayahKandung: "",
      noTelp: "",
      kontakDarurat: [],
      email: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      tempatLahir: "",
      perkawinan: false,
      alamat: "",
      varianKamar: { id: 0, tipeKamar: TipeKamar.QUAD, harga: 0, deskripsi: "" },
      kewarganegaraan: true,
      pekerjaan: "",
      kursiRoda: false,
      riwayatPenyakit: "",
      jenisPaket: {
        id: "0",
        nama: "",
        jenis: "REGULAR",
        maskapai: "",
        jenisPenerbangan: "DIRECT",
        keretaCepat: false,
        harga: 0,
        tglKeberangkatan: new Date(),
        tglKepulangan: new Date(),
        fasilitas: "",
      },
      berangkat: new Date(),
      selesai: new Date(),
      status: { id: 0, status: "Dijadwalkan" },
    }
  );

  useEffect(() => {
    if (jamaahData) setFormValues(jamaahData);
  }, [jamaahData]);

  const handleInputChange = (field: keyof JamaahProps, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveChanges(formValues);
  };

  return (
    <DashboardCard>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            {/* Kolom Kiri */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Nama Jamaah"
                value={formValues.nama}
                onChange={(e: { target: { value: string } }) => handleInputChange("nama", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="Nama Ayah Kandung"
                value={formValues.ayahKandung}
                onChange={(e: { target: { value: string } }) => handleInputChange("ayahKandung", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                fullWidth
                label="No Telepon"
                value={formValues.noTelp}
                onChange={(e: { target: { value: string } }) => handleInputChange("noTelp", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                select
                fullWidth
                label="Jenis Kelamin"
                value={formValues.jenisKelamin}
                onChange={(e: { target: { value: string } }) => handleInputChange("jenisKelamin", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value={JenisKelamin.LakiLaki}>Laki-Laki</MenuItem>
                <MenuItem value={JenisKelamin.Perempuan}>Perempuan</MenuItem>
              </CustomTextField>
              <CustomTextField
                fullWidth
                label="Tempat Lahir"
                value={formValues.tempatLahir}
                onChange={(e: { target: { value: string } }) => handleInputChange("tempatLahir", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            {/* Kolom Kanan */}
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Alamat"
                value={formValues.alamat}
                onChange={(e: { target: { value: string } }) => handleInputChange("alamat", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                select
                fullWidth
                label="Varian Kamar"
                value={formValues.varianKamar?.tipeKamar}
                onChange={(e: { target: { value: string } }) => handleInputChange("varianKamar", { ...formValues.varianKamar, tipeKamar: e.target.value })}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value={TipeKamar.QUAD}>QUAD</MenuItem>
                <MenuItem value={TipeKamar.TRIPLE}>TRIPLE</MenuItem>
                <MenuItem value={TipeKamar.DOUBLE}>DOUBLE</MenuItem>
                <MenuItem value={TipeKamar.CHILD}>CHILD</MenuItem>
                <MenuItem value={TipeKamar.INFANT}>INFANT</MenuItem>
              </CustomTextField>
              <CustomTextField
                fullWidth
                label="Pekerjaan"
                value={formValues.pekerjaan}
                onChange={(e: { target: { value: string } }) => handleInputChange("pekerjaan", e.target.value)}
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ marginTop: 3 }}>
              <Button variant="contained" color="primary" sx={{ color: "white" }} type="submit">
                Simpan Perubahan
              </Button>
            </Box>
          )}
        </Box>
      </form>
    </DashboardCard>
  );
};

export default FormDetail;
