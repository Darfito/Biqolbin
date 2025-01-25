'use server';

import React from "react";
import JamaahDetail from "./component/JamaahDetail";
import { getCmsAction } from "../../cms/action";
import { JamaahInterface, JenisKelamin, JenisPaket, JenisPenerbangan, Maskapai, TipeKamar } from "../../utilities/type";
import { getJamaahDataById } from "../action";

export default async function DetailJamaah({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let paketData = [];
  let jamaahData: JamaahInterface = {
    nama: "",
    ayahKandung: "",
    noTelp: "",
    email: "",
    jenisKelamin: JenisKelamin.LakiLaki,
    tempatLahir: "",
    pernikahan: false,
    alamat: "",
    varianKamar: TipeKamar.DOUBLE,
    kewarganegaraan: false,
    pekerjaan: "",
    kursiRoda: false,
    riwayatPenyakit: "",
    jenisDokumen: [],
    jenisPaket: {
      id: 0,
        nama: "",
        jenis: JenisPaket.REGULAR,
        maskapai: Maskapai.SAUDIA_ARABIA,
        customMaskapai: "",
        jenisPenerbangan: JenisPenerbangan.DIRECT,
        noPenerbangan: "",
        keretaCepat: false,
        tglKeberangkatan: "",
        tglKepulangan: "",
        fasilitas: [],
        publish: false,
        namaMuthawif: "",
        noTelpMuthawif: "",
        Hotel: [],
        gambar_url: "",
        hargaDouble: 0,
        hargaTriple: 0,
        hargaQuad: 0,
    },
    berangkat: "",
    selesai: "",
    status: "Berangkat"
  };

  try {
    paketData = await getCmsAction() ?? [];

    const jamaahResponse = await getJamaahDataById((await params).id);
    jamaahData = jamaahResponse || []

  } catch (error) {
    console.error("Error fetching data:", error);
  }

  // Gunakan data fallback jika ada error
  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];
 

  const breadcrumbLinks = [
    { label: "Jamaah", href: "/jamaah" },
    { label: `${(await params).id}` }, // No href for the current page
  ];
  return <>
  <JamaahDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} paketData={stablePaketData} jamaahData={stableJamaahData} />
  </>;
}
