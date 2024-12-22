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
  JenisKelamin,
  KontakDaruratRelation,
  KontakDaruratType,
  TipeKamar,
} from "../../utilities/type";
import { Grid, FormControlLabel, Checkbox } from "@mui/material";
import { KontakDaruratSection } from "./KontakDaruratHandler";
import { PaketData } from "../data";

interface FormErrors {
  id?: string;
  nama?: string;
  ayahKandung?: string;
  noTelp?: string;
  kontakDarurat?: string;
  email?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  perkawinan?: string;
  alamat?: string;
  varianKamar?: string;
  kewarganegaraan?: string;
  pekerjaan?: string;
  kursiRoda?: string;
  riwayatPenyakit?: string;
  jenisDokumen?: string[];
  jenisPaket?: string;
  berangkat?: string;
  selesai?: string;
  status?: string;
}

// Valibot Schema
const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  ayahKandung: v.pipe(v.string(), v.nonEmpty("Nama Ayah Kandung harus diisi")),
  noTelp: v.pipe(v.string(), v.nonEmpty("No Telp harus diisi")),
  kontakDarurat: v.array(
    v.object({
      id: v.number(),
      nama: v.string(),
      noTelp: v.string(),
      hubungan: v.string(),
      relasiLain: v.optional(v.string()),
    })
  ),
  email: v.pipe(v.string(), v.nonEmpty("Email harus diisi")),
  jenisKelamin: v.pipe(v.string(), v.nonEmpty("Jenis Kelamin harus diisi")),
  tempatLahir: v.pipe(v.string(), v.nonEmpty("Tempat Lahir harus diisi")),
  perkawinan: v.boolean(),
  alamat: v.pipe(v.string(), v.nonEmpty("Alamat harus diisi")),
  varianKamar: v.pipe(v.string(), v.nonEmpty("Varian Kamar harus diisi")),
  kewarganegaraan: v.boolean(),
  pekerjaan: v.pipe(v.string(), v.nonEmpty("Pekerjaan harus diisi")),
  kursiRoda: v.boolean(),
  riwayatPenyakit: v.pipe(
    v.string(),
    v.nonEmpty("Riwayat Penyakit harus diisi")
  ),
  jenisDokumen: v.array(v.string()),
  jenisPaket: v.object({
    id: v.number(),
    nama: v.string(),
    harga: v.number(),
    berangkat: v.date(),
    selesai: v.date(),
    status: v.string(),
  }),
  berangkat: v.date(),
  selesai: v.date(),
  status: v.string(),
});

