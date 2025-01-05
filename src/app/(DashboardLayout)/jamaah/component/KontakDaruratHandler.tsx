import React from "react";
import { Grid, Box, Typography, Button, MenuItem } from "@mui/material";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import { KontakDaruratRelation, KontakDaruratType } from "../../utilities/type";

interface KontakDaruratSectionProps {
  kontakDarurat: KontakDaruratType[];
  handleContactChange: (
    index: number,
    field: keyof KontakDaruratType,
    value: string
  ) => void;
  handleAddContact: () => void;
  handleRemoveContact: (index: number) => void;
}

export const KontakDaruratSection = ({
  kontakDarurat,
  handleContactChange,
  handleAddContact,
  handleRemoveContact,
}: KontakDaruratSectionProps) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ marginBottom: 2 }} variant="h5">
        Kontak Darurat
      </Typography>
      {kontakDarurat.map((contact, index) => (
        <Box key={index} sx={{ marginBottom: 3, display: "flex", width: "100%", flexDirection: "column" }}>
          {kontakDarurat.length > 1 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveContact(index)}
              sx={{ 
                width: "25%",
                alignSelf: "flex-end",
                marginBottom: 2,}}
            >
              Hapus
            </Button>
          )}
          <CustomTextField
            fullWidth
            label={`Nama Kontak Darurat ${index + 1}`}
            value={contact.nama}
            onChange={(e: { target: { value: string } }) =>
              handleContactChange(index, "nama", e.target.value)
            }
            sx={{ marginBottom: 2 }}
          />
          <CustomTextField
            fullWidth
            label={`No Telepon Kontak Darurat ${index + 1}`}
            value={contact.noTelp}
            onChange={(e: { target: { value: string } }) =>
              handleContactChange(index, "noTelp", e.target.value)
            }
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
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value={KontakDaruratRelation.Ayah}>Ayah</MenuItem>
            <MenuItem value={KontakDaruratRelation.Ibu}>Ibu</MenuItem>
            <MenuItem value={KontakDaruratRelation.Suami}>Suami</MenuItem>
            <MenuItem value={KontakDaruratRelation.Istri}>Istri</MenuItem>
            <MenuItem value={KontakDaruratRelation.Anak}>Anak</MenuItem>
            <MenuItem value={KontakDaruratRelation.SaudaraKandung}>
              Saudara Kandung
            </MenuItem>
            <MenuItem value={KontakDaruratRelation.KerabatLain}>
              Kerabat Lain
            </MenuItem>
            <MenuItem value={KontakDaruratRelation.Teman}>Teman</MenuItem>
            <MenuItem value={KontakDaruratRelation.Tetangga}>Tetangga</MenuItem>
            <MenuItem value={KontakDaruratRelation.Lainnya}>Lainnya</MenuItem>
          </CustomTextField>
        </Box>
      ))}
      <Button
        variant="contained"
        onClick={handleAddContact}
        sx={{ marginTop: 2, color: "white" }}
      >
        Tambah Kontak Darurat
      </Button>
    </Grid>
  );
};
