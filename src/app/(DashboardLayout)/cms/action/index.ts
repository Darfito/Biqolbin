"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { PaketInterface } from "../../utilities/type";

export const getCmsAction = async () => {
  const supabase = createClient(); // Membuat instance Supabase client

  // Mengambil data Paket beserta relasi Hotel
  const { data: paket, error } = await supabase.from("Paket").select(`
      *, 
      Hotel (
        id,
        namaHotel,
        alamatHotel,
        ratingHotel,
        tanggalCheckIn,
        tanggalCheckOut
      )
    `); // Menyertakan data Hotel yang berhubungan

  if (error) {
    console.error("Error fetching Paket with Hotel:", error.message);
    return null;
  }

  return paket; // Mengembalikan data Paket beserta Hotel
};

export const getPaketDatabyID = async (id: string) => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data, error } = await supabase
    .from("Paket")
    .select(
      `*, Hotel (
      id,
      namaHotel,
      alamatHotel,
      ratingHotel,
      tanggalCheckIn,
      tanggalCheckOut
    )`
    )
    .eq("id", id)
    .single(); // Mengambil data paket beserta relasi hotel

  if (error) {
    console.error("Error fetching Paket with Hotel:", error.message);
    return null;
  }

  return data; // Mengembalikan data Paket beserta Hotel
};

// createCmsAction
export const createCmsAction = async (paketData: PaketInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client
  console.log("Paket Data di createCmsAction:", paketData);
  try {
    // Pastikan publish diset ke false jika tidak ada di paketData
    const dataWithPublish = {
      ...paketData,
      publish: paketData.publish ?? false, // Default ke false jika publish tidak ada
    };

    const { Hotel, ...paketWithoutHotel } = dataWithPublish;

    // Memasukkan data ke dalam tabel `Paket`
    const { data: PaketData, error: PaketError } = await supabase
      .from("Paket")
      .insert([paketWithoutHotel])
      .select();

    if (PaketError) throw PaketError;

    const paketId = PaketData[0].id;

    // Masukkan data ke tabel Hotel
    if (Hotel && Hotel.length > 0) {
      for (const item of Hotel) {
        const { error: hotelError } = await supabase.from("Hotel").insert({
          namaHotel: item.namaHotel,
          alamatHotel: item.alamatHotel,
          ratingHotel: item.ratingHotel,
          tanggalCheckIn: item.tanggalCheckIn,
          tanggalCheckOut: item.tanggalCheckOut,
          paket_id: paketId, // Kaitkan hotel dengan paket baru
        });

        if (hotelError) throw hotelError;
      }
    }

    console.log("Paket created:", PaketData);

    // Revalidate the CMS path
    revalidatePath("/cms");

    return { success: true, data: PaketData };
  } catch (error) {
    console.error("Error creating Paket:", error);
    return {
      success: false,
      error: (error as Error).message || "Unknown error occurred",
    };
  }
};

// updateCmsAction
export const updateCmsAction = async (paketData: PaketInterface) => {
  const supabase = createClient();

  console.log("Paket Data di updateCmsAction:", paketData);

  try {
    if (!paketData.id) {
      throw new Error("Paket ID is required for update.");
    }

    // Update data Paket
    const { data: paketDataUpdated, error: paketError } = await supabase
      .from("Paket")
      .update({
        nama: paketData.nama,
        jenis: paketData.jenis,
        maskapai: paketData.maskapai,
        noPenerbangan: paketData.noPenerbangan,
        customMaskapai: paketData.customMaskapai,
        jenisPenerbangan: paketData.jenisPenerbangan,
        keretaCepat: paketData.keretaCepat,
        hargaDouble: paketData.hargaDouble,
        hargaTriple: paketData.hargaTriple,
        hargaQuad: paketData.hargaQuad,
        tglKeberangkatan: paketData.tglKeberangkatan,
        tglKepulangan: paketData.tglKepulangan,
        namaMuthawif: paketData.namaMuthawif,
        noTelpMuthawif: paketData.noTelpMuthawif,
        fasilitas: paketData.fasilitas,
        gambar_url: paketData.gambar_url,
      })
      .eq("id", paketData.id)
      .select();

    if (paketError) throw paketError;

    console.log("Paket updated successfully:", paketDataUpdated);

    // Process data Hotel
    if (paketData.Hotel && paketData.Hotel.length > 0) {
      const existingHotelIds = paketData.Hotel.map((hotel) => hotel.id).filter(
        (id): id is number => !!id
      );

      console.log("Existing Hotel IDs:", existingHotelIds);

      for (const hotel of paketData.Hotel) {
        console.log("Processing hotel:", hotel);

        if (hotel.id) {
          // Check if hotel exists in the database
          const { data: existingHotel, error: checkError } = await supabase
            .from("Hotel")
            .select("id")
            .eq("id", hotel.id)
            .single();

          if (checkError || !existingHotel) {
            console.log("Hotel ID not found, inserting as new hotel:", hotel);
            // Insert hotel as new
            const { error: hotelInsertError } = await supabase
              .from("Hotel")
              .insert({
                namaHotel: hotel.namaHotel,
                alamatHotel: hotel.alamatHotel,
                ratingHotel: hotel.ratingHotel,
                tanggalCheckIn: hotel.tanggalCheckIn,
                tanggalCheckOut: hotel.tanggalCheckOut,
                paket_id: paketData.id,
              });

            if (hotelInsertError) {
              console.error("Error inserting hotel:", hotel, hotelInsertError);
              throw hotelInsertError;
            } else {
              console.log("Hotel inserted successfully:", hotel.namaHotel);
            }
          } else {
            console.log("Updating existing hotel:", hotel);
            // Update existing hotel
            const { error: hotelUpdateError } = await supabase
              .from("Hotel")
              .update({
                namaHotel: hotel.namaHotel,
                alamatHotel: hotel.alamatHotel,
                ratingHotel: hotel.ratingHotel,
                tanggalCheckIn: hotel.tanggalCheckIn,
                tanggalCheckOut: hotel.tanggalCheckOut,
              })
              .eq("id", hotel.id);

            if (hotelUpdateError) {
              console.error("Error updating hotel:", hotel, hotelUpdateError);
              throw hotelUpdateError;
            } else {
              console.log("Hotel updated successfully:", hotel.namaHotel);
            }
          }
        } else {
          console.log("Inserting new hotel:", hotel);
          // Insert new hotel
          const { error: hotelInsertError } = await supabase
            .from("Hotel")
            .insert({
              namaHotel: hotel.namaHotel,
              alamatHotel: hotel.alamatHotel,
              ratingHotel: hotel.ratingHotel,
              tanggalCheckIn: hotel.tanggalCheckIn,
              tanggalCheckOut: hotel.tanggalCheckOut,
              paket_id: paketData.id,
            });

          if (hotelInsertError) {
            console.error("Error inserting hotel:", hotel, hotelInsertError);
            throw hotelInsertError;
          } else {
            console.log("Hotel inserted successfully:", hotel.namaHotel);
          }
        }
      }
    } else {
      console.log("No hotels provided. Skipping hotel processing.");
    }

    // Revalidate CMS path
    await revalidatePath("/cms");
    return { success: true, data: paketDataUpdated };
  } catch (error) {
    console.error("Error updating Paket:", error);
    return { success: false, error: (error as Error).message };
  }
};







// supporting function
export const sanitizeFolderName = (name: string): string => {
  if (typeof name !== "string") {
    throw new Error("Expected a string for folder name");
  }
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, "_");
};
