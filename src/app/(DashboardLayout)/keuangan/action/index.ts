"use server";

import { createClient } from "@/libs/supabase/server";
import {
  KeuanganInterface,
  StatusType,
} from "../../utilities/type";
import { revalidatePath } from "next/cache";




/**
 * Fetch all Keuangan data from the database.
 * If there is an error, return an empty array.
 * @returns {KeuanganInterface[]}
 */

export const getKeuanganAction = async (): Promise<KeuanganInterface[]> => {
  const supabase = createClient();
  const { data, error } = await supabase.from("Keuangan").select(`
    *,
    Jamaah (
      *
    ),
    Paket (
      *
    )
  `);

  if (error) {
    console.error("Error fetching data:", error.message);
    return []; // Kembalikan array kosong jika terjadi error
  }

  return data; // Kembalikan data langsung sebagai array
};

export const getKeuanganActionCabang = async (
  cabangId: number
): Promise<KeuanganInterface[]> => {
  const supabase = createClient();

  try {
    // Ambil semua ID Jamaah yang terkait dengan cabang tertentu
    const { data: jamaahIds, error: errorId } = await supabase
      .from("Jamaah")
      .select("id")
      .eq("cabang_id", cabangId);

    if (errorId) {
      console.error("Error fetching Jamaah IDs:", errorId.message);
      return [];
    }

    if (!jamaahIds || jamaahIds.length === 0) {
      console.warn("No Jamaah found for the given cabang_id:", cabangId);
      return [];
    }

    // Ambil semua keuangan berdasarkan jamaah_id yang ditemukan
    const jamaahIdArray = jamaahIds.map((jamaah) => jamaah.id); // Array of IDs
    const { data: keuanganData, error } = await supabase
      .from("Keuangan")
      .select(`*,
      Jamaah (
        *
      ),
      Paket (
        *
      )
    `)
      .in("jamaah_id", jamaahIdArray);

    if (error) {
      console.error("Error fetching Keuangan data:", error.message);
      return [];
    }
    return keuanganData ?? [];
  } catch (error) {
    console.error("Unexpected error:", error);
    return [];
  }
};


/**
 * Fetch a Keuangan by ID with relasi Jamaah, Paket, Hotel, and Cicilan.
 * If there is an error, return null.
 *
 * @param {number} id - ID of the Keuangan to fetch
 * @returns {object|null} Keuangan data with relasi, or null if error occurs
 */

