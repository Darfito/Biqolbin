"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";

export const getCmsAction = async () => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data: paket, error } = await supabase.from("Paket").select("*");

  if (error) {
    console.error("Error fetching Paket:", error.message);
    return null;
  }

  return paket; // Mengembalikan data pengguna
};

export const createCmsAction = async (paketData: Record<string, any>) => {
  const supabase = createClient(); // Membuat instance Supabase client

  // Ensure that publish is set to false if not provided in paketData
  const dataWithPublish = {
    ...paketData,
    publish: paketData.publish ?? false, // Default to false if publish is not provided
  };

  // Memasukkan data ke dalam tabel `Paket`
  const { data, error } = await supabase
    .from("Paket")
    .insert([dataWithPublish])  // Insert the modified data
    .select();

  if (error) {
    console.error("Error creating Paket:", error.message);
    return { success: false, error: error.message };
  }

  console.log("Paket created:", data);
  revalidatePath("/cms");
  return { success: true, data };
};


export const updateCmsAction = async (paketData: Record<string, any>) => {
  const supabase = createClient(); // Membuat instance Supabase client

  // Memasukkan data ke dalam tabel `Paket`
  const { data, error } = await supabase
    .from("Paket")
    .update(paketData)
    .eq("id", paketData.id)
    .select();

  if (error) {
    console.error("Error update Paket:", error.message);
    return { success: false, error: error.message };
  }
  console.log("Paket updated:", data);
  revalidatePath("/cms");
  return { success: true, data };
};



export const sanitizeFolderName = (name: string): string => {
  if (typeof name !== "string") {
    throw new Error("Expected a string for folder name");
  }
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
};

