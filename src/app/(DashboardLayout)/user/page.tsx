'use server';


import User from "./components/User";
import { getUserAction } from "./action";


export default async function UserPage() {
  const userData = await getUserAction();

  console.log("User data:", userData);  // Now `userData` is an array of users
  return (
    <>
      <User data={userData || []} />  {/* Passing the parsed data to the User component */}
    </>
  );
}
