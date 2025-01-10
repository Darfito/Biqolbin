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
  HotelType,
  JenisPaket,
  JenisPenerbangan,
  Maskapai,
  PaketInterface,
} from "../../utilities/type";
import {
  FormControlLabel,
  Checkbox,
  Box,
  IconButton,
  Typography,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import FileUploaderSingle from "../../utilities/component/uploader/FileUploaderSingle";
import { FormEvent, useEffect, useState } from "react";
import { createCmsAction, updateCmsAction } from "../action";
import { createClient } from "@/libs/supabase/client";
import { HotelSection } from "./HotelHandler";

interface FormCMSProps {
  initialValues?: PaketInterface; // Nilai default untuk mengedit
  mode: "create" | "edit"; // Mode: create atau edit
}

interface FormErrors {
  nama?: string;
  jenis?: string;
  maskapai?: string;
  noPenerbangan?: string;
  customMaskapai?: string;
  jenisPenerbangan?: string;
  keretaCepat?: boolean;
  hargaDouble?: number; // Harga untuk kamar double
  hargaTriple?: number; // Harga untuk kamar triple
  hargaQuad?: number; // Harga untuk kamar quad
  tglKeberangkatan?: string;
  tglKepulangan?: string;
  namaMuthawif?: string;
  noTelpMuthawif?: string;
  namaHotel?: string;
  alamatHotel?: string;
  ratingHotel?: number;
  tanggalCheckIn?: string;
  tanggalCheckOut?: string;
  fasilitas?: string[];
  gambar_url?: string;
}

// Valibot Schema
export const formSchema = v.object({
  nama: v.pipe(v.string(), v.nonEmpty("Nama harus diisi")),
  jenis: v.pipe(v.string(), v.nonEmpty("Pilih jenis paket")),
  maskapai: v.pipe(v.string(), v.nonEmpty("Maskapai harus diisi")),
  jenisPenerbangan: v.pipe(v.string(), v.nonEmpty("Pilih Jenis Penerbangan")),
  keretaCepat: v.boolean(),
  hargaDouble: v.pipe(v.number(), v.minValue(1, "Harga Kamar Double harus lebih dari 0")),
  hargaTriple: v.pipe(v.number(), v.minValue(1, "Harga Kamar Triple harus lebih dari 0")),
  hargaQuad: v.pipe(v.number(), v.minValue(1, "Harga Kamar Quad harus lebih dari 0")),
  tglKeberangkatan: v.pipe(
    v.string(),
    v.nonEmpty("Tanggal Keberangkatan harus diisi")
  ),
  tglKepulangan: v.pipe(
    v.string(),
    v.nonEmpty("Tanggal Kepulangan harus diisi")
  ),
  namaMuthawif: v.pipe(v.string(), v.nonEmpty("Nama Muthawif harus diisi")),
  noTelpMuthawif: v.pipe(
    v.string(),
    v.nonEmpty("No Telp Muthawif harus diisi")
  ),
  Hotel: v.array(
    v.object({
      namaHotel: v.pipe(v.string(), v.nonEmpty("Nama Hotel harus diisi")),
      alamatHotel: v.pipe(v.string(), v.nonEmpty("Alamat Hotel harus diisi")),
      ratingHotel: v.number(),
      tanggalCheckIn: v.pipe(
        v.string(),
        v.nonEmpty("Tanggal Check In harus diisi")
      ),
      tanggalCheckOut: v.pipe(
        v.string(),
        v.nonEmpty("Tanggal Check Out harus diisi")
      ),
    })
  ),
  fasilitas: v.array(v.string()),
  gambar_url: v.string(),
});

const FormCMS = ({ initialValues, mode }: FormCMSProps) => {
  const [open, setOpen] = useState(false);
  const [isCustomMaskapai, setIsCustomMaskapai] = useState(false); // Untuk melacak apakah pengguna memilih "Lainnya"

  const [formValues, setFormValues] = useState<PaketInterface>(
    initialValues || {
      nama: "",
      jenis: JenisPaket.REGULAR,
      maskapai: Maskapai.GARUDA_INDONESIA,
      noPenerbangan: "",
      customMaskapai: "",
      jenisPenerbangan: JenisPenerbangan.DIRECT,
      keretaCepat: false,
      hargaDouble: 0, // Harga untuk kamar double
      hargaTriple: 0, // Harga untuk kamar triple
      hargaQuad: 0, // Harga untuk kamar quad
      tglKeberangkatan: "",
      tglKepulangan: "",
      namaMuthawif: "",
      noTelpMuthawif: "",
      Hotel: [
        {
          id: 0,
          namaHotel: "",
          alamatHotel: "",
          ratingHotel: 0,
          tanggalCheckIn: "",
          tanggalCheckOut: "",
        },
      ],
      fasilitas: [] as string[],
      publish: false,
      gambar_url: "",
    }
  );
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [newFasilitas, setNewFasilitas] = useState<string>("");

  useEffect(() => {
    if (initialValues) {
      setFormValues(initialValues);
    }
  }, [initialValues]);

  const handleChangeHarga = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const value = e.target.value.replace(/[^\d]/g, ""); // Menghapus non-numeric characters (selain angka)
  
    setFormValues((prevValues) => ({
      ...prevValues,
      [type]: value === "" ? 0 : Number(value),
    }));
  };

  const handleAddFasilitas = () => {
    if (newFasilitas.trim() === "") {
      toast.error("Fasilitas tidak boleh kosong");
      return;
    }
    setFormValues((prev) => ({
      ...prev,
      fasilitas: [...prev.fasilitas, newFasilitas],
    }));
    setNewFasilitas(""); // Reset input
  };

  const handleRemoveFasilitas = (index: number) => {
    setFormValues((prev) => ({
      ...prev,
      fasilitas: prev.fasilitas.filter((_: any, i: number) => i !== index),
    }));
  };

  const uploadImageToSupabase = async (folderName: string, file: File) => {
    if (typeof folderName !== "string") {
      throw new Error(`Invalid folderName: ${folderName}`);
    }

    const supabase = createClient();
    const { data, error } = await supabase.storage
      .from("Paket") // Ganti dengan nama bucket Anda
      .upload(`${folderName}/${file.name}`, file);

    if (error) {
      throw new Error(error.message);
    }
    return data;
  };

  const handleUpload = async (file: File) => {
    try {
      // Log untuk memeriksa nilai formValues.nama
      console.log("formValues.nama:", formValues.nama);

      // Pastikan formValues.nama adalah string
      const namaPaket = await formValues.nama; // Jika formValues.nama adalah Promise, tunggu hasilnya

      // Cek apakah nilai sudah valid
      if (typeof namaPaket !== "string") {
        throw new Error("Nama paket harus berupa string");
      }

      // Sanitize folder name
      // const folderName = sanitizeFolderName(namaPaket);
      const folderName = namaPaket;
      console.log("Folder Name:", folderName);

      // Upload file
      const result = await uploadImageToSupabase(folderName, file);

      // Buat URL publik
      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/Paket/${result.path}`;

      // Simpan URL ke state
      setFormValues((prevValues) => ({
        ...prevValues,
        gambar_url: publicUrl,
      }));

      console.log("File uploaded successfully:", result);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error("Gagal mengunggah gambar!");
    }
  };

  const serializeFormData = (
    values: PaketInterface,
    mode: "create" | "edit",
    initialValues?: PaketInterface
  ): PaketInterface | Omit<PaketInterface, "id"> => {
    if (mode === "edit" && initialValues?.id == null) {
      throw new Error("ID is required for edit mode");
    }
  
    return {
      ...(mode === "edit" && initialValues?.id ? { id: initialValues.id } : {}),
      nama: values.nama,
      jenis: values.jenis,
      maskapai: values.maskapai,
      noPenerbangan: values.noPenerbangan || "",
      customMaskapai: values.customMaskapai,
      jenisPenerbangan: values.jenisPenerbangan,
      keretaCepat: Boolean(values.keretaCepat),
      hargaDouble: values.hargaDouble,
      hargaTriple: values.hargaTriple,
      hargaQuad: values.hargaQuad,
      tglKeberangkatan: values.tglKeberangkatan,
      tglKepulangan: values.tglKepulangan,
      namaMuthawif: values.namaMuthawif,
      noTelpMuthawif: values.noTelpMuthawif,
      fasilitas: Array.isArray(values.fasilitas) ? values.fasilitas : [],
      gambar_url: values.gambar_url,
      Hotel: Array.isArray(values.Hotel) ? values.Hotel : [], // Tambahkan properti hotel
    };
  };
  
  
  
const formatRupiah = (angka: number): string => {
  return angka.toLocaleString("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  });
};

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
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
  
    if (!formValues.gambar_url) {
      toast.error("Harap unggah gambar sebelum mengirimkan form!");
      return;
    }
  
    // Serialize form data before sending to server action
    const serializedData = serializeFormData(formValues, mode, initialValues);
    console.log("Serialized Data:", serializedData);
  
    try {
      if (mode === "create") {
        const { success, data, error } = await createCmsAction(serializedData);
        if (success) {
          toast.success("Form berhasil disubmit!");
          handleClose();
        } else {
          toast.error(`Error: ${error}`);
        }
      } else if (mode === "edit") {
        console.log("Submitting updateCmsAction with data:", serializedData);
        const { success, data, error } = await updateCmsAction(serializedData);
        if (success) {
          toast.success("Form berhasil di Update!");
          handleClose();
        } else {
          toast.error(`Error: ${error}`);
        }
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Terjadi kesalahan saat memproses form");
    }
  };

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);

    // Reset all form values
    setFormValues(
      initialValues || {
        nama: "",
        jenis: JenisPaket.REGULAR,
        maskapai: Maskapai.GARUDA_INDONESIA,
        customMaskapai: "",
        jenisPenerbangan: JenisPenerbangan.DIRECT,
        keretaCepat: false,
        hargaDouble: 0, // Harga untuk kamar double
        hargaTriple: 0, // Harga untuk kamar triple
        hargaQuad: 0, // Harga untuk kamar quad
        tglKeberangkatan: "",
        tglKepulangan: "",
        namaMuthawif: "",
        noTelpMuthawif: "",
        Hotel: [
          {
            id: 0,
            namaHotel: "",
            alamatHotel: "",
            ratingHotel: 0,
            tanggalCheckIn: "",
            tanggalCheckOut: "",
          },
        ],
        fasilitas: [],
        publish: false,
        gambar_url: "",
      }
    );

    // Clear any existing errors
    setFormErrors({});
  };

  console.log("initial values masuk:", initialValues);
  console.log("form values di detail:", formValues);

  const handleHotelChange = (
    index: number,
    field: keyof HotelType,
    value: string | number
  ) => {
    const updatedHotels = [...(formValues.Hotel ?? [])];
    updatedHotels[index] = { ...updatedHotels[index], [field]: value };
    setFormValues({ ...formValues, Hotel: updatedHotels });
  };

  const handleAddHotel = () => {
    console.log("add hotel tertekan")
    setFormValues((prev) => ({
      ...prev,
      Hotel: [
        ...(prev.Hotel ?? []),
        {
          id: (prev.Hotel?.length ?? 0) + 1,
          namaHotel: "",
          alamatHotel: "",
          ratingHotel: 0,
          tanggalCheckIn: "",
          tanggalCheckOut: "",
        },
      ],
    }));
  };

  const handleRemoveHotel = (indexToRemove: number) => {
    setFormValues((prev) => ({
      ...prev,
      Hotel: prev.Hotel?.filter((_, index) => index !== indexToRemove) ?? [],
    }));
  };

  return (
    <>
      <Button
        sx={{ color: "#fff", minWidth: "150px" }}
        variant="contained"
        onClick={handleClickOpen}
      >
        {mode === "create" ? "Tambah" : "Sunting"}
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {mode === "create" ? "Tambah Paket" : "Edit Paket"}
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
            <DialogContentText>Masukkan detail paket.</DialogContentText>

            <CustomTextField
              fullWidth
              label="Nama Paket"
              name="nama"
              value={formValues.nama}
              error={!!formErrors.nama}
              helperText={formErrors.nama}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, nama: e.target.value })
              }
            />
            <FormControl fullWidth>
              <FormLabel id="jenis-paket-label">Jenis Paket</FormLabel>
              <RadioGroup
                aria-labelledby="jenis-paket-label"
                name="jenisPaket"
                value={formValues.jenis}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    jenis: e.target.value as JenisPaket,
                  })
                }
                row
              >
                <FormControlLabel
                  value={JenisPaket.REGULAR}
                  control={<Radio />}
                  label="Regular"
                />
                <FormControlLabel
                  value={JenisPaket.VIP}
                  control={<Radio />}
                  label="VIP"
                />
              </RadioGroup>
            </FormControl>
            <CustomTextField
              select
              fullWidth
              label="Nama Maskapai"
              name="maskapai"
              value={formValues.maskapai}
              error={!!formErrors.maskapai}
              helperText={formErrors.maskapai}
              onChange={(e: { target: { value: string } }) => {
                const value = e.target.value;
                if (value === Maskapai.LAINNYA) {
                  setIsCustomMaskapai(true); // Aktifkan input tambahan
                  setFormValues({
                    ...formValues,
                    maskapai: value,
                    customMaskapai: "",
                  });
                } else {
                  setIsCustomMaskapai(false); // Nonaktifkan input tambahan
                  setFormValues({ ...formValues, maskapai: value as Maskapai });
                }
              }}
            >
              {Object.values(Maskapai).map((maskapai) => (
                <MenuItem key={maskapai} value={maskapai}>
                  {maskapai}
                </MenuItem>
              ))}
            </CustomTextField>

            <CustomTextField
              fullWidth
              label="Nomor Penerbangan (opsional)"
              name="Nomor Penerbangan"
              value={formValues.noPenerbangan}
              error={!!formErrors.noPenerbangan}
              helperText={formErrors.noPenerbangan}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, noPenerbangan: e.target.value })
              }
            />

            {/* Input tambahan jika memilih "Lainnya" */}
            {isCustomMaskapai && (
              <CustomTextField
                fullWidth
                label="Nama Maskapai (Lainnya)"
                name="customMaskapai"
                value={formValues.customMaskapai || ""}
                error={!!formErrors.customMaskapai}
                helperText={formErrors.customMaskapai}
                onChange={(e: { target: { value: string } }) =>
                  setFormValues({
                    ...formValues,
                    customMaskapai: e.target.value,
                  })
                }
              />
            )}
            <FormControl fullWidth>
              <FormLabel id="jenis-penerbangan-label">
                Jenis Penerbangan
              </FormLabel>
              <RadioGroup
                aria-labelledby="jenis-penerbangan-label"
                name="jenisPenerbangan"
                value={formValues.jenisPenerbangan}
                onChange={(e) =>
                  setFormValues({
                    ...formValues,
                    jenisPenerbangan: e.target.value as JenisPenerbangan,
                  })
                }
                row
              >
                <FormControlLabel
                  value={JenisPenerbangan.DIRECT}
                  control={<Radio />}
                  label="Direct"
                />
                <FormControlLabel
                  value={JenisPenerbangan.TRANSIT}
                  control={<Radio />}
                  label="Transit"
                />
              </RadioGroup>
            </FormControl>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formValues.keretaCepat}
                  onChange={(e) =>
                    setFormValues({
                      ...formValues,
                      keretaCepat: e.target.checked,
                    })
                  }
                />
              }
              label="Menggunakan Kereta Cepat?"
            />

                        <CustomTextField
              fullWidth
              label="Tanggal Keberangkatan"
              name="tglKeberangkatan"
              type="date"
              value={formValues.tglKeberangkatan}
              error={!!formErrors.tglKeberangkatan}
              helperText={formErrors.tglKeberangkatan}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({
                  ...formValues,
                  tglKeberangkatan: e.target.value,
                })
              }
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <CustomTextField
              fullWidth
              label="Tanggal Kepulangan"
              name="tglKepulangan"
              type="date"
              value={formValues.tglKepulangan}
              error={!!formErrors.tglKepulangan}
              helperText={formErrors.tglKepulangan}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, tglKepulangan: e.target.value })
              }
              InputLabelProps={{
                shrink: true, // Memastikan label selalu berada di atas
              }}
            />
            <Divider />
            {/* Akomodasi */}
            <Typography variant="h5">Muthawif</Typography>
            <CustomTextField
              fullWidth
              label="Nama Muthawif"
              name="namaMuthawif"
              value={formValues.namaMuthawif}
              error={!!formErrors.namaMuthawif}
              helperText={formErrors.namaMuthawif}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, namaMuthawif: e.target.value })
              }
            />
            <CustomTextField
              fullWidth
              label="Nomor Telpon Muthawif"
              name="noTelpMuthawif"
              value={formValues.noTelpMuthawif}
              error={!!formErrors.noTelpMuthawif}
              helperText={formErrors.noTelpMuthawif}
              onChange={(e: { target: { value: string } }) =>
                setFormValues({ ...formValues, noTelpMuthawif: e.target.value })
              }
            />
            <HotelSection
              hotel={formValues.Hotel ?? []}
              handleHotelChange={handleHotelChange}
              handleAddHotel={handleAddHotel}
              handleRemoveHotel={handleRemoveHotel}
            />
            <Divider />
            {/* Akomodasi */}
            <Typography variant="h5">Harga Sesuai Tipe Kamar</Typography>
            <CustomTextField
              fullWidth
              label="Tipe Kamar Double"
              name="hargaDouble"
              value={formatRupiah(formValues.hargaDouble)} // Format harga
              error={!!formErrors.hargaDouble}
              helperText={formErrors.hargaDouble}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeHarga(e, "hargaDouble")}
            />
            <CustomTextField
              fullWidth
              label="Tipe Kamar Triple"
              name="hargaTriple"
              value={formatRupiah(formValues.hargaTriple)} // Format harga
              error={!!formErrors.hargaTriple}
              helperText={formErrors.hargaTriple}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeHarga(e, "hargaTriple")}
            />
            <CustomTextField
              fullWidth
              label="Tipe Kamar Quad"
              name="hargaQuad"
              value={formatRupiah(formValues.hargaQuad)} // Format harga
              error={!!formErrors.hargaQuad}
              helperText={formErrors.hargaQuad}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChangeHarga(e, "hargaQuad")} // Menangani perubahan input
            />
            <Divider />
            {/* Fasilitas */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Fasilitas
              </Typography>
              {formValues.fasilitas.map((fasilitas: string, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <Typography>
                    {index + 1}. {fasilitas}
                  </Typography>
                  <IconButton onClick={() => handleRemoveFasilitas(index)}>
                    <Delete />
                  </IconButton>
                </Box>
              ))}
              <Box display="flex" gap="0.5rem" alignItems="center">
                <CustomTextField
                  label="Tambah Fasilitas"
                  value={newFasilitas}
                  onChange={(e: { target: { value: string } }) =>
                    setNewFasilitas(e.target.value)
                  }
                  fullWidth
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleAddFasilitas}
                  sx={{ color: "white" }}
                >
                  Tambah
                </Button>
              </Box>
            </Box>

            {/* Gambar */}
            <Box sx={{ width: "100%" }}>
              <Typography variant="subtitle1">
                Upload Gambar Poster Penawaran
              </Typography>
              <FileUploaderSingle
                onFileUpload={async (file) => {
                  await handleUpload(file); // Memanggil handleUpload yang sudah Anda buat
                }}
              />
            </Box>
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

export default FormCMS;
