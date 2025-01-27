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
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];

  // Hitung statistik
  const totalJamaah = jamaahData.length;
  const belumBerangkat = jamaahData.filter(
    (jamaah) => jamaah.status === "Berangkat"
  ).length;
  const berangkat = jamaahData.filter(
    (jamaah) => jamaah.status === "Berangkat"
  ).length
  const selesai = jamaahData.filter(
    (jamaah) => jamaah.status === "Selesai"
  ).length;

  const dynamicScoreCardJamaah = [
    {
      title: "Total Jamaah",
      total: totalJamaah,
      color: "#3E74FF",
      icon: "IconUser", // Kirim nama ikon sebagai string
    },
    {
      title: "Belum Berangkat",
      total: belumBerangkat,
      color: "#F54F63",
      icon: "IconLuggage", // Kirim nama ikon sebagai string
    },
    {
      title: "Berangkat",
      total: berangkat,
      color: "#ADD8E6",
      icon: "IconPlaneInflight", // Kirim nama ikon sebagai string
    },
    {
      title: "Selesai",
      total: selesai,
      color: "#4CAF50",
      icon: "IconPlaneArrival", // Kirim nama ikon sebagai string
    },
  ];


  return (
    <>
      <Jamaah paketData={stablePaketData} jamaahData={stableJamaahData}  scoreCardData={dynamicScoreCardJamaah}  />
    </>
  );
}

