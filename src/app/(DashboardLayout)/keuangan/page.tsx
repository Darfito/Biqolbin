'use server';

import { getCmsAction } from "../cms/action";
import { getJamaahAction } from "../jamaah/action";
import { JamaahInterface } from "../utilities/type";
import Keuangan from "./component/Keuangan"; // Client Component

export default async function KeuanganPage() {
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


  return (
    <>
      <Keuangan paketData={stablePaketData} jamaahData={jamaahData} />
    </>
  );
}
