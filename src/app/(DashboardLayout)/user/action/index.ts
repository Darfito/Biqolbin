'use server';

import { createClient } from "@/libs/supabase/server";
import { UserInterface } from "../../utilities/type";


export const getCabangAction = async () => {
  const supabase = createClient();
  const { data: Cabang, error} = await supabase.from("Cabang").select("*");

  if (error) {
    console.error("Error fetching cabang: ", error.message)
    return null;
  }

  return Cabang
}

export const getUserAction = async () => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data: User, error } = await supabase.from("Users").select("*");

  if (error) {
    console.error("Error fetching users:", error.message);
    return null;
  }

  return User; // Mengembalikan data pengguna
};

export const getUserCabangAction = async (cabang: number) => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data: User, error } = await supabase.from("Users").select("*").eq("cabang_id", cabang);

  if (error) {
    console.error("Error fetching users:", error.message);
    return null;
  }

  return User; // Mengembalikan data pengguna
};

export const createUserAction = async (formValues: UserInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  console.log("Form Values di createuser:", formValues);
  try {
    // Signup ke Supabase Auth
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email: formValues.email,
      password: formValues.password || "",
    });

    if (signupError) {
      console.error("Error during signup:", signupError.message);
      return { success: false, error: signupError.message };
    }

    // Masukkan data ke dalam tabel `User`
    const { error: insertError } = await supabase.from("Users").insert({
      id: authData.user?.id,
      email: formValues.email,
      nama: formValues.nama,
      jenisKelamin: formValues.jenisKelamin,
      noTelp: formValues.noTelp,
      role: formValues.role,
      penempatan: formValues.penempatan.nama,
      alamatCabang: formValues.penempatan.alamatCabang,
      cabang_id: formValues.penempatan.id
    });

    if (insertError) {
      console.error("Error inserting user data:", insertError.message);
      return { success: false, error: insertError.message };
    }

    console.log("User created successfully");
    // revalidatePath("/user");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan tak terduga." };
  }
};


export const updateUserAction = async (UserData: UserInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  console.log("Form Values di updateuser:", UserData);
  // Memasukkan data ke dalam tabel `User`
  const { data, error } = await supabase
    .from("Users")
    .update({
      email: UserData.email,
      nama: UserData.nama,
      jenisKelamin: UserData.jenisKelamin,
      noTelp: UserData.noTelp,
      role: UserData.role,
      penempatan: UserData.penempatan.nama,
      alamatCabang: UserData.alamatCabang,
      cabang_id: UserData.penempatan.id
    })
    .eq("id", UserData.id)
    .select();

  if (error) {
    console.error("Error updating user:", error.message);
    return { success: false, error: error.message };
  }
  console.log("User updated:", data);
  // revalidatePath("/user");
  return { success: true, data };
}

export const getUserActionById = async (
  id: string
): Promise<{ success: boolean; data: UserInterface | null; error?: string }> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("Users")
    .select(`
      id,
      email,
      nama,
      jenisKelamin,
      noTelp,
      role,
      alamatCabang,
      cabang_id,
      Cabang (
        id,
        nama,
        alamatCabang,
        cabang_lat,
        cabang_long
      )
    `)
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching user:", error.message);
    return { success: false, data: null, error: error.message };
  }

  if (!data) {
    return { success: false, data: null, error: "No data returned" };
  }

  // Transform data sehingga properti "Cabang" dipetakan ke "penempatan"
  const user: UserInterface = {
    id: data.id,
    email: data.email,
    nama: data.nama,
    jenisKelamin: data.jenisKelamin,
    noTelp: data.noTelp,
    role: data.role,
    alamatCabang: data.alamatCabang,
    cabang_id: data.cabang_id,
    penempatan: Array.isArray(data.Cabang) ? data.Cabang[0] ?? null : data.Cabang ?? null,
  };

  return { success: true, data: user };
};


export const deleteUserAction = async (userId: string) => {
  const supabase = createClient(); // Pastikan client ini diinisialisasi dengan Service Role Key

  // Hapus dari Supabase Auth
  const { error: authError } = await supabase.auth.admin.deleteUser(userId);
  if (authError) {
    console.error("Error deleting user from auth:", authError.message);
    return { success: false, error: authError.message };
  }

  // Hapus dari tabel Users di schema public
  const { error: dbError } = await supabase
    .from("Users")
    .delete()
    .eq("id", userId);
    
  if (dbError) {
    console.error("Error deleting user from database:", dbError.message);
    return { success: false, error: dbError.message };
  }

  console.log(`User with ID ${userId} deleted successfully`);
  // revalidatePath("/user");
  return { success: true };
};