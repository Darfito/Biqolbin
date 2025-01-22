"use client";

// React Imports
import React, { useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnFiltersState,
  Updater,
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
  Typography,
} from "@mui/material";
import { Folder, UploadFile } from "@mui/icons-material";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";
import { toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// Component Imports
import TablePaginationComponent from "../pagination/TablePaginationComponent";

// Style Imports
import styles from "../../../../styles/table.module.css";

// Type Imports
import { JenisDokumen } from "../../type";
import FileUploaderSingle from "../uploader/FileUploaderSingle";
import { createClient } from "@/libs/supabase/client";
import ActionButton from "./components/ActionButton";
import { getFileUrl } from "@/app/(DashboardLayout)/jamaah/action";


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
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<JenisDokumen | null>(null);
  const [dialogRow, setDialogRow] = useState<JenisDokumen | null>(null);
  const [openFileDialog, setOpenFileDialog] = useState(false); // Status dialog
  const [fileUrl, setFileUrl] = useState<string | null>(null); // URL file untuk dialog
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah
  const [tableData, setTableData] = useState<JenisDokumen[]>(data);

  const supabase = createClient();

  const uploadFileToSupabase = async (
    file: File,
    jamaahId: string,
    namaDokumen: string
  ) => {
    try {
      const path = `${jamaahId}/${namaDokumen}`;
      const { data, error } = await supabase.storage
        .from("Dokumen") // Nama bucketini 
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

  const handleOpenDeleteDialog = (row: JenisDokumen) => {
    setRowToDelete(row);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setRowToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleFileUpload = async (file: File) => {
    if (!dialogRow) return; // Pastikan ada data baris yang sedang aktif
  
    const { jamaah_id: jamaahId, nama_dokumen: namaDokumen } = dialogRow;
  
    if (!jamaahId || !namaDokumen) {
      toast.error("Data Jamaah atau nama dokumen tidak valid.");
      return;
    }
  
    // Dapatkan ekstensi file dari nama file asli
    const fileExtension = file.name.split(".").pop();
  
    if (!fileExtension) {
      toast.error("File tidak memiliki ekstensi.");
      return;
    }
  
    // Pastikan ekstensi valid (opsional, untuk membatasi file tertentu)
    const allowedExtensions = ["jpg", "jpeg", "png", "pdf"];
    if (!allowedExtensions.includes(fileExtension.toLowerCase())) {
      toast.error("Format file tidak didukung. Hanya JPG, PNG, dan PDF yang diizinkan.");
      return;
    }
  
    // Buat nama file dengan ekstensi
    const fileName = `${namaDokumen}.${fileExtension}`;
    const publicUrl = await uploadFileToSupabase(file, jamaahId.toString(), fileName);
  
    if (publicUrl) {
      // Jika upload berhasil, lakukan update pada tabel jenisDokumen dengan URL file
      try {
        const { data, error } = await supabase
          .from("jenis_dokumen")
          .update({ file: publicUrl, action: "Diterima", lampiran: true }) // Update file URL dan status
          .eq("jamaah_id", jamaahId)
          .eq("nama_dokumen", namaDokumen);
  
        if (error) {
          throw new Error(error.message);
        }
  
        toast.success("File berhasil diunggah dan data diperbarui!");
      } catch (error: any) {
        toast.error(`Gagal memperbarui data: ${error.message}`);
        console.error("Error updating jenisDokumen:", error);
      }
    }
  
    handleDialogClose(); // Tutup dialog setelah upload selesai
  };
  

  const getFile = async (jamaahId: string, namaDokumen: string) => {
    try {
      // Mengambil path file dari tabel Cicilan
      const filePath = await getFileUrl(jamaahId, namaDokumen);

      if (!filePath.success || !filePath.data?.file) {
        throw new Error("File path tidak ditemukan.");
      }

      // Mengambil URL publik dari Supabase Storage bucket "Cicilan"
      const lampiranPath = filePath.data.file; // Mengakses properti `lampiran`

      if (lampiranPath) {
        return lampiranPath; // Kembalikan URL publik yang bisa diakses
      }
    } catch (error: any) {
      toast.error(`Gagal mendapatkan URL file: ${error.message}`);
      console.error("Error fetching file URL:", error);
      return null;
    }
  };

  const deleteFileFromSupabase = async (
    jamaahId: string,
    namaDokumen: string
  ) => {
    try {
      const path = `${jamaahId}/${namaDokumen}`;
      const { error } = await supabase.storage.from("Dokumen").remove([path]);

      if (error) {
        throw new Error(error.message);
      }

      toast.success("File berhasil dihapus!");
      setFileUrl(null);
      return true;
    } catch (error: any) {
      toast.error(`Gagal menghapus file: ${error.message}`);
      console.error("Error deleting file:", error);
      return false;
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleOpenFileDialog = async (
    jamaahId: string,
    namaDokumen: string
  ) => {
    const url = await getFile(jamaahId, namaDokumen);
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
                  color: rowData.action === "Diterima" ? "#F18B04" : "#B0B0B0",
                }}
              >
                <Folder />
              </IconButton>

              {/* Tombol Delete */}
              {/* <IconButton
                color="error"
                onClick={() => {
                  if (rowData.jamaah_id && rowData.nama_dokumen) {
                    handleOpenDeleteDialog(rowData);
                  } else {
                    toast.error("Data Jamaah atau dokumen tidak valid.");
                  }
                }}
              >
                <Delete />
              </IconButton> */}

              <ActionButton
                rowData={row.original}
                mode="delete"
                onDelete={() => {
                  if (rowData.jamaah_id && rowData.nama_dokumen) {
                    handleOpenDeleteDialog(rowData);
                  } else {
                    toast.error("Data Jamaah atau dokumen tidak valid.");
                  }
                }} // Buka dialog konfirmasi
              />
            </Box>
          );
        },
        header: "Action",
        enableColumnFilter: false,
      }),
    ],
    [columnHelper, fileUrl, handleOpenFileDialog]
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
        onPageChange={(_: any, page: Updater<number>) => {
          table.setPageIndex(page);
        }}
      />
      {/* Dialog Upload */}
      {dialogRow && (
        <Dialog open={!!dialogRow} onClose={handleDialogClose}>
          <DialogTitle>Upload File untuk {dialogRow.nama_dokumen}</DialogTitle>
          <DialogContent>
          <FileUploaderSingle
            onFileUpload={(file) => {
            setUploadedFile(file); // Simpan file yang diunggah ke state
            }}
          />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose} color="primary">
              Cancel
            </Button>
            <Button
            onClick={async () => {
              if (uploadedFile && dialogRow) {
                await handleFileUpload(
                  uploadedFile,
                ); // Proses upload file
                setUploadedFile(null); // Reset file setelah upload selesai
                handleDialogClose(); // Tutup dialog setelah berhasil upload
              } else {
                toast.error("Silakan pilih file terlebih dahulu."); // Tampilkan pesan error jika file belum dipilih
              }
            }}
            color="primary"
            variant="contained"
            sx={{ color: "white" }}
          >
            Simpan
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
            // Cek ekstensi file
            fileUrl.endsWith(".pdf") ? (
              <iframe
                src={fileUrl}
                width="100%"
                height="500px"
                style={{ border: "none" }}
              />
            ) : (
              // Tampilkan gambar jika bukan PDF
              <Box
                component="img"
                src={fileUrl}
                alt="Lampiran"
                sx={{
                  maxWidth: "400px",
                  objectFit: "contain",
                }}
              />
            )
          ) : (
            <Typography>File tidak tersedia.</Typography>
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

      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">
          Konfirmasi Penghapusan
        </DialogTitle>
        <DialogContent>
          <p id="delete-dialog-description">
            Apakah Anda yakin ingin menghapus dokumen{" "}
            <strong>{rowToDelete?.nama_dokumen}</strong>?
          </p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog} color="primary">
            Batal
          </Button>
          <Button
            onClick={async () => {
              if (
                rowToDelete &&
                rowToDelete.jamaah_id &&
                rowToDelete.nama_dokumen
              ) {
                const success = await deleteFileFromSupabase(
                  rowToDelete.jamaah_id.toString(),
                  rowToDelete.nama_dokumen
                );

                if (success) {
                  setTableData((prevData) =>
                    prevData.filter(
                      (dokumen) =>
                        !(
                          dokumen.jamaah_id === rowToDelete.jamaah_id &&
                          dokumen.nama_dokumen === rowToDelete.nama_dokumen
                        )
                    )
                  );
                }

                handleCloseDeleteDialog();
              } else {
                toast.error("Data Jamaah atau dokumen tidak valid.");
              }
            }}
            color="error"
            variant="contained"
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default JamaahDetailTable;
