import React from "react";
import JamaahDetail from "./component/JamaahDetail";

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
  <JamaahDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} />
  </>;
}
