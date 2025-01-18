'use server';

import { getCmsAction } from "../cms/action";
import { JamaahInterface } from "../utilities/type";

import { getJamaahAction } from "./action";
import Jamaah from "./component/Jamaah";

// Ini adalah React Server Component (RSC) yang dapat dipanggil di dalam aplikasi.
export default async function JamaahPage() {
  let paketData = [];
  let jamaahData: JamaahInterface[] = [];

  try {
    paketData = await getCmsAction() ?? [];
    jamaahData = await getJamaahAction();
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
      title: "Selesai",
      total: selesai,
      color: "#F5BD4F",
      icon: "IconPlaneArrival", // Kirim nama ikon sebagai string
    },
  ];


  return (
    <>
      <Jamaah paketData={stablePaketData} jamaahData={stableJamaahData}  scoreCardData={dynamicScoreCardJamaah}  />
    </>
  );
}

