import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  CabangInterface,
  Jabatan,
  JenisKelamin,
  UserInterface,
} from "@/app/(DashboardLayout)/utilities/type";
import * as v from "valibot";
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { updateUserAction } from "../../action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

interface FormDetailProps {
  isEditing: boolean; // Status edit mode
  userData?: UserInterface | null;
  cabangData: CabangInterface[];
  role: string;
}

interface FormErrors {
  nama?: string;
  jenisKelamin?: string;
  noTelp?: string;
  role?: string;
  penempatan?: string;
  alamatCabang?: string;
}

const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  email: v.pipe(
    v.string(),
    v.email("Email tidak valid"),
    v.nonEmpty("Email harus diisi")
  ),
  jenisKelamin: v.pipe(v.string(), v.nonEmpty("Jenis Kelamin harus diisi")),
  // umur: v.number("Umur harus berupa angka dan tidak boleh kosong"),
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

const FormDetail = ({
  isEditing,
  userData,
  cabangData,
  role,
}: FormDetailProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formValues, setFormValues] = useState<UserInterface>(
    userData || {
      id: "",
      nama: "",
      email: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      noTelp: "",
      role: Jabatan.Marketing,
      penempatan: {
        id: 0,
        nama: "",
        alamatCabang: "",
      },
      password: "",
      confirmPassword: "",
      alamatCabang: "",
    }
  );

  useEffect(() => {
    if (userData) setFormValues(userData);
  }, [userData]);

  const handleInputChange = (field: keyof UserInterface, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleOpenModal = () => {
    if (!openModal) {
      setOpenModal(true); // Only open the modal if it's not already open
    }
  };

  // Close the confirmation modal
  const handleCloseModal = () => {
    if (openModal) {
      setOpenModal(false); // Close the modal if it's open
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log(formValues);

    // Validate form data
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

    const response = await updateUserAction(formValues);

    if (response.success) {
      toast.success("Data berhasil diperbarui"); // Show success toast
      handleCloseModal(); // Tutup dialog setelah selesai
    }
  };

  return (
    <DashboardCard>
      <form id="form-detail" onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Nama Pegawai"
                value={formValues.nama}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("nama", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
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
                label="Nomor Telepon Pegawai"
                value={formValues.noTelp}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("noTelp", e.target.value)
                }
                disabled={!isEditing}
                sx={{ marginBottom: 2 }}
              />
              <CustomTextField
                select
                fullWidth
                label="Jabatan"
                value={formValues.role}
                onChange={(e: { target: { value: string } }) =>
                  handleInputChange("role", e.target.value)
                }
                disabled={!isEditing}
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
            </Grid>

            <Grid item xs={12} sm={6}>
              <Autocomplete
                fullWidth
                options={cabangData}
                getOptionLabel={(option) => option.nama}
                disabled={role !== "Superadmin" ? true : !isEditing} // Kondisi untuk disabled
                value={
                  cabangData.find(
                    (cabang) => cabang.id === formValues.penempatan.id
                  ) || null
                }
                onChange={(event, newValue) => {
                  if (newValue) {
                    setFormValues({
                      ...formValues,
                      penempatan: newValue || ({} as CabangInterface),
                    });
                  } else {
                    setFormValues({
                      ...formValues,
                      penempatan: {} as CabangInterface,
                    });
                  }
                }}
                sx={{ marginBottom: 2 }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Cabang"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />
              <CustomTextField
                fullWidth
                label="Alamat Cabang"
                name="alamatCabang"
                value={formValues.alamatCabang}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({ ...formValues, alamatCabang: e.target.value })
                }
                disabled={role !== "Superadmin" ? true : !isEditing} // Kondisi untuk disabled
                multiline
                rows={4}
              />
            </Grid>
            {isEditing && (
              <Box
                sx={{ width: "100%", display: "flex", justifyContent: "end" }}
              >
                <Button
                  sx={{ color: "#fff", minWidth: "150px", marginLeft: "24px" }}
                  variant="contained"
                  onClick={handleOpenModal}
                >
                  Simpan
                </Button>
              </Box>
            )}
          </Grid>
        </Box>

        {/* Confirmation Modal */}
        <Dialog open={openModal} onClose={handleCloseModal}>
          <DialogTitle>Konfirmasi Perubahan</DialogTitle>
          <DialogContent>
            <Typography>
              Apakah Anda yakin ingin menyimpan perubahan ini?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleCloseModal}
              variant="contained"
              color="error"
            >
              Batal
            </Button>
            <Button
              form="form-detail"
              type="submit"
              variant="contained"
              sx={{ color: "white" }}
            >
              Simpan Perubahan
            </Button>
          </DialogActions>
        </Dialog>
      </form>
    </DashboardCard>
  );
};

export default FormDetail;
