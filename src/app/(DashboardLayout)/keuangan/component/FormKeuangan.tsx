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
import {
  JamaahInterface,
  JenisKelamin,
  JenisPaket,
  JenisPenerbangan,
  KontakDaruratRelation,
  Maskapai,
  MetodePembayaranType,
  PaketInterface,
  StatusType,
  TipeKamar,
} from "../../utilities/type";
import { Autocomplete } from "@mui/material";
import { createKeuaganAction } from "../action";

interface FormErrors {
  nama?: string;
  Paket?: string;
  metodePembayaran?: string;
  uangMuka?: string;
  totalTagihan?: string;
  tenggatPembayaran?: string;
  banyaknyaCicilan?: string; // Simpan pesan error
  jumlahBiayaPerAngsuran?: string;
}

type FormType = {
  Jamaah: JamaahInterface;
  Paket: PaketInterface;
  metodePembayaran: MetodePembayaranType;
  uangMuka?: number;
  totalTagihan: number;
  tenggatPembayaran: string;
  banyaknyaCicilan?: number;
  jumlahBiayaPerAngsuran?: number;
  status: StatusType;
};

// Valibot Schema
const formSchema = v.object({
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
  banyaknyaCicilan: v.optional(
    v.pipe(v.number(), v.minValue(1, "Banyaknya cicilan harus lebih dari 0"))
  ),
  jumlahBiayaPerAngsuran: v.optional(
    v.pipe(
      v.string(),
      v.transform(Number), // Ubah ke angka
      v.minValue(0, "Jumlah Biaya per Angsuran harus lebih dari 0") // Validasi angka
    )
  ),
});

type FormKeuanganProps = {
  paketData: PaketInterface[];
  jamaahData: JamaahInterface[];
};

