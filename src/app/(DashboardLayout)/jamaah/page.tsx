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
    // Memanggil getCmsAction
    paketData = await getCmsAction() ?? [];
    console.log("Paket data:", paketData);

    // Memanggil getJamaahAction
    jamaahData = await getJamaahAction();
    console.log("Jamaah data:", jamaahData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  return (
    <>
      {/* Kirimkan data yang telah di-fetch ke komponen Jamaah */}
      <Jamaah paketData={paketData} jamaahData={jamaahData} />
    </>
  );
}
