'use server';

import { getCmsAction } from "./action";
import CMS from "./component/CMS";



export default async function CMSPage() {
  const paketData = await getCmsAction();
  console.log("Paket data:", paketData);
  return (
    <>
      <CMS data={paketData || []} />
    </>
  );
}
