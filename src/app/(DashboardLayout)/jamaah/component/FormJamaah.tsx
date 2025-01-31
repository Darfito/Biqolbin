"use client";

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
  JenisDokumen,
  JenisKelamin,
  JenisPaket,
  JenisPenerbangan,
  KontakDaruratRelation,
  KontakDaruratType,
  Maskapai,
  PaketInterface,
  provinces,
  StatusKepergian,
  TipeKamar,
} from "../../utilities/type";
import {
  Grid,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
  Autocomplete,
} from "@mui/material";
import { KontakDaruratSection } from "./KontakDaruratHandler";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { createJamaahAction } from "../action";

interface FormErrors {
  id?: string;
  NIK: string;
  nama?: string;
  tanggalLahir?: string;
  ayahKandung?: string;
  noTelp?: string;
  kontakDarurat?: string;
  email?: string;
  jenisKelamin?: string;
  tempatLahir?: string;
  pernikahan?: string;
  alamat?: string;
  // varianKamar?: string;
  kewarganegaraan?: string;
  pekerjaan?: string;
  // kursiRoda?: string;
  riwayatPenyakit?: string;
  jenisDokumen?: string[];
  jenisPaket?: string;
  // berangkat?: string;
  // selesai?: string;
  // status?: string;
}

// Valibot Schema
const formSchema = v.object({
  NIK: v.pipe(v.number()),
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  tanggalLahir: v.date(),
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
  pernikahan: v.boolean(),
  provinsi: v.pipe(v.string(), v.nonEmpty("Provinsi harus diisi")),
  alamat: v.pipe(v.string(), v.nonEmpty("Alamat harus diisi")),
  // varianKamar: v.pipe(v.string(), v.nonEmpty("Varian Kamar harus diisi")),
  kewarganegaraan: v.boolean(),
  pekerjaan: v.pipe(v.string(), v.nonEmpty("Pekerjaan harus diisi")),
  // kursiRoda: v.boolean(),
  riwayatPenyakit: v.pipe(
    v.string(),
    v.nonEmpty("Riwayat Penyakit harus diisi")
  ),
  // jenisDokumen: v.array(v.string()),
  // jenisPaket: v.object({
  //   id: v.number(),
  //   nama: v.string(),
  //   harga: v.number(),
  //   berangkat: v.date(),
  //   selesai: v.date(),
  //   status: v.string(),
  // }),
  // berangkat: v.date(),
  // selesai: v.date(),
  // status: v.string(),
});

type FormType = {
  id: number;
  NIK: number;
  nama: string;
  tanggalLahir: Date;
  ayahKandung: string;
  noTelp: string;
  kontakDarurat: KontakDaruratType[];
  email: string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  pernikahan: boolean;
  provinsi: string;
  alamat: string;
  // varianKamar: TipeKamar;
  kewarganegaraan: boolean;
  pekerjaan: string;
  // kursiRoda: boolean;
  riwayatPenyakit: string;
  jenisDokumen: JenisDokumen[];
  // jenisPaket: PaketInterface;
  // berangkat: string;
  // selesai: string;
  // status: StatusKepergian;
  cabang_id: number;
};

type FormJamaahProps = {
  paketData: PaketInterface[];
  cabang_id: number;
};

