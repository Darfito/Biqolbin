"use client";

import React, { ChangeEvent, useEffect, useState } from "react";
import * as v from "valibot";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Grid, MenuItem, Button, Autocomplete } from "@mui/material";
import {
  JamaahInterface,
  JenisKelamin,
  JenisPaket,
  JenisPenerbangan,
  KeuanganInterface,
  KontakDaruratRelation,
  Maskapai,
  MetodePembayaranType,
  PaketInterface,
  StatusType,
  TipeKamar,
} from "@/app/(DashboardLayout)/utilities/type";
import { showToast } from "@/app/(DashboardLayout)/utilities/component/toast/Toast";

interface FormErrors {
  nama?: string;
  jenisPaket?: string;
  metodePembayaran?: string;
  uangMuka?: string;
  totalTagihan?: string;
  tenggatPembayaran?: string;
  sisaTagihan?: string;
  banyaknyaCicilan?: string; // Simpan pesan error
  jumlahBiayaPerAngsuran?: string;
  catatanPembayaran?: string;
}

type FormType = {
  Jamaah: JamaahInterface;
  Paket: PaketInterface;
  metodePembayaran: MetodePembayaranType;
  uangMuka?: number;
  totalTagihan: number;
  tenggatPembayaran: string;
  sisaTagihan?: number;
  banyaknyaCicilan?: number;
  jumlahBiayaPerAngsuran?: number;
  status: StatusType;
  catatanPembayaran?: string;
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
  banyaknyaCicilan: v.optional(v.string()),
  jumlahBiayaPerAngsuran: v.optional(
    v.pipe(
      v.string(),
      v.transform(Number), // Ubah ke angka
      v.minValue(0, "Jumlah Biaya per Angsuran harus lebih dari 0") // Validasi angka
    )
  ),
  sisaTagihan: v.optional(
    v.pipe(
      v.string(),
      v.transform(Number), // Ubah ke angka
      v.minValue(0, "Jumlah sisa tagihan harus lebih dari 0") // Validasi angka
    )
  ),
});

interface FormDetailProps {
  isEditing: boolean; // Receive isEditing from the parent component
  paketData: PaketInterface[];
  keuanganData?: KeuanganInterface | null; // Current selected data
  jamaahData: JamaahInterface[];
}

