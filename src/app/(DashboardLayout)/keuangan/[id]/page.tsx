"use server";

import React from "react";
import KeuanganDetail from "./component/KeuanganDetail";
import { getCmsAction } from "../../cms/action";
import { getJamaahAction } from "../../jamaah/action";
import { getCicilanAction, getKeuanganByIdAction } from "../action";
import {
  PaketInterface,
  JamaahInterface,
  KeuanganInterface,
  CicilanType,
} from "../../utilities/type";

export default async function DetailKeuangan({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const breadcrumbLinks = [
    { label: "Keuangan", href: "/keuangan" },
    { label: `${(await params).id}` }, // No href for the current page
  ];

  let paketData: PaketInterface[] = [];
  let jamaahData: JamaahInterface[] = [];
  let keuanganData: KeuanganInterface | null = null;
  let dataCicilan: CicilanType[] = [];
  let nextCicilanKe: number = 0;

  try {
    paketData = (await getCmsAction()) ?? [];
    jamaahData = await getJamaahAction();

    const keuanganResponse = await getKeuanganByIdAction((await params).id);
    if (keuanganResponse) {
      keuanganData = keuanganResponse.keuangan;
      nextCicilanKe = keuanganResponse.nextCicilanKe;
    }

    dataCicilan = await getCicilanAction((await params).id);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];
  const stableKeuanganData = keuanganData || null;
  const stableDataCicilan = dataCicilan || [];
  const stableNextCicilanKe = nextCicilanKe || 0;

  return (
    <>
      <KeuanganDetail
        id={(await params).id}
        breadcrumbLinks={breadcrumbLinks}
        paketData={stablePaketData}
        jamaahData={stableJamaahData}
        keuanganData={stableKeuanganData}
        dataCicilan={stableDataCicilan}
        nextCicilanKe={stableNextCicilanKe}
      />
    </>
  );
}
