"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { CabangInterface } from "../../utilities/type";

export const createCabangAction = async (formValues: CabangInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  console.log("Form Values di create cabang:", formValues);

  try {
    // Masukkan data ke dalam tabel `Cabang`

    const { data: cabangData, error: cabangError } = await supabase
      .from("Cabang")
      .insert({
        nama: formValues.nama,
        alamatCabang: formValues.alamatCabang,
        cabang_lat: formValues.cabang_lat,
        cabang_long: formValues.cabang_long,
      });

    if (cabangError) {
      console.error("Error inserting user data:", cabangError.message);
      return { success: false, error: cabangError.message };
    }

    console.log("Cabang created successfully");
    revalidatePath("/cabang");
    return { success: true, data: cabangData };
  } catch (error) {
    console.error("Error creating cabang:", error);
    return { success: false, error: "Terjadi Kesalahan saat menyimpan cabang" };
  }
};

export const updateCabangAction = async (formValues: CabangInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  const { data, error } = await supabase
    .from("Cabang")
    .update({
      nama: formValues.nama,
      alamatCabang: formValues.alamatCabang,
      cabang_lat: formValues.cabang_lat,
      cabang_long: formValues.cabang_long,
    })
    .eq("id", formValues.id)
    .select();

  if (error) {
    console.error("Error updating user data:", error.message);
    return { success: false, error: error.message };
  }

  console.log("Cabang updated:", data);
  revalidatePath("/cabang");
  return { success: true, data };
}

export const deleteCabangAction = async (CabangId: number) => {
  const supabase = createClient();

  const { error } = await supabase.from("Cabang").delete().eq("id", CabangId);

  if (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error: error.message };
  }
  console.log(`User with ID ${CabangId} deleted successfully`);
  revalidatePath("/user");
  return { success: true };
};