export default function FormJamaah({ paketData, cabang_id }: FormJamaahProps) {
  const [open, setOpen] = useState(false);

  const [formValues, setFormValues] = useState<FormType>({
    id: 0,
    NIK: 0,
    nama: "",
    tanggalLahir: new Date(),
    ayahKandung: "",
    noTelp: "",
    kontakDarurat: [
      { id: 0, nama: "", no_telp: "", hubungan: KontakDaruratRelation.Lainnya },
    ],
    email: "",
    jenisKelamin: JenisKelamin.LakiLaki,
    tempatLahir: "",
    pernikahan: false,
    provinsi: "",
    alamat: "",
    // varianKamar: TipeKamar.DOUBLE,
    kewarganegaraan: true,
    pekerjaan: "",
    // kursiRoda: false,
    riwayatPenyakit: "",
    jenisDokumen: [],
    // jenisPaket: {
    //   id: 0, // Mengambil hanya properti yang relevan
    //   nama: "",
    //   jenis: JenisPaket.REGULAR,
    //   maskapai: Maskapai.SAUDIA_ARABIA,
    //   customMaskapai: "",
    //   jenisPenerbangan: JenisPenerbangan.DIRECT,
    //   noPenerbangan: "",
    //   keretaCepat: false,
    //   tglKeberangkatan: "",
    //   tglKepulangan: "",
    //   fasilitas: [],
    //   publish: false,
    //   namaMuthawif: "",
    //   noTelpMuthawif: "",
    //   Hotel: [],
    //   gambar_url: "",
    //   hargaDouble: 0,
    //   hargaTriple: 0,
    //   hargaQuad: 0,
    // },
    cabang_id: cabang_id || 0,
  });
  // const [formErrors, setFormErrors] = useState<FormErrors>({});

  // useEffect(() => {
  //   if (formValues.jenisPaket) {
  //     setFormValues((prev) => ({
  //       ...prev,
  //       berangkat: formValues.jenisPaket.tglKeberangkatan || "",
  //       selesai: formValues.jenisPaket.tglKepulangan || "",
  //     }));
  //   }
  // }, [formValues.jenisPaket]);

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
          no_telp: "",
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

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // setFormErrors({}); // Clear previous errors

    console.log("Form submitting with values:", formValues);

    // Validate the form values
    const result = v.safeParse(formSchema, formValues);

    if (!result.success) {
      const errorMap: Record<string, string> = {};
      result.issues.forEach((issue) => {
        const path = issue.path?.[0]?.key as string | undefined;
        if (path) {
          errorMap[path] = issue.message;
        }
      });
    }

    console.log("Form submitted:", formValues);

    const response = await createJamaahAction(formValues);
    toast.success("Form berhasil disubmit!"); // Show success toast
    handleClose();

    if (response.success) {
      toast.success("Jamaah berhasil ditambahkan!");
      handleClose(); // Tutup dialog setelah berhasil
    } else {
      toast.error(`Gagal menambahkan Jamaah: ${response.error}`);
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      id: 0,
      NIK: 0,
      nama: "",
      tanggalLahir: new Date(),
      ayahKandung: "",
      noTelp: "",
      kontakDarurat: [
        {
          id: 0,
          nama: "",
          no_telp: "",
          hubungan: KontakDaruratRelation.Lainnya,
        },
      ],
      email: "",
      jenisKelamin: JenisKelamin.LakiLaki,
      tempatLahir: "",
      pernikahan: false,
      provinsi: "",
      alamat: "",
      // varianKamar: TipeKamar.DOUBLE,
      kewarganegaraan: true,
      pekerjaan: "",
      // kursiRoda: false,
      riwayatPenyakit: "",
      jenisDokumen: [],
      // jenisPaket: {
      //   id: 0, // Mengambil hanya properti yang relevan
      //   nama: "",
      //   jenis: JenisPaket.REGULAR,
      //   maskapai: Maskapai.SAUDIA_ARABIA,
      //   customMaskapai: "",
      //   jenisPenerbangan: JenisPenerbangan.DIRECT,
      //   noPenerbangan: "",
      //   keretaCepat: false,
      //   tglKeberangkatan: "",
      //   tglKepulangan: "",
      //   fasilitas: [],
      //   publish: false,
      //   namaMuthawif: "",
      //   noTelpMuthawif: "",
      //   Hotel: [],
      //   gambar_url: "",
      //   hargaDouble: 0,
      //   hargaTriple: 0,
      //   hargaQuad: 0,
      // },
      cabang_id: cabang_id || 0,
    });
  };

  console.log("form values di Jamaah:", formValues);

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
                  label="Nomor Induk Kependudukan"
                  value={formValues.NIK}
                  required
                  onChange={(e: { target: { value: number } }) =>
                    setFormValues({ ...formValues, NIK: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  fullWidth
                  label="Nama Jamaah"
                  value={formValues.nama}
                  required
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, nama: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />

                <CustomTextField
                  fullWidth
                  label="Nama Ayah Kandung"
                  value={formValues.ayahKandung}
                  required
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
                  required
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, noTelp: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                  <FormLabel component="legend">Jenis Kelamin</FormLabel>
                  <RadioGroup
                    value={formValues.jenisKelamin}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormValues({
                        ...formValues,
                        jenisKelamin: e.target.value as JenisKelamin, // Cast ke JenisKelamin
                      })
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
                  label="Tanggal Lahir"
                  type="date"
                  required
                  value={
                    formValues.tanggalLahir
                      ? formValues.tanggalLahir.toISOString().split("T")[0]
                      : ""
                  } // Mengonversi ke format YYYY-MM-DD
                  InputLabelProps={{
                    shrink: true, // Memastikan label tetap di atas
                  }}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      tanggalLahir: new Date(e.target.value), // Mengonversi string kembali menjadi objek Date
                    })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <CustomTextField
                  fullWidth
                  label="Tempat Lahir"
                  required
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
                  required
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, email: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
              </Grid>
              {/* Kolom Kanan */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  fullWidth
                  options={provinces}
                  value={formValues.provinsi || ""}
                  onChange={(event, newValue) =>
                    setFormValues({ ...formValues, provinsi: newValue || "" })
                  }
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Provinsi Asal"
                      required
                      sx={{ marginBottom: 2 }}
                    />
                  )}
                />
                <CustomTextField
                  multiline
                  rows={4}
                  fullWidth
                  label="Alamat"
                  required
                  value={formValues.alamat}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, alamat: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                  <FormLabel component="legend">Status Menikah</FormLabel>
                  <RadioGroup
                    value={
                      formValues.pernikahan ? "Sudah Menikah" : "Belum Menikah"
                    }
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormValues({
                        ...formValues,
                        pernikahan: e.target.value === "Sudah Menikah",
                      })
                    }
                    row
                  >
                    <FormControlLabel
                      value="Belum Menikah"
                      control={<Radio />}
                      label="Belum Menikah"
                    />
                    <FormControlLabel
                      value="Sudah Menikah"
                      control={<Radio />}
                      label="Sudah Menikah"
                    />
                  </RadioGroup>
                </FormControl>
                <FormControl component="fieldset" sx={{ marginBottom: 2 }}>
                  <FormLabel component="legend">Status Bernegara</FormLabel>
                  <RadioGroup
                    value={formValues.kewarganegaraan ? "WNI" : "WNA"}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      setFormValues({
                        ...formValues,
                        kewarganegaraan: e.target.value === "WNI",
                      })
                    }
                    row
                  >
                    <FormControlLabel
                      value="WNI"
                      control={<Radio />}
                      label="WNI"
                    />
                    <FormControlLabel
                      value="WNA"
                      control={<Radio />}
                      label="WNA"
                    />
                  </RadioGroup>
                </FormControl>

                <CustomTextField
                  fullWidth
                  label="Pekerjaan"
                  required
                  value={formValues.pekerjaan}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({ ...formValues, pekerjaan: e.target.value })
                  }
                  sx={{ marginBottom: 2 }}
                />
                {/* <FormControlLabel
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
                /> */}
                <CustomTextField
                  fullWidth
                  label="Riwayat Penyakit"
                  required
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
                {/* <Autocomplete
                  fullWidth
                  options={paketData}
                  getOptionLabel={(option) => option.nama} // Menampilkan nama paket
                  value={
                    paketData.find(
                      (paket) => paket.id === formValues.jenisPaket.id
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setFormValues({
                        ...formValues,
                        jenisPaket: newValue || ({} as PaketInterface),
                      });
                    } else {
                      setFormValues({
                        ...formValues,
                        jenisPaket: {} as PaketInterface,
                      });
                    }
                  }}
                  renderInput={(params) => (
                    <CustomTextField
                      {...params}
                      label="Jenis Paket"
                      variant="outlined"
                      required
                      fullWidth
                      sx={{ marginBottom: 2 }}
                    />
                  )}
                /> */}
                {/* <CustomTextField
                  select
                  fullWidth
                  label="Varian Kamar"
                  required
                  value={formValues.varianKamar}
                  onChange={(e: { target: { value: string } }) =>
                    setFormValues({
                      ...formValues,
                      varianKamar: e.target.value as TipeKamar,
                    })
                  }
                  sx={{ marginBottom: 2 }}
                >
                  <MenuItem value={TipeKamar.QUAD}>QUAD</MenuItem>
                  <MenuItem value={TipeKamar.TRIPLE}>TRIPLE</MenuItem>
                  <MenuItem value={TipeKamar.DOUBLE}>DOUBLE</MenuItem>
                </CustomTextField> */}
                {/* Tanggal Berangkat */}
                {/* <CustomTextField
                  fullWidth
                  disabled
                  label="Tanggal Berangkat"
                  type="date"
                  required
                  value={formValues.jenisPaket.tglKeberangkatan} // Sudah otomatis terisi dari jenisPaket
                  InputLabelProps={{
                    shrink: true, // Memastikan label tetap di atas
                  }}
                  sx={{ marginBottom: 2 }}
                /> */}
                {/* Tanggal Selesai */}
                {/* <CustomTextField
                  fullWidth
                  disabled
                  label="Tanggal Selesai"
                  type="date"
                  required
                  value={formValues.jenisPaket.tglKepulangan} // Sudah otomatis terisi dari jenisPaket
                  InputLabelProps={{
                    shrink: true, // Memastikan label tetap di atas
                  }}
                  sx={{ marginBottom: 2 }}
                /> */}
              </Grid>

              {/* Kontak Darurat */}
              <KontakDaruratSection
                isEditing={true}
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