export const getKeuanganByIdAction = async (id: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Keuangan")
    .select(
      `
      *,
      Jamaah (
        id,
        nama,
        ayahKandung,
        noTelp
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
      ),
      Cicilan (
        cicilanKe, 
        nominalCicilan,
        tanggalPembayaran
      ),
      BiayaTambahan(*)
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching keuangan with relasi:", error.message);
    return null;
  }

  // Hitung cicilanKe berikutnya
  const nextCicilanKe = data?.Cicilan?.length ? data.Cicilan.length + 1 : 1;

  return {
    keuangan: data,
    nextCicilanKe, // Menambahkan nextCicilanKe ke data yang dikembalikan
  };
};

/**
 * Create a new Keuangan with the given formValues
 * @param {KeuanganInterface} formValues - Object containing data to create a new Keuangan
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */

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
      varianKamar: formValues.varianKamar,
      metodePembayaran: formValues.metodePembayaran,
      paket_id: formValues.Paket.id, // Relasi ke Paket
      uangMuka: formValues.uangMuka,
      totalTagihan: formValues.totalTagihan,
      sisaTagihan: formValues.totalTagihan,
      jumlahBiayaPerAngsuran: formValues.jumlahBiayaPerAngsuran,
      tenggatPembayaran: formValues.tenggatPembayaran,
      banyaknyaCicilan: formValues.banyaknyaCicilan,
      catatanPembayaran: formValues.catatanPembayaran,
      status: formValues.status,
      statusPenjadwalan: formValues.statusPenjadwalan,
      kursiRoda: formValues.kursiRoda,
      statusAktif: formValues.statusAktif
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

/**
 * Update data Keuangan dengan ID yang diberikan
 * @param {KeuanganInterface} formValues - Data Keuangan yang akan diupdate
 * @returns {Promise<{success: boolean, error?: string, data?: any}>}
 */
export const updateKeuanganAction = async (formValues: KeuanganInterface) => {
  const supabase = createClient();
  console.log("Form Values yang akan dikirim:", formValues);

  if (!formValues.id) {
    console.error("ID tidak ditemukan!");
    return { success: false, error: "ID tidak ditemukan!" };
  }

  // Mulai transaksi untuk memastikan konsistensi data
  const { data, error } = await supabase
    .from("Keuangan")
    .update({
      metodePembayaran: formValues.metodePembayaran,
      uangMuka: formValues.uangMuka ?? 0,
      totalTagihan: formValues.totalTagihan ?? 0,
      sisaTagihan: formValues.sisaTagihan ?? 0,
      jumlahBiayaPerAngsuran: formValues.jumlahBiayaPerAngsuran ?? 0,
      tenggatPembayaran: formValues.tenggatPembayaran,
      banyaknyaCicilan: formValues.banyaknyaCicilan ?? 0,
      catatanPembayaran: formValues.catatanPembayaran ?? "",
      paket_id: formValues.paket_id ?? 0,
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

  // **Hapus biaya tambahan lama sebelum menambahkan yang baru**
  const { error: deleteError } = await supabase
    .from("BiayaTambahan")
    .delete()
    .eq("keuangan_id", formValues.id);

  if (deleteError) {
    console.error("Error deleting old BiayaTambahan:", deleteError.message);
    return { success: false, error: deleteError.message };
  }

  console.log(`Deleted old BiayaTambahan for Keuangan ID: ${formValues.id}`);

  // **Insert biaya tambahan baru jika ada**
  if (formValues.BiayaTambahan && formValues.BiayaTambahan.length > 0) {
    const biayaTambahanData = formValues.BiayaTambahan.map((item) => ({
      nama: item.nama,
      biaya: item.biaya,
      keuangan_id: formValues.id, // Hubungkan dengan ID Keuangan yang diperbarui
    }));

    const { error: insertError } = await supabase
      .from("BiayaTambahan")
      .insert(biayaTambahanData);

    if (insertError) {
      console.error("Error inserting new BiayaTambahan:", insertError.message);
      return { success: false, error: insertError.message };
    }

    console.log(`Inserted ${biayaTambahanData.length} new BiayaTambahan`);
  }

  revalidatePath("/keuangan");
  return { success: true };
};


/**
 * Deletes a keuangan record from the Keuangan table based on the given keuanganId.
 * Revalidates the keuangan path upon successful deletion.
 *
 * @param {number} keuanganId - ID of the keuangan to delete
 * @returns {Promise<{success: boolean, error?: string}>} - An object indicating success or failure,
 *   with an optional error message if the operation fails
 */

export const deleteKeuanganAction = async (keuanganId: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("Keuangan")
    .delete()
    .eq("id", keuanganId);
  if (error) {
    console.error("Error deleting keuangan:", error.message);
    return { success: false, error: error.message };
  }
  console.log(`Keuangan with ID ${keuanganId} deleted successfully`);
  revalidatePath("/keuangan");
  return { success: true };
};


export const deleteStatusAktifAction = async (keuanganId: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("Keuangan")
    .update({ statusAktif: false })
    .eq("id", keuanganId);
  if (error) {
    console.error("Error deleting keuangan:", error.message);
    return { success: false, error: error.message };
  }
  console.log(`Keuangan with ID ${keuanganId} deleted successfully`);
  revalidatePath("/keuangan");
  return { success: true };
}
export const undoStatusAktifAction = async (keuanganId: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("Keuangan")
    .update({ statusAktif: true })
    .eq("id", keuanganId);
  if (error) {
    console.error("Error restoring keuangan:", error.message);
    return { success: false, error: error.message };
  }
  console.log(`Keuangan with ID ${keuanganId} restored successfully`);
  revalidatePath("/keuangan");
  return { success: true };
}


/**
 * Fetch all cicilan data for the given keuanganId.
 * If there is an error, return an empty array.
 * @param {number} keuanganId
 * @returns {CicilanType[]}
 */
export const getCicilanAction = async (keuanganId: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Cicilan")
    .select()
    .eq("keuangan_id", keuanganId);
  if (error) {
    console.error("Error fetching data:", error.message);
    return []; // Kembalikan array kosong jika terjadi error
  }
  return data; // Kembalikan data langsung sebagai array
};


/**
 * Create a new cicilan
 * @param {object} formValues - Object containing cicilan data
 * @property {number} keuangan_id - ID of the related Keuangan
 * @property {number} cicilanKe - Sequence number of the cicilan
 * @property {number} nominalCicilan - Nominal value of the cicilan
 * @property {string} tanggalPembayaran - Date of the cicilan
 * @returns {Promise<object>} - Promise resolving to an object containing
 *   a boolean indicating success, an error message if applicable, and
 *   the created cicilan data if successful
 */
export const createCicilanAction = async (formValues: any) => {
  console.log("Form Values yang akan dikirim:", formValues);
  const supabase = createClient();

  try {
    // Tambahkan cicilan baru
    const { data, error } = await supabase.from("Cicilan").insert({
      keuangan_id: formValues.keuangan_id,
      cicilanKe: formValues.cicilanKe,
      nominalCicilan: formValues.nominalCicilan,
      tanggalPembayaran: formValues.tanggalPembayaran,
    });

    if (error) {
      console.error("Error creating cicilan:", error.message);
      return { success: false, error: error.message };
    }

    console.log("Cicilan created:", data);

    // Update sisaTagihan setelah cicilan ditambahkan
    const updatedSisaTagihan = await updateSisaTagihan(formValues.keuangan_id);

    if (updatedSisaTagihan === null) {
      console.error("Failed to update sisa tagihan");
      return { success: false, error: "Failed to update sisa tagihan" };
    }

    // Revalidate path (opsional, bergantung pada implementasi routing Anda)
    revalidatePath(`/keuangan/${formValues.keuangan_id}`);

    return { success: true, data: data, updatedSisaTagihan };
  } catch (err: any) {
    console.error("Unexpected error:", err.message);
    return { success: false, error: err.message };
  }
};

/**
 * Update an existing cicilan
 * @param {object} formValues - Object containing cicilan data to update
 * @property {number} id - ID of the cicilan to update
 * @property {number} keuangan_id - ID of the related Keuangan
 * @property {number} cicilanKe - Sequence number of the cicilan
 * @property {number} nominalCicilan - Nominal value of the cicilan
 * @property {string} tanggalPembayaran - Date of the cicilan
 * @returns {Promise<object>} - Promise resolving to an object containing
 *   a boolean indicating success, an error message if applicable, and
 *   the updated cicilan data if successful
 */
export const updateCicilanAction = async (formValues: any) => {
  const supabase = createClient();
  console.log("Form Values yang akan dikirim:", formValues);

  if (!formValues.id) {
    console.error("ID tidak ditemukan!");
    return { success: false, error: "ID tidak ditemukan!" };
  }

  // Update cicilan di tabel Cicilan
  const { data, error } = await supabase
    .from("Cicilan")
    .update({
      keuangan_id: formValues.keuangan_id,
      cicilanKe: formValues.cicilanKe,
      nominalCicilan: formValues.nominalCicilan,
      tanggalPembayaran: formValues.tanggalPembayaran,
    })
    .eq("id", formValues.id)
    .select("id")
    .single();

  if (error) {
    console.error("Error updating cicilan:", error.message);
    return { success: false, error: error.message };
  }

  console.log(`Cicilan with ID ${formValues.id} updated successfully`);

  // Update sisaTagihan setelah nominalCicilan diperbarui
  const updatedSisaTagihan = await updateSisaTagihan(formValues.keuangan_id);

  if (updatedSisaTagihan === null) {
    console.error("Failed to update sisa tagihan");
    return { success: false, error: "Failed to update sisa tagihan" };
  }

  // Revalidate path (opsional, bergantung pada implementasi routing Anda)
  revalidatePath(`/keuangan/${formValues.keuangan_id}`);

  return { success: true, data, updatedSisaTagihan };
};

/**
 * Deletes a cicilan record and updates the sisaTagihan field in Keuangan table.
 *
 * @param {number} cicilanId - ID of the cicilan to delete
 * @param {number} keuanganId - ID of the keuangan related to the cicilan
 * @returns {Promise<{success: boolean, error?: string}>} - An object indicating success or failure,
 *   with an optional error message if the operation fails
 */
export const deleteCicilanAndUpdateSisaTagihan = async (
  cicilanId: number,
  keuanganId: number
) => {
  const supabase = createClient();

  // Step 1: Delete cicilan
  const { error: deleteError } = await supabase
    .from("Cicilan")
    .delete()
    .eq("id", cicilanId);

  if (deleteError) {
    console.error("Error deleting cicilan:", deleteError.message);
    return { success: false, error: deleteError.message };
  }

  // Step 2: Update sisaTagihan after deleting cicilan
  const updatedSisaTagihan = await updateSisaTagihan(keuanganId);

  if (updatedSisaTagihan === null) {
    return {
      success: false,
      error: "Failed to update sisaTagihan after deleting cicilan",
    };
  }

  revalidatePath(`/keuangan/${keuanganId}`);
  return { success: true };
};

/**
 * Update sisaTagihan field in Keuangan table based on the total of all cicilan
 * payments made for the given keuanganId.
 *
 * @param {number} keuanganId - ID of the keuangan to update
 * @returns {number|null} Updated sisaTagihan or null if any error occurs
 */
export const updateSisaTagihan = async (keuanganId: number) => {
  const supabase = createClient();

  // 1. Fetch total cicilan yang sudah dibayarkan
  const { data: cicilanData, error: cicilanError } = await supabase
    .from("Cicilan")
    .select("nominalCicilan")
    .eq("keuangan_id", keuanganId);

  if (cicilanError) {
    console.error("Error fetching cicilan:", cicilanError.message);
    return null;
  }

  const totalCicilanDibayar = cicilanData.reduce(
    (total: number, cicilan: { nominalCicilan: number }) =>
      total + cicilan.nominalCicilan,
    0
  );

  // 2. Fetch keuangan data untuk totalTagihan
  const { data: keuanganData, error: keuanganError } = await supabase
    .from("Keuangan")
    .select("totalTagihan")
    .eq("id", keuanganId)
    .single();

  if (keuanganError) {
    console.error("Error fetching keuangan:", keuanganError.message);
    return null;
  }

  const totalTagihan = keuanganData?.totalTagihan || 0;

  // 3. Calculate sisaTagihan
  const sisaTagihan = totalTagihan - totalCicilanDibayar;

  // 4. Update sisaTagihan in Keuangan table
  const { error: updateError } = await supabase
    .from("Keuangan")
    .update({ sisaTagihan })
    .eq("id", keuanganId);

  if (updateError) {
    console.error("Error updating sisaTagihan:", updateError.message);
    return null;
  }

  return sisaTagihan;
};

export const updateStatusLunas = async (keuanganId: number) => {
  const supabase = createClient();
  // Melakukan update status 'lunas' pada tabel Keuangan
  const { data, error } = await supabase
    .from("Keuangan")
    .update({ status: StatusType.LUNAS }) // Menggunakan enum StatusType.LUNAS
    .eq("id", keuanganId); // Mencocokkan berdasarkan keuanganId yang diberikan

  if (error) {
    console.error("Error updating status lunas:", error.message);
    return { success: false, error: error.message };
  }

  return { success: true, data };
};

export const getFileUrl = async (keuanganId: number, cicilanKe: number) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("Cicilan")
    .select("lampiran")
    .eq("keuangan_id", keuanganId)
    .eq("cicilanKe", cicilanKe)
    .single();

  if (error) {
    console.error("Error fetching file URL:", error.message);
    return { success: false, error: error.message };
  }

  console.log("File URL:", data.lampiran);

  return { success: true, data };
};


export const getVisaUrl = async (jamaah_id: string): Promise<string | null> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("jenis_dokumen")
    .select("file")
    .eq("jamaah_id", jamaah_id)
    .eq("nama_dokumen", "Visa")
    .single();

  if (error) {
    console.error("Error fetching visa URL:", error);
    return null; // Pastikan mengembalikan null jika ada error
  }

  return data?.file || null; // Mengembalikan URL atau null jika tidak ada data
};
