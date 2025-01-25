"use server";

import User from "./components/User";
import { getCabangAction, getUserAction, getUserCabangAction } from "./action";
import { CabangInterface, UserInterface } from "../utilities/type";
import { getLoggedInUser, getUserById } from "@/libs/sessions";

export default async function UserPage() {
  let cabangData: CabangInterface[] = [];
  let userData: UserInterface[] = [];
  let cabangUser = 0;
  let roleUser = "";

  try {
    // Ambil data user yang sedang login
    const userLoginResponse = await getLoggedInUser();

    if (userLoginResponse) {
      // Ambil detail user berdasarkan ID
      const userDetails = await getUserById(userLoginResponse.id);

      console.log("User data: ", userDetails);
      // Ambil data penempatan cabang dan role user
      cabangUser = userDetails?.[0].cabang_id || 0;
      roleUser = userDetails?.[0].role || "";
    }

    // Ambil data cabang
    cabangData = (await getCabangAction()) ?? [];

    // Ambil data user berdasarkan role
    if (roleUser === "Superadmin") {
      userData = (await getUserAction()) ?? [];
    } else {
      userData = (await getUserCabangAction(cabangUser)) ?? [];
    }
  } catch (error) {
    console.error("Error fetching data: ", error);
  }

  const stableCabangData = cabangData || [];
  const stableUserData = userData || [];

  console.log("Cabang data: ", stableCabangData);
  console.log("User data: ", stableUserData);

  return (
    <>
      <User userData={stableUserData} cabangData={stableCabangData} />
    </>
  );
}
