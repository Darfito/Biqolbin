'use server';

import { redirect } from "next/navigation";
import Dashboard from "./component/Dashboard";
import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { CabangInterface } from "../utilities/type";
import { getCabangAction } from "../user/action";


export default async function DashboardPage() {
  let cabangUser = 0;
  let roleUser = "";
  let cabangData: CabangInterface[] = [];

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
    cabangData = (await getCabangAction()) ?? [];

    // Daftar role yang diizinkan
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  const allowedRoles = ["Admin", "Superadmin", "Divisi General Affair", "Finance & Accounting", "Marketing"]


  if (!allowedRoles.includes(roleUser)) {
    redirect("/not-authorized"); // Ganti dengan halaman not-authorized Anda
  }

  const stableCabangData = cabangData || [];





  return (
    <Dashboard cabang={cabangUser} roleUser={roleUser} cabangData={stableCabangData}/>
  )
}
