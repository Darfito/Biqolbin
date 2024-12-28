import React from "react";
import CMSDetail from "./components/CMSDetail";


export default async function DetailJamaah({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const breadcrumbLinks = [
    { label: "Jamaah", href: "/jamaah" },
    { label: `${(await params).id}` }, // No href for the current page
  ];
  return <>
  <CMSDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} />
  </>;
}
