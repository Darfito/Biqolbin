import React from "react"

// ! GENERAL TYPE

export type CardStatsHorizontalWithBorderProps = {
    title: string
    total: number
    color?: string
    icon: React.ElementType
  }

  export type CardStatsProps = {
    title: string
    total: number
    color?: string
    icon: string
  }


// ! KEUANGAN TYPE
  export interface KeuanganInterface {
    id: number;
    nama: string;
    jenisPaket : PaketInterface
    metodePembayaran: MetodePembayaranType
    uangMuka?: number
    totalTagihan: number
    sisaTagihan: number
    jumlahBiayaPerAngsuran?: number
    tenggatPembayaran: string
    banyaknyaCicilan?: number
    catatanPembayaran?: string
    status: StatusType
    action?: string; // Optional field for action
    cicilan?: CicilanType[];
    paket_id?: number;
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



  // ! PAKET TYPE
  export interface PaketInterface {
    id?: number;
    nama: string;
    jenis: JenisPaket;
    maskapai: Maskapai; // Menggunakan enum Maskapai
    customMaskapai?: string; // Untuk maskapai lainnya jika memilih "Lainnya"
    jenisPenerbangan: JenisPenerbangan;
    noPenerbangan?: string;
    keretaCepat: boolean;
    tglKeberangkatan: string;
    tglKepulangan: string;
    fasilitas: string[];
    action?: string;
    publish?: boolean;
    namaMuthawif: string;
    noTelpMuthawif: string;
    hargaDouble: number; // Harga untuk kamar double
    hargaTriple: number; // Harga untuk kamar triple
    hargaQuad: number;   // Harga untuk kamar quad
    gambar_url?: string;
    Hotel?: HotelType[];
  }

  // ! TYPE HOTEL
  export type HotelType = {
    id?: number;
    namaHotel: string;
    alamatHotel: string;
    ratingHotel: number;
    tanggalCheckIn: string;
    tanggalCheckOut: string;
  }



  export enum Maskapai {
    SAUDIA_ARABIA = "Saudia Arabia",
    GARUDA_INDONESIA = "Garuda Indonesia",
    QATAR_AIRWAYS = "Qatar Airways",
    ETIHAD_AIRWAYS = "Etihad Airways",
    LION_AIRWAYS = "Lion Airways",
    LAINNYA = "Lainnya", // Opsi untuk memilih maskapai lainnya
  }


export enum JenisPaket{
  REGULAR = "REGULAR",
  VIP = "VIP",
}

export enum JenisPenerbangan {
  DIRECT = "DIRECT",
  TRANSIT = "TRANSIT",
}



// ! JAMAAH TYPE
export interface JamaahInterface {
  id?: number;
  nama: string;
  ayahKandung: string;
  noTelp: string;
  kontakDarurat?: KontakDaruratType[];
  email:string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  pernikahan: boolean;
  alamat: string;
  varianKamar: TipeKamar;
  kewarganegaraan: boolean;
  pekerjaan: string;
  kursiRoda: boolean;
  riwayatPenyakit: string;
  jenisDokumen: JenisDokumen[];
  jenisPaket : PaketInterface;
  berangkat: string; // tanggal berangkat dari paket
  selesai: string; // tanggal pulang dari paket
  status: StatusKepergian;
  paket_id?: number;
}

// ! INTERFACE USER
export interface UserInterface {
  id: number;
  nama: string;
  jenisKelamin: JenisKelamin;
  noTelp: string;
  role: Jabatan;
  penempatan: string;
  alamatCabang: string;
  action?: string
}

export enum Jabatan {
  DivisiGeneralAffair = "Divisi General Affair",
  Marketing = "Marketing",
  FinanceAccounting = "Finance & Accounting",
  Admin = "Admin",
  Superadmin = "Superadmin",
}

export type JenisDokumen ={
  id: number;
  nama_dokumen: string;
  file?: string
  lampiran: boolean
  action?: string
  jamaah_id?: number
}

export type KontakDaruratType = {
  id: number;
  nama: string;
  no_telp: string;
  hubungan: KontakDaruratRelation;
  relasiLain?: string;
}

// export type StatusKepergian = {
//   id: number;
//   status: 'Berangkat' | 'Dijadwalkan' | 'Selesai';
//   deskripsi?: string;
// }
export type StatusKepergian = 'Berangkat' | 'Dijadwalkan' | 'Selesai'

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



// ! TYPE KAMAR
export enum TipeKamar {
  QUAD = "QUAD",
  TRIPLE = "TRIPLE",
  DOUBLE = "DOUBLE",
}