export default function FormJamaah() {
  const [open, setOpen] = React.useState(false);
  const [jenisKelamin, setJenisKelamin] = React.useState<string>("");

  const [formValues, setFormValues] = React.useState({
    nama: "",
    ayahKandung: "",
    noTelp: "",
    kontakDarurat: [
      { id: 0, nama: "", noTelp: "", hubungan: KontakDaruratRelation.Lainnya },
    ],
    email: "",
    jenisKelamin: JenisKelamin.LakiLaki,
    tempatLahir: "",
    perkawinan: false,
    alamat: "",
    varianKamar: {
      id: 0,
      tipeKamar: TipeKamar.QUAD,
      harga: 0,
      deskripsi: "",
    },
    kewarganegaraan: true,
    pekerjaan: "",
    kursiRoda: false,
    riwayatPenyakit: "",
    jenisDokumen: [],
    jenisPaket: {
      id: "0",
      nama: "",
      jenis: "REGULAR",
      maskapai: "",
      jenisPenerbangan: "DIRECT",
      keretaCepat: false,
      harga: 0,
      tglKeberangkatan: "",
      tglKepulangan: "",
      fasilitas: [],
    },
    berangkat: "",
    selesai: "",
    status: { id: 0, status: "Dijadwalkan" },
  });
  const [formErrors, setFormErrors] = React.useState<FormErrors>({});

  const handleJenisKelaminChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setJenisKelamin(event.target.value as JenisKelamin);
    setFormValues({
      ...formValues,
      jenisKelamin: event.target.value as JenisKelamin,
    });
  };

  const handleContactChange = (
    index: number,
    field: keyof KontakDaruratType,
    value: string
  ) => {
    const updatedContacts = [...formValues.kontakDarurat];
    updatedContacts[index] = { ...updatedContacts[index], [field]: value };
    setFormValues({ ...formValues, kontakDarurat: updatedContacts });
  };

  const handleAddContact = () => {
    setFormValues((prev) => ({
      ...prev,
      kontakDarurat: [
        ...prev.kontakDarurat,
        {
          id: prev.kontakDarurat.length,
          nama: "",
          noTelp: "",
          hubungan: KontakDaruratRelation.Lainnya,
        },
      ],
    }));
  };

  const handleRemoveContact = (indexToRemove: number) => {
    // Prevent removing the last contact
    if (formValues.kontakDarurat.length > 1) {
      setFormValues((prev) => ({
        ...prev,
        kontakDarurat: prev.kontakDarurat.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    }
  };

  const handleJenisPaketChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const selectedPaket = PaketData.find(
      (paket) => paket.id === event.target.value
    );
    if (selectedPaket) {
      setFormValues((prevValues) => ({
        ...prevValues,
        jenisPaket: selectedPaket,
        berangkat: selectedPaket.tglKeberangkatan,
        selesai: selectedPaket.tglKepulangan,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormErrors({}); // Clear previous errors

    console.log("Form submitting with values:", formValues);

    // Validate the form values
    const result = v.safeParse(formSchema, formValues);

    if (!result.success) {
      const errorMap: FormErrors = {};

      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as keyof FormErrors | undefined;
        if (path) {
          if (path === "jenisDokumen") {
            // Jika error untuk jenisDokumen, simpan dalam array
            if (!errorMap.jenisDokumen) {
              errorMap.jenisDokumen = [];
            }
            errorMap.jenisDokumen.push(issue.message);
          } else {
            // Jika field lain, langsung simpan pesan kesalahan
            errorMap[path] = issue.message;
          }
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

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      nama: "",
      ayahKandung: "",
      noTelp: "",
      kontakDarurat: [
        {
          id: 0,
          nama: "",
          noTelp: "",
          hubungan: KontakDaruratRelation.Lainnya,
        },
      ],
      email: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      tempatLahir: "",
      perkawinan: false,
      alamat: "",
      varianKamar: {
        id: 0,
        tipeKamar: TipeKamar.QUAD,
        harga: 0,
        deskripsi: "",
      },
      kewarganegaraan: true,
      pekerjaan: "",
      kursiRoda: false,
      riwayatPenyakit: "",
      jenisDokumen: [],
      jenisPaket: {
        id: "0",
        nama: "",
        jenis: "REGULAR",
        maskapai: "",
        jenisPenerbangan: "DIRECT",
        keretaCepat: false,
        harga: 0,
        tglKeberangkatan: "",
        tglKepulangan: "",
        fasilitas: [],
      },
      berangkat: "",
      selesai: "",
      status: { id: 0, status: "Dijadwalkan" },
    });
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
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>Tambah Item Jamaah</DialogTitle>
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "start",
              width: "100%",
              gap: "1rem",
            }}
          >
            <DialogContentText>Masukkan detail Jamaah.</DialogContentText>

            <Grid container spacing={3}>
              {/* Kolom Kiri */}
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  fullWidth
                  label="Nama Jamaah"
                  value={formValues.nama}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, nama: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  fullWidth
                  label="Nama Ayah Kandung"
                  value={formValues.ayahKandung}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      ayahKandung: e.target.value,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  fullWidth
                  label="No Telepon"
                  value={formValues.noTelp}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, noTelp: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  select
                  fullWidth
                  label="Jenis Kelamin"
                  value={formValues.jenisKelamin}
                  onChange={handleJenisKelaminChange}
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value={JenisKelamin.LakiLaki}>Laki-Laki</MenuItem>
                  <MenuItem value={JenisKelamin.Perempuan}>Perempuan</MenuItem>
                </CustomTextField>
                <CustomTextField
                  fullWidth
                  label="Tempat Lahir"
                  value={formValues.tempatLahir}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      tempatLahir: e.target.value,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  fullWidth
                  label="Email"
                  value={formValues.email}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  select
                  fullWidth
                  label="Status Perkawinan"
                  value={
                    formValues.perkawinan ? "Sudah Menikah" : "Belum Menikah"
                  }
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      perkawinan: e.target.value === "Sudah Menikah",
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="Sudah Menikah">Sudah Menikah</MenuItem>
                  <MenuItem value="Belum Menikah">Belum Menikah</MenuItem>
                </CustomTextField>
                <CustomTextField
                  fullWidth
                  label="Alamat"
                  value={formValues.alamat}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, alamat: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  select
                  fullWidth
                  label="Kewarganegaraan"
                  value={formValues.kewarganegaraan ? "WNI" : "WNA"}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      kewarganegaraan: e.target.value === "WNI",
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value="WNI">WNI</MenuItem>
                  <MenuItem value="WNA">WNA</MenuItem>
                </CustomTextField>
              </Grid>

              {/* Kolom Kanan */}
              <Grid item xs={12} sm={6}>
                <CustomTextField
                  select
                  fullWidth
                  label="Varian Kamar"
                  value={formValues.varianKamar?.tipeKamar}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      varianKamar: {
                        ...formValues.varianKamar,
                        tipeKamar: e.target.value as TipeKamar, // Convert to TipeKamar
                      },
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value={TipeKamar.QUAD}>QUAD</MenuItem>
                  <MenuItem value={TipeKamar.TRIPLE}>TRIPLE</MenuItem>
                  <MenuItem value={TipeKamar.DOUBLE}>DOUBLE</MenuItem>
                  <MenuItem value={TipeKamar.CHILD}>CHILD</MenuItem>
                  <MenuItem value={TipeKamar.INFANT}>INFANT</MenuItem>
                </CustomTextField>

                <CustomTextField
                  fullWidth
                  label="Pekerjaan"
                  value={formValues.pekerjaan}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, pekerjaan: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formValues.kursiRoda}
                      onChange={(e) =>
                        setFormValues({
                          ...formValues,
                          kursiRoda: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Butuh Kursi Roda"
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  fullWidth
                  label="Riwayat Penyakit"
                  value={formValues.riwayatPenyakit}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      riwayatPenyakit: e.target.value,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />

                {/* Jenis Paket */}
                <CustomTextField
                  select
                  fullWidth
                  label="Jenis Paket"
                  value={formValues.jenisPaket.id}
                  onChange={handleJenisPaketChange}
                  sx={{ marginBottom: 2 }}
                >
                  {PaketData.map((paket) => (
                    <MenuItem key={paket.id} value={paket.id}>
                      {paket.nama}
                    </MenuItem>
                  ))}
                </CustomTextField>

                {/* Tanggal Berangkat */}
                <CustomTextField
                  fullWidth
                  label="Tanggal Berangkat"
                  type="date"
                  value={formValues.berangkat} // Format date untuk input type="date"
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      berangkat: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true, // Memastikan label selalu berada di atas
                  }}
                  sx={{ marginBottom: 2 }}
                />

                {/* Tanggal Selesai */}
                <CustomTextField
                  fullWidth
                  label="Tanggal Selesai"
                  type="date"
                  value={formValues.selesai} // Format date untuk input type="date"
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      selesai: e.target.value,
                    })
                  }
                  InputLabelProps={{
                    shrink: true, // Memastikan label selalu berada di atas
                  }}
                  sx={{ marginBottom: 2 }}
                />
              </Grid>

              {/* Kontak Darurat */}
              <KontakDaruratSection
                kontakDarurat={formValues.kontakDarurat}
                handleContactChange={handleContactChange}
                handleAddContact={handleAddContact}
                handleRemoveContact={handleRemoveContact}
              />
            </Grid>
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
