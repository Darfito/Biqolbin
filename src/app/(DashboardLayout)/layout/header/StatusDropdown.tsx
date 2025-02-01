"use client";

import React, { useState, useRef, useEffect } from "react";
import type { KeyboardEvent } from "react";

// MUI Imports
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { IconChevronDown } from "@tabler/icons-react";
import useMediaQuery from "@mui/material/useMediaQuery";

interface StatusDropdownProps {
  selectedStatus: boolean;
  onStatusChange: (status: boolean) => void;
}

const StatusDropdown = ({ selectedStatus, onStatusChange }: StatusDropdownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  // Responsive hook untuk layar kecil (mobile)
  const isMobile = useMediaQuery("(max-width: 768px)");

  const statusOptions = [
    { label: "Aktif", value: true },
    { label: "Tidak Aktif", value: false },
  ];

  // Toggle dropdown
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSelectStatus = (status: boolean) => {
    onStatusChange(status);
    setOpen(false);
  };

  // Handle keyboard navigation
  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab" || event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    }
  };

  // Fokus kembali ke tombol setelah dropdown ditutup
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current?.focus();
    }
    prevOpen.current = open;
  }, [open]);

  return (
    <>
      <Button
        ref={anchorRef}
        variant="contained"
        endIcon={<IconChevronDown size={isMobile ? 16 : 20} />}
        aria-haspopup="true"
        onClick={handleToggle}
        sx={{
          fontSize: isMobile ? "0.8rem" : "1rem",
          padding: isMobile ? "8px 14px" : "6px 16px",
          minWidth: "125px",
          color: "white",
        }}
      >
        {selectedStatus ? "Aktif" : "Tidak Aktif"}
      </Button>

      <Popper
        transition
        open={open}
        disablePortal
        placement="bottom-start"
        anchorEl={anchorRef.current}
        sx={{ zIndex: 2 }}
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin: placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                boxShadow: 3,
                mt: 0.5,
                width: "150px",
                backgroundColor: "white",
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList autoFocusItem={open} onKeyDown={handleListKeyDown}>
                  {statusOptions.map((option) => (
                    <MenuItem
                      key={option.value.toString()}
                      onClick={() => handleSelectStatus(option.value)}
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Fade>
        )}
      </Popper>
    </>
  );
};

export default StatusDropdown;
