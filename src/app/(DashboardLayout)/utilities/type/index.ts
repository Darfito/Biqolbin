import React from "react"

export type CardStatsHorizontalWithBorderProps = {
    title: string
    total: number
    color?: string
    icon: React.ElementType
  }

  export interface KeuanganType {
    id: number;
    nama: string;
    jenisPaket : PaketInterface
    metodePembayaran: MetodePembayaranType
    jumlahTagihan: number
    sisaTagihan: number
    tanggalPembayaran: Date
    status: StatusType
    action?: string; // Optional field for action
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
