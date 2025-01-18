import UserDetail from "./components/UserDetail";

export default async function DetailUser({
    params,
  }: {
    params: Promise<{ id: string }>;
  }) {
    const breadcrumbLinks = [
      { label: "User", href: "/user" },
      { label: `${(await params).id}` }, // No href for the current page
    ];
    return <>
    <UserDetail id={(await params).id} breadcrumbLinks={breadcrumbLinks} />
    </>;
  }