const FormDetail = ({
  isEditing,
  keuanganData,
  paketData,
  jamaahData,
}: FormDetailProps) => {
  console.log("keuanganData di detail:", keuanganData);
  const [metode, setMetode] = useState<string>(keuanganData?.metodePembayaran || "");
  const [formErrors, setFormErrors] = useState<any>({});
  const [formValues, setFormValues] = useState<FormType>({
    Jamaah: {
      id: 0,
      nama: "",
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
      alamat: "",
      varianKamar: TipeKamar.DOUBLE,
      kewarganegaraan: false,
      pekerjaan: "",
      kursiRoda: false,
      riwayatPenyakit: "",
      jenisDokumen: [],
      jenisPaket: {
        id: 0,
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
      id: 0,
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
      namaMuthawif: "",
      noTelpMuthawif: "",
      Hotel: [],
      gambar_url: "",
      hargaDouble: 0,
      hargaTriple: 0,
      hargaQuad: 0,
    },
    metodePembayaran: MetodePembayaranType.TUNAI,
    sisaTagihan: 0,
    tenggatPembayaran: "",
    totalTagihan: 0,
    uangMuka: 0,
    banyaknyaCicilan: 0,
    jumlahBiayaPerAngsuran: 0,
    status: StatusType.BELUM_BAYAR,
  });

  // Gunakan useEffect untuk memperbarui state ketika keuanganData berubah
  useEffect(() => {
    if (keuanganData) {
      setMetode(keuanganData.metodePembayaran || MetodePembayaranType.TUNAI);
      setFormValues({
        Jamaah: {
          ...keuanganData.Jamaah,
          jenisPaket: {
            ...keuanganData.Paket,
          },
        },
        Paket: keuanganData.Paket,
        metodePembayaran:keuanganData.metodePembayaran || MetodePembayaranType.TUNAI,
        sisaTagihan: keuanganData.sisaTagihan || 0,
        tenggatPembayaran: keuanganData.tenggatPembayaran || "",
        totalTagihan: keuanganData.totalTagihan || 0,
        uangMuka: keuanganData.uangMuka || 0,
        banyaknyaCicilan: keuanganData.banyaknyaCicilan || 0,
        jumlahBiayaPerAngsuran: keuanganData.jumlahBiayaPerAngsuran || 0,
        status: keuanganData.status || StatusType.BELUM_BAYAR,
      });
    }
  }, [keuanganData]);

  console.log("Keuangan data di detail:", keuanganData);

  // Handle metode pembayaran selection
  const handleMetodeChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newMetode = event.target.value as MetodePembayaranType;

    setMetode(newMetode);
    setFormValues({ ...formValues, metodePembayaran: newMetode });

    if (newMetode !== "Cicilan") {
      setFormValues((prev) => ({
        ...prev,
        metodePembayaran: newMetode,
        banyaknyaCicilan: 0,
        jumlahBiayaPerAngsuran: 0,
      }));
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
  }, [
    formValues.totalTagihan,
    formValues.uangMuka,
    formValues.banyaknyaCicilan,
  ]);

  const handleSubmit = () => {
    // Kirim data ke parent
    showToast("Form berhasil disimpan", "minor-success");
  };



  return (
    <DashboardCard>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              {/* Pilihan Jamaah */}
              <Autocomplete
                fullWidth
                options={jamaahData}
                getOptionLabel={(option) => option.nama}
                disabled={!isEditing}
                sx={{ mb: 2 }}
                value={
                  jamaahData.find(
                    (jamaah) => jamaah.id === formValues.Jamaah.id
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormValues({
                    ...formValues,
                    Jamaah: newValue || ({} as JamaahInterface),
                  });
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Pilih Jamaah"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              {/* Pilihan Paket */}
              <Autocomplete
                fullWidth
                options={paketData}
                getOptionLabel={(option) => option.nama}
                disabled={!isEditing}
                sx={{ mb: 2 }}
                value={
                  paketData.find(
                    (paket) => paket.id === formValues.Paket?.id
                  ) || null
                }
                onChange={(event, newValue) => {
                  setFormValues({
                    ...formValues,
                    Paket: newValue || ({} as PaketInterface),
                  });
                }}
                renderInput={(params) => (
                  <CustomTextField
                    {...params}
                    label="Jenis Paket"
                    variant="outlined"
                    fullWidth
                  />
                )}
              />

              <CustomTextField
                select
                fullWidth
                label="Metode Pembayaran"
                value={metode}
                onChange={handleMetodeChange}
                error={formErrors.metodePembayaran}
                disabled={!isEditing} // Disable if not editing
                sx={{ marginBottom: 2 }}
              >
                <MenuItem value="Tunai">Tunai</MenuItem>
                <MenuItem value="Tabungan">Tabungan</MenuItem>
                <MenuItem value="Cicilan">Cicilan</MenuItem>
              </CustomTextField>

              <CustomTextField
                fullWidth
                label="Total Tagihan"
                name="totalTagihan"
                sx={{ mb: 2 }}
                value={formatRupiah(formValues.totalTagihan)}
                error={!!formErrors.totalTagihan}
                helperText={formErrors.totalTagihan}
                disabled={!isEditing}
                onChange={(e: { target: { value: any } }) =>
                  setFormValues({
                    ...formValues,
                    totalTagihan: e.target.value,
                  })
                }
              />

              <CustomTextField
                fullWidth
                label="Tenggat Pembayaran"
                type="date"
                sx={{ mb: 2 }}
                InputLabelProps={{
                  shrink: true,
                }}
                value={formValues.tenggatPembayaran}
                error={!!formErrors.tenggatPembayaran}
                helperText={formErrors.tenggatPembayaran}
                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                  setFormValues({
                    ...formValues,
                    tenggatPembayaran: e.target.value,
                  })
                }
                disabled={!isEditing} // Disable if not editing
              />
            </Grid>

            <Grid item xs={12} sm={6} md={6} lg={6}>
              {/* Right Column Fields */}
              <CustomTextField
                fullWidth
                label="Uang Muka"
                name="uangMuka"
                sx={{ mb: 2 }}
                disabled={!isEditing}
                value={formatRupiah(formValues.uangMuka ?? 0)}
                error={!!formErrors.uangMuka}
                helperText={formErrors.uangMuka}
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
                    sx={{ mb: 2 }}
                    disabled={!isEditing}
                    onChange={(e: { target: { value: any } }) =>
                      setFormValues({
                        ...formValues,
                        banyaknyaCicilan: e.target.value,
                      })
                    }
                  />
                  <CustomTextField
                    fullWidth
                    sx={{ mb: 2 }}
                    label="Jumlah Biaya Per Angsuran"
                    name="jumlahBiayaPerAngsuran"
                    value={formatRupiah(formValues.jumlahBiayaPerAngsuran ?? 0)}
                    error={!!formErrors.jumlahBiayaPerAngsuran}
                    helperText={formErrors.jumlahBiayaPerAngsuran}
                    disabled
                  />
                </>
              )}

              <CustomTextField
                fullWidth
                label="Sisa Tagihan"
                name="sisaTagihan"
                sx={{ mb: 2 }}
                disabled={!isEditing}
                value={formatRupiah(formValues.sisaTagihan ?? 0)}
                error={!!formErrors.sisaTagihan}
                helperText={formErrors.sisaTagihan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeHarga(e, "sisaTagihan")
                }
              />

              <CustomTextField
                fullWidth
                label="Total Tagihan"
                name="totalTagihan"
                value={formatRupiah(formValues.totalTagihan)}
                error={!!formErrors.totalTagihan}
                InputLabelProps={{
                  shrink: true,
                }}
                disabled={!isEditing}
                sx={{ mb: 2 }}
                helperText={formErrors.totalTagihan}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleChangeHarga(e, "totalTagihan")
                }
              />

              <CustomTextField
                fullWidth
                label="Catatan Pembayaran"
                multiline
                rows={4}
                value={formValues.catatanPembayaran}
                error={formErrors.catatanPembayaran}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    catatanPembayaran: e.target.value,
                  })
                }
                disabled={!isEditing} // Disable if not editing
              />
            </Grid>
          </Grid>

          {isEditing && (
            <Box sx={{ marginTop: 3 }}>
              <Button
                variant="contained"
                color="primary"
                sx={{ color: "white" }}
                onClick={handleSubmit}
              >
                Simpan Perubahan
              </Button>
            </Box>
          )}
        </Box>
      </form>
    </DashboardCard>
  );
};

export default FormDetail;
