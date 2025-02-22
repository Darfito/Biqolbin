import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from "@mui/material";

interface ConfirmDialogProps {
  open: boolean; // Status dialog (buka/tutup)
  onClose: () => void; // Fungsi untuk menutup dialog
  onConfirm: () => void; // Fungsi untuk mengonfirmasi aksi
  title: string; // Judul dialog
  description: string; // Deskripsi dialog
  undo: boolean;
}

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title,
  description,
  undo,
}: ConfirmDialogProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" sx={{ color: "#fff" }} color="primary">
          Batal
        </Button>
        {undo === false ? (
          <Button onClick={onConfirm} color="error" variant="contained">
            Hapus
          </Button>
        ) : (
          <Button onClick={onConfirm} color="error" variant="contained">
            Balikkan
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
