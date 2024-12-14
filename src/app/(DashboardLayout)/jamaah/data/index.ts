import { CardStatsHorizontalWithBorderProps, JamaahProps, JenisKelamin, KontakDaruratRelation, PaketInterface, TipeKamar } from "../../utilities/type";
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

export const PaketData: PaketInterface[] = [
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
    ]
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
    ]
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
    ]
  },
  // Tambahkan data ke-4 dan ke-5 dengan pola serupa jika diperlukan
];

export default jamaahData;


