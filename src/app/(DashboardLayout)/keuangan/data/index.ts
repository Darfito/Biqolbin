import { CardStatsHorizontalWithBorderProps, JenisPaket, JenisPenerbangan, KeuanganProps, PaketInterface } from "../../utilities/type";
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
    jenis: JenisPaket.REGULAR, // Enum digunakan di sini
    maskapai: "Garuda Indonesia",
    jenisPenerbangan: JenisPenerbangan.DIRECT, // Enum digunakan di sini
    keretaCepat: false,
    harga: 1000000,
    tglKeberangkatan: "2024-12-01", // Diubah menjadi string
    tglKepulangan: "2024-12-10", // Diubah menjadi string
    fasilitas: ["Hotel bintang 3", "Transportasi lokal"], // Diubah menjadi array string
    publish: true, // Properti baru sesuai tipe
  },
  {
    id: "PKT002",
    nama: "Paket Regular 2",
    jenis: JenisPaket.REGULAR,
    maskapai: "Lion Air",
    jenisPenerbangan: JenisPenerbangan.TRANSIT,
    keretaCepat: false,
    harga: 800000,
    tglKeberangkatan: "2024-12-05",
    tglKepulangan: "2024-12-15",
    fasilitas: ["Hotel bintang 2", "Transportasi lokal"],
    publish: false, // Properti baru sesuai tipe
  },
  {
    id: "PKT003",
    nama: "Paket VIP 1",
    jenis: JenisPaket.VIP,
    maskapai: "Singapore Airlines",
    jenisPenerbangan: JenisPenerbangan.DIRECT,
    keretaCepat: true,
    harga: 2000000,
    tglKeberangkatan: "2024-12-10",
    tglKepulangan: "2024-12-20",
    fasilitas: ["Hotel bintang 5", "Transportasi premium"],
    publish: true,
    gambar: {
      id: 1,
      url: "https://example.com/images/paket-vip-1.jpg",
      bucket: "travel-packages",
      path: "images/paket-vip-1.jpg",
    }, // Menambahkan properti gambar sesuai tipe
  },
];


export const KeuanganData: KeuanganProps[] = [
  {
    id: 1,
    nama: "Keuangan 1",
    metodePembayaran: "Cicilan",
    totalTagihan: 100000,
    banyaknyaCicilan: 6,
    jumlahBiayaPerAngsuran: 5000,
    uangMuka: 50000,
    sisaTagihan: 100000,
    tenggatPembayaran: new Date(),
    status: "Belum Bayar",
    catatanPembayaran: "Catatan Pembayaran",
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
      {
        id: 2,
        cicilanKe: 2,
        jumlahCicilan: 50000,
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
    banyaknyaCicilan: 5,
    totalTagihan: 200000,
    jumlahBiayaPerAngsuran: 5000,
    sisaTagihan: 100000,
    uangMuka: 50000,
    tenggatPembayaran: new Date(),
    status: "Sedang Menyicil",
    jenisPaket: PaketData[1],
    catatanPembayaran: "Catatan Pembayaran",
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
    uangMuka: 50000,
    jumlahBiayaPerAngsuran: 5000,
    banyaknyaCicilan: 7,
    totalTagihan: 100000,
    sisaTagihan: 0,
    tenggatPembayaran: new Date(),
    status: "Lunas",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[2]
  },
  {
    id: 4,
    nama: "Keuangan 4",
    metodePembayaran: "Tunai",
    uangMuka: 50000,
    totalTagihan: 200000,
    jumlahBiayaPerAngsuran: 5000,
    sisaTagihan: 0,
    tenggatPembayaran: new Date(),
    status: "Lunas",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[0]
  },
  {
    id: 5,
    nama: "Keuangan 5",
    metodePembayaran: "Tabungan",
    uangMuka: 50000,
    totalTagihan: 200000,
    sisaTagihan: 150000,
    tenggatPembayaran: new Date(),
    status: "Sedang Menabung",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[1]
  },
  {
    id: 6,
    nama: "Keuangan 6",
    metodePembayaran: "Cicilan",
    banyaknyaCicilan: 8,
    jumlahBiayaPerAngsuran: 5000,
    uangMuka: 50000,
    totalTagihan: 300000,
    sisaTagihan: 300000,
    tenggatPembayaran: new Date(),
    status: "Belum Bayar",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[2]
  },
  {
    id: 7,
    nama: "Keuangan 7",
    metodePembayaran: "Cicilan",
    jumlahBiayaPerAngsuran: 5000,
    banyaknyaCicilan: 9,
    uangMuka: 50000,
    totalTagihan: 300000,
    sisaTagihan: 100000,
    tenggatPembayaran: new Date(),
    status: "Sedang Menyicil",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[0]
  },
  {
    id: 8,
    nama: "Keuangan 8",
    metodePembayaran: "Tunai",
    uangMuka: 50000,
    totalTagihan: 500000,
    sisaTagihan: 0,
    tenggatPembayaran: new Date(),
    status: "Lunas",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[1]
  },
  {
    id: 9,
    nama: "Keuangan 9",
    metodePembayaran: "Tabungan",
    totalTagihan: 200000,
    sisaTagihan: 100000,
    tenggatPembayaran: new Date(),
    status: "Sedang Menabung",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[2]
  },
  {
    id: 10,
    nama: "Keuangan 10",
    metodePembayaran: "Cicilan",
    banyaknyaCicilan: 10,
    jumlahBiayaPerAngsuran: 5000,
    uangMuka: 50000,
    totalTagihan: 150000,
    sisaTagihan: 0,
    tenggatPembayaran: new Date(),
    status: "Lunas",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[0]
  },
  {
    id: 11,
    nama: "Keuangan 11",
    metodePembayaran: "Tunai",
    uangMuka: 50000,
    totalTagihan: 400000,
    sisaTagihan: 400000,
    tenggatPembayaran: new Date(),
    status: "Belum Bayar",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[1]
  },
  {
    id: 12,
    nama: "Keuangan 12",
    banyaknyaCicilan: 12,
    metodePembayaran: "Cicilan",
    uangMuka: 50000,
    jumlahBiayaPerAngsuran: 5000,
    totalTagihan: 250000,
    sisaTagihan: 150000,
    tenggatPembayaran: new Date(),
    status: "Sedang Menyicil",
    catatanPembayaran: "Catatan Pembayaran",
    jenisPaket: PaketData[2]
  },
];

