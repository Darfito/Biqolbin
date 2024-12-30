import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  Jabatan,
  JenisKelamin,
  UserProps,
} from "@/app/(DashboardLayout)/utilities/type";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
} from "@mui/material";
import React, { useEffect, useState } from "react";

interface FormDetailProps {
  isEditing: boolean; // Status edit mode
  onSaveChanges: (data: UserProps) => void; // Kirim data ke parent
  userData?: UserProps | null;
}

const FormDetail = ({
  isEditing,
  onSaveChanges,
  userData,
}: FormDetailProps) => {
  const [formValues, setFormValues] = useState<UserProps>(
    userData || {
      id: 0,
      nama: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      noTelp: "",
      role: Jabatan.Marketing,
      penempatan: "",
      alamatCabang: "",
    }
  );

  useEffect(() => {
    if (userData) setFormValues(userData);
  }, [userData]);

  const handleInputChange = (field: keyof UserProps, value: any) => {
    setFormValues({ ...formValues, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveChanges(formValues);
  };

  return (
    <DashboardCard>
      <form onSubmit={handleSubmit}>
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
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
            </Grid>

            <Grid item xs={12} sm={6}>
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
              <CustomTextField
                fullWidth
                label="Penempatan"
                name="penempatan"
                value={formValues.penempatan}
                disabled={!isEditing}
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
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({ ...formValues, alamatCabang: e.target.value })
                }
                disabled={!isEditing}
                multiline
                rows={4}
              />
            </Grid>
          </Grid>
        </Box>
      </form>
    </DashboardCard>
  );
};

export default FormDetail;
