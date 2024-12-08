import React from 'react'
import KeuanganDetail from './component/KeuanganDetail'



export default async function DetailKeuangan({
    params,
  }: {
    params: Promise<{ id: string }>
  }) {

    const breadcrumbLinks = [
      { label: "Keuangan", href: "/keuangan" },
      { label: `${(await params).id}` }, // No href for the current page
    ];
    return(
      <>
      <KeuanganDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} />
      </>
    )
      
  }