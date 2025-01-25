'use server';

import { redirect } from "next/navigation";
import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { getCmsAction } from "./action";
import CMS from "./component/CMS";

export default async function CMSPage() {
  let roleUser = "";

  // Ambil data user yang sedang login
  const userLoginResponse = await getLoggedInUser();

  if (userLoginResponse) {
    // Ambil detail user berdasarkan ID
    const userDetails = await getUserById(userLoginResponse.id);

    // Ambil data role user
    roleUser = userDetails?.[0].role || "";
  }

  // Daftar role yang diizinkan
  const allowedRoles = ["Admin", "Superadmin", "Marketing"];

  // Redirect jika role user tidak diizinkan
  if (!allowedRoles.includes(roleUser)) {
    redirect("/not-authorized"); // Ganti dengan halaman not-authorized Anda
    return null; // Menghentikan rendering halaman
  }

  // Jika role sesuai, ambil data CMS
  const paketData = await getCmsAction();
  console.log("Paket data:", paketData);

  return (
    <>
      <CMS data={paketData || []} />
    </>
  );
}
