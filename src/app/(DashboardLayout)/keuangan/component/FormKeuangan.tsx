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
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface FormErrors {
  nama?: string;
  jenisPaket?: string;
  metodePembayaran?: string;
  tenggatPembayaran?: string;
  totalTagihan?: string;
  uangMuka?: string;
  banyaknyaAngsuran?: string;
  jumlahBiayaPerAngsuran?: string;
}

// Valibot Schema
const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  jenisPaket: v.pipe(v.string(), v.nonEmpty("Pilih jenis paket")),
  metodePembayaran: v.pipe(v.string(), v.nonEmpty("Pilih metode pembayaran")),
  tenggatPembayaran: v.pipe(
    v.string(),
    v.nonEmpty("Tenggat pembayaran harus diisi") // Validasi
  ),
  totalTagihan: v.pipe(
    v.string(),
    v.nonEmpty("Total Tagihan harus diisi"),
    v.transform(Number),
    v.minValue(1, "Total Tagihan harus lebih dari 0")
  ),
  uangMuka: v.pipe(
    v.string(),
    v.nonEmpty("Uang muka harus diisi"),
    v.transform(Number),
    v.minValue(0, "Uang muka harus lebih dari atau sama dengan 0")
  ),
  banyaknyaAngsuran: v.optional(v.string()),
  jumlahBiayaPerAngsuran: v.optional(v.string()),
});

