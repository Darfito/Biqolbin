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
import {
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { Jabatan, JenisKelamin, UserProps } from "../../utilities/type";
import { FormEvent, useState } from "react";
import { createUserAction } from "../action";
import { revalidatePath } from "next/cache";

interface FormErrors {
  nama?: string;
  jenisKelamin?: string;
  noTelp?: string;
  role?: string;
  penempatan?: string;
  alamatCabang?: string;
}

// Valibot Schema
const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  jenisKelamin: v.pipe(v.string(), v.nonEmpty("Jenis Kelamin harus diisi")),
  noTelp: v.pipe(v.string(), v.nonEmpty("Nomor Telepon harus diisi")),
  role: v.pipe(v.string(), v.nonEmpty("Role harus diisi")),
  penempatan: v.pipe(v.string(), v.nonEmpty("Penempatan harus diisi")),
  alamatCabang: v.pipe(v.string(), v.nonEmpty("Alamat Cabang harus diisi")),
});

export default function FormUser() {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState({
    nama: "",
    jenisKelamin: "",
    noTelp: "",
    role: "",
    penempatan: "",
    alamatCabang: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const handleInputChange = (field: keyof UserProps, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setFormErrors({}); // Clear previous errors

    // Validasi menggunakan Valibot
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

    console.log("Form User submitted:", formValues);

    // Jika validasi berhasil, panggil createUserAction
    const response = await createUserAction(formValues);

    if (response.success) {
      toast.success("User berhasil ditambahkan!");
      handleClose(); // Tutup dialog setelah berhasil

    } else {
      toast.error(`Gagal menambahkan user: ${response.error}`);
    }
  };


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      nama: "",
      jenisKelamin: "",
      noTelp: "",
      role: "",
      penempatan: "",
      alamatCabang: "",
    });


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
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Tambah Item User</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              gap: "1rem",
            }}
          >
            <DialogContentText>Masukkan detail user.</DialogContentText>

            <CustomTextField
              fullWidth
              label="Nama Lengkap"
              name="nama"
              value={formValues.nama}
              error={!!formErrors.nama}
              helperText={formErrors.nama}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, nama: e.target.value })
              }
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
                />
                <FormControlLabel
                  value={JenisKelamin.Perempuan}
                  control={<Radio />}
                  label="Perempuan"
                />
              </RadioGroup>
            </FormControl>
            <CustomTextField
              fullWidth
              label="Nomor Telepon"
              name="noTelp"
              value={formValues.noTelp}
              error={!!formErrors.noTelp}
              helperText={formErrors.noTelp}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, noTelp: e.target.value })
              }
            />
            <CustomTextField
              select
              fullWidth
              label="Jabatan"
              value={formValues.role}
              onChange={(e: { target: { value: string } }) =>
                handleInputChange("role", e.target.value)
              }
              sx={{ marginBottom: 2 }}
            >
              <MenuItem value={Jabatan.Admin}>Admin</MenuItem>
              <MenuItem value={Jabatan.Superadmin}>Superadmin</MenuItem>
              <MenuItem value={Jabatan.DivisiGeneralAffair}>
                Divisi General Affair
              </MenuItem>
              <MenuItem value={Jabatan.FinanceAccounting}>
                Finance & Accounting
              </MenuItem>
              <MenuItem value={Jabatan.Marketing}>Marketing</MenuItem>
            </CustomTextField>
            <CustomTextField
              fullWidth
              label="Penempatan"
              name="penempatan"
              value={formValues.penempatan}
              error={!!formErrors.penempatan}
              helperText={formErrors.penempatan}
              sx={{ marginBottom: 2 }}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, penempatan: e.target.value })
              }
            />
            <CustomTextField
              fullWidth
              label="Alamat Cabang"
              name="alamatCabang"
              value={formValues.alamatCabang}
              error={!!formErrors.alamatCabang}
              helperText={formErrors.alamatCabang}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, alamatCabang: e.target.value })
              }
              multiline
              rows={4}
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
