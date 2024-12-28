import * as React from "react";
import * as v from "valibot";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { JenisPaket, JenisPenerbangan, Maskapai } from "../../utilities/type";
import {
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
  Typography,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import FileUploaderSingle from "../../utilities/component/uploader/FileUploaderSingle";
import { useEffect, useState } from "react";

interface FormCMSProps {
  initialValues?: Record<string, any>; // Nilai default untuk mengedit
  mode: 'create' | 'edit'; // Mode: create atau edit
}

interface FormErrors {
  nama?: string;
  jenis?: string;
  maskapai?: string;
  customMaskapai?: string;
  jenisPenerbangan?: string;
  keretaCepat?: boolean;
  harga?: number;
  tglKeberangkatan?: string;
  tglKepulangan?: string;
  namaMuthawif?: string;
  noTelpMuthawif?: string;
  namaHotel?: string;
  alamatHotel?: string;
  ratingHotel?: number;
  tanggalCheckIn?: string;
  tanggalCheckOut?: string;
  fasilitas?: string[];
  gambar?: {
    url?: string;
    bucket?: string;
    path?: string;
  };
}

// Valibot Schema
export const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  jenis: v.pipe(v.string(), v.nonEmpty("Pilih jenis paket")),
  maskapai: v.pipe(v.string(), v.nonEmpty("Maskapai harus diisi")),
  customMaskapai: v.optional(
    v.pipe(
      v.string(),
      v.nonEmpty("Nama maskapai harus diisi jika memilih 'Lainnya'")
    )
  ),
  jenisPenerbangan: v.pipe(v.string(), v.nonEmpty("Pilih Jenis Penerbangan")),
  keretaCepat: v.boolean(),
  harga: v.pipe(v.string(), v.nonEmpty("Harga harus diisi")),
  tglKeberangkatan: v.pipe(
    v.string(),
    v.nonEmpty("Tanggal Keberangkatan harus diisi")
  ),
  tglKepulangan: v.pipe(
    v.string(),
    v.nonEmpty("Tanggal Kepulangan harus diisi")
  ),
  namaMuthawif: v.pipe(v.string(), v.nonEmpty("Nama Muthawif harus diisi")),
  noTelpMuthawif: v.pipe(v.string(), v.nonEmpty("No Telp Muthawif harus diisi")),
  namaHotel: v.pipe(v.string(), v.nonEmpty("Nama Hotel harus diisi")),
  alamatHotel: v.pipe(v.string(), v.nonEmpty("Alamat Hotel harus diisi")),
  ratingHotel: v.number(),
  tanggalCheckIn: v.pipe(v.string(), v.nonEmpty("Tanggal Check In harus diisi")),
  tanggalCheckOut: v.pipe(
    v.string(),
    v.nonEmpty("Tanggal Check Out harus diisi")
  ),
  fasilitas: v.array(v.string()),
  gambar: v.object({
    url: v.pipe(v.string(), v.nonEmpty("Gambar harus memiliki URL")),
    bucket: v.string(),
    path: v.string(),
  }),
});

