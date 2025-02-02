import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { BiayaTambahanType } from "@/app/(DashboardLayout)/utilities/type";
import { Box, Button, Grid, MenuItem, Typography } from "@mui/material";
import { IconPlus } from "@tabler/icons-react";

interface BiayaTambahanSectionProps {
  biayaTambahan: BiayaTambahanType[];
  handleBiayaTambahanChange: (
    index: number,
    field: string,
    value: string | number
  ) => void;
  handleBiayaTambahanRemove: (index: number) => void;
  handleAddBiayaTambahan: () => void;
  isEditing: boolean;
}

const biayaTambahanOptions = [
  "Kereta Cepat",
  "Lounge Bandara",
  "Tiket Wisata Turki",
  "Tiket Wisata Mesir",
  "Taksi",
  "Al Hada Cable Car",
  "Toboggan Rollercoaster",
  "The International Fair and Museum of the Prophet's Biography and Islamic Civilization Ticket",
];

export const BiayaTambahanSection = ({
  biayaTambahan,
  handleBiayaTambahanChange,
  handleBiayaTambahanRemove,
  handleAddBiayaTambahan,
  isEditing,
}: BiayaTambahanSectionProps) => {
  const formatRupiah = (value: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Grid item xs={12}>
      <Typography
        sx={{
          marginBottom: 1,
          color: isEditing ? "inherit" : "gray", // Warna default atau abu-abu jika tidak diedit
          fontWeight: isEditing ? "bold" : "normal",
        }}
        variant="h5"
      >
        Biaya Tambahan
      </Typography>

      {!isEditing && (
        <Typography
          sx={{
            marginBottom: 2,
            color: "gray",
            fontSize: "0.875rem",
            fontStyle: "italic",
          }}
        >
          Sunting untuk menambahkan Biaya Tambahan
        </Typography>
      )}
      {biayaTambahan.map((item, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
            mb: 2,
          }}
        >
          {biayaTambahan.length > 1 && isEditing && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleBiayaTambahanRemove(index)}
              sx={{
                alignSelf: "flex-end",
                marginBottom: 2,
              }}
            >
              Hapus
            </Button>
          )}
          <CustomTextField
            select
            fullWidth
            label={`Nama Biaya Tambahan ${index + 1}`}
            value={item.nama}
            disabled={!isEditing}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              handleBiayaTambahanChange(index, "nama", e.target.value)
            }
            sx={{ marginBottom: 2 }}
          >
            {biayaTambahanOptions.map((option, idx) => (
              <MenuItem key={idx} value={option}>
                {option}
              </MenuItem>
            ))}
          </CustomTextField>

          <CustomTextField
            fullWidth
            label={`Biaya Tambahan ${index + 1}`}
            value={item.biaya ? formatRupiah(item.biaya) : "Rp 0"} // Menampilkan dalam format Rupiah
            required
            disabled={!isEditing}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const numericValue = e.target.value.replace(/[^0-9]/g, ""); // Hanya angka
              handleBiayaTambahanChange(index, "biaya", numericValue); // Simpan sebagai angka murni
            }}
          />
        </Box>
      ))}
      {isEditing && (
        <Button
          onClick={handleAddBiayaTambahan}
          sx={{ color: "#f18b04" }}
          startIcon={<IconPlus />}
        >
          Tambah Biaya Tambahan
        </Button>
      )}
    </Grid>
  );
};
