// import { CardStatsHorizontalWithBorderProps, Jabatan, JenisKelamin, JenisPaket, JenisPenerbangan, KeuanganInterface, Maskapai, PaketInterface, UserProps } from "../type";
// import { IconUser, IconProgress,IconReceipt, IconPlaneDeparture, IconPlaneArrival, IconLoader } from "@tabler/icons-react";


// export const scoreCardKeuangan: CardStatsHorizontalWithBorderProps[] = [
//   {
//     title: 'Total Jamaah',
//     total: 1280,
//     color: '#3E74FF',
//     icon: IconUser,
//   },
//   {
//     title: 'Sedang Diproses',
//     total: 1280,
//     color: '#F54F63',
//     icon: IconProgress,
//   },
//   {
//     title: 'Belum Diproses',
//     total: 1280,
//     color: '#F5BD4F',
//     icon: IconReceipt,
//   },
// ]
// export const scoreCardJamaah: CardStatsHorizontalWithBorderProps[] = [
//   {
//     title: 'Total Jamaah',
//     total: 1280,
//     color: '#3E74FF',
//     icon: IconUser,
//   },
//   {
//     title: 'Belum Berangkat',
//     total: 1280,
//     color: '#F54F63',
//     icon: IconLoader,
//   },
//   {
//     title: 'Selesai',
//     total: 1280,
//     color: '#F5BD4F',
//     icon: IconPlaneArrival,
//   },
// ]



// export const PaketData: PaketInterface[] = [
//   {
//     id: 1,
//     nama: "Paket Regular 1",
//     jenis: JenisPaket.REGULAR,
//     maskapai: Maskapai.GARUDA_INDONESIA,
//     jenisPenerbangan: JenisPenerbangan.DIRECT,
//     keretaCepat: false,

//     tglKeberangkatan: "2024-12-01",
//     tglKepulangan: "2024-12-10",
//     fasilitas: ["Hotel bintang 3", "Transportasi lokal"],
//     publish: true,
//     namaMuthawif: "Yusuf Aldi",
//     noTelpMuthawif: "0812 3456 7890",
//     hotel: [
//       {
//         id:1,
//         namaHotel: "Al Madinah",
//     alamatHotel: "Jl. Utama No. 123, Mekah",
//     ratingHotel: 4.5,
//     tanggalCheckIn: "2024-12-02",
//     tanggalCheckOut: "2024-12-09",
//       }
//     ],
//     gambar_url: "https://example.com/images/paket-regular-1.jpg",
//   },
//   {
//     id: 2,
//     nama: "Paket Regular 2",
//     jenis: JenisPaket.REGULAR,
//     maskapai: Maskapai.QATAR_AIRWAYS,
//     jenisPenerbangan: JenisPenerbangan.TRANSIT,
//     keretaCepat: false,
//     tglKeberangkatan: "2024-12-05",
//     tglKepulangan: "2024-12-15",
//     fasilitas: ["Hotel bintang 2", "Transportasi lokal"],
//     publish: false,
//     namaMuthawif: "Ahmad Fauzi",
//     noTelpMuthawif: "0812 5678 1234",
//    hotel: [
//      {
//       id: 1,
//       namaHotel: "Al Safwa",
//       alamatHotel: "Jl. Selatan No. 45, Madinah",
//       ratingHotel: 3.8,
//       tanggalCheckIn: "2024-12-06",
//       tanggalCheckOut: "2024-12-14",
//      }
//    ],
//     gambar_url: "https://example.com/images/paket-regular-2.jpg",
//   },
//   {
//     id: 3,
//     nama: "Paket VIP 1",
//     jenis: JenisPaket.VIP,
//     maskapai: Maskapai.LION_AIRWAYS,
//     jenisPenerbangan: JenisPenerbangan.DIRECT,
//     keretaCepat: true,
//     tglKeberangkatan: "2024-12-10",
//     tglKepulangan: "2024-12-20",
//     fasilitas: ["Hotel bintang 5", "Transportasi premium"],
//     publish: true,
//     namaMuthawif: "Hana Ramadani",
//     noTelpMuthawif: "0812 3456 7891",
//     hotel: [
//       {
//         id: 1,
//         namaHotel: "Hilton Mekah",
//     alamatHotel: "Jl. Ka'bah No. 1, Mekah",
//     ratingHotel: 5.0,
//     tanggalCheckIn: "2024-12-11",
//     tanggalCheckOut: "2024-12-19",
//       }
//     ],
//     gambar_url: "https://example.com/images/paket-vip-1.jpg",
//   },
//   {
//     id: 4,
//     nama: "Paket Regular 4",
//     jenis: JenisPaket.REGULAR,
//     maskapai: Maskapai.ETIHAD_AIRWAYS,
//     jenisPenerbangan: JenisPenerbangan.TRANSIT,
//     keretaCepat: false,
//     tglKeberangkatan: "2024-12-15",
//     tglKepulangan: "2024-12-25",
//     fasilitas: ["Hotel bintang 1", "Transportasi umum"],
//     publish: true,
//     namaMuthawif: "Rizki Hidayat",
//     noTelpMuthawif: "0812 7890 4567",
//     hotel: [
//       {
//         id: 1,
//         namaHotel: "Al Firdous",
//         alamatHotel: "Jl. Timur No. 34, Madinah",
//         ratingHotel: 3.0,
//         tanggalCheckIn: "2024-12-16",
//         tanggalCheckOut: "2024-12-24",
//       }
//     ],
//     gambar_url: "https://example.com/images/paket-regular-4.jpg",