const FormCMS  = ({ initialValues, mode } : FormCMSProps) => {
  const [open, setOpen] = useState(false);
  const [jenisPaket, setJenisPaket] = useState<string>("");
  const [isCustomMaskapai, setIsCustomMaskapai] = useState(false); // Untuk melacak apakah pengguna memilih "Lainnya"

  const [formValues, setFormValues] = useState(
    initialValues || {
      nama: "",
      jenis: "",
      maskapai: "",
      customMaskapai: "",
      jenisPenerbangan: "",
      keretaCepat: false,
      harga: "",
      tglKeberangkatan: "",
      tglKepulangan: "",
      namaMuthawif: "",
      noTelpMuthawif: "",
      namaHotel: "",
      alamatHotel: "",
      ratingHotel: 0,
      tanggalCheckIn: "",
      tanggalCheckOut: "",
      fasilitas: [] as string[],
      gambar: {
        url: "",
        bucket: "",
        path: "",
      },
    }
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newFasilitas, setNewFasilitas] = useState<string>("");


  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);
  
  const handleAddFasilitas = () => {
    if (newFasilitas.trim() === "") {
      toast.error("Fasilitas tidak boleh kosong");
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      fasilitas: [...prev.fasilitas, newFasilitas],
    }));
    setNewFasilitas(""); // Reset input
  };

  const handleRemoveFasilitas = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      fasilitas: prev.fasilitas.filter((_: any, i: number) => i !== index),
    }));
  };

  // Handle form submission
  const handleSubmit = (values: Record<string, any>) => {
    setFormErrors({}); // Clear previous errors

    // Validasi menggunakan Valibot
    const result = v.safeParse(formSchema, values);

    if (!result.success) {
      // Jika ada error, perbarui state `formErrors`
      const errorMap: Record<string, string> = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as string | undefined;
        if (path) {
          errorMap[path] = issue.message;
        }
      });

      setFormErrors(errorMap); // Kirim error ke komponen bawah
      console.error("Validation errors:", errorMap);
      return;
    }

    // Jika validasi berhasil
    if (mode === "create") {

      console.log("Form submitted:", values);
      toast.success("Form berhasil disubmit!");
    } else if (mode === "edit") {

      console.log("Form berhasil di Update!:", values);
      toast.success("Form berhasil di Update!");
    }

  };


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues(initialValues || {
      nama: "",
      jenis: "",
      maskapai: "",
      customMaskapai: "",
      jenisPenerbangan: "",
      keretaCepat: false,
      harga: "",
      tglKeberangkatan: "",
      tglKepulangan: "",
      namaMuthawif: "",
      noTelpMuthawif: '',
      namaHotel: "",
      alamatHotel: "",
      ratingHotel: 0,
      tanggalCheckIn: "",
      tanggalCheckOut: "",
      fasilitas: [],
      gambar: {
        url: "",
        bucket: "",
        path: "",
      },
    });

    // Clear any existing errors
    setFormErrors({});
  };

  console.log("initial values masuk:", initialValues);
  console.log("form values di detail:", formValues);

  return (
    <>
      <Button
        sx={{ color: "#fff", minWidth: "150px" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        {mode === 'create' ? "Tambah" : "Sunting"}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
        <DialogTitle>{mode === 'create' ? "Tambah Paket" : "Edit Paket"}</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              gap: "1rem",
            }}
          >
            <DialogContentText>Masukkan detail paket.</DialogContentText>

            <CustomTextField
              fullWidth
              label="Nama Paket"
              name="nama"
              value={formValues.nama}
              error={!!formErrors.nama}
              helperText={formErrors.nama}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, nama: e.target.value })
              }
            />
            <FormControl fullWidth>
              <FormLabel id="jenis-paket-label">Jenis Paket</FormLabel>
              <RadioGroup
                aria-labelledby="jenis-paket-label"
                name="jenisPaket"
                value={formValues.jenis}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    jenis: e.target.value,
                  })
                }
                row
              >
                <FormControlLabel
                  value={JenisPaket.REGULAR}
                  control={<Radio />}
                  label="Regular"
                />
                <FormControlLabel
                  value={JenisPaket.VIP}
                  control={<Radio />}
                  label="VIP"
                />
              </RadioGroup>
            </FormControl>
            <CustomTextField
              select
              fullWidth
              label="Nama Maskapai"
              name="maskapai"
              value={formValues.maskapai}
              error={!!formErrors.maskapai}
              helperText={formErrors.maskapai}
              onChange={(e: { target: { value: string } }) => {
                const value = e.target.value;
                if (value === Maskapai.LAINNYA) {
                  setIsCustomMaskapai(true); // Aktifkan input tambahan
                  setFormValues({
                    ...formValues,
                    maskapai: value,
                    customMaskapai: "",
                  });
                } else {
                  setIsCustomMaskapai(false); // Nonaktifkan input tambahan
                  setFormValues({ ...formValues, maskapai: value });
                }
              }}
            >
              {Object.values(Maskapai).map((maskapai) => (
                <MenuItem key={maskapai} value={maskapai}>
                  {maskapai}
                </MenuItem>
              ))}
            </CustomTextField>

            {/* Input tambahan jika memilih "Lainnya" */}
            {isCustomMaskapai && (
              <CustomTextField
                fullWidth
                label="Nama Maskapai (Lainnya)"
                name="customMaskapai"
                value={formValues.customMaskapai || ""}
                error={!!formErrors.customMaskapai}
                helperText={formErrors.customMaskapai}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    customMaskapai: e.target.value,
                  })
                }
              />
            )}
            <FormControl fullWidth>
              <FormLabel id="jenis-penerbangan-label">
                Jenis Penerbangan
              </FormLabel>
              <RadioGroup
                aria-labelledby="jenis-penerbangan-label"
                name="jenisPenerbangan"
                value={formValues.jenisPenerbangan}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    jenisPenerbangan: e.target.value,
                  })
                }
                row
              >
                <FormControlLabel
                  value={JenisPenerbangan.DIRECT}
                  control={<Radio />}
                  label="Direct"
                />
                <FormControlLabel
                  value={JenisPenerbangan.TRANSIT}
                  control={<Radio />}
                  label="Transit"
                />
              </RadioGroup>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.keretaCepat}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      keretaCepat: e.target.checked,
                    })
                  }
                />
              }
              label="Menggunakan Kereta Cepat?"
            />
            <CustomTextField
              fullWidth
              label="Harga Paket"
              name="harga"
              value={formValues.harga}
              error={!!formErrors.harga}
              helperText={formErrors.harga}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, harga: e.target.value })
              }
            />
            <Divider/>
            {/* Akomodasi */}
            <Typography variant="h5">Akomodasi</Typography>
            <CustomTextField
              fullWidth
              label="Nama Muthawif"
              name="namaMuthawif"
              value={formValues.namaMuthawif}
              error={!!formErrors.namaMuthawif}
              helperText={formErrors.namaMuthawif}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, namaMuthawif: e.target.value })
              }
            />
            <CustomTextField
              fullWidth
              label="Nomor Telpon Muthawif"
              name="noTelpMuthawif"
              value={formValues.noTelpMuthawif}
              error={!!formErrors.noTelpMuthawif}
              helperText={formErrors.noTelpMuthawif}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, noTelpMuthawif: e.target.value })
              }
            />
                        <CustomTextField
              fullWidth
              label="Nama Hotel"
              name="namaHotel"
              value={formValues.namaHotel}
              error={!!formErrors.namaHotel}
              helperText={formErrors.namaHotel}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, namaHotel: e.target.value })
              }
            />
            <CustomTextField
              fullWidth
              label="Alamat Hotel"
              name="alamatHotel"
              value={formValues.alamatHotel}
              error={!!formErrors.alamatHotel}
              helperText={formErrors.alamatHotel}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, alamatHotel: e.target.value })
              }
              multiline
              rows={2}
            />
            <CustomTextField
              fullWidth
              label="Rating Hotel"
              name="ratingHotel"
              value={formValues.ratingHotel}
              error={!!formErrors.ratingHotel}
              helperText={formErrors.ratingHotel}
              onChange={(e: { target: { value: number } }) =>
                setFormValues({ ...formValues, ratingHotel: e.target.value })
              }
            />
            <CustomTextField
              fullWidth
              label="Tanggal Check In Hotel"
              name="tanggalCheckIn"
              type="date"
              value={formValues.tanggalCheckIn}
              error={!!formErrors.tanggalCheckIn}
              helperText={formErrors.tanggalCheckIn}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, tanggalCheckIn: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomTextField
              fullWidth
              label="Tanggal Check Out Hotel"
              name="tanggalCheckOut"
              type="date"
              value={formValues.tanggalCheckOut}
              error={!!formErrors.tanggalCheckOut}
              helperText={formErrors.tanggalCheckOut}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, tanggalCheckOut: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />
            <CustomTextField
              fullWidth
              label="Tanggal Keberangkatan"
              name="tglKeberangkatan"
              type="date"
              value={formValues.tglKeberangkatan}
              error={!!formErrors.tglKeberangkatan}
              helperText={formErrors.tglKeberangkatan}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  tglKeberangkatan: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <CustomTextField
              fullWidth
              label="Tanggal Kepulangan"
              name="tglKepulangan"
              type="date"
              value={formValues.tglKepulangan}
              error={!!formErrors.tglKepulangan}
              helperText={formErrors.tglKepulangan}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, tglKepulangan: e.target.value })
              }
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <Divider/>
            {/* Fasilitas */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="h5">Fasilitas</Typography>
              {formValues.fasilitas.map((fasilitas: string[], index: number) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>
                    {index + 1}. {fasilitas}
                  </Typography>
                  <IconButton onClick={() => handleRemoveFasilitas(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Box display="flex" gap="0.5rem" alignItems="center">
                <CustomTextField
                  label="Tambah Fasilitas"
                  value={newFasilitas}
                  onChange={(e: { target: { value: string } }) =>
                    setNewFasilitas(e.target.value)
                  }
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFasilitas}
                  sx={{ color: "white" }}
                >
                  Tambah
                </Button>
              </Box>
            </Box>

            {/* Gambar */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle1">
                Upload Gambar Poster Penawaran
              </Typography>
              <FileUploaderSingle
                onFileUpload={(file) => {
                  // Simulasi menyimpan data file ke Supabase
                  const bucket = "your-bucket-name"; // Ganti dengan nama bucket Supabase Anda
                  const path = `uploads/${file.name}`; // Path file dalam bucket
                  const url = URL.createObjectURL(file); // Simulasi URL file untuk preview

                  // Update state formValues untuk gambar
                  setFormValues((prevValues) => ({
                    ...prevValues,
                    gambar: {
                      url,
                      bucket,
                      path,
                    },
                  }));
                }}
              />
              {/* {formValues.gambar && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    component="img"
                    src={formValues.gambar.url}
                    alt="Preview"
                    sx={{
                      mt: 1,
                      maxWidth: "100%",
                      maxHeight: 200,
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )} */}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">
              Batal
            </Button>
            <Button type="submit" variant="contained" sx={{ color: "white" }}>
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}

export default FormCMS;
