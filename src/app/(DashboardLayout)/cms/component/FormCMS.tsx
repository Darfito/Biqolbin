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
import { JenisPaket, JenisPenerbangan } from "../../utilities/type";
import {
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import FileUploaderSingle from "../../utilities/component/uploader/FileUploaderSingle";

interface FormErrors {
  nama?: string;
  jenis?: string;
  maskapai?: string;
  jenisPenerbangan?: string;
  keretaCepat?: boolean;
  harga?: number;
  tglKeberangkatan?: string;
  tglKepulangan?: string;
  fasilitas?: string[];
  gambar?: {
    url?: string;
    bucket?: string;
    path?: string;
  };
}

// Valibot Schema
const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  jenis: v.pipe(v.string(), v.nonEmpty("Pilih jenis paket")),
  maskapai: v.pipe(v.string(), v.nonEmpty("Maskapai harus diisi")),
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
  gambar: v.object({
    url: v.pipe(v.string(), v.nonEmpty("Gambar harus memiliki URL")),
    bucket: v.string(),
    path: v.string(),
  }),
});

export default function FormCMS() {
  const [open, setOpen] = React.useState(false);
  const [metode, setMetode] = React.useState<string>("");
  const [jenisPaket, setJenisPaket] = React.useState<string>("");

  const [formValues, setFormValues] = React.useState({
    nama: "",
    jenis: "",
    maskapai: "",
    jenisPenerbangan: "",
    keretaCepat: false,
    harga: "",
    tglKeberangkatan: "",
    tglKepulangan: "",
    fasilitas: [] as string[],
    gambar: {
      url: "",
      bucket: "",
      path: "",
    },
  });
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});
  const [newFasilitas, setNewFasilitas] = React.useState<string>("");

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
      fasilitas: prev.fasilitas.filter((_, i) => i !== index),
    }));
  };
  const handleJenisPaketChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJenisPaket(event.target.value as JenisPaket);
    setFormValues({
      ...formValues,
      jenis: event.target.value as JenisPaket,
    });
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({}); // Clear previous errors

    console.log("Form submitting with values:", formValues);

    // Special handling based on payment method
    const methodErrors: FormErrors = {};

    // If method errors exist, set them and return
    if (Object.keys(methodErrors).length > 0) {
      setFormErrors(methodErrors);
      return;
    }

    // Validate the form values
    const result = v.safeParse(formSchema, formValues);

    if (!result.success) {
      const errorMap: FormErrors = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as string | undefined;

        // Cek apakah path adalah salah satu kunci yang valid di FormErrors
        if (path && path in errorMap) {
          errorMap[path] = issue.message;
        }
      });

      setFormErrors(errorMap);
      console.error("Validation errors:", errorMap);
      return;
    }

    console.log("Form submitted:", formValues);
    toast.success("Form berhasil disubmit!"); // Show success toast

    handleClose();
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      nama: "",
      jenis: "",
      maskapai: "",
      jenisPenerbangan: "",
      keretaCepat: false,
      harga: "",
      tglKeberangkatan: "",
      tglKepulangan: "",
      fasilitas: [],
      gambar: {
        url: "",
        bucket: "",
        path: "",
      },
    });

    // Reset method selection
    setMetode("");

    // Clear any existing errors
    setFormErrors({});
  };

  return (
    <>
      <Button
        sx={{ color: "#fff", minWidth: "150px" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Tambah
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Tambah Item Paket</DialogTitle>
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
            <CustomTextField
              select
              fullWidth
              label="Jenis Paket"
              value={formValues.jenis}
              onChange={handleJenisPaketChange}
            >
              <MenuItem value={JenisPaket.REGULAR}>REGULAR</MenuItem>
              <MenuItem value={JenisPaket.VIP}>VIP</MenuItem>
            </CustomTextField>
            <CustomTextField
              fullWidth
              label="Nama Maskapai"
              name="maskapai"
              value={formValues.maskapai}
              error={!!formErrors.maskapai}
              helperText={formErrors.maskapai}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, maskapai: e.target.value })
              }
            />
            <CustomTextField
              select
              fullWidth
              label="Jenis Penerbangan"
              value={formValues.jenisPenerbangan}
              onChange={handleJenisPaketChange}
            >
              <MenuItem value={JenisPenerbangan.DIRECT}>DIRECT</MenuItem>
              <MenuItem value={JenisPenerbangan.TRANSIT}>TRANSIT</MenuItem>
            </CustomTextField>
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

            {/* Fasilitas */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="h5">Fasilitas</Typography>
              {formValues.fasilitas.map((fasilitas, index) => (
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
              <Typography variant="subtitle1">Upload Gambar Poster Penawaran</Typography>
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
