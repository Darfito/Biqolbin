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
    uangMuka?: number
    totalTagihan: number
    sisaTagihan: number
    jumlahBiayaPerAngsuran?: number
    tenggatPembayaran: Date
    banyaknyaCicilan?: number
    catatanPembayaran?: string
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
    maskapai: Maskapai; // Menggunakan enum Maskapai
    customMaskapai?: string; // Untuk maskapai lainnya jika memilih "Lainnya"
    jenisPenerbangan: JenisPenerbangan;
    noPenerbangan?: string;
    keretaCepat: boolean;
    harga: number;
    tglKeberangkatan: string;
    tglKepulangan: string;
    fasilitas: string[];
    action?: string;
    publish: boolean;
    namaMuthawif: string;
    noTelpMuthawif: string;
    namaHotel: string;
    alamatHotel: string;
    ratingHotel: number;
    tanggalCheckIn: string;
    tanggalCheckOut: string;
    gambar?: {
      id: number
      url: string; // URL gambar (untuk akses langsung)
      bucket: string; // Nama bucket di Supabase
      path: string; // Path file dalam bucket
    }; // Menyimpan URL gambar dari Supabase Bucket
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
  jenisDokumen: JenisDokumen[];
  jenisPaket : PaketInterface;
  berangkat: Date; // tanggal berangkat dari paket
  selesai: Date; // tanggal pulang dari paket
  status: StatusKepergian;
}




export type JenisDokumen ={
  id: number;
  namaDokumen: string;
  file?: string
  lampiran: boolean
  action?: string
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
}