export default function FormKeuangan() {
  const [open, setOpen] = useState(false);
  const [metode, setMetode] = useState<string>("");
  const [jenisPaket, setJenisPaket] = useState<string>("");

  const [formValues, setFormValues] = useState({
    nama: "",
    jenisPaket: "",
    metodePembayaran: "",
    tenggatPembayaran: "",
    totalTagihan: "",
    uangMuka: "",
    banyaknyaAngsuran: "",
    jumlahBiayaPerAngsuran: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Handle metode pembayaran selection
  const handleMetodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMetode(event.target.value);
    setFormValues({ ...formValues, metodePembayaran: event.target.value });

    // Reset installment values if method is not "Cicilan"
    if (event.target.value !== "Cicilan") {
      setFormValues((prev) => ({
        ...prev,
        metodePembayaran: event.target.value,
        banyaknyaAngsuran: "",
        jumlahBiayaPerAngsuran: "",
      }));
    } else {
      setFormValues((prev) => ({
        ...prev,
        metodePembayaran: event.target.value,
      }));
    }
  };

  const handleJenisPaketChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setJenisPaket(event.target.value);
    setFormValues({ ...formValues, jenisPaket: event.target.value });
  };

  // Handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({}); // Clear previous errors

    console.log("Form submitting with values:", formValues);

    // Special handling based on payment method
    const methodErrors: FormErrors = {};

    // Validate metodePembayaran
    if (!formValues.metodePembayaran) {
      methodErrors.metodePembayaran = "Pilih metode pembayaran";
    }

    // Specific validations for Cicilan method
    if (formValues.metodePembayaran === "Cicilan") {
      if (!formValues.banyaknyaAngsuran) {
        methodErrors.banyaknyaAngsuran = "Banyaknya angsuran harus dipilih";
      }
    } else {
      // Clear installment-related fields for non-Cicilan methods
      setFormValues((prev) => ({
        ...prev,
        banyaknyaAngsuran: "",
        jumlahBiayaPerAngsuran: "",
      }));
    }

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
        const path = issue.path?.[0]?.key as keyof FormErrors | undefined;
        if (path) {
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

  // Calculate installment (angsuran) if "Cicilan" is selected
  const calculateAngsuran = () => {
    if (
      metode === "Cicilan" &&
      formValues.totalTagihan &&
      formValues.uangMuka &&
      formValues.banyaknyaAngsuran
    ) {
      const jumlahAngsuran =
        (Number(formValues.totalTagihan) - Number(formValues.uangMuka)) /
        Number(formValues.banyaknyaAngsuran);

      // Round the installment amount to whole number
      const roundedAngsuran = Math.round(jumlahAngsuran);
      setFormValues({
        ...formValues,
        jumlahBiayaPerAngsuran: roundedAngsuran.toString(),
      });
    }
  };

  useEffect(() => {
    calculateAngsuran();
  }, [
    formValues.totalTagihan,
    formValues.uangMuka,
    formValues.banyaknyaAngsuran,
  ]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      nama: "",
      jenisPaket: "",
      metodePembayaran: "",
      tenggatPembayaran: "",
      totalTagihan: "",
      uangMuka: "",
      banyaknyaAngsuran: "",
      jumlahBiayaPerAngsuran: "",
    });

    // Reset method selection
    setMetode("");
    setJenisPaket("");

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
          <DialogTitle>Tambah Item Pembayaran</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              gap: "1rem",
            }}
          >
            <DialogContentText>Masukkan detail pembayaran.</DialogContentText>

            <CustomTextField
              fullWidth
              label="Nama Lengkap"
              name="nama"
              value={formValues.nama}
              error={!!formErrors.nama}
              helperText={formErrors.nama}
              onChange={(e: { target: { value: any } }) =>
                setFormValues({ ...formValues, nama: e.target.value })
              }
            />

            <CustomTextField
              select
              fullWidth
              label="Jenis Paket"
              value={jenisPaket}
              onChange={handleJenisPaketChange}
              error={formErrors.jenisPaket}
            >
              <MenuItem value="Paket Regular 1">Paket Regular 1</MenuItem>
              <MenuItem value="Paket Regular 2">Paket Regular 2</MenuItem>
              <MenuItem value="Paket VIP 1">Paket VIP 1</MenuItem>
            </CustomTextField>

            <CustomTextField
              select
              fullWidth
              label="Metode Pembayaran"
              value={metode}
              onChange={handleMetodeChange}
              error={!!formErrors.metodePembayaran}
              helperText={formErrors.metodePembayaran}
            >
              <MenuItem value="Tunai">Tunai</MenuItem>
              <MenuItem value="Tabungan">Tabungan</MenuItem>
              <MenuItem value="Cicilan">Cicilan</MenuItem>
            </CustomTextField>

            <CustomTextField
              fullWidth
              label="Tenggat Pembayaran"
              type="date"
              name="tenggatPembayaran"
              InputLabelProps={{
                shrink: true,
              }}
              value={formValues.tenggatPembayaran}
              error={!!formErrors.tenggatPembayaran}
              helperText={formErrors.tenggatPembayaran}
              onChange={(e: { target: { value: any } }) =>
                setFormValues({
                  ...formValues,
                  tenggatPembayaran: e.target.value,
                })
              }
            />

            <CustomTextField
              fullWidth
              label="Total Tagihan"
              name="totalTagihan"
              value={formValues.totalTagihan}
              error={!!formErrors.totalTagihan}
              helperText={formErrors.totalTagihan}
              onChange={(e: { target: { value: any } }) =>
                setFormValues({
                  ...formValues,
                  totalTagihan: e.target.value,
                })
              }
            />

            <CustomTextField
              fullWidth
              label="Uang Muka"
              name="uangMuka"
              value={formValues.uangMuka}
              error={!!formErrors.uangMuka}
              helperText={formErrors.uangMuka}
              onChange={(e: { target: { value: any } }) =>
                setFormValues({
                  ...formValues,
                  uangMuka: e.target.value,
                })
              }
            />

            {metode === "Cicilan" && (
              <>
                <CustomTextField
                  fullWidth
                  label="Banyaknya Angsuran"
                  name="banyaknyaAngsuran"
                  value={formValues.banyaknyaAngsuran}
                  error={!!formErrors.banyaknyaAngsuran}
                  helperText={formErrors.banyaknyaAngsuran}
                  onChange={(e: { target: { value: any } }) =>
                    setFormValues({
                      ...formValues,
                      banyaknyaAngsuran: e.target.value,
                    })
                  }
                />
                <CustomTextField
                  fullWidth
                  label="Jumlah Biaya Per Angsuran"
                  name="jumlahBiayaPerAngsuran"
                  value={formValues.jumlahBiayaPerAngsuran || ""}
                  error={!!formErrors.jumlahBiayaPerAngsuran}
                  helperText={formErrors.jumlahBiayaPerAngsuran}
                  disabled
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="error">Batal</Button>
            <Button type="submit" variant="contained" sx={{ color: "white" }}>
              Simpan
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