//   },
//   {
//     id: 5,
//     nama: "Paket VIP 4",
//     jenis: JenisPaket.VIP,
//     maskapai: Maskapai.SAUDIA_ARABIA,
//     jenisPenerbangan: JenisPenerbangan.DIRECT,
//     keretaCepat: true,
//     tglKeberangkatan: "2024-12-20",
//     tglKepulangan: "2024-12-30",
//     fasilitas: ["Hotel bintang 5", "Transportasi VIP", "Makanan premium"],
//     publish: true,
//     namaMuthawif: "Nur Aisyah",
//     noTelpMuthawif: "0812 5678 9101",
//     hotel: [
//       {
//         id: 1,
//         namaHotel: "Raffles Mekah",
//         alamatHotel: "Jl. Zamzam No. 12, Mekah",
//         ratingHotel: 4.9,
//         tanggalCheckIn: "2024-12-21",
//         tanggalCheckOut: "2024-12-29",
//       }
//     ],

//     gambar_url: "https://example.com/images/paket-vip-4.jpg",

//   },
// ];



// export const KeuanganData: KeuanganInterface[] = [
//   {
//     id: 1,
//     nama: "Keuangan 1",
//     metodePembayaran: "Cicilan",
//     totalTagihan: 100000,
//     banyaknyaCicilan: 6,
//     jumlahBiayaPerAngsuran: 5000,
//     uangMuka: 50000,
//     sisaTagihan: 100000,
//     tenggatPembayaran: new Date(),
//     status: "Belum Bayar",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[0],
//     cicilan: [
//       {
//         id: 1,
//         cicilanKe: 1,
//         jumlahCicilan: 100000,
//         nominalCicilan: 50000,
//         tanggalPembayaran: new Date("2024-04-01"),
//         lampiran: "https://example.com/lampiran1.pdf",
//       },
//       {
//         id: 2,
//         cicilanKe: 2,
//         jumlahCicilan: 50000,
//         nominalCicilan: 50000,
//         tanggalPembayaran: new Date("2024-04-01"),
//         lampiran: "https://example.com/lampiran1.pdf",
//       },
//     ],
//   },
//   {
//     id: 2,
//     nama: "Keuangan 2",
//     metodePembayaran: "Cicilan",
//     banyaknyaCicilan: 5,
//     totalTagihan: 200000,
//     jumlahBiayaPerAngsuran: 5000,
//     sisaTagihan: 100000,
//     uangMuka: 50000,
//     tenggatPembayaran: new Date(),
//     status: "Sedang Menyicil",
//     jenisPaket: PaketData[1],
//     catatanPembayaran: "Catatan Pembayaran",
//     cicilan: [
//       {
//         id: 2,
//         cicilanKe: 1,
//         jumlahCicilan: 200000,
//         nominalCicilan: 100000,
//         tanggalPembayaran: new Date("2024-03-15"),
//         lampiran: "https://example.com/lampiran2.pdf",
//       },
//     ],
//   },
//   {
//     id: 3,
//     nama: "Keuangan 3",
//     metodePembayaran: "Cicilan",
//     uangMuka: 50000,
//     jumlahBiayaPerAngsuran: 5000,
//     banyaknyaCicilan: 7,
//     totalTagihan: 100000,
//     sisaTagihan: 0,
//     tenggatPembayaran: new Date(),
//     status: "Lunas",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[2]
//   },
//   {
//     id: 4,
//     nama: "Keuangan 4",
//     metodePembayaran: "Tunai",
//     uangMuka: 50000,
//     totalTagihan: 200000,
//     jumlahBiayaPerAngsuran: 5000,
//     sisaTagihan: 0,
//     tenggatPembayaran: new Date(),
//     status: "Lunas",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[0]
//   },
//   {
//     id: 5,
//     nama: "Keuangan 5",
//     metodePembayaran: "Tabungan",
//     uangMuka: 50000,
//     totalTagihan: 200000,
//     sisaTagihan: 150000,
//     tenggatPembayaran: new Date(),
//     status: "Sedang Menabung",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[1]
//   },
//   {
//     id: 6,
//     nama: "Keuangan 6",
//     metodePembayaran: "Cicilan",
//     banyaknyaCicilan: 8,
//     jumlahBiayaPerAngsuran: 5000,
//     uangMuka: 50000,
//     totalTagihan: 300000,
//     sisaTagihan: 300000,
//     tenggatPembayaran: new Date(),
//     status: "Belum Bayar",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[2]
//   },
//   {
//     id: 7,
//     nama: "Keuangan 7",
//     metodePembayaran: "Cicilan",
//     jumlahBiayaPerAngsuran: 5000,
//     banyaknyaCicilan: 9,
//     uangMuka: 50000,
//     totalTagihan: 300000,
//     sisaTagihan: 100000,
//     tenggatPembayaran: new Date(),
//     status: "Sedang Menyicil",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[0]
//   },
//   {
//     id: 8,
//     nama: "Keuangan 8",
//     metodePembayaran: "Tunai",
//     uangMuka: 50000,
//     totalTagihan: 500000,
//     sisaTagihan: 0,
//     tenggatPembayaran: new Date(),
//     status: "Lunas",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[1]
//   },
//   {
//     id: 9,
//     nama: "Keuangan 9",
//     metodePembayaran: "Tabungan",
//     totalTagihan: 200000,
//     sisaTagihan: 100000,
//     tenggatPembayaran: new Date(),
//     status: "Sedang Menabung",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[2]
//   },
//   {
//     id: 10,
//     nama: "Keuangan 10",
//     metodePembayaran: "Cicilan",
//     banyaknyaCicilan: 10,
//     jumlahBiayaPerAngsuran: 5000,
//     uangMuka: 50000,
//     totalTagihan: 150000,
//     sisaTagihan: 0,
//     tenggatPembayaran: new Date(),
//     status: "Lunas",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[0]
//   },
//   {
//     id: 11,
//     nama: "Keuangan 11",
//     metodePembayaran: "Tunai",
//     uangMuka: 50000,
//     totalTagihan: 400000,
//     sisaTagihan: 400000,
//     tenggatPembayaran: new Date(),
//     status: "Belum Bayar",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[1]
//   },
//   {
//     id: 12,
//     nama: "Keuangan 12",
//     banyaknyaCicilan: 12,
//     metodePembayaran: "Cicilan",
//     uangMuka: 50000,
//     jumlahBiayaPerAngsuran: 5000,
//     totalTagihan: 250000,
//     sisaTagihan: 150000,
//     tenggatPembayaran: new Date(),
//     status: "Sedang Menyicil",
//     catatanPembayaran: "Catatan Pembayaran",
//     jenisPaket: PaketData[2]
//   },
// ];

