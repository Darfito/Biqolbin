import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import {
  JamaahProps,
  JenisKelamin,
  KontakDaruratRelation,
  TipeKamar,
} from "@/app/(DashboardLayout)/utilities/type";

interface FormDetailProps {
  isEditing: boolean; // Status edit mode
  onSaveChanges: (data: JamaahProps) => void; // Kirim data ke parent
  jamaahData?: JamaahProps | null;
}

const FormDetail = ({
  isEditing,
  onSaveChanges,
  jamaahData,
}: FormDetailProps) => {
  const [formValues, setFormValues] = useState<JamaahProps>(
    jamaahData || {
      id: 0,
      nama: "",
      ayahKandung: "",
      noTelp: "",
      kontakDarurat: [
        {
          id: 0,
          nama: "",
          noTelp: "",
          hubungan: KontakDaruratRelation.Lainnya,
        },
      ],
      email: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      tempatLahir: "",
      perkawinan: false,
      alamat: "",
      varianKamar: {
        id: 0,
        tipeKamar: TipeKamar.QUAD,
        harga: 0,
        deskripsi: "",
      },
      kewarganegaraan: true,
      pekerjaan: "",
      kursiRoda: false,
      riwayatPenyakit: "",
      jenisDokumen: [],
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

  const handleContactChange = (
    index: number,
    field: "nama" | "noTelp" | "hubungan", // Memperbaiki tipe field
    value: string
  ) => {
    const updatedContacts = [...formValues.kontakDarurat];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormValues({ ...formValues, kontakDarurat: updatedContacts });
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            </Grid>

            {/* Kolom Kanan */}
            <Grid item xs={12} sm={6}>
              <Box>
              <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                <FormLabel component="legend">Status Perkawinan</FormLabel>
                <RadioGroup
                  value={
                    formValues.perkawinan ? "Sudah Menikah" : "Belum Menikah"
                  }
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(
                      "perkawinan",
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
              <Box>
              <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                <FormLabel component="legend">Kewarganegaraan</FormLabel>
                <RadioGroup
                  value={formValues.kewarganegaraan ? "WNI" : "WNA"}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    handleInputChange(
                      "kewarganegaraan",
                      e.target.value === "WNI"
                    )
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
              </Box>
              <CustomTextField
                select
                fullWidth
                label="Varian Kamar"
                value={formValues.varianKamar?.tipeKamar}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("varianKamar", {
                    ...formValues.varianKamar,
                    tipeKamar: e.target.value,
                  })
                }
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
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("pekerjaan", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formValues.kursiRoda}
                    onChange={(e) =>
                      handleInputChange("kursiRoda", e.target.checked)
                    }
                    disabled={!isEditing}
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
                  handleInputChange("riwayatPenyakit", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
            </Grid>

            {/* Kontak Darurat */}
            <Grid item xs={12}>
              <Typography sx={{ marginBottom: 2 }} variant="h5">
                Kontak Darurat
              </Typography>
              {formValues.kontakDarurat.map((contact, index) => (
                <Box key={index}>
                  <CustomTextField
                    fullWidth
                    label={`Nama Kontak Darurat ${index + 1}`}
                    value={contact.nama}
                    onChange={(e: { target: { value: string } }) =>
                      handleContactChange(index, "nama", e.target.value)
                    }
                    disabled={!isEditing}
                    sx={{ marginBottom: 2 }}
                  />
                  <CustomTextField
                    fullWidth
                    label={`No Telepon Kontak Darurat ${index + 1}`}
                    value={contact.noTelp}
                    onChange={(e: { target: { value: string } }) =>
                      handleContactChange(index, "noTelp", e.target.value)
                    }
                    disabled={!isEditing}
                    sx={{ marginBottom: 2 }}
                  />
                  <CustomTextField
                    select
                    fullWidth
                    label={`Hubungan Kontak Darurat ${index + 1}`}
                    value={contact.hubungan}
                    onChange={(e: { target: { value: string } }) =>
                      handleContactChange(index, "hubungan", e.target.value)
                    }
                    disabled={!isEditing}
                    sx={{ marginBottom: 2 }}
                  >
                    <MenuItem value={KontakDaruratRelation.Ayah}>Ayah</MenuItem>
                    <MenuItem value={KontakDaruratRelation.Ibu}>Ibu</MenuItem>
                    <MenuItem value={KontakDaruratRelation.Suami}>
                      Suami
                    </MenuItem>
                    <MenuItem value={KontakDaruratRelation.Istri}>
                      Istri
                    </MenuItem>
                    <MenuItem value={KontakDaruratRelation.Anak}>Anak</MenuItem>
                    <MenuItem value={KontakDaruratRelation.SaudaraKandung}>
                      Saudara Kandung
                    </MenuItem>
                    <MenuItem value={KontakDaruratRelation.KerabatLain}>
                      Kerabat Lain
                    </MenuItem>
                    <MenuItem value={KontakDaruratRelation.Teman}>
                      Teman
                    </MenuItem>
                    <MenuItem value={KontakDaruratRelation.Tetangga}>
                      Tetangga
                    </MenuItem>
                    <MenuItem value={KontakDaruratRelation.Lainnya}>
                      Lainnya
                    </MenuItem>
                  </CustomTextField>
                </Box>
              ))}
            </Grid>

            {/* Tombol Simpan */}
            {isEditing && (
              <Grid item xs={12}>
                <Button type="submit" variant="contained" color="primary">
                  Simpan
                </Button>
              </Grid>
            )}
          </Grid>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default FormDetail;
