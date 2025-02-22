import * as React from "react";
import * as v from "valibot";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { FormEvent, useState } from "react";

import { createCabangAction } from "../action";

interface FormErrors {
  email?: string;
  nama?: string;
  alamatCabang?: string;
  cabang_lat?: string;
  cabang_long?: string;
}

type FormType = {
  nama: string;
  alamatCabang: string;
  cabang_lat?: number;
  cabang_long?: number;
  action?: string;
};

// Valibot Schema
const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  alamatCabang: v.pipe(v.string(), v.nonEmpty("Alamat Cabang harus diisi")),
  cabang_lat: v.pipe(
    v.string(),
    v.transform((val) => parseFloat(val)),
    v.number()
  ),
  cabang_long: v.pipe(
    v.string(),
    v.transform((val) => parseFloat(val)),
    v.number()
  ),
});

export default function FormCabang() {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState<FormType>({
    nama: "",
    alamatCabang: "",
    cabang_lat: 0,
    cabang_long: 0,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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

    const cabangInsertResponse = await createCabangAction(formValues);

    if (cabangInsertResponse.success) {
      toast.success("Cabang berhasil ditambahkan!");
      handleClose();
    } else {
      toast.error(`Gagal menambahkan Cabang: ${cabangInsertResponse.error}`);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      nama: "",
      alamatCabang: "",
      cabang_lat: 0,
      cabang_long: 0,
    });

    // Clear any existing errors
    setFormErrors({});
  };

  console.log("form values di User:", formValues);
  return (
    <>
      <Button
        sx={{ color: "#fff", minWidth: "150px" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Tambah
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Tambah Item Cabang</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              gap: "1rem",
            }}
          >
            <DialogContentText>Masukkan detail Cabang.</DialogContentText>

            <CustomTextField
              fullWidth
              label="Nama Cabang"
              name="nama"
              value={formValues.nama}
              error={!!formErrors.nama}
              helperText={formErrors.nama}
              required
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, nama: e.target.value })
              }
            />

            <CustomTextField
              fullWidth
              label="Alamat Cabang"
              name="alamatCabang"
              value={formValues.alamatCabang}
              error={!!formErrors.alamatCabang}
              required
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, alamatCabang: e.target.value })
              }
              multiline
              rows={4}
            />
            <CustomTextField
              fullWidth
              label="Koordinat Latitude"
              name="cabang_lat"
              value={formValues.cabang_lat}
              error={!!formErrors.cabang_lat}
              required
              onChange={(e: { target: { value: number } }) =>
                setFormValues({ ...formValues, cabang_lat: e.target.value })
              }
            />
            <CustomTextField
              fullWidth
              label="Koordinat Longitude"
              name="cabang_long"
              value={formValues.cabang_long}
              error={!!formErrors.cabang_long}
              required
              onChange={(e: { target: { value: number } }) =>
                setFormValues({ ...formValues, cabang_long: e.target.value })
              }
            />
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
