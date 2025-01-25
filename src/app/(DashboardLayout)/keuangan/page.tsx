"use server";

import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { getCmsAction } from "../cms/action";
import { getJamaahAction } from "../jamaah/action";
import {
  JamaahInterface,
  KeuanganInterface,
  PaketInterface,
  StatusType,
} from "../utilities/type";

import Keuangan from "./component/Keuangan"; // Client Component
import { getKeuanganAction, getKeuanganActionCabang } from "./action";

export default async function KeuanganPage() {
  let paketData: PaketInterface[] = [];
  let jamaahData: JamaahInterface[] = [];
  let keuanganData: KeuanganInterface[] = [];
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

    // Ambil data paket, jamaah, dan keuangan
    paketData = (await getCmsAction()) ?? [];
    jamaahData = await getJamaahAction();

    if (roleUser === "Superadmin") {

      keuanganData = (await getKeuanganAction()) ?? [];
    } else {
      keuanganData = await getKeuanganActionCabang(cabangUser);
    }

    console.log("keungan data di page", keuanganData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];
  const stableKeuanganData = keuanganData || [];

  // Hitung statistik
  const totalJamaah = stableKeuanganData.length;
  const belumLunas = stableKeuanganData.filter(
    (keuangan) => keuangan.status !== StatusType.LUNAS
  ).length;
  const lunas = stableKeuanganData.filter(
    (keuangan) => keuangan.status === StatusType.LUNAS
  ).length;

  // Konfigurasi score card
  const dynamicScoreCardJamaah = [
    {
      title: "Total Jamaah",
      total: totalJamaah,
      color: "#3E74FF",
      icon: "IconUser", // Kirim nama ikon sebagai string
    },
    {
      title: "Belum Lunas",
      total: belumLunas,
      color: "#F54F63",
      icon: "IconProgress", // Kirim nama ikon sebagai string
    },
    {
      title: "Lunas",
      total: lunas,
      color: "#F5BD4F",
      icon: "IconReceipt", // Kirim nama ikon sebagai string
    },
  ];

  return (
    <>
      <Keuangan
        paketData={stablePaketData}
        jamaahData={stableJamaahData}
        keuanganData={stableKeuanganData}
        scoreCardData={dynamicScoreCardJamaah}
      />
    </>
  );
}
