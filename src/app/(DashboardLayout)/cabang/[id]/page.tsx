import { getLoggedInUser, getUserById } from "@/libs/sessions";
import { CabangInterface } from "../../utilities/type";
import { getCabangAction } from "../../user/action";
import CabangDetail from "./components/CabangDetail";

export default async function DetailUser({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  let cabangData: CabangInterface[] = [];
  let roleUser = "";

  try {
    // Ambil data user yang sedang login
    const userLoginResponse = await getLoggedInUser();

    if (userLoginResponse) {
      // Ambil detail user berdasarkan ID
      const userDetails = await getUserById(userLoginResponse.id);

      console.log("User data: ", userDetails);
      // Ambil data penempatan cabang dan role user
      roleUser = userDetails?.[0].role || "";
    }

    // Ambil data cabang
    cabangData = (await getCabangAction()) ?? [];
  } catch (error) {
    console.error("Error fetching data: ", error);
  }

  const breadcrumbLinks = [
    { label: "Cabang", href: "/cabang" },
    { label: `${(await params).id}` }, // No href for the current page
  ];

  return (
    <>
      <CabangDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} role={roleUser} />
    </>
  );
}
