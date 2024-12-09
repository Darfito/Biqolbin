import { CardStatsHorizontalWithBorderProps, JamaahProps, JenisKelamin, KontakDaruratRelation, TipeKamar } from "../../utilities/type";
import { IconUser, IconCreditCard,IconReceipt } from "@tabler/icons-react";


export const scoreCardKeuangan: CardStatsHorizontalWithBorderProps[] = [
  {
    title: 'Total Jamaah',
    total: 1280,
    color: '#3E74FF',
    icon: IconUser,
  },
  {
    title: 'Belum Proses',
    total: 1280,
    color: '#F54F63',
    icon: IconCreditCard,
  },
  {
    title: 'Sedang Proses',
    total: 1280,
    color: '#F5BD4F',
    icon: IconReceipt,
  },
]

const jamaahData: JamaahProps[] = [
  {
    id: 1,
    nama: "Ahmad Fauzi",
    ayahKandung: "Budi Santoso",
    noTelp: "081234567890",
    kontakDarurat: [
      {
        id: 1,
        nama: "Siti Nurhaliza",
        noTelp: "081987654321",
        hubungan: KontakDaruratRelation.Istri,
      },
    ],
    email: "ahmad.fauzi@example.com",
    jenisKelamin: JenisKelamin.LakiLaki,
    tempatLahir: "Surabaya",
    perkawinan: true,
    alamat: "Jl. Pahlawan No. 45, Surabaya",
    varianKamar: {
      id: 1,
      tipeKamar: TipeKamar.DOUBLE,
      harga: 5000000,
      deskripsi: "Kamar dengan 2 tempat tidur",
    },
    kewarganegaraan: true,
    pekerjaan: "Pengusaha",
    kursiRoda: false,
    riwayatPenyakit: "Tidak ada",
    jenisPaket: {
      id: "1",
      nama: "Umroh Reguler",
      jenis: "REGULAR",
      maskapai: "Garuda Indonesia",
      jenisPenerbangan: "DIRECT",
      keretaCepat: false,
      harga: 25000000,
      tglKeberangkatan: new Date("2024-01-15"),
      tglKepulangan: new Date("2024-01-30"),
      fasilitas: "Hotel bintang 4, Makan 3x sehari",
    },
    berangkat: new Date("2024-01-15"),
    selesai: new Date("2024-01-30"),
    status: {
      id: 1,
      status: "Dijadwalkan",
      deskripsi: "Persiapan keberangkatan",
    },
  },
  {
    id: 2,
    nama: "Dewi Sartika",
    ayahKandung: "Rahmat Hidayat",
    noTelp: "081345678901",
    kontakDarurat: [
      {
        id: 2,
        nama: "Andi Pratama",
        noTelp: "081234567891",
        hubungan: KontakDaruratRelation.Ayah,
      },
    ],
    email: "dewi.sartika@example.com",
    jenisKelamin: JenisKelamin.Perempuan,
    tempatLahir: "Bandung",
    perkawinan: false,
    alamat: "Jl. Asia Afrika No. 12, Bandung",
    varianKamar: {
      id: 2,
      tipeKamar: TipeKamar.QUAD,
      harga: 3500000,
      deskripsi: "Kamar untuk 4 orang",
    },
    kewarganegaraan: true,
    pekerjaan: "Guru",
    kursiRoda: false,
    riwayatPenyakit: "Asma",
    jenisPaket: {
      id: "2",
      nama: "Umroh VIP",
      jenis: "VIP",
      maskapai: "Saudi Airlines",
      jenisPenerbangan: "TRANSIT",
      keretaCepat: true,
      harga: 35000000,
      tglKeberangkatan: new Date("2024-02-10"),
      tglKepulangan: new Date("2024-02-25"),
      fasilitas: "Hotel bintang 5, Transportasi VIP",
    },
    berangkat: new Date("2024-02-10"),
    selesai: new Date("2024-02-25"),
    status: {
      id: 2,
      status: "Berangkat",
      deskripsi: "Dalam perjalanan menuju Saudi Arabia",
    },
  },
  {
    id: 3,
    nama: "Rafi Hidayat",
    ayahKandung: "Ali Hidayat",
    noTelp: "081567890123",
    kontakDarurat: [
      {
        id: 3,
        nama: "Nur Aisyah",
        noTelp: "081678901234",
        hubungan: KontakDaruratRelation.Ibu,
      },
    ],
    email: "rafi.hidayat@example.com",
    jenisKelamin: JenisKelamin.LakiLaki,
    tempatLahir: "Yogyakarta",
    perkawinan: false,
    alamat: "Jl. Malioboro No. 21, Yogyakarta",
    varianKamar: {
      id: 3,
      tipeKamar: TipeKamar.TRIPLE,
      harga: 4000000,
      deskripsi: "Kamar untuk 3 orang",
    },
    kewarganegaraan: true,
    pekerjaan: "Mahasiswa",
    kursiRoda: false,
    riwayatPenyakit: "Tidak ada",
    jenisPaket: {
      id: "3",
      nama: "Umroh Reguler",
      jenis: "REGULAR",
      maskapai: "Garuda Indonesia",
      jenisPenerbangan: "DIRECT",
      keretaCepat: false,
      harga: 22000000,
      tglKeberangkatan: new Date("2024-03-15"),
      tglKepulangan: new Date("2024-03-30"),
      fasilitas: "Hotel bintang 3, Transportasi lokal",
    },
    berangkat: new Date("2024-03-15"),
    selesai: new Date("2024-03-30"),
    status: {
      id: 3,
      status: "Dijadwalkan",
      deskripsi: "Menunggu dokumen selesai",
    },
  },
  // Tambahkan data ke-4 dan ke-5 dengan pola serupa jika diperlukan
];

export default jamaahData;


