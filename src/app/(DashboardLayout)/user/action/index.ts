'use server';

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";

export const getUserAction = async () => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data: User, error } = await supabase.from("User").select("*");

  if (error) {
    console.error("Error fetching users:", error.message);
    return null;
  }

  return User; // Mengembalikan data pengguna
};

export const createUserAction = async (userData: Record<string, any>) => {
  const supabase = createClient(); // Membuat instance Supabase client

  // Memasukkan data ke dalam tabel `User`
  const { data, error } = await supabase
    .from("User")
    .insert([userData])
    .select();

  if (error) {
    console.error("Error creating user:", error.message);
    return { success: false, error: error.message };
  }
  console.log("User created:", data);
	revalidatePath("/user");
  return { success: true, data };
};
