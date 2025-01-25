import React from "react";
import Menuitems from "./MenuItems";
import { usePathname } from "next/navigation";
import { Box, List } from "@mui/material";
import NavItem from "./NavItem";

interface SidebarItemsProps {
  toggleMobileSidebar?: any;
  role: string
}

const SidebarItems = ({ toggleMobileSidebar, role}: SidebarItemsProps) => {
  const pathname = usePathname();
  const pathDirect = pathname;

  const filteredMenuItems = Menuitems.filter((item) => item.role.includes(role));

  return (
    <Box sx={{ px: 3 }}>
      <List sx={{ pt: 0 }} className="sidebarNav" component="div">
      {filteredMenuItems.map((item) => (
          <NavItem
            item={item}
            key={item.id}
            pathDirect={pathDirect}
            onClick={toggleMobileSidebar}
          />
        ))}
      </List>
    </Box>
  );
};
export default SidebarItems;
