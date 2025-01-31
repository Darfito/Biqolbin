import React from "react";
import { string } from "valibot";

// ! GENERAL TYPE

export type CardStatsHorizontalWithBorderProps = {
  title: string;
  total: number;
  color?: string;
  icon: React.ElementType;
};

export type CardStatsProps = {
  title: string;
  total: number;
  color?: string;
  icon: React.ElementType; // Ganti dari string menjadi React.ElementType
};

// ! KEUANGAN TYPE
export interface KeuanganInterface {
  id?: number;
  created_at?: string;
  Jamaah: JamaahInterface;
  Paket: PaketInterface;
  // namaPaket?: string;
  // jenisPaket?: string;
  metodePembayaran: MetodePembayaranType;
  uangMuka?: number;
  totalTagihan: number;
  sisaTagihan?: number;
  jumlahBiayaPerAngsuran?: number;
  tenggatPembayaran: string;
  banyaknyaCicilan?: number;
  catatanPembayaran?: string;
  status: StatusType;
  action?: string; // Optional field for action
  Cicilan?: CicilanType[];
  paket_id?: number;
  statusPenjadwalan: StatusKepergian;
  visa?: string;
  statusAktif?: boolean;
  varianKamar: TipeKamar;
}

export type CicilanType = {
  keuangan_id?: number;
  id?: number;
  cicilanKe: number;
  nominalCicilan: number;
  tanggalPembayaran: string;
  lampiran?: string;
  action?: string;
};

export enum MetodePembayaranType {
  CICILAN = "Cicilan",
  TUNAI = "Tunai",
  TABUNGAN = "Tabungan",
}

export enum StatusType {
  BELUM_BAYAR = "Belum Bayar",
  SEDANG_MENYICIL = "Sedang Menyicil",
  SEDANG_MENABUNG = "Sedang Menabung",
  LUNAS = "Lunas",
}

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
  hargaQuad: number; // Harga untuk kamar quad
  gambar_url?: string;
  Hotel?: HotelType[];
  selectedFile?: File | null;
}

// ! TYPE HOTEL
export type HotelType = {
  id?: number;
  namaHotel: string;
  alamatHotel: string;
  ratingHotel: number;
  tanggalCheckIn: string;
  tanggalCheckOut: string;
};

export enum Maskapai {
  SAUDIA_ARABIA = "Saudia Arabia",
  GARUDA_INDONESIA = "Garuda Indonesia",
  QATAR_AIRWAYS = "Qatar Airways",
  ETIHAD_AIRWAYS = "Etihad Airways",
  LION_AIRWAYS = "Lion Airways",
  LAINNYA = "Lainnya", // Opsi untuk memilih maskapai lainnya
}

export enum JenisPaket {
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
  NIK: number;
  nama: string;
  cabang_id?: number;
  created_at?: string;
  tanggalLahir: Date;
  ayahKandung: string;
  noTelp: string;
  kontakDarurat?: KontakDaruratType[];
  email: string;
  jenisKelamin: JenisKelamin;
  tempatLahir: string;
  pernikahan: boolean;
  provinsi: string;
  alamat: string;
  kewarganegaraan: boolean;
  pekerjaan: string;
  // kursiRoda: boolean;
  riwayatPenyakit: string;
  jenisDokumen: JenisDokumen[];
  // jenisPaket?: PaketInterface;
  // varianKamar: TipeKamar;
  // berangkat: string; // tanggal berangkat dari paket
  // selesai: string; // tanggal pulang dari paket
  // status: StatusKepergian;
  // paket_id?: number;
}

// ! INTERFACE USER
export interface UserInterface {
  id?: string;
  email: string;
  nama: string;
  jenisKelamin: JenisKelamin;
  noTelp: string;
  role: Jabatan;
  penempatan: CabangInterface;
  alamatCabang: string;
  password?: string;
  cabang_id?: number
  confirmPassword?: string;
  action?: string;
}

export interface CabangInterface {
  id?: number;
  nama: string;
  alamatCabang: string;
  cabang_lat?: number;
  cabang_long?: number;
  action?:string;
}


export enum Jabatan {
  DivisiGeneralAffair = "Divisi General Affair",
  Marketing = "Marketing",
  FinanceAccounting = "Finance & Accounting",
  Admin = "Admin",
  Superadmin = "Superadmin",
}

export type JenisDokumen = {
  id: number;
  nama_dokumen: string;
  file?: string | null;
  lampiran: boolean;
  action?: string;
  actionEvent?: string;
  jamaah_id?: number;
};

export type KontakDaruratType = {
  id: number;
  nama: string;
  no_telp: string;
  hubungan: KontakDaruratRelation;
  relasiLain?: string;
};

export type StatusKepergian = "Belum Dijadwalkan" | "Berangkat" | "Dijadwalkan" | "Selesai";

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
  PILIHVARIANKAMAR = "PILIH VARIAN KAMAR",
}


export const provinces = [
  "Aceh", "Sumatera Utara", "Sumatera Barat", "Riau", "Kepulauan Riau", "Jambi", 
  "Sumatera Selatan", "Bangka Belitung", "Bengkulu", "Lampung",
  "DKI Jakarta", "Banten", "Jawa Barat", "Jawa Tengah", "DI Yogyakarta", "Jawa Timur",
  "Kalimantan Barat", "Kalimantan Tengah", "Kalimantan Selatan", "Kalimantan Timur", "Kalimantan Utara",
  "Sulawesi Utara", "Gorontalo", "Sulawesi Tengah", "Sulawesi Barat", "Sulawesi Selatan", "Sulawesi Tenggara",
  "Bali", "Nusa Tenggara Barat", "Nusa Tenggara Timur",
  "Maluku", "Maluku Utara", "Papua", "Papua Barat", "Papua Tengah", 
  "Papua Pegunungan", "Papua Selatan", "Papua Barat Daya"
];