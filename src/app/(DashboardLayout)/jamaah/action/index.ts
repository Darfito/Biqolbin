"use server";

import { createClient } from "@/libs/supabase/server";
import { JamaahProps } from "../../utilities/type";
import { revalidatePath } from "next/cache";

export const createJamaahAction = async (formValues: JamaahProps) => {
  const supabase = createClient();
  const { data: jamaahData, error: jamaahError } = await supabase
    .from("Jamaah")
    .insert({
      nama: formValues.nama,
      ayahKandung: formValues.ayahKandung,
      noTelp: formValues.noTelp,
      kontakDarurat: formValues.kontakDarurat,
      email: formValues.email,
      jenisKelamin: formValues.jenisKelamin,
      tempatLahir: formValues.tempatLahir,
      pernikahan: formValues.pernikahan,
      paket_id: formValues.jenisPaket.id,
    })
    .select("id")
    .single();

    if (jamaahError) throw jamaahError;
    const jamaahId = jamaahData.id;

    // Step 2: Create Kontak Darurat

    for (const contact of formValues.kontakDarurat) {
        const { error: kontakError } = await supabase.from('KontakDarurat').insert({
            nama: contact.nama,
            no_telp: contact.noTelp,
            hubungan: contact.hubungan,
            relasi_lain: contact.relasiLain,
            jamaah_id: jamaahId,
        });
        if (kontakError) throw kontakError;
    }



    // Step 3: Create Jenis Dokumen
    const dokumenList = formValues.pernikahan === true
        ? ['KTP', 'Paspor', 'Buku Nikah', 'Kartu Keluarga', 'Visa', 'Pas Foto']
        : ['KTP', 'Paspor', 'Kartu Keluarga', 'Visa', 'Pas Foto'];

    const dokumenEntries = dokumenList.map((dokumen) => ({
        jamaah_id: jamaahId,
        nama_dokumen: dokumen,
        file: null, // File akan diupload secara terpisah
        lampiran: false, // Default: belum ada lampiran
        action: 'Menunggu', // Default: status awal dokumen
    }));

    const { error: dokumenError } = await supabase
        .from('jenis_dokumen')
        .insert(dokumenEntries);

    if (dokumenError) throw dokumenError;

    console.log("Jamaah created:", jamaahData);
    revalidatePath("/jamaah");
    return { success: true, data: jamaahData };

};
