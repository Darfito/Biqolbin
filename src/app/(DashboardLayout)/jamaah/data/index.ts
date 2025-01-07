import { PaketData } from "../../utilities/data";
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
    pernikahan: true,
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
    berangkat: "2024-01-15",
    selesai: "2024-01-30",
    status: "Dijadwalkan",
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
    pernikahan: false,
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
    berangkat: "2024-02-10",
    selesai: "2024-02-25",
    status: "Berangkat",
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
    pernikahan: false,
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
    berangkat: "2024-03-15",
    selesai: "2024-03-30",
    status: "Dijadwalkan",
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
