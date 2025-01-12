// components/ActionButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton } from "@mui/material";
import { IconEditCircle, IconTrash } from "@tabler/icons-react";

interface ActionButtonProps<T> {
  rowData: T;
  actionPath?: (rowData: T) => string; // Fungsi untuk menentukan path dinamis
  mode?: "detail" | "delete"; // Mode aksi tombol: detail (default) atau delete
  onDelete?: (rowData: T) => void; // Callback khusus untuk mode delete
}

const ActionButton = <T,>({ rowData, actionPath, mode = "detail", onDelete }: ActionButtonProps<T>) => {
  const router = useRouter();

  const handleAction = () => {
    if (mode === "delete") {
      if (onDelete) {
        onDelete(rowData); // Eksekusi callback delete jika disediakan
      } else {
        console.warn("onDelete callback is not provided for delete mode");
      }
    } else {
      router.push(actionPath ? actionPath(rowData) : '/'); // Navigasi ke path berdasarkan fungsi
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton
        color={mode === "delete" ? "error" : "primary"} // Warna tombol berdasarkan mode
        onClick={handleAction} // Action ketika tombol diklik
      >
        {mode === "delete" ? <IconTrash /> : <IconEditCircle />} {/* Icon berdasarkan mode */}
      </IconButton>
    </Box>
  );
};

export default ActionButton;
