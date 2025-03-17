"use server"

import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { redirect } from "next/navigation";
import { getCmsAction } from "../cms/action";
import { getJamaahAction } from "../jamaah/action";
import { PaketInterface, JamaahInterface, KeuanganInterface } from "../utilities/type";
import { getKeuanganAction, getKeuanganActionCabang } from "./action";
import Keuangan from "./component/Keuangan";

export default async function KeuanganPage() {
  let paketData: PaketInterface[] = [];
  let jamaahData: JamaahInterface[] = [];
  let keuanganData: KeuanganInterface[] = [];
  let cabangUser = 0;
  let roleUser = "";
  let idUser = "";

  try {
    const userLoginResponse = await getLoggedInUser();

    if (userLoginResponse) {
      const userDetails = await getUserById(userLoginResponse.id);
      cabangUser = userDetails?.[0].cabang_id || 0;
      roleUser = userDetails?.[0].role || "";
      idUser = userDetails?.[0].id || "";
    }

    paketData = (await getCmsAction()) ?? [];
    jamaahData = await getJamaahAction();

    // Jika bukan Superadmin, filter data jamaah berdasarkan cabangUser
    if (roleUser !== "Superadmin") {
      jamaahData = jamaahData.filter((jamaah) => jamaah.cabang_id === cabangUser);
    }

    if (roleUser === "Superadmin") {
      keuanganData = (await getKeuanganAction()) ?? [];
    } else {
      keuanganData = await getKeuanganActionCabang(cabangUser);
    }

    console.log("keuangan data di page", keuanganData);
  } catch (error) {
    console.error("Error fetching data:", error);
  }

  const allowedRoles = ["Admin", "Superadmin", "Divisi General Affair", "Finance & Accounting"];

  if (!allowedRoles.includes(roleUser)) {
    redirect("/not-authorized");
  }

  const stablePaketData = paketData || [];
  const stableJamaahData = jamaahData || [];
  const stableKeuanganData = keuanganData || [];

  return (
    <Keuangan
      paketData={stablePaketData}
      jamaahData={stableJamaahData}
      keuanganData={stableKeuanganData}
      idUser={idUser}
    />
  );
}
