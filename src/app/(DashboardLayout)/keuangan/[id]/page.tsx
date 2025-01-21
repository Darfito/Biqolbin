"use server"

import React from 'react'
import KeuanganDetail from './component/KeuanganDetail'
import { getCmsAction } from '../../cms/action';
import { getJamaahAction } from '../../jamaah/action';
import { PaketInterface, JamaahInterface } from '../../utilities/type';



export default async function DetailKeuangan({
    params,
  }: {
    params: Promise<{ id: number }>
  }) {

    const breadcrumbLinks = [
      { label: "Keuangan", href: "/keuangan" },
      { label: `${(await params).id}` }, // No href for the current page
    ];

    let paketData: PaketInterface[] = [];
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

    return(
      <>
      <KeuanganDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} paketData={stablePaketData} jamaahData={stableJamaahData} />
      </>
    )
      
  }