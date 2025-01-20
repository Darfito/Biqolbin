"use server";

import { createClient } from "@/libs/supabase/server";
import { KeuanganInterface } from "../../utilities/type";
import { revalidatePath } from "next/cache";

export const getKeuanganAction = async (): Promise<KeuanganInterface[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("Keuangan").select(`
    *,
    Jamaah (
      id,
      nama,
      ayahKandung,
      noTelp,
      varianKamar
    )
  `);

  if (error) {
    console.error("Error fetching data:", error.message);
    return []; // Kembalikan array kosong jika terjadi error
  }

  return data; // Kembalikan data langsung sebagai array
};


export const getKeuanganByIdAction = async (id: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
  .from("Keuangan")
  .select(`
    *,
    Jamaah (
      id,
      nama,
      ayahKandung,
      noTelp,
      varianKamar
    ),
    Paket (
      id,
      nama,
      maskapai,
      customMaskapai,
      noPenerbangan,
      jenisPenerbangan,
      keretaCepat,
      hargaDouble,
      hargaTriple,
      hargaQuad,
      tglKeberangkatan,
      tglKepulangan,
      fasilitas,
      namaMuthawif,
      noTelpMuthawif,
      jenis,
      Hotel (
        id,
        namaHotel,
        alamatHotel,
        ratingHotel,
        tanggalCheckIn,
        tanggalCheckOut
      )
    )
  `)
  .eq("id", id)
  .single();

  if (error) {
    console.error("Error fetching keuangan with relasi:", error.message);
    return null;
  }
  return data;
}


export const createKeuaganAction = async (formValues: KeuanganInterface) => {
  console.log("Form Values di create:", formValues);
  const supabase = createClient();

  // Pastikan jenisPaket ada dan terisi dengan benar
  const { nama, jenis } = formValues.Paket;
  if (!nama || !jenis) {
    console.error("Jenis Paket tidak lengkap:", formValues.Paket);
    return { success: false, error: "Jenis Paket tidak lengkap" };
  }

  // Step 1: Insert data Keuangan
  const { data: keuanganData, error: keuanganError } = await supabase
    .from("Keuangan")
    .insert({
      jamaah_id: formValues.Jamaah.id, // Relasi ke Jamaah
      metodePembayaran: formValues.metodePembayaran,
      namaPaket: nama, // Mengirimkan namaPaket
      jenisPaket: jenis, // Mengirimkan jenisPaket
      uangMuka: formValues.uangMuka,
      totalTagihan: formValues.totalTagihan,
      sisaTagihan: formValues.totalTagihan,
      jumlahBiayaPerAngsuran: formValues.jumlahBiayaPerAngsuran,
      tenggatPembayaran: formValues.tenggatPembayaran,
      banyaknyaCicilan: formValues.banyaknyaCicilan,
      catatanPembayaran: formValues.catatanPembayaran,
      status: formValues.status,
    })
    .select("id") // Ambil ID Keuangan yang baru dibuat
    .single();

  if (keuanganError) {
    console.error("Error creating Keuangan:", keuanganError);
    return { success: false, error: keuanganError.message };
  }

  console.log("Keuangan created:", keuanganData);
  revalidatePath("/keuangan");
  return { success: true, data: keuanganData };
};


export const updateKeuanganAction = async (formValues: KeuanganInterface) => {
  const supabase = createClient();
  console.log("Form Values yang akan dikirim:", formValues);

  if (!formValues.id) {
    console.error("ID tidak ditemukan!");
    return { success: false, error: "ID tidak ditemukan!" };
  }

  const { data, error } = await supabase
    .from("Keuangan")
    .update({
      metodePembayaran: formValues.metodePembayaran,
      namaPaket: formValues.namaPaket,
      jenisPaket: formValues.jenisPaket,
      uangMuka: formValues.uangMuka ?? 0,
      totalTagihan: formValues.totalTagihan ?? 0,
      sisaTagihan: formValues.sisaTagihan ?? 0,
      jumlahBiayaPerAngsuran: formValues.jumlahBiayaPerAngsuran ?? 0,
      tenggatPembayaran: formValues.tenggatPembayaran,
      banyaknyaCicilan: formValues.banyaknyaCicilan ?? 0,
      catatanPembayaran: formValues.catatanPembayaran ?? '',
      paket_id: formValues.paket_id ?? 0, // Pastikan paket_id ada
    })
    .eq("id", formValues.id)
    .select("id")
    .single();

  if (error) {
    console.error("Error updating keuangan:", error.message);
    return { success: false, error: error.message };
  }

  console.log(`Keuangan with ID ${formValues.id} updated successfully`);
  console.log("Updated data:", data);
  revalidatePath("/keuangan");
  return { success: true };
};


export const deleteKeuanganAction = async (keuanganId: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("Keuangan")
    .delete()
    .eq("id", keuanganId);
  if (error) {
    console.error("Error deleting keuangan:", error.message);
    return { success: false, error: error.message }
  }
  console.log(`Keuangan with ID ${keuanganId} deleted successfully`);
  revalidatePath("/keuangan");
  return { success: true }
};
