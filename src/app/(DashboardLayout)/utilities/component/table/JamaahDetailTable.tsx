"use client";

// React Imports
import React, { useEffect, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnFiltersState,
} from "@tanstack/react-table";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  TablePagination,
} from "@mui/material";
import { Delete, Folder, UploadFile } from "@mui/icons-material";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// Component Imports
import CustomTextField from "../textField/TextField";
import TablePaginationComponent from "../pagination/TablePaginationComponent";

// Style Imports
import styles from "../../../../styles/table.module.css";

// Type Imports
import { JenisDokumen } from "../../type";
import FileUploaderSingle from "../uploader/FileUploaderSingle";
import { createClient } from "@/libs/supabase/client";
import PdfViewer from "./components/PdfViewer";

const fuzzyFilter = (
  row: { getValue: (arg0: any) => any },
  columnId: any,
  value: string,
  addMeta: (arg0: { itemRank: RankingInfo }) => void
) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

interface JamaahDetailProps<T> {
  data: T[];
  perkawinan?: boolean;
}

const JamaahDetailTable = ({
  data,
  perkawinan,
}: JamaahDetailProps<JenisDokumen>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah
  const [dialogRow, setDialogRow] = useState<JenisDokumen | null>(null);
  const [openFileDialog, setOpenFileDialog] = useState(false); // Status dialog
  const [fileUrl, setFileUrl] = useState<string | null>(null); // URL file untuk dialog
  const supabase = createClient();

  const uploadFileToSupabase = async (
    file: File,
    jamaahId: string,
    namaDokumen: string
  ) => {
    try {
      const path = `${jamaahId}/${namaDokumen}`;
      const { data, error } = await supabase.storage
        .from("Dokumen") // Nama bucket
        .upload(path, file, {
          cacheControl: "3600",
          upsert: true, // Overwrite file jika sudah ada
        });

      if (error) {
        throw new Error(error.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("Dokumen")
        .getPublicUrl(path);

      toast.success("File berhasil diunggah!");
      return publicUrlData.publicUrl; // Kembalikan URL publik
    } catch (error: any) {
      toast.error(`Gagal mengunggah file: ${error.message}`);
      console.error("Error uploading file:", error);
      return null;
    }
  };

  const handleDialogOpen = (row: JenisDokumen) => {
    setDialogRow(row); // Tetapkan baris yang sedang dibuka dialognya
  };
  const handleDialogClose = () => {
    setDialogRow(null); // Tutup dialog
  };

  const handleFileUpload = async (file: File) => {
    if (!dialogRow) return; // Pastikan ada data baris yang sedang aktif

    const { jamaah_id: jamaahId, nama_dokumen: namaDokumen } = dialogRow;

    if (!jamaahId || !namaDokumen) {
      toast.error("Data Jamaah atau nama dokumen tidak valid.");
      return;
    }

    const publicUrl = await uploadFileToSupabase(
      file,
      jamaahId.toString(),
      namaDokumen
    );

    if (publicUrl) {
      console.log("File URL:", publicUrl);
      // Anda bisa melakukan sesuatu dengan URL publik, seperti menyimpan ke database
    }

    handleDialogClose(); // Tutup dialog setelah upload selesai
  };

  const getFileUrl = async (jamaahId: string, namaDokumen: string) => {
    try {
      const path = `${jamaahId}/${namaDokumen}`;
      const { data } = supabase.storage.from("Dokumen").getPublicUrl(path);

      if (data?.publicUrl) {
        return data.publicUrl;
      } else {
        throw new Error("File tidak ditemukan.");
      }
    } catch (error: any) {
      toast.error(`Gagal mendapatkan URL file: ${error.message}`);
      console.error("Error fetching file URL:", error);
      return null;
    }
  };

  const handleOpenFileDialog = async (
    jamaahId: string,
    namaDokumen: string
  ) => {
    const url = await getFileUrl(jamaahId, namaDokumen);
    if (url) {
      setFileUrl(url);
      setOpenFileDialog(true);
    }
  };

  const handleCloseFileDialog = () => {
    setFileUrl(null);
    setOpenFileDialog(false);
  };

  // Filter data "Buku Nikah" hanya jika perkawinan bernilai true
  const filteredData = useMemo(() => {
    return data.filter(
      (dokumen) => dokumen.nama_dokumen !== "Buku Nikah" || perkawinan
    );
  }, [data, perkawinan]);

  const columnHelper = createColumnHelper<JenisDokumen>();

  // Definisi kolom tabel
  const columns = useMemo(
    () => [
      columnHelper.accessor("nama_dokumen", {
        id: "nama_dokumen",
        cell: (info) => info.getValue(),
        header: "Jenis Dokumen",
        enableColumnFilter: false,
      }),
      columnHelper.accessor("action", {
        id: "action",
        cell: ({ row }) => {
          const rowData = row.original;
          console.log("file url di kolom action:", fileUrl);
          return (
            <Box sx={{ display: "flex", justifyContent: "start" }}>
              {/* Tombol Upload */}
              <IconButton onClick={() => handleDialogOpen(rowData)}>
                <UploadFile />
              </IconButton>
              {/* Tombol Folder */}
              <IconButton
                onClick={() => {
                  if (rowData.jamaah_id && rowData.nama_dokumen) {
                    handleOpenFileDialog(
                      rowData.jamaah_id.toString(),
                      rowData.nama_dokumen
                    );
                  } else {
                    toast.error("Data Jamaah atau dokumen tidak valid.");
                  }
                }}
                sx={{
                  color: fileUrl && fileUrl.includes(rowData.nama_dokumen) ? '#F18B04' : '#B0B0B0',
                }}
              >
                <Folder />
              </IconButton>

              {/* Tombol Delete */}
              <IconButton>
                <Delete />
              </IconButton>
            </Box>
          );
        },
        header: "Action",
        enableColumnFilter: false,
      }),
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <Box sx={{ paddingX: "1rem" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          margin: "20px",
        }}
      ></Box>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.tableTh}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <TablePagination
        component={() => <TablePaginationComponent table={table} />}
        count={table.getFilteredRowModel().rows.length}
        rowsPerPage={table.getState().pagination.pageSize}
        page={table.getState().pagination.pageIndex}
        onPageChange={(_, page) => {
          table.setPageIndex(page);
        }}
      />
      {/* Dialog Upload */}
      {dialogRow && (
        <Dialog open={!!dialogRow} onClose={handleDialogClose}>
          <DialogTitle>Upload File untuk {dialogRow.nama_dokumen}</DialogTitle>
          <DialogContent>
            <FileUploaderSingle onFileUpload={handleFileUpload} />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog
        open={openFileDialog}
        onClose={handleCloseFileDialog}
        sx={{ padding: "1rem" }}
      >
        <DialogTitle>Preview File</DialogTitle>
        <DialogContent>
          {fileUrl ? (
            <PdfViewer fileUrl={fileUrl} />
          ) : (
            <p>File tidak tersedia.</p>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseFileDialog}
            sx={{ color: "white" }}
            variant="contained"
            color="error"
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JamaahDetailTable;
