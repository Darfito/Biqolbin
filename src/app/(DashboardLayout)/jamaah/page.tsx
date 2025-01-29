'use server';

import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { getCmsAction } from "../cms/action";
import { JamaahInterface } from "../utilities/type";

import { getJamaahAction, getJamaahCabangAction } from "./action";
import Jamaah from "./component/Jamaah";
import { redirect } from "next/navigation";

// Ini adalah React Server Component (RSC) yang dapat dipanggil di dalam aplikasi.
export default async function JamaahPage() {
  let paketData = [];
  let jamaahData: JamaahInterface[] = [];
  let cabangUser = 0;
  let roleUser = "";
  
  try {
    // Ambil data user yang sedang login
    const userLoginResponse = await getLoggedInUser();

    if (userLoginResponse) {
      // Ambil detail user berdasarkan ID
      const userDetails = await getUserById(userLoginResponse.id);
      // Ambil data penempatan cabang user
      cabangUser = userDetails?.[0].cabang_id || 0;
      roleUser = userDetails?.[0].role || "";
    }

    console.log("cabangUser", cabangUser);

    // Daftar role yang diizinkan
  const allowedRoles = ["Admin", "Superadmin", "Divisi General Affair", "Finance & Accounting"]


  if (!allowedRoles.includes(roleUser)) {
    redirect("/not-authorized"); // Ganti dengan halaman not-authorized Anda
  }


    paketData = await getCmsAction() ?? [];
    jamaahData = await getJamaahCabangAction(cabangUser);

    // Ambil data user berdasarkan role
    if (roleUser === "Superadmin") {
      jamaahData = (await getJamaahAction()) ?? [];
    } else {
      jamaahData = (await getJamaahCabangAction(cabangUser)) ?? [];
      console.log("jamaahData per cabang", jamaahData);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];


  return (
    <>
      <Jamaah paketData={stablePaketData} jamaahData={stableJamaahData} cabang_id={cabangUser} />
    </>
  );
}

