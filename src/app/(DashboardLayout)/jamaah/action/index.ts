"use server";

import { createClient } from "@/libs/supabase/server";

import { revalidatePath } from "next/cache";
import { JamaahInterface } from "../../utilities/type";


export const mapJamaahData = (data: any): JamaahInterface[] => {
  return data.map((item: any) => ({
    id: item.id,
    NIK: item.NIK,
    nama: item.nama,
    created_at: item.created_at,
    ayahKandung: item.ayahKandung,
    tanggalLahir: item.tanggalLahir,
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
    provinsi: item.provinsi,
    alamat: item.alamat,
    kewarganegaraan: item.kewarganegaraan,
    pekerjaan: item.pekerjaan,
    riwayatPenyakit: item.riwayatPenyakit,
    jenisDokumen: item.jenisDokumen || [],
    statusAktif: item.statusAktif,
    cabang_id: item.cabang_id
  }));
};

export const getJamaahDataById = async (id: string) => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data, error } = await supabase
    .from("Jamaah")
    .select(`
      *,
      kontakDarurat:KontakDarurat(*),
      jenisDokumen:jenis_dokumen(*)
    `)
    .eq("id", id)
    .single(); // Mengambil data jamaah beserta relasi

  if (error) {
    console.error("Error fetching Jamaah with relasi:", error.message);
    return null;
  }

  return data; // Mengembalikan data Jamaah beserta relasi
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

