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
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Jabatan, JenisKelamin, UserInterface } from "../../utilities/type";
import { ChangeEvent, FormEvent, useState } from "react";
import { createUserAction } from "../action";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { signup } from "@/app/authentication/login/action";

interface FormErrors {
  nama?: string;
  jenisKelamin?: string;
  noTelp?: string;
  role?: string;
  penempatan?: string;
  alamatCabang?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

type FormType = {
  email: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  noTelp: string;
  role: Jabatan;
  penempatan: string;
  alamatCabang: string;
  password: string;
  confirmPassword?: string;
}

// Valibot Schema
const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  email: v.pipe(v.string(), v.email("Email tidak valid"), v.nonEmpty("Email harus diisi")),
  jenisKelamin: v.pipe(v.string(), v.nonEmpty("Jenis Kelamin harus diisi")),
  noTelp: v.pipe(v.string(), v.nonEmpty("Nomor Telepon harus diisi")),
  role: v.pipe(v.string(), v.nonEmpty("Role harus diisi")),
  penempatan: v.pipe(v.string(), v.nonEmpty("Penempatan harus diisi")),
  alamatCabang: v.pipe(v.string(), v.nonEmpty("Alamat Cabang harus diisi")),
  password: v.pipe(
    v.string(),
    v.minLength(8, "Password minimal 8 karakter"),
    v.nonEmpty("Password harus diisi")
  ),
});

export default function FormUser() {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState<FormType>({
    nama: "",
    email: "",
    jenisKelamin: JenisKelamin.LakiLaki,
    noTelp: "",
    role: Jabatan.Marketing,
    penempatan: "",
    password: "",
    confirmPassword: "",
    alamatCabang: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false); // State untuk visibilitas password
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State untuk visibilitas confirm password

  const handleInputChange = (field: keyof UserInterface, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Validasi password dan confirmPassword
    if (formValues.password !== formValues.confirmPassword) {
      toast.error("Password dan Confirm Password tidak cocok!");
      return;
    }
  

  
    // // Lakukan signup (mendaftarkan user di Supabase Auth)
    // const signupResponse = await signup({ email: formValues.email, password });
  

      // Jika signup berhasil, masukkan data ke tabel `User` tanpa `confirmPassword`
      // const userData = { ...userDetails, email: formValues.email }; // Menggabungkan data user tanpa password dan confirmPassword
      // const { confirmPassword, jenisKelamin, ...rest } = formValues;
      // const userData = {
      //   ...rest,
      //   jenisKelamin: jenisKelamin === "Laki-laki" ? JenisKelamin.LakiLaki : JenisKelamin.Perempuan,
      // };
      const userInsertResponse = await createUserAction(formValues);
  
      if (userInsertResponse.success) {
        toast.success("User berhasil ditambahkan!");
        handleClose();
      } else {
        toast.error(`Gagal menambahkan user: ${userInsertResponse.error}`);
      }

  };
  
  


  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      nama: "",
      email: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      noTelp: "",
      role: Jabatan.Marketing,
      penempatan: "",
      alamatCabang: "",
      password: "",
      confirmPassword: "",
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

<CustomTextField
              fullWidth
              label="Email"
              name="email"
              value={formValues.email}
              error={!!formErrors.email}
              helperText={formErrors.email}
              onChange={(e: { target: { value: string } }) => setFormValues({ ...formValues, email: e.target.value })}
            />

<CustomTextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formValues.password}
              error={!!formErrors.password}
              helperText={formErrors.password}
              onChange={(e: { target: { value: string } }) => setFormValues({ ...formValues, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <CustomTextField
              fullWidth
              label="Konfirmasi Password"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formValues.confirmPassword}
              error={!!formErrors.confirmPassword}
              helperText={formErrors.confirmPassword}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, confirmPassword: e.target.value })
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
              <FormLabel component="legend">Jenis Kelamin</FormLabel>
              <RadioGroup
                value={formValues.jenisKelamin}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
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
