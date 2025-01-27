import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import {
  CabangInterface,
  UserInterface,
} from "@/app/(DashboardLayout)/utilities/type";
import * as v from "valibot";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { updateCabangAction } from "../../action";

interface FormDetailProps {
  isEditing: boolean; // Status edit mode
  cabangData?: CabangInterface | null;
  role: string;
}

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

const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  alamatCabang: v.pipe(v.string(), v.nonEmpty("Alamat Cabang harus diisi")),
  cabang_lat: v.number(),
  cabang_long: v.number(),
});

const FormDetail = ({ isEditing, cabangData, role }: FormDetailProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formValues, setFormValues] = useState<CabangInterface>(
    cabangData || {
      nama: "",
      alamatCabang: "",
      cabang_lat: 0,
      cabang_long: 0,
    }
  );

  useEffect(() => {
    if (cabangData) setFormValues(cabangData);
  }, [cabangData]);

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

    const response = await updateCabangAction(formValues);

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
                label="Nama Cabang"
                name="nama"
                value={formValues.nama}
                error={!!formErrors.nama}
                helperText={formErrors.nama}
                sx={{ marginBottom: 2 }}
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
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({ ...formValues, alamatCabang: e.target.value })
                }
                multiline
                rows={4}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <CustomTextField
                fullWidth
                label="Koordinat Latitude"
                name="cabang_lat"
                value={formValues.cabang_lat}
                error={!!formErrors.cabang_lat}
                sx={{ marginBottom: 2 }}
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
                onChange={(e: { target: { value: number } }) =>
                  setFormValues({ ...formValues, cabang_long: e.target.value })
                }
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
