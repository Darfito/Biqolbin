import React from "react";
import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { Box, Grid, MenuItem, Button } from "@mui/material";
import { KeuanganProps } from "@/app/(DashboardLayout)/utilities/type";
import { showToast } from "@/app/(DashboardLayout)/utilities/component/toast/Toast";

interface FormDetailProps {
  isEditing: boolean; // Receive isEditing from the parent component
  onSaveChanges: (data: any) => void; // Kirim data ke parent
  keuanganData?: KeuanganProps | null; // Current selected data
}

const FormDetail = ({ isEditing, onSaveChanges, keuanganData }: FormDetailProps) => {

  console.log("keuanganData di detail:", keuanganData);
  const [metode, setMetode] = React.useState<string>("");
  const [jenisPaket, setJenisPaket] = React.useState<string>("");

  const [formValues, setFormValues] = React.useState({
    nama: "",
    jenisPaket: "",
    metodePembayaran: "",
    jumlahTagihan: "",
    uangMuka: "",
    sisaPembayaran: "",
    totalPembayaran: "",
    tenggatPembayaran: "",
    banyaknyaAngsuran: "",
    jumlahBiayaPerAngsuran: "",
    cicilanKe: "",
    catatanPembayaran: "",
  });

  // Effect untuk mengatur data awal berdasarkan `keuanganData`
  React.useEffect(() => {
    if (keuanganData) {
      setFormValues({
        nama: keuanganData.nama || "",
        jenisPaket: keuanganData.jenisPaket?.nama || "",
        metodePembayaran: keuanganData.metodePembayaran || "",
        jumlahTagihan: keuanganData.jumlahTagihan?.toString() || "",
        uangMuka: keuanganData.uangMuka?.toString() || "",
        sisaPembayaran: keuanganData.sisaTagihan?.toString() || "",
        totalPembayaran: keuanganData.jumlahTagihan?.toString() || "",
        tenggatPembayaran: keuanganData?.tenggatPembayaran
        ? new Date(keuanganData.tenggatPembayaran).toISOString().split("T")[0]
        : "",
        banyaknyaAngsuran: keuanganData?.banyaknyaCicilan?.toString() || "",
        jumlahBiayaPerAngsuran: keuanganData.jumlahBiayaPerAngsuran?.toString() || "",
        cicilanKe: keuanganData?.cicilan && keuanganData.cicilan.length > 0
  ? keuanganData.cicilan[keuanganData.cicilan.length - 1].cicilanKe.toString()
  : "",
        catatanPembayaran: keuanganData.catatanPembayaran || "",
      });

      setMetode(keuanganData.metodePembayaran || "");
      setJenisPaket(keuanganData.jenisPaket?.nama || "");
    }
  }, [keuanganData]);

  const handleMetodeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMetode(event.target.value);
  };

  const handleJenisPaketChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setJenisPaket(event.target.value);
  };

  const handleSubmit = () => {
    // Kirim data ke parent
    onSaveChanges(formValues);
    showToast('Form berhasil disimpan', 'minor-success');
  };

  const [formErrors, setFormErrors] = React.useState<any>({});

  return (
    <DashboardCard>
      <form onSubmit={handleSubmit}>
        <Box sx={{ width: "100%" }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={6} lg={6}>
              <CustomTextField
                fullWidth
                label="Nama Lengkap"
                name="nama"
                value={formValues.nama}
                error={formErrors.nama}
                onChange={(e: { target: { value: any } }) =>
                  setFormValues({ ...formValues, nama: e.target.value })
                }
                disabled={!isEditing} // Disable if not editing
                sx={{ marginBottom: 2 }}
              />

              <CustomTextField
                select
                fullWidth
                label="Jenis Paket"
                value={jenisPaket}
                onChange={handleJenisPaketChange}
                error={formErrors.jenisPaket}
                disabled={!isEditing} // Disable if not editing
                sx={{ marginBottom: 2 }}
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
                label="Jumlah Tagihan (Rupiah)"
                value={formValues.jumlahTagihan}
                error={formErrors.jumlahTagihan}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    jumlahTagihan: e.target.value,
                  })
                }
                disabled={!isEditing} // Disable if not editing
                sx={{ marginBottom: 2 }}
              />

              <CustomTextField
                fullWidth
                label="Tenggat Pembayaran"
                type="date"
                InputLabelProps={{
                  shrink: true,
                }}
                value={formValues.tenggatPembayaran}
                error={!!formErrors.tenggatPembayaran}
                helperText={formErrors.tenggatPembayaran}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
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
              sx={{ marginBottom: 2 }}
              fullWidth
              label="Uang Muka (Rupiah)"
              value={formValues.uangMuka}
              error={!!formErrors.uangMuka}
              helperText={formErrors.uangMuka}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  uangMuka: e.target.value,
                })
              }
              disabled={!isEditing} // Disable if not editing
            />

            <CustomTextField
              sx={{ marginBottom: 2 }}
              fullWidth
              label="Sisa Pembayaran (Rupiah)"
              value={formValues.sisaPembayaran}
              error={!!formErrors.sisaPembayaran}
              helperText={formErrors.sisaPembayaran}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  sisaPembayaran: e.target.value,
                })
              }
              disabled={!isEditing} // Disable if not editing
            />

            <CustomTextField
              sx={{ marginBottom: 2 }}
              fullWidth
              label="Total Pembayaran (Rupiah)"
              value={formValues.totalPembayaran}
              error={formErrors.totalPembayaran}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  totalPembayaran: e.target.value,
                })
              }
              disabled={!isEditing} // Disable if not editing
            />

            <CustomTextField
              fullWidth
              label="Catatan Pembayaran"
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
              <Button variant="contained" color="primary" sx={{ color: "white" }} onClick={handleSubmit}>
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
