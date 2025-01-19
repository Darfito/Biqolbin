"use server";

import { createClient } from "@/libs/supabase/server";
import { KeuanganInterface } from "../../utilities/type";
import { revalidatePath } from "next/cache";


export const getKeuanganAction = async () => {
	const supabase = createClient();
	const { data, error } = await supabase.from("Keuangan").select("*");
	if (error) {
		console.error("Error fetching data:", error.message);
		return { success: false, error: error.message };
	}
	return { success: true, data };
}

export const createKeuaganAction = async (formValues: KeuanganInterface) => {
  console.log("Form Values di create:", formValues);
  const supabase = createClient();

  // Step 1: Insert data Keuangan
  const { data: keuanganData, error: keuanganError } = await supabase
    .from("Keuangan")
    .insert({
      nama: formValues.nama,
      paket_id: formValues.jenisPaket.id, // Relasi ke Paket
      metodePembayaran: formValues.metodePembayaran,
      uangMuka: formValues.uangMuka,
      totalTagihan: formValues.totalTagihan,
      sisaTagihan: formValues.sisaTagihan,
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


