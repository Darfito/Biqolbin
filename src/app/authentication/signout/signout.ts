"use server"
// import { createClient } from '@/libs/supabase/server'
// import { revalidatePath } from 'next/cache'
// import { type NextRequest, NextResponse } from 'next/server'

// export async function POST(req: NextRequest) {
//   const supabase = await createClient()

//   // Check if a user's logged in
//   const {
//     data: { user },
//   } = await supabase.auth.getUser()

//   if (user) {
//     await supabase.auth.signOut()
//   }

//   revalidatePath('/', 'layout')
//   return NextResponse.redirect(new URL('/authentication/login', req.url), {
//     status: 302,
//   })
// }


import { createClient } from '@/libs/supabase/server';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createClient();

  if (req.method === 'POST') {
    const { data: { user }, error } = await supabase.auth.getUser();

    if (user) {
      await supabase.auth.signOut();
      return res.status(200).json({ message: 'Signed out successfully' });
    } else {
      return res.status(400).json({ error: 'User not found' });
    }
  }

  return res.status(405).json({ error: 'Method Not Allowed' });
}
