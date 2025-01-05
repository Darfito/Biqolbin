import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { showToast } from "@/app/(DashboardLayout)/utilities/component/toast/Toast";
import { CicilanType } from "@/app/(DashboardLayout)/utilities/type";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { FormEvent, useEffect, useState } from "react";
import * as v from "valibot";

interface FormErrors {
  cicilanKe?: string;
  tanggalBayar?: string;
  nominalCicilan?: string;
}

const formSchema = v.object({
  cicilanKe: v.pipe(
    v.number(),
    v.transform(Number),
    v.minValue(1, "Cicilan keberapa harus lebih dari 0")
  ),
  tanggalBayar: v.pipe(
    v.string(),
    v.nonEmpty("Tenggat pembayaran harus diisi") // Validasi
  ),
  nominalCicilan: v.pipe(
    v.number(),
    v.transform(Number),
    v.minValue(10000, "Jumlah cicilan harus lebih dari 0")
  ),
});

interface FormCicilanProps {
  open: boolean;
  handleClose: () => void;
  initialData?: CicilanType | null;
  currentCicilanKe?: number;
}

const FormCicilan= ({
  open,
  handleClose,
  initialData,
  currentCicilanKe,
}:FormCicilanProps) => {
  console.log("initialData cicilan:", initialData);
  console.log("cicilan ke:", currentCicilanKe);

  const [formValues, setFormValues] = useState({
    cicilanKe: 0,
    tanggalBayar: "",
    nominalCicilan: 0,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Reset form values when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormValues({
        cicilanKe: initialData.cicilanKe || 0,
        tanggalBayar: initialData.tanggalPembayaran
          ? new Date(initialData.tanggalPembayaran).toISOString().split("T")[0]
          : "",
        nominalCicilan: initialData.nominalCicilan || 0,
      });
    } else {
      setFormValues({
        cicilanKe: currentCicilanKe || 0,
        tanggalBayar: "",
        nominalCicilan: 0,
      });
    }
  }, [initialData]);

  // Handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Parse and validate form values
    const parsedValues = {
      cicilanKe: Number(formValues.cicilanKe),
      tanggalBayar: formValues.tanggalBayar,
      nominalCicilan: Number(formValues.nominalCicilan),
    };

    const result = v.safeParse(formSchema, parsedValues);

    if (!result.success) {
      const errorMap: FormErrors = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as keyof FormErrors | undefined;
        if (path) {
          errorMap[path] = issue.message;
        }
      });

      setFormErrors(errorMap);
      console.error("Validation errors:", errorMap);
      return;
    }

    // If validation passes, log form values
    console.log("Form submitted successfully:", parsedValues);
    // If validation passes
    if (initialData) {
      console.log("Update Cicilan:", parsedValues); // Log update for now
    } else {
      console.log("Add New Cicilan:", parsedValues); // Log addition for now
    }

    // Close the dialog
    handleClose();
    showToast("Form berhasil disimpan", "success");
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {initialData ? "Edit Cicilan" : "Tambah Cicilan"}
          </DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              gap: "1rem",
            }}
          >
            <DialogContentText>
              {initialData
                ? "Perbarui detail cicilan yang dipilih."
                : "Masukkan detail cicilan baru."}
            </DialogContentText>

            <CustomTextField
              fullWidth
              disabled
              label="Cicilan Ke"
              name="cicilanKe"
              value={formValues.cicilanKe}
              error={!!formErrors.cicilanKe}
              helperText={formErrors.cicilanKe}
              onChange={(e: { target: { value: number } }) => {
                setFormValues({
                  ...formValues,
                  cicilanKe: Number(e.target.value),
                });
              }}
            />

            <CustomTextField
              fullWidth
              label="Tanggal Bayar"
              name="tanggalBayar"
              type="date"
              value={formValues.tanggalBayar}
              error={!!formErrors.tanggalBayar}
              helperText={formErrors.tanggalBayar}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, tanggalBayar: e.target.value })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <CustomTextField
              fullWidth
              label="Nominal Cicilan"
              name="nominalCicilan"
              value={formValues.nominalCicilan}
              error={!!formErrors.nominalCicilan}
              helperText={formErrors.nominalCicilan}
              onChange={(e: { target: { value: number } }) => {
                setFormValues({
                  ...formValues,
                  nominalCicilan: Number(e.target.value),
                });
              }}
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
};

export default FormCicilan;
