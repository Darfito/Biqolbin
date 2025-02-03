// components/ActionButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton } from "@mui/material";
import { IconEditCircle, IconTrash, IconArrowBack } from "@tabler/icons-react";

interface ActionButtonProps<T> {
  rowData: T;
  actionPath?: (rowData: T) => string; // Fungsi untuk menentukan path dinamis
  mode?: "detail" | "delete" | "undo"; // Mode aksi tombol: detail (default), delete, atau undo
  onDelete?: (rowData: T) => void; // Callback khusus untuk mode delete
  onUndo?: (rowData: T) => void; // Callback khusus untuk mode undo
}

const ActionButton = <T,>({ rowData, actionPath, mode = "detail", onDelete, onUndo }: ActionButtonProps<T>) => {
  const router = useRouter();

  const handleAction = () => {
    if (mode === "delete") {
      if (onDelete) {
        onDelete(rowData); // Eksekusi callback delete jika disediakan
      } else {
        console.warn("onDelete callback is not provided for delete mode");
      }
    } else if (mode === "undo") {
      if (onUndo) {
        onUndo(rowData); // Eksekusi callback undo jika disediakan
      } else {
        console.warn("onUndo callback is not provided for undo mode");
      }
    } else {
      router.push(actionPath ? actionPath(rowData) : '/'); // Navigasi ke path berdasarkan fungsi
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center" }}>
      <IconButton
        color={mode === "delete" ? "error" : mode === "undo" ? "secondary" : "primary"} // Warna tombol berdasarkan mode
        onClick={handleAction} // Action ketika tombol diklik
      >
        {mode === "delete" ? <IconTrash /> : mode === "undo" ? <IconArrowBack /> : <IconEditCircle />} {/* Icon berdasarkan mode */}
      </IconButton>
    </Box>
  );
};

export default ActionButton;