export const getJamaahCabangAction = async (cabang:number): Promise<JamaahInterface[]> => {
  console.log("tersekusi pada cabang", cabang);
  const supabase = createClient();

  // Mengambil data Jamaah beserta relasi dan Kontak Darurat
  const { data, error } = await supabase.from("Jamaah").select(`
    *,
    KontakDarurat (
      id,
      nama,
      no_telp,
      hubungan,
      relasi_lain
    )
  `).eq("cabang_id", cabang);

  if (error) {
    console.error("Error fetching Jamaah data cabang:", error);
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
        NIK:formValues.NIK,
        nama: formValues.nama,
        tanggalLahir: formValues.tanggalLahir,
        ayahKandung: formValues.ayahKandung,
        noTelp: formValues.noTelp,
        email: formValues.email,
        jenisKelamin: formValues.jenisKelamin,
        tempatLahir: formValues.tempatLahir,
        pernikahan: formValues.pernikahan,
        provinsi: formValues.provinsi,
        alamat: formValues.alamat,
        kewarganegaraan: formValues.kewarganegaraan,
        pekerjaan: formValues.pekerjaan,
        riwayatPenyakit: formValues.riwayatPenyakit,
        statusAktif: formValues.statusAktif,
        cabang_id: formValues.cabang_id,
      })
      .select("id") // Ambil ID Jamaah yang baru dibuat
      .single();

      
      if (jamaahError) {
        console.log("kena error di jamaah create")
      throw jamaahError;}

    const jamaahId = jamaahData.id;

    // Step 2: Insert data Kontak Darurat
    if (formValues.kontakDarurat && formValues.kontakDarurat.length > 0) {
      const kontakDaruratEntries = formValues.kontakDarurat.map((contact) => ({
        nama: contact.nama,
        no_telp: contact.no_telp,
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
        ? ["KTP", "Paspor", "Buku Nikah", "Kartu Keluarga", "Pas Foto"]
        : ["KTP", "Paspor", "Kartu Keluarga", "Pas Foto"];

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
    // revalidatePath("/jamaah");
    return { success: true, data: jamaahData };
  } catch (error) {
    console.error("Error creating Jamaah:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

export const updateJamaahAction = async (jamaahData: JamaahInterface) => {
  const supabase = createClient();

  console.log("Paket Data di updateJamaahAction:", jamaahData);
  console.log("Jamaah Data ID:", jamaahData.id);


  try {

    if (!jamaahData.id) {
      throw new Error("Jamaah ID is required for update.");
    }
    // Step 1: Update data Jamaah
    const { data: jamaahDataUpdated, error: jamaahError } = await supabase
      .from("Jamaah")
      .update({
        NIK: jamaahData.NIK,
        nama: jamaahData.nama,
        ayahKandung: jamaahData.ayahKandung,
        tanggalLahir: jamaahData.tanggalLahir,
        noTelp: jamaahData.noTelp,
        email: jamaahData.email,
        jenisKelamin: jamaahData.jenisKelamin,
        tempatLahir: jamaahData.tempatLahir,
        pernikahan: jamaahData.pernikahan,
        provinsi: jamaahData.provinsi,
        alamat: jamaahData.alamat,
        kewarganegaraan: jamaahData.kewarganegaraan,
        pekerjaan: jamaahData.pekerjaan,
        riwayatPenyakit: jamaahData.riwayatPenyakit,
      })
      .eq("id", jamaahData.id)
      .select()


    if (jamaahError) throw jamaahError;

    console.log("Jamaah updated successfully:", jamaahDataUpdated);

    if (jamaahData.kontakDarurat && jamaahData.kontakDarurat.length > 0) {
      const existingKontakDarurat = jamaahData.kontakDarurat.map((contact) => contact.id).filter(
        (id): id is number => !!id
      )

      console.log("Existing Kontak Darurat IDs:", existingKontakDarurat);

      // **Delete Kontak Darurat** not in `jamaahData.kontakDarurat`
      const { error: deleteError } = await supabase
        .from("KontakDarurat")
        .delete()
        .eq("jamaah_id", jamaahData.id)
        .not("id", "in", `(${existingKontakDarurat})`);

        if (deleteError) {
          console.error("Error deleting Kontak Darurat:", deleteError);
          throw deleteError;
        } else {
          console.log("Kontak Darurat in the current list have been deleted successfully.");
        }

        // Process remaining Kontak Darurat for update or insert
        for (const contact of jamaahData.kontakDarurat) {
          if (contact.id) {
            // Check if kontak exist in the database 
            const { data: existingKontakDarurat, error: checkError} = await supabase
              .from("KontakDarurat")
              .select("id")
              .eq("id", contact.id)
              .single();
        

        if (checkError || !existingKontakDarurat) {
          console.log("Kontak Darurat ID not found, inserting as new Kontak Darurat:", contact);
        // Insert new Kontak Darurat
        const { error: kontakInsertError } = await supabase
          .from("KontakDarurat")
          .insert({
            nama: contact.nama,
            no_telp: contact.no_telp,
            hubungan: contact.hubungan,
            relasi_lain: contact.relasiLain,
            jamaah_id: jamaahData.id, // Relasi ke Jamaah
          });

          if (kontakInsertError) {
            console.error("Error inserting Kontak Darurat: ",contact ,kontakInsertError);
            throw kontakInsertError;
          } else {
            console.log("Kontak Darurat inserted successfully:", contact.nama);
          }
        } else {
          console.log("Updating existing hotel:", contact);
          const { error: kontakUpdateError } = await supabase
            .from("KontakDarurat")
            .update({
              nama: contact.nama,
              no_telp: contact.no_telp,
              hubungan: contact.hubungan,
              relasi_lain: contact.relasiLain,
              jamaah_id: jamaahData.id, // Relasi ke Jamaah
            })
            .eq("id", contact.id);
  
            if (kontakUpdateError) {
              console.error("Error updating Kontak Darurat: ",contact, kontakUpdateError);
              throw kontakUpdateError;
            } else {
              console.log("Kontak Darurat updated successfully:", contact.nama);
            }
        }
    } else {
      console.log("Inserting new Kontak Darurat:", contact);
      // Insert new Kontak Darurat
      const { error: kontakInsertError } = await supabase
        .from("KontakDarurat")
        .insert({
          nama: contact.nama,
          no_telp: contact.no_telp,
          hubungan: contact.hubungan,
          relasi_lain: contact.relasiLain,
          jamaah_id: jamaahData.id, // Relasi ke Jamaah
        });
  
        if (kontakInsertError) {
          console.error("Error inserting Kontak Darurat: ",contact, kontakInsertError);
          throw kontakInsertError;
        } else {
          console.log("Kontak Darurat inserted successfully:", contact.nama);
        }
    }
  }
} else {
  console.log("No Kontak Darurat provided. Deleteing all related Kontak Darurat.");
  // If no kontak darurat, delete all related Kontak Darurat
  const { error: deleteAllError } = await supabase
  .from("KontakDarurat")
  .delete()
  .eq("jamaah_id", jamaahData.id);

  if (deleteAllError){
    console.error("Error deleting all Kontak Darurat:", deleteAllError);
    throw deleteAllError;
  } else {
    console.log("All Kontak Darurat related to this jamaah have been deleted.");
  }
}

    console.log("Jamaah updated successfully:", jamaahDataUpdated);
    // revalidatePath(`/jamaah/${jamaahData.id}`);
    return { success: true, data: jamaahDataUpdated };
  } catch (error) {
    console.error("Error updating Jamaah:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";
    return { success: false, error: errorMessage };
  }
};

export const deleteJamaahAction = async (jamaahId: number) => {
  const supabase = createClient();
  const { error } = await supabase
    .from("Jamaah")
    .delete()
    .eq("id", jamaahId);
  if (error) {
    console.error("Error deleting jamaah:", error.message);
    return { success: false, error: error.message };
  }
  console.log(`Jamaah with ID ${jamaahId} deleted successfully`);
  revalidatePath("/jamaah");
  return { success: true };
};

export const deleteStatusAktifAction = async (jamaahId: string) => {
  const supabase = createClient();

  // Update statusAktif di tabel Jamaah
  const { error: jamaahError } = await supabase
    .from("Jamaah")
    .update({ statusAktif: false })
    .eq("id", jamaahId);

  if (jamaahError) {
    console.error("Error updating Jamaah statusAktif:", jamaahError.message);
    return { success: false, error: jamaahError.message };
  }

  // Update statusAktif di tabel Keuangan untuk row yang memiliki jamaah_id yang sama
  const { error: keuanganError } = await supabase
    .from("Keuangan")
    .update({ statusAktif: false })
    .eq("jamaah_id", jamaahId);

  if (keuanganError) {
    console.error("Error updating Keuangan statusAktif:", keuanganError.message);
    return { success: false, error: keuanganError.message };
  }

  console.log(`Jamaah and related Keuangan records updated successfully for ID ${jamaahId}`);

  // Revalidate halaman /jamaah setelah perubahan data
  revalidatePath("/jamaah");

  return { success: true };
};



export const undoDeleteStatusAktifAction = async (jamaahId: string) => {
  const supabase = createClient();

  try {
    // Update Jamaah table
    const { error: jamaahError } = await supabase
      .from("Jamaah")
      .update({ statusAktif: true })
      .eq("id", jamaahId);

    if (jamaahError) throw jamaahError;

    // Update Keuangan table
    const { error: keuanganError } = await supabase
      .from("Keuangan")
      .update({ statusAktif: true })
      .eq("jamaah_id", jamaahId);

    if (keuanganError) throw keuanganError;

    // Revalidate the page after successful updates
    revalidatePath("/jamaah");
    
    return { success: true };
  } catch (error) {
    console.error("Error restoring records:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to restore records' 
    };
  }
};


export const getFileUrl = async (jamaahId: string, namaDokumen: string) => {
  const supabase = createClient();
  const {data, error} = await supabase
    .from('jenis_dokumen')
    .select('file')
    .eq('nama_dokumen', namaDokumen)
    .eq('jamaah_id', jamaahId)
    .single();

  if (error) {
    console.error('Error fetching file URL:', error.message);
    return { success: false, error: error.message };
  }

  console.log('File URL:', data.file);

  return { success: true, data };
};

export const updateFileUrl = async (jamaahId: string, namaDokumen: string, fileUrl: string) => {
  const supabase = createClient();
  try {
    // Update kolom `file` dengan URL baru
    const { data, error } = await supabase
    .from("jenis_dokumen")
    .update({ file: fileUrl, action: "Diterima", lampiran: true }) // Update file URL dan status
    .eq("jamaah_id", jamaahId)
    .eq("nama_dokumen", namaDokumen);

    if (error) {
      throw new Error(error.message);
    }
    
    revalidatePath(`/jamaah/${jamaahId}`);
    return { success: true, data };

  } catch (error: any) {
    console.error("Error in updateFileUrl:", error.message);
    return { success: false, message: error.message, error };
  }

  }

export const deleteFileUrl = async (jamaahId: string, namaDokumen: string) => {
  const supabase = createClient();
  try {
    // Update kolom `file` menjadi null pada baris yang sesuai
    const { data, error } = await supabase
      .from("jenis_dokumen")
      .update({ file: null, action: "Menunggu", lampiran: false }) // Set kolom `file` menjadi null
      .eq("jamaah_id", jamaahId)
      .eq("nama_dokumen", namaDokumen);

    if (error) {
      throw new Error(`Gagal menghapus data di kolom 'file': ${error.message}`);
    }
    
    revalidatePath(`/jamaah/${jamaahId}`);

    return { success: true, message: "Kolom 'file' berhasil dikosongkan." };
  } catch (error: any) {
    console.error("Error in deleteFileUrl:", error.message);
    return { success: false, message: error.message, error };
  }
};
