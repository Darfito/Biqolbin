'use server'

import { createClient } from '@/libs/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'



export async function login(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return { success: false, error: error.message };
  }

  // Tidak menggunakan redirect di sini
  return { success: true };
}


export async function signup(formData: { email: string, password: string }) {
  const supabase = await createClient();

  // type-casting here for convenience
  const data = {
    email: formData.email,
    password: formData.password,
  };

  const { error } = await supabase.auth.signUp(data);

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true };
}
