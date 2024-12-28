import {
  IconBook,
  IconLayoutDashboard,
  IconMoneybag,
  IconPencil,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";


const Menuitems = [

  {
    id: uniqueId(),
    title: "Dashboard",
    icon: IconLayoutDashboard,
    href: "/dashboard",
  },
  {
    id: uniqueId(),
    title: "Keuangan",
    icon: IconMoneybag,
    href: "/keuangan",
  },
  {
    id: uniqueId(),
    title: "Jamaah",
    icon: IconBook,
    href: "/jamaah",
  },
  {
    id: uniqueId(),
    title: "CMS",
    icon: IconPencil,
    href: "/cms",
  },
];

export default Menuitems;
