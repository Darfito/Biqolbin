import React from "react"

// ! GENERAL TYPE

export type CardStatsHorizontalWithBorderProps = {
    title: string
    total: number
    color?: string
    icon: React.ElementType
  }


// ! KEUANGAN TYPE
  export interface KeuanganProps {
    id: number;
    nama: string;
    jenisPaket : PaketInterface
    metodePembayaran: MetodePembayaranType
    jumlahTagihan: number
    sisaTagihan: number
    tanggalPembayaran: Date
    status: StatusType
    action?: string; // Optional field for action
    cicilan?: CicilanType[];
  }
  
export type CicilanType = {
  id: number;
  cicilanKe: number;
  jumlahCicilan: number;
  nominalCicilan: number;
  tanggalPembayaran: Date;
  lampiran?: string;
  action?: string;
}

  export type MetodePembayaranType = 'Cicilan' | 'Tunai' | 'Tabungan'

  export type StatusType = 'Belum Bayar' | 'Sedang Menyicil' | 'Sedang Menabung' | 'Lunas';

  export interface PaketInterface {
    id: string;
    nama: string;
    jenis: JenisPaket;
    maskapai : string;
    jenisPenerbangan:JenisPenerbangan;
    keretaCepat: boolean
    harga: number
    tglKeberangkatan: Date
    tglKepulangan: Date
    fasilitas: string
  }

export type JenisPaket = 'REGULAR' | 'VIP'

export type JenisPenerbangan = 'DIRECT' | 'TRANSIT'



// ! JAMAAH TYPE

export interface JamaahProps {
  id: number;
  nama: string;
  ayahKandung: string;
  noTelp: string;
  kontakDarurat: KontakDaruratType[];
  email:string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  perkawinan: boolean;
  alamat: string;
  varianKamar: KamarType;
  kewarganegaraan: boolean;
  pekerjaan: string;
  kursiRoda: boolean;
  riwayatPenyakit: string;
  jenisPaket : PaketInterface;
  berangkat: Date; // tanggal berangkat dari paket
  selesai: Date; // tanggal pulang dari paket
  status: StatusKepergian;
}

export type KontakDaruratType = {
  id: number;
  nama: string;
  noTelp: string;
  hubungan: KontakDaruratRelation;
  relasiLain?: string;
}

export type StatusKepergian = {
  id: number;
  status: 'Berangkat' | 'Dijadwalkan' | 'Selesai';
  deskripsi?: string;
}
// export type StatusKepergian = 'Berangkat' | 'Dijadwalkan' | 'Selesai'

export enum KontakDaruratRelation {
  Ayah = "Ayah",
  Ibu = "Ibu",
  Suami = "Suami",
  Istri = "Istri",
  Anak = "Anak",
  SaudaraKandung = "Saudara Kandung",
  KerabatLain = "Kerabat Lain",
  Teman = "Teman",
  Tetangga = "Tetangga",
  Lainnya = "Lainnya",
}

export enum JenisKelamin {
  LakiLaki = "Laki-Laki",
  Perempuan = "Perempuan",
}


// ! TYPE HOTEL
export type HotelType = {
  id: number;
  namaHotel: string;
  alamat: string;
  deskripsi: string;
}

// ! TYPE KAMAR

export type KamarType = {
  id: number;
  tipeKamar: TipeKamar;
  harga: number;
  deskripsi: string;
}


export enum TipeKamar {
  QUAD = "QUAD",
  TRIPLE = "TRIPLE",
  DOUBLE = "DOUBLE",
  CHILD = "CHILD",
  INFANT = "INFANT",
}

