import React from "react";
import { Grid, Box, Typography, Button, MenuItem } from "@mui/material";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import { KontakDaruratRelation, KontakDaruratType } from "../../utilities/type";
import { IconPlus } from "@tabler/icons-react";

interface KontakDaruratSectionProps {
  kontakDarurat: KontakDaruratType[];
  handleContactChange: (
    index: number,
    field: keyof KontakDaruratType,
    value: string
  ) => void;
  handleAddContact: () => void;
  handleRemoveContact: (index: number) => void;
  isEditing: boolean; // Status edit mode
}

export const KontakDaruratSection = ({
  kontakDarurat,
  handleContactChange,
  handleAddContact,
  handleRemoveContact,
  isEditing,
}: KontakDaruratSectionProps) => {
  return (
    <Grid item xs={12}>
      <Typography sx={{ marginBottom: 2 }} variant="h5">
        Kontak Darurat
      </Typography>
      {kontakDarurat.map((contact, index) => (
        <Box
          key={index}
          sx={{ display: "flex", width: "100%", flexDirection: "column" }}
        >
          {kontakDarurat.length > 1 && isEditing && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveContact(index)}
              sx={{
                alignSelf: "flex-end",
                marginBottom: 2,
              }}
            >
              Hapus
            </Button>
          )}
          <CustomTextField
            fullWidth
            label={`Nama Kontak Darurat ${index + 1}`}
            value={contact.nama}
            disabled={!isEditing}
            onChange={(e: { target: { value: string } }) =>
              handleContactChange(index, "nama", e.target.value)
            }
            sx={{ marginBottom: 2 }}
          />
          <CustomTextField
            fullWidth
            label={`No Telepon Kontak Darurat ${index + 1}`}
            value={contact.no_telp}
            disabled={!isEditing}
            onChange={(e: { target: { value: string } }) =>
              handleContactChange(index, "no_telp", e.target.value)
            }
            sx={{ marginBottom: 2 }}
          />
          <CustomTextField
            select
            fullWidth
            label={`Hubungan Kontak Darurat ${index + 1}`}
            value={contact.hubungan}
            disabled={!isEditing}
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
      {isEditing && (
        <Button
          onClick={handleAddContact}
          sx={{ color: "#f18b04" }}
          startIcon={<IconPlus />}
        >
          Tambah Kontak Darurat
        </Button>
      )}
    </Grid>
  );
};
