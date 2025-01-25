"use server";

import { createClient } from '@/libs/supabase/server';
import { NextResponse } from 'next/server';

export async function POST() {
  const supabase = createClient();

  // Mendapatkan user yang sedang login
  const { data: { user }, error } = await supabase.auth.getUser();

  if (user) {
    // Jika user ditemukan, lakukan signOut
    await supabase.auth.signOut();
    return NextResponse.redirect('/authentication/login'); // Redirect ke halaman login setelah logout
  } else {
    // Jika user tidak ditemukan
    return NextResponse.json({ error: 'No user signed in' }, { status: 400 });
  }
}
