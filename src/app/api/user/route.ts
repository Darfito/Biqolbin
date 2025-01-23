import { createClient } from "@/libs/supabase/server";

export async function GET() {
  const supabase = createClient();

  // Mendapatkan informasi user saat ini
  const { data: { user }, error } = await supabase.auth.getUser();

  console.log("user loggin ",user);
  if (error) {
      console.error("Error fetching user:", error.message);
      return new Response(null, { status: 500 });
  }

  return new Response(JSON.stringify(user), { status: 200 });
}