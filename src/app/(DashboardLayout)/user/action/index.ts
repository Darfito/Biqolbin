'use server';

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { UserInterface } from "../../utilities/type";


export const getUserAction = async () => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data: User, error } = await supabase.from("Users").select("*");

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
      password: formValues.password,
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
      penempatan: formValues.penempatan,
      alamatCabang: formValues.alamatCabang,
    });

    if (insertError) {
      console.error("Error inserting user data:", insertError.message);
      return { success: false, error: insertError.message };
    }

    console.log("User created successfully");
    revalidatePath("/user");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error:", error);
    return { success: false, error: "Terjadi kesalahan tak terduga." };
  }
};


export const updateUserAction = async (UserData: UserInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  // Memasukkan data ke dalam tabel `User`
  const { data, error } = await supabase
    .from("User")
    .update(UserData)
    .eq("id", UserData.id)
    .select();

  if (error) {
    console.error("Error updating user:", error.message);
    return { success: false, error: error.message };
  }
  console.log("User updated:", data);
  revalidatePath("/user");
  return { success: true, data };
}


export const deleteUserAction = async (userId: string) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("User")
    .delete()
    .eq("id", userId);

  if (error) {
    console.error("Error deleting user:", error.message);
    return { success: false, error: error.message };
  }
  console.log(`User with ID ${userId} deleted successfully`);
  revalidatePath("/user");
  return { success: true };
};

