'use server';

import { getCmsAction } from "../cms/action";
import { getJamaahAction } from "../jamaah/action";
import { JamaahInterface, KeuanganInterface, PaketInterface } from "../utilities/type";
import { getKeuanganAction } from "./action";
import Keuangan from "./component/Keuangan"; // Client Component

export default async function KeuanganPage() {
  let paketData: PaketInterface[] = [];
  let jamaahData: JamaahInterface[] = [];
  let keuanganData: KeuanganInterface[] = [];

  try {
    paketData = await getCmsAction() ?? [];
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


  return (
    <>
      <Keuangan paketData={stablePaketData} jamaahData={stableJamaahData} keuanganData={stableKeuanganData} />
    </>
  );
}
