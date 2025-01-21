"use server";

import { getCmsAction } from "../cms/action";
import { getJamaahAction } from "../jamaah/action";
import {
  JamaahInterface,
  KeuanganInterface,
  PaketInterface,
  StatusType,
} from "../utilities/type";
import { getKeuanganAction } from "./action";
import Keuangan from "./component/Keuangan"; // Client Component

export default async function KeuanganPage() {
  let paketData: PaketInterface[] = [];
  let jamaahData: JamaahInterface[] = [];
  let keuanganData: KeuanganInterface[] = [];

  try {
    paketData = (await getCmsAction()) ?? [];
    jamaahData = await getJamaahAction();
    keuanganData = await getKeuanganAction();
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];
  const stableKeuanganData = keuanganData || [];

  console.log("stableJamaahData:", stableJamaahData);

  // Hitung statistik
  const totalJamaah = stableKeuanganData.length;
  const belumLunas = stableKeuanganData.filter(
    (keuangan) => keuangan.status !== StatusType.LUNAS
  ).length;
  const lunas = stableKeuanganData.filter(
    (keuangan) => keuangan.status === StatusType.LUNAS
  ).length;
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
      title: "lunas",
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
        keuanganData={stableKeuanganData} scoreCardData={dynamicScoreCardJamaah}      />
    </>
  );
}
