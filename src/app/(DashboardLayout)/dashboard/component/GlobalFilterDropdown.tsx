"use client";

import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";

// MUI Imports
import Fade from "@mui/material/Fade";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import Popper from "@mui/material/Popper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { IconChevronDown, IconFilter } from "@tabler/icons-react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CabangInterface } from "../../utilities/type";

interface GlobalFilterDropdownProps {
  data: CabangInterface[];
  onSelectedFilter: (selectedFilter: string) => void;
  selectedFilterName: string;
}

const GlobalFilterDropdown = ({
  data,
  onSelectedFilter,
  selectedFilterName,
}: GlobalFilterDropdownProps) => {
  // States
  const [open, setOpen] = useState<boolean>(false);
  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [selectedFilter, setSelectedFilter] =
    useState<string>(selectedFilterName);

  // Responsive hook to detect if screen width is less than 768px
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  // Update selectedFilter state when selectedFilterName prop changes
  useEffect(() => {
    setSelectedFilter(selectedFilterName);
  }, [selectedFilterName]);

  // Notify parent component when selectedFilter changes
  useEffect(() => {
    onSelectedFilter(selectedFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilter]);

  const handleListKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  };

  // Function to handle filter selection
  const handleSelectFilter = (filterName: string) => {
    setSelectedFilter(filterName);
    setOpen(false);
  };

  // Return focus to the button when we transitioned from !open -> open
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
        startIcon={<IconFilter size={isMobile ? 16 : 20} />}
        endIcon={<IconChevronDown size={isMobile ? 16 : 20} />}
        aria-haspopup="true"
        onClick={handleToggle}
        id="composition-button"
        aria-expanded={open ? "true" : undefined}
        aria-controls={open ? "composition-menu" : undefined}
        sx={{
          fontSize: isMobile ? "0.7rem" : "1rem",
          padding: isMobile ? "8px 14px" : "6px 16px",
          minWidth: isMobile ? "125px" : "auto",
          color: "white",
        }}
      >
        {selectedFilter || "Dummy"}
      </Button>
      <Popper
        transition
        open={open}
        disablePortal
        role={undefined}
        placement="bottom-start"
        anchorEl={anchorRef.current}
        className="z-[var(--mui-zIndex-modal)]"
        popperOptions={{
          modifiers: [
            {
              name: "flip",
              options: {
                enabled: true,
                boundary: "window",
              },
            },
          ],
        }}
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
                width: isMobile ? "125px" : "190px",
              }}
            >
              <ClickAwayListener onClickAway={() => setOpen(false)}>
                <MenuList
                  autoFocusItem={open}
                  id="composition-menu"
                  onKeyDown={handleListKeyDown}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 1,
                    paddingInlineStart: 2,
                    fontSize: isMobile ? "0.75rem" : "0.875rem",
                  }}
                >
                  <MenuItem onClick={() => handleSelectFilter("Semua Cabang")}>
                    Semua Cabang
                  </MenuItem>
                  {data
                    ?.filter((item) => item.nama !== "Pusat") // Menambahkan filter untuk menghilangkan item dengan nama "Pusat"
                    .map((item, index) => (
                      <MenuItem
                        key={index}
                        onClick={() => handleSelectFilter(item.nama)}
                      >
                        {item.nama}
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

export default GlobalFilterDropdown;
