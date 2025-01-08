"use server";

import { createClient } from "@/libs/supabase/server";
import { revalidatePath } from "next/cache";
import { PaketInterface } from "../../utilities/type";

export const getCmsAction = async () => {
  const supabase = createClient(); // Membuat instance Supabase client
  const { data: paket, error } = await supabase.from("Paket").select("*");

  if (error) {
    console.error("Error fetching Paket:", error.message);
    return null;
  }

  return paket; // Mengembalikan data pengguna
};

// createCmsAction
export const createCmsAction = async (paketData: PaketInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  try {
    // Pastikan publish diset ke false jika tidak ada di paketData
    const dataWithPublish = {
      ...paketData,
      publish: paketData.publish ?? false, // Default ke false jika publish tidak ada
    };

    // Memasukkan data ke dalam tabel `Paket`
    const { data: PaketData, error: PaketError } = await supabase
      .from("Paket")
      .insert([dataWithPublish])
      .select();

    if (PaketError) throw PaketError;

    const paketId = PaketData[0].id;

    // Memasukkan data ke dalam tabel `Hotel` terkait dengan paket yang baru dibuat
    if (paketData.hotel && paketData.hotel.length > 0) {
      for (const item of paketData.hotel) {
        const { error: hotelError } = await supabase
          .from("Hotel")
          .insert({
            namaHotel: item.namaHotel,
            alamatHotel: item.alamatHotel,
            ratingHotel: item.ratingHotel,
            tanggalCheckIn: item.tanggalCheckIn,
            tanggalCheckOut: item.tanggalCheckOut,
            paket_id: paketId, // Mengaitkan hotel dengan paket baru
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
    return { success: false, error: (error as Error).message || "Unknown error occurred" };
  }
};

// updateCmsAction
export const updateCmsAction = async (paketData: PaketInterface) => {
  const supabase = createClient(); // Membuat instance Supabase client

  try {
    if (!paketData.id) {
      throw new Error("Paket ID is required for update.");
    }

    // Memperbarui data di tabel `Paket`
    const { data: paketDataUpdated, error: paketError } = await supabase
      .from("Paket")
      .update(paketData)
      .eq("id", paketData.id)
      .select();

    if (paketError) throw paketError;

    console.log("Paket updated:", paketDataUpdated);

    // Memproses pembaruan data hotel
    if (paketData.hotel && paketData.hotel.length > 0) {
      const existingHotelIds = paketData.hotel.map((hotel) => hotel.id).filter(Boolean);

      // Hapus hotel yang tidak ada di `paketData.hotel`
      const { error: deleteError } = await supabase
        .from("Hotel")
        .delete()
        .eq("paket_id", paketData.id)
        .not("id", "in", existingHotelIds);

      if (deleteError) throw deleteError;

      // Perbarui atau tambahkan data hotel
      for (const hotel of paketData.hotel) {
        if (hotel.id) {
          // Update data hotel yang sudah ada
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

          if (hotelUpdateError) throw hotelUpdateError;
        } else {
          // Tambahkan data hotel baru
          const { error: hotelInsertError } = await supabase
            .from("Hotel")
            .insert({
              namaHotel: hotel.namaHotel,
              alamatHotel: hotel.alamatHotel,
              ratingHotel: hotel.ratingHotel,
              tanggalCheckIn: hotel.tanggalCheckIn,
              tanggalCheckOut: hotel.tanggalCheckOut,
              paket_id: paketData.id, // Mengaitkan hotel dengan paket yang diupdate
            });

            if (hotelInsertError) throw hotelInsertError;
        }
      }
    }

    // Revalidate CMS path setelah berhasil update
    revalidatePath("/cms");

    return { success: true, data: paketDataUpdated };
  } catch (error) {
    console.error("Error updating Paket:", error);

    const errorMessage =
      error instanceof Error
        ? error.message
        : "Unknown error occurred";

    return { success: false, error: errorMessage };
  }
};




export const sanitizeFolderName = (name: string): string => {
  if (typeof name !== "string") {
    throw new Error("Expected a string for folder name");
  }
  return name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
};

