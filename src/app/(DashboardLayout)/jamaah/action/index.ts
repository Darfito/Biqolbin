"use server";

import { createClient } from "@/libs/supabase/server";
import { JamaahProps } from "../../utilities/type";
import { revalidatePath } from "next/cache";

export const createJamaahAction = async (formValues: JamaahProps) => {
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

