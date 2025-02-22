import React from "react";
import CMSDetail from "./components/CMSDetail";
import { getLoggedInUser, getUserById } from "@/libs/sessions";


export default async function DetailCMS({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let roleUser = "";

  // Ambil data user yang sedang login
  const userLoginResponse = await getLoggedInUser();

  if (userLoginResponse) {
    // Ambil detail user berdasarkan ID
    const userDetails = await getUserById(userLoginResponse.id);

    // Ambil data role user
    roleUser = userDetails?.[0].role || "";
  }
  const breadcrumbLinks = [
    { label: "CMS", href: "/cms" },
    { label: `${(await params).id}` }, // No href for the current page
  ];
  return <>
  <CMSDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} roleUser={roleUser}/>
  </>;
}
