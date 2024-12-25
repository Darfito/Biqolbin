// components/ActionButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton } from "@mui/material";
import { IconEditCircle, IconInfoCircle } from "@tabler/icons-react";

interface ActionButtonProps<T> {
  rowData: T;
  actionPath: (rowData: T) => string; // Fungsi untuk menentukan path dinamis
}

const ActionButton = <T,>({ rowData, actionPath }: ActionButtonProps<T>) => {
  const router = useRouter();

  const handleAction = () => {
    router.push(actionPath(rowData)); // Navigasi ke path berdasarkan fungsi
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton
        color="primary"
        onClick={handleAction} // Action ketika tombol diklik
      >
        <IconEditCircle />
      </IconButton>
    </Box>
  );
};

export default ActionButton;