// export const userData: UserProps[] = [
//   {
//     id: 1,
//     nama: "Budi Santoso",
//     jenisKelamin: JenisKelamin.LakiLaki,
//     noTelp: "081234567890",
//     role: Jabatan.Marketing,
//     penempatan: "Jakarta",
//     alamatCabang: "Jl. Sudirman No. 12, Jakarta",
//   },
//   {
//     id: 2,
//     nama: "Siti Nurhaliza",
//     jenisKelamin: JenisKelamin.Perempuan,
//     noTelp: "081234567891",
//     role: Jabatan.Admin,
//     penempatan: "Bandung",
//     alamatCabang: "Jl. Braga No. 45, Bandung",
//     action: "Delete",
//   },
//   {
//     id: 3,
//     nama: "Andi Pratama",
//     jenisKelamin: JenisKelamin.LakiLaki,
//     noTelp: "081234567892",
//     role: Jabatan.FinanceAccounting,
//     penempatan: "Surabaya",
//     alamatCabang: "Jl. Tunjungan No. 23, Surabaya",
//   },
//   {
//     id: 4,
//     nama: "Rina Amelia",
//     jenisKelamin: JenisKelamin.Perempuan,
//     noTelp: "081234567893",
//     role: Jabatan.DivisiGeneralAffair,
//     penempatan: "Yogyakarta",
//     alamatCabang: "Jl. Malioboro No. 10, Yogyakarta",
//     action: "View",
//   },
//   {
//     id: 5,
//     nama: "Joko Widodo",
//     jenisKelamin: JenisKelamin.LakiLaki,
//     noTelp: "081234567894",
//     role: Jabatan.Marketing,
//     penempatan: "Medan",
//     alamatCabang: "Jl. Sisingamangaraja No. 8, Medan",
//   },
// ];
