import { Box, Button, Typography } from "@mui/material";
import { HotelType } from "../../utilities/type";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

interface HotelHandlerProps {
  hotel: HotelType[];
  handleHotelChange: (
    index: number,
    field: keyof HotelType,
    value: string | number
  ) => void;
  handleAddHotel: () => void;
  handleRemoveHotel: (index: number) => void;
}

export const HotelSection = ({
  hotel,
  handleHotelChange,
  handleAddHotel,
  handleRemoveHotel,
}: HotelHandlerProps) => {
  return (
    <Box sx={{ width: "100%" }}>
      <Typography sx={{ marginBottom: 2 }} variant="h5">
        Hotel
      </Typography>
      {hotel.map((value, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            width: "100%",
            flexDirection: "column",
          }}
        >
          {hotel.length > 1 && (
            <Button
              variant="contained"
              color="error"
              onClick={() => handleRemoveHotel(index)}
              sx={{
                width: "25%",
                alignSelf: "flex-end",
                marginBottom: 2,
              }}
            >
              Hapus
            </Button>
          )}
          <CustomTextField
            fullWidth
            label={`Nama Hotel ${index + 1}`}
            name="namaHotel"
            value={value.namaHotel}
            onChange={(e: { target: { value: string } }) =>
              handleHotelChange(index, "namaHotel", e.target.value)
            }
            sx={{ marginBottom: 2 }}
          />
          <CustomTextField
            fullWidth
            label="Alamat Hotel"
            name="alamatHotel"
            value={value.alamatHotel}
            onChange={(e: { target: { value: string } }) =>
              handleHotelChange(index, "alamatHotel", e.target.value)
            }
            sx={{ marginBottom: 2 }}
            multiline
            rows={2}
          />
          <CustomTextField
            fullWidth
            label="Rating Hotel"
            name="ratingHotel"
            value={value.ratingHotel}
            onChange={(e: { target: { value: string } }) =>
              handleHotelChange(
                index,
                "ratingHotel",
                e.target.value === "" ? 0 : Number(e.target.value)
              )
            }
            type="number"
            inputProps={{ min: 0 }} // Membatasi nilai minimum ke 0
            sx={{ marginBottom: 2 }}
          />

          <CustomTextField
            fullWidth
            label="Tanggal Check In Hotel"
            name="tanggalCheckIn"
            type="date"
            value={value.tanggalCheckIn}
            onChange={(e: { target: { value: string } }) =>
              handleHotelChange(index, "tanggalCheckIn", e.target.value)
            }
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <CustomTextField
            fullWidth
            label="Tanggal Check Out Hotel"
            name="tanggalCheckOut"
            type="date"
            value={value.tanggalCheckOut}
            onChange={(e: { target: { value: string } }) =>
              handleHotelChange(index, "tanggalCheckOut", e.target.value)
            }
            sx={{ marginBottom: 2 }}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Box>
      ))}
      <Box sx={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <Button
          variant="contained"
          onClick={handleAddHotel}
          sx={{ color: "white", marginBottom: 2 }}
        >
          Tambah Hotel
        </Button>
      </Box>
    </Box>
  );
};
