'use server';

import React from "react";
import JamaahDetail from "./component/JamaahDetail";
import { getCmsAction } from "../../cms/action";

export default async function DetailJamaah({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let paketData = [];

  try {
    paketData = await getCmsAction() ?? [];
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];

  const breadcrumbLinks = [
    { label: "Jamaah", href: "/jamaah" },
    { label: `${(await params).id}` }, // No href for the current page
  ];
  return <>
  <JamaahDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} paketData={stablePaketData} />
  </>;
}
