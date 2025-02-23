"use client";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { CicilanType } from "@/app/(DashboardLayout)/utilities/type";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
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
import { createCicilanAction, updateCicilanAction } from "../../action";

interface FormErrors {
  cicilanKe?: string;
  tanggalPembayaran?: string;
  nominalCicilan?: string;
}

type FormType = {
  id?: number;
  keuangan_id: number;
  cicilanKe: number;
  tanggalPembayaran: string;
  nominalCicilan: number;
};

const formSchema = v.object({
  cicilanKe: v.pipe(
    v.number(),
    v.transform(Number),
    v.minValue(1, "Cicilan keberapa harus lebih dari 0")
  ),
  tanggalPembayaran: v.pipe(
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
  keuanganId?: number;
}

const FormCicilan = ({
  open,
  handleClose,
  initialData,
  currentCicilanKe,
  keuanganId,
}: FormCicilanProps) => {
  console.log("initialData cicilan:", initialData);
  console.log("cicilan ke:", currentCicilanKe);

  const [formValues, setFormValues] = useState<FormType>({
    id: 0,
    keuangan_id: keuanganId || 0,
    cicilanKe: 0,
    tanggalPembayaran: "",
    nominalCicilan: 0,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Reset form values when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormValues({
        id: initialData.id || 0,
        keuangan_id: initialData.keuangan_id || 0,
        cicilanKe: initialData.cicilanKe || 0,
        tanggalPembayaran: initialData.tanggalPembayaran || "",
        nominalCicilan: initialData.nominalCicilan || 0,
      });
    } else {
      setFormValues({
        keuangan_id: keuanganId || 0,
        cicilanKe: currentCicilanKe || 0,
        tanggalPembayaran: "",
        nominalCicilan: 0,
      });
    }
  }, [currentCicilanKe, initialData, keuanganId]);

  const formatRupiah = (angka: number): string => {
    return angka.toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
  };

  const handleChangeHarga = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // Menghapus non-numeric characters (selain angka)

    setFormValues((prevValues) => ({
      ...prevValues,
      [type]: value === "" ? 0 : Number(value),
    }));
  };
  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    // Validasi data form
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
  
    try {
      // Tentukan apakah ini operasi create atau update berdasarkan ada/tidaknya id
      let response;
      if (formValues.id) {
        response = await updateCicilanAction(formValues);
      } else {
        response = await createCicilanAction(formValues);
      }
  
      if (response.success) {
        toast.success(
          formValues.id
            ? "Cicilan berhasil diperbarui!"
            : "Cicilan berhasil ditambahkan!"
        );
        handleClose(); // Tutup dialog setelah berhasil
        setTimeout(() => {
          window.location.reload();
        }, 100);
      } else {
        toast.error(
          `Gagal ${
            formValues.id ? "memperbarui" : "menambahkan"
          } cicilan: ${response.error}`
        );
      }
    } catch (error: any) {
      console.error("Unexpected error:", error);
      toast.error("Terjadi kesalahan saat memproses form.");
    }
  };
  

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {initialData?.nominalCicilan !== 0 ? "Edit Cicilan" : "Tambah Cicilan"}
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
              required
              onChange={(e: { target: { value: number } }) => {
                setFormValues({
                  ...formValues,
                  cicilanKe: Number(e.target.value),
                });
              }}
            />

            <CustomTextField
              fullWidth
              label="Tanggal Pembayaran"
              name="tanggalPembayaran"
              type="date"
              value={formValues.tanggalPembayaran}
              error={!!formErrors.tanggalPembayaran}
              helperText={formErrors.tanggalPembayaran}
              required
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  tanggalPembayaran: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true,
              }}
            />

            <CustomTextField
              fullWidth
              label="Nominal Cicilan"
              name="nominalCicilan"
              value={formatRupiah(formValues.nominalCicilan)}
              error={!!formErrors.nominalCicilan}
              helperText={formErrors.nominalCicilan}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                handleChangeHarga(e, "nominalCicilan");
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
