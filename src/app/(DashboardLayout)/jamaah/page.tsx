'use server';

import { getCmsAction } from "../cms/action";
import Jamaah from "./component/Jamaah";


export default async function JamaahPage() {
  const paketData = await getCmsAction();
    console.log("Paket data:", paketData);
  return (
    <>
      <Jamaah paketData={paketData ||[]} />
    </>
  );
}
