import {
  CardStatsHorizontalWithBorderProps,
  JamaahProps,
  JenisKelamin,
  JenisPaket,
  JenisPenerbangan,
  KontakDaruratRelation,
  Maskapai,
  PaketInterface,
  TipeKamar,
} from "../../utilities/type";
import { IconUser, IconCreditCard, IconReceipt } from "@tabler/icons-react";

export const scoreCardKeuangan: CardStatsHorizontalWithBorderProps[] = [
  {
    title: "Total Jamaah",
    total: 1280,
    color: "#3E74FF",
    icon: IconUser,
  },
  {
    title: "Belum Proses",
    total: 1280,
    color: "#F54F63",
    icon: IconCreditCard,
  },
  {
    title: "Sedang Proses",
    total: 1280,
    color: "#F5BD4F",
    icon: IconReceipt,
  },
];

export const PaketData: PaketInterface[] = [
  {
    id: "PKT001",
    nama: "Paket Regular 1",
    jenis: JenisPaket.REGULAR,
    maskapai: Maskapai.GARUDA_INDONESIA,
    jenisPenerbangan: JenisPenerbangan.DIRECT,
    keretaCepat: false,
    harga: 1000000,
    tglKeberangkatan: "2024-12-01",
    tglKepulangan: "2024-12-10",
    fasilitas: ["Hotel bintang 3", "Transportasi lokal"],
    publish: false,
    gambar_url: "https://picsum.photos/seed/picsum/200/300",
    namaMuthawif: "Ahmad Yusuf",
    namaHotel: "Hotel Bintang Jakarta",
    alamatHotel: "Jl. Gatot Subroto No.10, Jakarta",
    ratingHotel: 3,
    tanggalCheckIn: "2024-12-01",
    tanggalCheckOut: "2024-12-10",
    noTelpMuthawif: "+62 812 3456 7890",
  },
  {
    id: "PKT002",
    nama: "Paket Regular 2",
    jenis: JenisPaket.REGULAR,
    maskapai: Maskapai.LION_AIRWAYS,
    jenisPenerbangan: JenisPenerbangan.TRANSIT,
    keretaCepat: false,
    harga: 800000,
    tglKeberangkatan: "2024-12-05",
    tglKepulangan: "2024-12-15",
    fasilitas: ["Hotel bintang 3", "Transportasi lokal"],
    publish: false,
    namaMuthawif: "Fatimah Anisa",
    namaHotel: "Hotel Bintang Surabaya",
    alamatHotel: "Jl. Raya Darmo No.45, Surabaya",
    ratingHotel: 3,
    tanggalCheckIn: "2024-12-05",
    tanggalCheckOut: "2024-12-15",
    noTelpMuthawif: "+62 813 6543 2100",
  },
  {
    id: "PKT003",
    nama: "Paket VIP 1",
    jenis: JenisPaket.VIP,
    maskapai: Maskapai.ETIHAD_AIRWAYS,
    jenisPenerbangan: JenisPenerbangan.DIRECT,
    keretaCepat: true,
    harga: 2000000,
    tglKeberangkatan: "2024-12-10",
    tglKepulangan: "2024-12-20",
    fasilitas: ["Hotel bintang 3", "Transportasi lokal"],
    publish: false,
    namaMuthawif: "Zainal Abidin",
    namaHotel: "Hotel Premium Bali",
    alamatHotel: "Jl. Sunset Road No.12, Bali",
    ratingHotel: 5,
    tanggalCheckIn: "2024-12-10",
    tanggalCheckOut: "2024-12-20",
    noTelpMuthawif: "+62 811 9876 5432",
  },
];

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
      {
        id: 2,
        nama: "John Yoesop",
        noTelp: "081987654321",
        hubungan: KontakDaruratRelation.Ayah,
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
    jenisPaket: PaketData[0],
    berangkat: new Date("2024-01-15"),
    selesai: new Date("2024-01-30"),
    status: {
      id: 1,
      status: "Dijadwalkan",
      deskripsi: "Persiapan keberangkatan",
    },
    jenisDokumen: [
      {
        id: 1,
        namaDokumen: "KTP",
        lampiran: false,
        file: "",
      },
      {
        id: 2,
        namaDokumen: "Paspor",
        lampiran: false,
        file: "",
      },
      {
        id: 3,
        namaDokumen: "Buku Nikah",
        lampiran: false,
        file: "",
      },
      {
        id: 4,
        namaDokumen: "Kartu Keluarga",
        lampiran: false,
        file: "",
      },
      {
        id: 5,
        namaDokumen: "Visa",
        lampiran: false,
        file: "",
      },
      {
        id: 6,
        namaDokumen: "Pas Foto",
        lampiran: false,
        file: "",
      },
    ],
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
    jenisPaket: PaketData[1],
    berangkat: new Date("2024-02-10"),
    selesai: new Date("2024-02-25"),
    status: {
      id: 2,
      status: "Berangkat",
      deskripsi: "Dalam perjalanan menuju Saudi Arabia",
    },
    jenisDokumen: [
      {
        id: 1,
        namaDokumen: "KTP",
        lampiran: false,
        file: "",
      },
      {
        id: 2,
        namaDokumen: "Paspor",
        lampiran: false,
        file: "",
      },
      {
        id: 3,
        namaDokumen: "Buku Nikah",
        lampiran: false,
        file: "",
      },
      {
        id: 4,
        namaDokumen: "Kartu Keluarga",
        lampiran: false,
        file: "",
      },
      {
        id: 5,
        namaDokumen: "Visa",
        lampiran: false,
        file: "",
      },
      {
        id: 6,
        namaDokumen: "Pas Foto",
        lampiran: false,
        file: "",
      },
    ],
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
    jenisPaket: PaketData[2],
    berangkat: new Date("2024-03-15"),
    selesai: new Date("2024-03-30"),
    status: {
      id: 3,
      status: "Dijadwalkan",
      deskripsi: "Menunggu dokumen selesai",
    },
    jenisDokumen: [
      {
        id: 1,
        namaDokumen: "KTP",
        lampiran: false,
        file: "",
      },
      {
        id: 2,
        namaDokumen: "Paspor",
        lampiran: false,
        file: "",
      },
      {
        id: 3,
        namaDokumen: "Buku Nikah",
        lampiran: false,
        file: "",
      },
      {
        id: 4,
        namaDokumen: "Kartu Keluarga",
        lampiran: false,
        file: "",
      },
      {
        id: 5,
        namaDokumen: "Visa",
        lampiran: false,
        file: "",
      },
      {
        id: 6,
        namaDokumen: "Pas Foto",
        lampiran: false,
        file: "",
      },
    ],
  },
  // Tambahkan data ke-4 dan ke-5 dengan pola serupa jika diperlukan
];

export default jamaahData;
