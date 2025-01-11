"use server";

import { createClient } from "@/libs/supabase/server";

import { revalidatePath } from "next/cache";
import { JamaahInterface } from "../../utilities/type";

export const mapJamaahData = (data: any): JamaahInterface[] => {
  return data.map((item: any) => ({
    id: item.id,
    nama: item.nama,
    ayahKandung: item.ayahKandung,
    noTelp: item.noTelp,
    kontakDarurat: item.KontakDarurat.map((contact: any) => ({
      id: contact.id,
      nama: contact.nama,
      noTelp: contact.no_telp,
      hubungan: contact.hubungan,
      relasiLain: contact.relasi_lain || undefined,
    })),
    email: item.email,
    jenisKelamin: item.jenisKelamin,
    tempatLahir: item.tempatLahir,
    pernikahan: item.pernikahan,
    alamat: item.alamat,
    varianKamar: item.varianKamar,
    kewarganegaraan: item.kewarganegaraan,
    pekerjaan: item.pekerjaan,
    kursiRoda: item.kursiRoda,
    riwayatPenyakit: item.riwayatPenyakit,
    jenisDokumen: item.jenisDokumen || [],
    jenisPaket: {
      id: item.Paket.id,
      nama: item.Paket.nama,
      maskapai: item.Paket.maskapai,
      customMaskapai: item.Paket.customMaskapai || undefined,
      noPenerbangan: item.Paket.noPenerbangan || undefined,
      jenisPenerbangan: item.Paket.jenisPenerbangan,
      keretaCepat: item.Paket.keretaCepat,
      tglKeberangkatan: item.Paket.tglKeberangkatan,
      tglKepulangan: item.Paket.tglKepulangan,
      fasilitas: item.Paket.fasilitas || [],
      namaMuthawif: item.Paket.namaMuthawif,
      noTelpMuthawif: item.Paket.noTelpMuthawif,
      hargaDouble: item.Paket.hargaDouble,
      hargaTriple: item.Paket.hargaTriple,
      hargaQuad: item.Paket.hargaQuad,
      gambar_url: item.Paket.gambar_url || undefined,
      Hotel: item.Paket.Hotel.map((hotel: any) => ({
        id: hotel.id,
        namaHotel: hotel.namaHotel,
        alamatHotel: hotel.alamatHotel,
        ratingHotel: hotel.ratingHotel,
        tanggalCheckIn: hotel.tanggalCheckIn,
        tanggalCheckOut: hotel.tanggalCheckOut,
      })),
    },
    berangkat: item.Paket.tglKeberangkatan,
    selesai: item.Paket.tglKepulangan,
    status: item.status,
  }));
};


export const getJamaahAction = async (): Promise<JamaahInterface[]> => {
  const supabase = createClient();

  // Mengambil data Jamaah beserta relasi Paket, hotel, dan Kontak Darurat
  const { data, error } = await supabase.from("Jamaah").select(`
    *,
    KontakDarurat (
      id,
      nama,
      no_telp,
      hubungan,
      relasi_lain
    ),
    Paket (
      id,
      nama,
      maskapai,
      customMaskapai,
      noPenerbangan,
      jenisPenerbangan,
      keretaCepat,
      hargaDouble,
      hargaTriple,
      hargaQuad,
      tglKeberangkatan,
      tglKepulangan,
      fasilitas,
      namaMuthawif,
      noTelpMuthawif,
      Hotel (
        id,
        namaHotel,
        alamatHotel,
        ratingHotel,
        tanggalCheckIn,
        tanggalCheckOut
      )
    )
  `);

  if (error) {
    console.error("Error fetching Jamaah data:", error);
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  // Mapping data untuk mencocokkan dengan JamaahProps
  return mapJamaahData(data);
};


export const createJamaahAction = async (formValues: JamaahInterface) => {
  console.log("Form Values di create:", formValues);
  const supabase = createClient();
  try {
    // Step 1: Insert data Jamaah
    const { data: jamaahData, error: jamaahError } = await supabase
      .from("Jamaah")
      .insert({
        nama: formValues.nama,
        ayahKandung: formValues.ayahKandung,
        noTelp: formValues.noTelp,
        email: formValues.email,
        jenisKelamin: formValues.jenisKelamin,
        tempatLahir: formValues.tempatLahir,
        pernikahan: formValues.pernikahan,
        paket_id: formValues.jenisPaket.id, // Relasi ke Paket
        alamat: formValues.alamat,
        kewarganegaraan: formValues.kewarganegaraan,
        pekerjaan: formValues.pekerjaan,
        kursiRoda: formValues.kursiRoda,
        riwayatPenyakit: formValues.riwayatPenyakit,
        status: formValues.status,
        varianKamar: formValues.varianKamar,
        berangkat: formValues.berangkat,
        selesai: formValues.selesai,
      })
      .select("id") // Ambil ID Jamaah yang baru dibuat
      .single();

    if (jamaahError) throw jamaahError;

    const jamaahId = jamaahData.id;

    // Step 2: Insert data Kontak Darurat
    if (formValues.kontakDarurat && formValues.kontakDarurat.length > 0) {
      const kontakDaruratEntries = formValues.kontakDarurat.map((contact) => ({
        nama: contact.nama,
        no_telp: contact.noTelp,
        hubungan: contact.hubungan,
        relasi_lain: contact.relasiLain,
        jamaah_id: jamaahId, // Relasi ke Jamaah
      }));

      const { error: kontakError } = await supabase
        .from("KontakDarurat")
        .insert(kontakDaruratEntries);

      if (kontakError) throw kontakError;
    }

    // Step 3: Insert Jenis Dokumen
    const dokumenList =
      formValues.pernikahan === true
        ? ["KTP", "Paspor", "Buku Nikah", "Kartu Keluarga", "Visa", "Pas Foto"]
        : ["KTP", "Paspor", "Kartu Keluarga", "Visa", "Pas Foto"];

    const dokumenEntries = dokumenList.map((dokumen) => ({
      jamaah_id: jamaahId,
      nama_dokumen: dokumen,
      file: null, // File diupload terpisah
      lampiran: false, // Default: belum ada lampiran
      action: "Menunggu", // Status awal dokumen
    }));

    const { error: dokumenError } = await supabase
      .from("jenis_dokumen")
      .insert(dokumenEntries);

    if (dokumenError) throw dokumenError;

    console.log("Jamaah created successfully:", jamaahData);
    revalidatePath("/jamaah");
    return { success: true, data: jamaahData };
  } catch (error) {
    console.error("Error creating Jamaah:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

