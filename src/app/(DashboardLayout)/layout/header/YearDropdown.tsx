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

interface YearDropdownProps {
  selectedYear: string;
  onYearChange: (year: string) => void;
}

const YearDropdown = ({ selectedYear, onYearChange }: YearDropdownProps) => {
  // State tahun yang aman saat pertama kali render
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);

  // Responsive hook untuk layar kecil (mobile)
  const isMobile = useMediaQuery("(max-width: 768px)");


  const years = Array.from({ length: 30 }, (_, index) => {
    const currentYear = new Date().getFullYear();
    return currentYear - index; // Daftar 30 tahun terakhir
  });

  // Toggle dropdown
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleSelectYear = (year: number) => {
    onYearChange(year.toString()); // Mengubah tahun yang dipilih
    setOpen(false);
  };

  // Handle keyboard navigation
  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // Fokus kembali ke tombol setelah dropdown ditutup
  const prevOpen = useRef(open);
  useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
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
          fontSize: isMobile ? "0.7rem" : "1rem",
          padding: isMobile ? "8px 14px" : "6px 16px",
          minWidth: isMobile ? "125px" : "auto",
          color: "white",
        }}
      >
      {selectedYear || "Memuat tahun..."}
      </Button>

      <Popper
        transition
        open={open}
        disablePortal
        placement="bottom-start"
        anchorEl={anchorRef.current}
        className="z-[var(--mui-zIndex-modal)]"
      >
        {({ TransitionProps, placement }) => (
          <Fade
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom-start" ? "left top" : "left bottom",
            }}
          >
            <Paper
              sx={{
                boxShadow: 3,
                mt: 0.5,
                width: isMobile ? "125px" : "125px",
                backgroundColor: "white", // Non-tembus pandang
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList
                  autoFocusItem={open}
                  onKeyDown={handleListKeyDown}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    paddingInlineStart: 2,
                    fontSize: isMobile ? "0.7rem" : "0.75rem", // Ukuran font lebih kecil
                    maxHeight: "150px", // Menambahkan batas tinggi agar bisa scroll
                    overflowY: "auto", // Membuat list dapat digulir
                  }}
                >
                  {years.map((year) => (
                    <MenuItem key={year} onClick={() => handleSelectYear(year)}>
                      {year}
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

export default YearDropdown;
