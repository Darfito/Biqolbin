import * as React from "react";
import {
  object,
  string,
  minLength,
  pipe,
  nonEmpty,
  optional,
} from "valibot";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import MenuItem from "@mui/material/MenuItem";
import CustomTextField from "../../components/forms/theme-elements/CustomTextField";

// Valibot Schema
const formSchema = object({
  nama: pipe(
    string(),
    nonEmpty("Nama harus diisi") // Validator untuk memastikan nama tidak kosong
  ),
  metodePembayaran: pipe(
    string(),
    minLength(1, "Pilih metode pembayaran") // Validator untuk memastikan metode pembayaran dipilih
  ),
  jumlahTagihan: pipe(
    string(),
    nonEmpty("Jumlah tagihan harus diisi"),
    // Validator to check if the input is a valid number and greater than 0
    (value) => {
      if (isNaN(Number(value)) || Number(value) <= 0) {
        return "Jumlah tagihan harus lebih dari 0";
      }
      return undefined;
    }
  ),
  uangMuka: pipe(
    string(),
    nonEmpty("Uang muka harus diisi"),
    (value) => {
      if (isNaN(Number(value)) || Number(value) < 0) {
        return "Uang muka harus lebih dari 0";
      }
      return undefined;
    }
  ),
  banyaknyaAngsuran: optional(
    pipe(
      string(),
      (value) => {
        if (value && (isNaN(Number(value)) || Number(value) <= 0)) {
          return "Banyaknya angsuran harus lebih dari 0";
        }
        return undefined;
      }
    )
  ),
  jumlahBiayaPerAngsuran: optional(string()),
});

export default function FormKeuangan() {
  const [open, setOpen] = React.useState(false);
  const [metode, setMetode] = React.useState<string>("");

  const [formValues, setFormValues] = React.useState({
    nama: "",
    metodePembayaran: "",
    jumlahTagihan: "",
    uangMuka: "",
    banyaknyaAngsuran: "",
    jumlahBiayaPerAngsuran: "",
  });
  const [formErrors, setFormErrors] = React.useState<any>({});

  // Handle metode pembayaran selection
  const handleMetodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetode(event.target.value);
    setFormValues({ ...formValues, metodePembayaran: event.target.value });

    // Reset installment values if method is not "Cicilan"
    if (event.target.value !== "Cicilan") {
      setFormValues({
        ...formValues,
        banyaknyaAngsuran: "",
        jumlahBiayaPerAngsuran: "",
      });
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate the form values manually
    const result = formSchema.validate(formValues);

    if (result.errors) {
      setFormErrors(result.errors);
      console.error("Validation errors:", result.errors);
      return;
    }

    console.log("Form submitted:", formValues);
    handleClose();
  };

  // Calculate installment (angsuran) if "Cicilan" is selected
  const calculateAngsuran = () => {
    if (metode === "Cicilan" && formValues.jumlahTagihan && formValues.uangMuka && formValues.banyaknyaAngsuran) {
      const jumlahAngsuran =
        (Number(formValues.jumlahTagihan) - Number(formValues.uangMuka)) /
        Number(formValues.banyaknyaAngsuran);
  
      // Round the installment amount to 2 decimal places
      const roundedAngsuran = Math.round(jumlahAngsuran); // You can adjust decimal places here if needed (e.g., .toFixed(2))
      setFormValues({ ...formValues, jumlahBiayaPerAngsuran: roundedAngsuran.toString() });
    }
  };

  React.useEffect(() => {
    calculateAngsuran();
  }, [
    formValues.jumlahTagihan,
    formValues.uangMuka,
    formValues.banyaknyaAngsuran,
  ]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <>
      <Button
        sx={{ color: "#fff" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        Tambah
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
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
              error={formErrors.nama}
              onChange={(e: { target: { value: any } }) =>
                setFormValues({ ...formValues, nama: e.target.value })
              }
            />

            <CustomTextField
              select
              fullWidth
              label="Metode Pembayaran"
              value={metode}
              onChange={handleMetodeChange}
              error={formErrors.metodePembayaran}
            >
              <MenuItem value="Tunai">Tunai</MenuItem>
              <MenuItem value="Tabungan">Tabungan</MenuItem>
              <MenuItem value="Cicilan">Cicilan</MenuItem>
            </CustomTextField>

            <CustomTextField
              fullWidth
              label="Jumlah Tagihan (Rupiah)"
              value={formValues.jumlahTagihan}
              error={formErrors.jumlahTagihan}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  jumlahTagihan: e.target.value,
                })
              }
            />

            <CustomTextField
              fullWidth
              label="Uang Muka (Rupiah)"
              value={formValues.uangMuka}
              error={formErrors.uangMuka}
              onChange={(e: { target: { value: string } }) =>
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
                  select
                  label="Banyaknya Angsuran"
                  value={formValues.banyaknyaAngsuran}
                  error={formErrors.banyaknyaAngsuran}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      banyaknyaAngsuran: e.target.value,
                    })
                  }
                >
                  <MenuItem value="3">3</MenuItem>
                  <MenuItem value="6">6</MenuItem>
                </CustomTextField>

                <CustomTextField
                  label="Jumlah Biaya per Angsuran (Rupiah)"
                  type="text"
                  value={formValues.jumlahBiayaPerAngsuran}
                  disabled
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button
              sx={{ color: "#fff" }}
              variant="contained"
              onClick={handleClose}
            >
              Batal
            </Button>
            <Button sx={{ color: "#fff" }} variant="contained" type="submit">
              Tambah
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
