import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";

interface BreadcrumbProps {
  links: { label: string; href?: string }[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ links }) => {
  return (
    <Breadcrumbs aria-label="breadcrumb">
      {links.map((link, index) =>
        link.href ? (
          <Link key={index} underline="hover" color="inherit" href={link.href}>
            {link.label}
          </Link>
        ) : (
          <Typography key={index} color="text.primary">
            {link.label}
          </Typography>
        )
      )}
    </Breadcrumbs>
  );
};

export default Breadcrumb;
