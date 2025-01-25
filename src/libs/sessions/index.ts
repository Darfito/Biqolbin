"use server";

import { createClient } from "../supabase/server";

export async function getLoggedInUser() {
    const supabase = createClient();
  
    // Mendapatkan informasi user saat ini
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    console.log("user loggin ",user);
  
    if (error) {
      console.error("Error fetching user:", error.message);
      return null;
    }
  
    return user;
}

export async function getUserById(userId: string) {
    const supabase = createClient();
  
    // Query tabel Users berdasarkan ID
    const { data, error } = await supabase
      .from('Users')  // Nama tabel yang ingin Anda query
      .select('*')    // Pilih semua kolom yang dibutuhkan
      .eq('id', userId); // Kondisi pencarian berdasarkan ID
  
    if (error) {
      console.error("Error fetching user data:", error.message);
      return null;  // Mengembalikan null jika terjadi error
    }
  
    return data;  // Mengembalikan data pengguna yang ditemukan
  }