import {
  IconBook,
  IconLayoutDashboard,
  IconMoneybag,
  IconPencil,
  IconUser,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";


const Menuitems = [

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
    role: ["Admin", "Superadmin", "Divisi General Affair", "Finance & Accounting", "Marketing"]
  },
  {
    id: uniqueId(),
    title: "Keuangan",
    icon: IconMoneybag,
    href: "/keuangan",
    role: ["Admin", "Superadmin", "Divisi General Affair", "Finance & Accounting"]
  },
  {
    id: uniqueId(),
    title: "Jamaah",
    icon: IconBook,
    href: "/jamaah",
    role: ["Admin", "Superadmin", "Divisi General Affair", "Finance & Accounting"]
  },
  {
    id: uniqueId(),
    title: "CMS",
    icon: IconPencil,
    href: "/cms",
    role: ["Admin", "Superadmin", "Marketing"]
  },
  {
    id: uniqueId(),
    title: "User",
    icon: IconUser,
    href: "/user",
    role: ["Admin", "Superadmin"]
  },
];

export default Menuitems;
