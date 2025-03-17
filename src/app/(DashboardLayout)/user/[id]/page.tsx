import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { CabangInterface, UserInterface } from "../../utilities/type";
import {
  getCabangAction,
  getUserAction,
  getUserActionById,
  getUserCabangAction,
} from "../action";
import UserDetail from "./components/UserDetail";

export default async function DetailUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let cabangData: CabangInterface[] = [];
  let roleUser = "";
  let currentUser: UserInterface | null = null;

  try {
    // Ambil data user yang sedang login
    const userLoginResponse = await getLoggedInUser();

    if (userLoginResponse) {
      // Ambil detail user berdasarkan ID
      const userDetails = await getUserById(userLoginResponse.id);

      const userResult = await getUserActionById((await params).id);
      if (userResult.success) {
        currentUser = userResult.data;
      } else {
        currentUser = null;
      }

      console.log("User data: ", userDetails);
      // Ambil data penempatan cabang dan role user
      roleUser = userDetails?.[0].role || "";
    }

    // Ambil data cabang
    cabangData = (await getCabangAction()) ?? [];
  } catch (error) {
    console.error("Error fetching data: ", error);
  }

  const stableCurrentUser = currentUser || null;

  console.log("Current User: ", stableCurrentUser);

  const breadcrumbLinks = [
    { label: "User", href: "/user" },
    { label: `${(await params).id}` }, // No href for the current page
  ];

  return (
    <>
      <UserDetail
        id={(await params).id}
        breadcrumbLinks={breadcrumbLinks}
        role={roleUser}
        cabangData={cabangData}
        userData={stableCurrentUser}
      />
    </>
  );
}
