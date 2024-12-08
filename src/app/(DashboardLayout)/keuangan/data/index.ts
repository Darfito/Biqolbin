import { CardStatsHorizontalWithBorderProps, KeuanganType, PaketInterface } from "../../utilities/type";
import { IconUser, IconProgress,IconReceipt } from "@tabler/icons-react";


export const scoreCardKeuangan: CardStatsHorizontalWithBorderProps[] = [
  {
    title: 'Total Jamaah',
    total: 1280,
    color: '#3E74FF',
    icon: IconUser,
  },
  {
    title: 'Sedang Diproses',
    total: 1280,
    color: '#F54F63',
    icon: IconProgress,
  },
  {
    title: 'Belum Diproses',
    total: 1280,
    color: '#F5BD4F',
    icon: IconReceipt,
  },
]



const PaketData: PaketInterface[] = [
  {
    id: "PKT001",
    nama: "Paket Regular 1",
    jenis: "REGULAR",
    maskapai: "Garuda Indonesia",
    jenisPenerbangan: "DIRECT",
    keretaCepat: false,
    harga: 1000000,
    tglKeberangkatan: new Date("2024-12-01"),
    tglKepulangan: new Date("2024-12-10"),
    fasilitas: "Hotel bintang 3, Transportasi lokal",
  },
  {
    id: "PKT002",
    nama: "Paket Regular 2",
    jenis: "REGULAR",
    maskapai: "Lion Air",
    jenisPenerbangan: "TRANSIT",
    keretaCepat: false,
    harga: 800000,
    tglKeberangkatan: new Date("2024-12-05"),
    tglKepulangan: new Date("2024-12-15"),
    fasilitas: "Hotel bintang 2, Transportasi lokal",
  },
  {
    id: "PKT003",
    nama: "Paket VIP 1",
    jenis: "VIP",
    maskapai: "Singapore Airlines",
    jenisPenerbangan: "DIRECT",
    keretaCepat: true,
    harga: 2000000,
    tglKeberangkatan: new Date("2024-12-10"),
    tglKepulangan: new Date("2024-12-20"),
    fasilitas: "Hotel bintang 5, Transportasi premium",
  },
];

export const KeuanganData: KeuanganType[] = [
  {
    id: 1,
    nama: "Keuangan 1",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 100000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Belum Bayar",
    jenisPaket: PaketData[0],
    cicilan: [
      {
        id: 1,
        cicilanKe: 1,
        jumlahCicilan: 100000,
        nominalCicilan: 50000,
        tanggalPembayaran: new Date("2024-04-01"),
        lampiran: "https://example.com/lampiran1.pdf",
      },
    ],
  },
  {
    id: 2,
    nama: "Keuangan 2",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 200000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menyicil",
    jenisPaket: PaketData[1],
    cicilan: [
      {
        id: 2,
        cicilanKe: 1,
        jumlahCicilan: 200000,
        nominalCicilan: 100000,
        tanggalPembayaran: new Date("2024-03-15"),
        lampiran: "https://example.com/lampiran2.pdf",
      },
    ],
  },
  {
    id: 3,
    nama: "Keuangan 3",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 100000,
    sisaTagihan: 0,
    tanggalPembayaran: new Date(),
    status: "Lunas",
    jenisPaket: PaketData[2]
  },
  {
    id: 4,
    nama: "Keuangan 4",
    metodePembayaran: "Tunai",
    jumlahTagihan: 200000,
    sisaTagihan: 0,
    tanggalPembayaran: new Date(),
    status: "Lunas",
    jenisPaket: PaketData[0]
  },
  {
    id: 5,
    nama: "Keuangan 5",
    metodePembayaran: "Tabungan",
    jumlahTagihan: 200000,
    sisaTagihan: 150000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menabung",
    jenisPaket: PaketData[1]
  },
  {
    id: 6,
    nama: "Keuangan 6",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 300000,
    sisaTagihan: 300000,
    tanggalPembayaran: new Date(),
    status: "Belum Bayar",
    jenisPaket: PaketData[2]
  },
  {
    id: 7,
    nama: "Keuangan 7",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 300000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menyicil",
    jenisPaket: PaketData[0]
  },
  {
    id: 8,
    nama: "Keuangan 8",
    metodePembayaran: "Tunai",
    jumlahTagihan: 500000,
    sisaTagihan: 0,
    tanggalPembayaran: new Date(),
    status: "Lunas",
    jenisPaket: PaketData[1]
  },
  {
    id: 9,
    nama: "Keuangan 9",
    metodePembayaran: "Tabungan",
    jumlahTagihan: 200000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menabung",
    jenisPaket: PaketData[2]
  },
  {
    id: 10,
    nama: "Keuangan 10",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 150000,
    sisaTagihan: 0,
    tanggalPembayaran: new Date(),
    status: "Lunas",
    jenisPaket: PaketData[0]
  },
  {
    id: 11,
    nama: "Keuangan 11",
    metodePembayaran: "Tunai",
    jumlahTagihan: 400000,
    sisaTagihan: 400000,
    tanggalPembayaran: new Date(),
    status: "Belum Bayar",
    jenisPaket: PaketData[1]
  },
  {
    id: 12,
    nama: "Keuangan 12",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 250000,
    sisaTagihan: 150000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menyicil",
    jenisPaket: PaketData[2]
  },
  {
    id: 13,
    nama: "Keuangan 13",
    metodePembayaran: "Tabungan",
    jumlahTagihan: 350000,
    sisaTagihan: 200000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menabung",
    jenisPaket: PaketData[0]
  },
  {
    id: 14,
    nama: "Keuangan 14",
    metodePembayaran: "Tunai",
    jumlahTagihan: 250000,
    sisaTagihan: 0,
    tanggalPembayaran: new Date(),
    status: "Lunas",
    jenisPaket: PaketData[1]
  },
  {
    id: 15,
    nama: "Keuangan 15",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 100000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Belum Bayar",
    jenisPaket: PaketData[2]
  },
  {
    id: 16,
    nama: "Keuangan 16",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 200000,
    sisaTagihan: 50000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menyicil",
    jenisPaket: PaketData[0]
  },
  {
    id: 17,
    nama: "Keuangan 17",
    metodePembayaran: "Tabungan",
    jumlahTagihan: 300000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menabung",
    jenisPaket: PaketData[1]
  },
  {
    id: 18,
    nama: "Keuangan 18",
    metodePembayaran: "Tunai",
    jumlahTagihan: 150000,
    sisaTagihan: 0,
    tanggalPembayaran: new Date(),
    status: "Lunas",
    jenisPaket: PaketData[2]
  },
  {
    id: 19,
    nama: "Keuangan 19",
    metodePembayaran: "Cicilan",
    jumlahTagihan: 200000,
    sisaTagihan: 100000,
    tanggalPembayaran: new Date(),
    status: "Sedang Menyicil",
    jenisPaket: PaketData[0]
  },
  {
    id: 20,
    nama: "Keuangan 20",
    metodePembayaran: "Tabungan",
    jumlahTagihan: 400000,
    sisaTagihan: 400000,
    tanggalPembayaran: new Date(),
    status: "Belum Bayar",
    jenisPaket: PaketData[1]
  }
];