export default function FormKeuangan({
  paketData,
  jamaahData,
}: FormKeuanganProps) {
  const [open, setOpen] = useState(false);
  const [metode, setMetode] = useState<string>("");
  const [jenisPaket, setJenisPaket] = useState<string>("");
  const [formValues, setFormValues] = useState<FormType>({
    Jamaah: {
      id: 0,
      nama: "",
      ayahKandung: "",
      noTelp: "",
      tanggalLahir: new Date(),
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
      alamat: "",
      varianKamar: TipeKamar.DOUBLE,
      kewarganegaraan: true,
      pekerjaan: "",
      kursiRoda: false,
      riwayatPenyakit: "",
      jenisDokumen: [],
      jenisPaket: {
        id: 0, // Mengambil hanya properti yang relevan
        nama: "",
        jenis: JenisPaket.REGULAR,
        maskapai: Maskapai.SAUDIA_ARABIA,
        customMaskapai: "",
        jenisPenerbangan: JenisPenerbangan.DIRECT,
        noPenerbangan: "",
        keretaCepat: false,
        tglKeberangkatan: "",
        tglKepulangan: "",
        fasilitas: [],
        publish: false,
        namaMuthawif: "",
        noTelpMuthawif: "",
        Hotel: [],
        gambar_url: "",
        hargaDouble: 0,
        hargaTriple: 0,
        hargaQuad: 0,
      },
      berangkat: "",
      selesai: "",
      status: "Dijadwalkan",
    },
    Paket: {
      id: 0, // Mengambil hanya properti yang relevan
      nama: "",
      jenis: JenisPaket.REGULAR,
      maskapai: Maskapai.SAUDIA_ARABIA,
      customMaskapai: "",
      jenisPenerbangan: JenisPenerbangan.DIRECT,
      noPenerbangan: "",
      keretaCepat: false,
      tglKeberangkatan: "",
      tglKepulangan: "",
      fasilitas: [],
      publish: false,
      namaMuthawif: "",
      noTelpMuthawif: "",
      Hotel: [],
      gambar_url: "",
      hargaDouble: 0,
      hargaTriple: 0,
      hargaQuad: 0,
    },
    metodePembayaran: MetodePembayaranType.TUNAI,
    tenggatPembayaran: "",
    totalTagihan: 0,
    uangMuka: 0,
    banyaknyaCicilan: 0,
    jumlahBiayaPerAngsuran: 0,
    status: StatusType.BELUM_BAYAR,
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Handle metode pembayaran selection
  const handleMetodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMetode = event.target.value as MetodePembayaranType; // Casting tipe

    setMetode(newMetode);
    setFormValues({ ...formValues, metodePembayaran: newMetode });

    // Tentukan status berdasarkan metode pembayaran
    let newStatus: StatusType;
    switch (newMetode) {
      case "Tunai":
        newStatus = StatusType.BELUM_BAYAR;
        break;
      case "Cicilan":
        newStatus = StatusType.SEDANG_MENYICIL;
        break;
      case "Tabungan":
        newStatus = StatusType.SEDANG_MENABUNG;
        break;
      default:
        newStatus = StatusType.BELUM_BAYAR; // Default status jika diperlukan
    }

    // Atur nilai status pembayaran
    setFormValues((prev) => ({
      ...prev,
      status: newStatus, // Tambahkan status pembayaran ke formValues
    }));

    // Reset installment values jika metode bukan "Cicilan"
    if (newMetode !== "Cicilan") {
      setFormValues((prev) => ({
        ...prev,
        banyaknyaCicilan: 0,
        jumlahBiayaPerAngsuran: 0,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
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
      if (!formValues.banyaknyaCicilan) {
        methodErrors.banyaknyaCicilan = "Masukkan banyaknya cicilan";
      }
    } else {
      // Clear installment-related fields for non-Cicilan methods
      setFormValues((prev) => ({
        ...prev,
        banyaknyaCicilan: 0,
        jumlahBiayaPerAngsuran: 0,
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
      const errorMap: Record<string, string> = {};
      result.issues.forEach((issue) => {
        // Pastikan path adalah string
        const path = String(issue.path?.[0]?.key);
        if (path) {
          // Pastikan issue.message adalah string
          errorMap[path] = String(issue.message);
        }
      });
    }

    const response = await createKeuaganAction(formValues);
    handleClose();

    if (response.success) {
      toast.success("Item Keuangan berhasil ditambahkan!");
      handleClose(); // Tutup dialog setelah berhasil
    } else {
      toast.error(`Gagal menambahkan Item Keuangan: ${response.error}`);
    }
  };

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

  // Calculate installment (angsuran) if "Cicilan" is selected
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const calculateAngsuran = () => {
    if (
      metode === "Cicilan" &&
      formValues.totalTagihan &&
      formValues.uangMuka &&
      formValues.banyaknyaCicilan
    ) {
      const jumlahAngsuran =
        (Number(formValues.totalTagihan) - Number(formValues.uangMuka)) /
        Number(formValues.banyaknyaCicilan);

      // Round the installment amount to whole number
      const roundedAngsuran = Math.round(jumlahAngsuran);
      setFormValues({
        ...formValues,
        jumlahBiayaPerAngsuran: roundedAngsuran,
      });
    }
  };

  useEffect(() => {
    calculateAngsuran();
  }, [formValues.totalTagihan, formValues.uangMuka, formValues.banyaknyaCicilan]);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues({
      Jamaah: {
        id: 0,
        nama: "",
        ayahKandung: "",
        noTelp: "",
        tanggalLahir: new Date(),
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
        alamat: "",
        varianKamar: TipeKamar.DOUBLE,
        kewarganegaraan: true,
        pekerjaan: "",
        kursiRoda: false,
        riwayatPenyakit: "",
        jenisDokumen: [],
        jenisPaket: {
          id: 0, // Mengambil hanya properti yang relevan
          nama: "",
          jenis: JenisPaket.REGULAR,
          maskapai: Maskapai.SAUDIA_ARABIA,
          customMaskapai: "",
          jenisPenerbangan: JenisPenerbangan.DIRECT,
          noPenerbangan: "",
          keretaCepat: false,
          tglKeberangkatan: "",
          tglKepulangan: "",
          fasilitas: [],
          publish: false,
          namaMuthawif: "",
          noTelpMuthawif: "",
          Hotel: [],
          gambar_url: "",
          hargaDouble: 0,
          hargaTriple: 0,
          hargaQuad: 0,
        },
        berangkat: "",
        selesai: "",
        status: "Dijadwalkan",
      },
      Paket: {
        id: 0, // Mengambil hanya properti yang relevan
        nama: "",
        jenis: JenisPaket.REGULAR,
        maskapai: Maskapai.SAUDIA_ARABIA,
        customMaskapai: "",
        jenisPenerbangan: JenisPenerbangan.DIRECT,
        noPenerbangan: "",
        keretaCepat: false,
        tglKeberangkatan: "",
        tglKepulangan: "",
        fasilitas: [],
        publish: false,
        namaMuthawif: "",
        noTelpMuthawif: "",
        Hotel: [],
        gambar_url: "",
        hargaDouble: 0,
        hargaTriple: 0,
        hargaQuad: 0,
      },
      metodePembayaran: MetodePembayaranType.TUNAI,
      tenggatPembayaran: "",
      totalTagihan: 0,
      uangMuka: 0,
      banyaknyaCicilan: 0,
      jumlahBiayaPerAngsuran: 0,
      status: StatusType.BELUM_BAYAR,
    });

    // Reset method selection
    setMetode("");
    setJenisPaket("");

    // Clear any existing errors
    setFormErrors({});
  };

  // console.log("formvalues: ", formValues);

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

            <Autocomplete
              fullWidth
              options={jamaahData}
              getOptionLabel={(option) => option.nama} // Menampilkan nama Jamaah
              value={
                jamaahData.find(
                  (jamaah) => jamaah.id === formValues.Jamaah.id
                ) || null
              }
              onChange={(event, newValue) => {
                if (newValue) {
                  setFormValues({
                    ...formValues,
                    Jamaah: newValue || ({} as JamaahInterface),
                    Paket: newValue.jenisPaket || ({} as PaketInterface), // Mengatur paket otomatis
                    totalTagihan: newValue.jenisPaket?.hargaDouble || 0, // Mengatur harga totalTagihan berdasarkan paket
                  });
                } else {
                  setFormValues({
                    ...formValues,
                    Jamaah: {} as JamaahInterface,
                    Paket: {} as PaketInterface,
                    totalTagihan: 0, // Reset totalTagihan jika Jamaah dihapus
                  });
                }
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Pilih Jamaah"
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />

            <Autocomplete
              fullWidth
              options={paketData}
              getOptionLabel={(option) => option.nama} // Menampilkan nama paket
              value={
                paketData.find((paket) => paket.id === formValues.Paket.id) ||
                null
              }
              onChange={(event, newValue) => {
                if (newValue) {
                  setFormValues({
                    ...formValues,
                    Paket: newValue || ({} as PaketInterface),
                  });
                } else {
                  setFormValues({
                    ...formValues,
                    Paket: {} as PaketInterface,
                  });
                }
              }}
              renderInput={(params) => (
                <CustomTextField
                  {...params}
                  label="Jenis Paket"
                  variant="outlined"
                  fullWidth
                  required
                />
              )}
            />

            <CustomTextField
              select
              fullWidth
              label="Metode Pembayaran"
              value={metode}
              onChange={handleMetodeChange}
              error={!!formErrors.metodePembayaran}
              helperText={formErrors.metodePembayaran}
              required
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
              required
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
              value={formatRupiah(formValues.totalTagihan)}
              error={!!formErrors.totalTagihan}
              helperText={formErrors.totalTagihan}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeHarga(e, "totalTagihan")
              }
            />

            <CustomTextField
              fullWidth
              label="Uang Muka"
              name="uangMuka"
              value={formatRupiah(formValues.uangMuka ?? 0)}
              error={!!formErrors.uangMuka}
              helperText={formErrors.uangMuka}
              required
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                handleChangeHarga(e, "uangMuka")
              }
            />

            {metode === "Cicilan" && (
              <>
                <CustomTextField
                  fullWidth
                  label="Banyaknya Cicilan"
                  name="banyaknyaCicilan"
                  value={formValues.banyaknyaCicilan}
                  error={!!formErrors.banyaknyaCicilan}
                  helperText={formErrors.banyaknyaCicilan}
                  required
                  onChange={(e: { target: { value: any } }) =>
                    setFormValues({
                      ...formValues,
                      banyaknyaCicilan: e.target.value,
                    })
                  }
                />
                <CustomTextField
                  fullWidth
                  label="Jumlah Biaya Per Angsuran"
                  name="jumlahBiayaPerAngsuran"
                  value={formatRupiah(formValues.jumlahBiayaPerAngsuran ?? 0)}
                  error={!!formErrors.jumlahBiayaPerAngsuran}
                  required
                  helperText={formErrors.jumlahBiayaPerAngsuran}
                  disabled
                />
              </>
            )}
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
