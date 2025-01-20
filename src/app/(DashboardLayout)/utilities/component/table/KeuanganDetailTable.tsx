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
} from "@mui/material";
import { Edit, Folder, UploadFile } from "@mui/icons-material";
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
  const [editData, setEditData] = useState<CicilanType | null>(null); // Data cicilan yang sedang diedit
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file); // Simpan file yang diunggah ke state
    console.log("File uploaded:", file);
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
      deleteCicilanAndUpdateSisaTagihan(rowToDelete.id, rowToDelete.keuangan_id); // Perform delete and update actions
    } else {
      console.error("Invalid cicilan data for deletion");
    }
    handleCloseDeleteDialog(); // Close the dialog after deletion
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
      cell: (info) => (
        <IconButton
          onClick={() => {
            const fileUrl = info.getValue();
            if (fileUrl) {
              window.open(fileUrl, "_blank");
            } else {
              alert("Lampiran tidak tersedia");
            }
          }}
          aria-label="view attachment"
        >
          <Folder />
        </IconButton>
      ),
      header: "Lampiran",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("action", {
      cell: (info) => {
        return (
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            <IconButton onClick={handleDialogOpen}>
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
            <Dialog open={openDialog} onClose={handleDialogClose}>
              <DialogTitle>Upload File</DialogTitle>
              <DialogContent>
                <FileUploaderSingle onFileUpload={handleFileUpload} />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  Cancel
                </Button>
                <Button
                  onClick={() => console.log("Upload file")}
                  color="primary"
                >
                  Upload
                </Button>
              </DialogActions>
            </Dialog>
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
    </>
  );
};

export default KeuanganDetailTable;
