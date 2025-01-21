"use client";

// React Imports
import React, { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  ColumnFiltersState,
  SortingState,
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
  Card,
  Typography,
} from "@mui/material";
import { Folder, UploadFile } from "@mui/icons-material";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

// Component Imports
import TablePaginationComponent from "../pagination/TablePaginationComponent";

// Style Imports
import styles from "../../../../styles/table.module.css";

// Type Imports
import { CicilanType } from "../../type";
import FileUploaderSingle from "../uploader/FileUploaderSingle";
import FormCicilan from "@/app/(DashboardLayout)/keuangan/[id]/component/FormCicilan";
import ConfirmDialog from "../dialog/ConfirmDialog";
import ActionButton from "./components/ActionButton";
import { IconEditCircle } from "@tabler/icons-react";
import { deleteCicilanAndUpdateSisaTagihan } from "@/app/(DashboardLayout)/keuangan/action";
import { createClient } from "@/libs/supabase/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
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

interface KeuanganDetailProps<T> {
  data: T[];
  cicilanKe: number;
  keuanganId: number;
}

interface EditCicilanFormProps {
  onClose: () => void;
}

const KeuanganDetailTable = ({
  keuanganId,
  data,
  cicilanKe,
}: KeuanganDetailProps<CicilanType>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowToDelete, setRowToDelete] = useState<CicilanType | null>(null);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [sorting, setSorting] = useState<SortingState>([
    { id: "cicilanKe", desc: false }, // Default sorting ascending pada kolom cicilanKe
  ]);
  const [openDialog, setOpenDialog] = useState(false);
  const [openFormCicilan, setOpenFormCicilan] = useState(false);
  const [openFileDialog, setOpenFileDialog] = useState(false); // Status dialog
  const [editData, setEditData] = useState<CicilanType | null>(null); // Data cicilan yang sedang diedit
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah
  const [fileUrl, setFileUrl] = useState<string | null>(null); // Menyimpan URL file yang diambil

  const supabase = createClient();

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleFileUpload = async (
    file: File,
    keuanganId: number,
    cicilanKe: number
  ) => {
    try {
      // Get current date for file name
      const formattedDate = new Date().toLocaleDateString("id-ID").replace(/\//g, "_");
      const newFileName = `CicilanKe_${cicilanKe}_Tanggal_${formattedDate}.pdf`;
  
      // Define the file path
      const folderPath = `${keuanganId}/cicilanKe_${cicilanKe}`;
      const fileName = `${folderPath}/${newFileName}`;
  
      // Upload the file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("Cicilan")
        .upload(fileName, file);
  
      if (uploadError) {
        console.error("Error uploading file:", uploadError.message);
        toast.error("Gagal mengunggah file.");
        return;
      }
  
      // Get the file URL from the storage
      const fileUrl = supabase.storage.from("Cicilan").getPublicUrl(fileName).data?.publicUrl;
  
      if (fileUrl) {
        // Update the URL in the Cicilan table
        const { error: updateError } = await supabase
          .from("Cicilan")
          .update({ lampiran: fileUrl })
          .eq("keuangan_id", keuanganId) // Assuming `keuangan_id` is the unique identifier
          .eq("cicilanKe", cicilanKe);
  
        if (updateError) {
          console.error("Error updating lampiran:", updateError.message);
          toast.error("Gagal menyimpan lampiran ke database.");
        } else {
          toast.success("File berhasil diunggah dan lampiran diperbarui!");
        }
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("Terjadi kesalahan saat mengunggah file.");
    }
  };
  
  

  const handleOpenFileDialog = async (
    keuanganId: number,
    cicilanKe: number
  ) => {
    try {
      // Ambil URL file dari bucket
      const url = await getFileUrl(keuanganId, cicilanKe);

      if (url) {
        setFileUrl(url); // Set URL file untuk ditampilkan
        setOpenFileDialog(true); // Buka dialog file
      } else {
        toast.error("File tidak ditemukan.");
      }
    } catch (error) {
      console.error("Error fetching file:", error);
      toast.error("Terjadi kesalahan saat mengambil file.");
    }
  };

  const handleCloseFileDialog = () => {
    setFileUrl(null); // Reset file URL
    setOpenFileDialog(false); // Tutup dialog
  };
  console.log("data keuangan detail table:", data);
  console.log("data cicilan ke:", cicilanKe);

  const handleOpenFormCicilan = (data: CicilanType) => {
    setEditData(data); // Set data cicilan yang akan diedit
    setOpenFormCicilan(true); // Buka dialog
  };

  const handleOpenDeleteDialog = (row: CicilanType) => {
    setRowToDelete(row);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setRowToDelete(null);
    setOpenDeleteDialog(false);
  };

  const handleDelete = () => {
    if (rowToDelete && rowToDelete.id && rowToDelete.keuangan_id) {
      deleteCicilanAndUpdateSisaTagihan(
        rowToDelete.id,
        rowToDelete.keuangan_id
      ); // Perform delete and update actions
    } else {
      console.error("Invalid cicilan data for deletion");
    }
    handleCloseDeleteDialog(); // Close the dialog after deletion
  };

  const getFileUrl = async (keuanganId: number, cicilanKe: number) => {
    try {
      // Sesuaikan path file sesuai format yang digunakan untuk upload
      const path = `${keuanganId}/cicilanKe_${cicilanKe}`;
      const { data } = supabase.storage.from("Cicilan").getPublicUrl(path);

      if (data?.publicUrl) {
        return data.publicUrl; // Kembalikan URL yang bisa diakses publik
      } else {
        throw new Error("File tidak ditemukan.");
      }
    } catch (error: any) {
      toast.error(`Gagal mendapatkan URL file: ${error.message}`);
      console.error("Error fetching file URL:", error);
      return null;
    }
  };

  const handleAddCicilan = async () => {
    const newCicilan: CicilanType = {
      keuangan_id: keuanganId,
      cicilanKe: cicilanKe,
      nominalCicilan: 0,
      tanggalPembayaran: "",
    };

    // Buka form cicilan dengan data baru
    setEditData(newCicilan); // Set data awal untuk form
    setOpenFormCicilan(true); // Buka form
  };

  const handleCloseFormCicilan = () => {
    setOpenFormCicilan(false); // Tutup dialog
    setEditData(null); // Reset data cicilan
  };

  const columnHelper = createColumnHelper<CicilanType>();

  const columns = [
    columnHelper.accessor("cicilanKe", {
      id: "cicilanKe",
      cell: (info) => info.getValue(),
      header: "Cicilan Ke",
      enableColumnFilter: false,
      sortingFn: "basic",
    }),
    columnHelper.accessor("tanggalPembayaran", {
      id: "tanggalPembayaran",
      cell: (info) => new Date(info.getValue()).toLocaleDateString("id-ID"),
      header: "Tanggal Bayar",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("nominalCicilan", {
      id: "nominalCicilan",
      cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
      header: "Cicilan Yang Dibayar",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("lampiran", {
      cell: (info) => {
        const rowData = info.row.original;
        return (
          <IconButton
            onClick={() => {
              if (rowData.keuangan_id && rowData.cicilanKe) {
                handleOpenFileDialog(
                  rowData.keuangan_id,
                  rowData.cicilanKe
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
        );
      },
      header: "Lampiran",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("action", {
      cell: (info) => {
        const rowData = info.row.original; // Data dari baris saat ini

        return (
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            <IconButton
              onClick={() => {
                setEditData(rowData); // Set data row ke state (jika perlu)
                setOpenDialog(true); // Buka dialog
              }}
            >
              <UploadFile />
            </IconButton>
            <IconButton
              color="primary"
              onClick={() => handleOpenFormCicilan(info.row.original)}
            >
              <IconEditCircle />
            </IconButton>
            <ActionButton
              rowData={info.row.original}
              mode="delete"
              onDelete={() => handleOpenDeleteDialog(info.row.original)} // Buka dialog konfirmasi
            />
          </Box>
        );
      },
      header: "Action",
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: data || [],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter,
    },
    state: {
      columnFilters,
      globalFilter,
      sorting,
    },
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    globalFilterFn: fuzzyFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <Box sx={{ margin: "20px", display: "flex", justifyContent: "end" }}>
        <Button
          sx={{ color: "#fff", minWidth: "150px" }}
          variant="contained"
          onClick={handleAddCicilan}
        >
          Tambah
        </Button>
      </Box>
      <Card sx={{ backgroundColor: "#fff", paddingX: "1rem" }}>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "end",
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
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
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

        {/* Confirm Dialog for Delete */}
        <ConfirmDialog
          open={openDeleteDialog}
          onClose={handleCloseDeleteDialog}
          onConfirm={handleDelete}
          title="Konfirmasi Penghapusan"
          description={`Apakah Anda yakin ingin menghapus cicilan ini?`}
        />

        {/* Form Cicilan Dialog */}
        {openFormCicilan && (
          <FormCicilan
            open={openFormCicilan}
            handleClose={handleCloseFormCicilan}
            initialData={editData}
            currentCicilanKe={cicilanKe}
          />
        )}
      </Card>

      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Upload File</DialogTitle>
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
              if (uploadedFile && editData) {
                await handleFileUpload(uploadedFile, keuanganId, editData.cicilanKe); // Proses upload file
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

      {/* Liat lampiran */}

      <Dialog open={openFileDialog} onClose={handleCloseFileDialog}>
        <DialogTitle>Preview File</DialogTitle>
        <DialogContent>
          {fileUrl ? (
            <PdfViewer fileUrl={fileUrl} />
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
    </>
  );
};

export default KeuanganDetailTable;
