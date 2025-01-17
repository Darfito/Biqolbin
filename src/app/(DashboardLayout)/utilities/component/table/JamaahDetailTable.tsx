"use client";

// React Imports
import React, { useEffect, useState } from "react";
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
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TablePagination } from "@mui/material";
import { Delete, Folder, UploadFile } from "@mui/icons-material";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

// Component Imports
import CustomTextField from "../textField/TextField";
import TablePaginationComponent from "../pagination/TablePaginationComponent";

// Style Imports
import styles from "../../../../styles/table.module.css";

// Type Imports
import { JenisDokumen } from "../../type";
import FileUploaderSingle from "../uploader/FileUploaderSingle";

const fuzzyFilter = (row: { getValue: (arg0: any) => any; }, columnId: any, value: string, addMeta: (arg0: { itemRank: RankingInfo; }) => void) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};


interface JamaahDetailProps<T> {
  data: T[];
  perkawinan?: boolean;
}


const JamaahDetailTable = ({ data, perkawinan }: JamaahDetailProps<JenisDokumen>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null); // State untuk menyimpan file yang diunggah


  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);

  const handleFileUpload = (file: File) => {
    setUploadedFile(file); // Simpan file yang diunggah ke state
    console.log("File uploaded:", file);
  };



  // Filter data "Buku Nikah" hanya jika perkawinan bernilai true
  const filteredData = data.filter(
    (dokumen) =>
      dokumen.nama_dokumen !== "Buku Nikah" || perkawinan
  );
  

  const columnHelper = createColumnHelper<JenisDokumen>();


  const columns = [
    columnHelper.accessor("nama_dokumen", {
      id: "nama_dokumen",
      cell: (info) => info.getValue(),
      header: "Jenis Dokumen",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("action", {
      cell: (info) => (
        <Box sx={{ display: "flex", justifyContent: "start" }}>
          <IconButton onClick={handleDialogOpen}>
            <UploadFile />
          </IconButton>
          <IconButton>
            <Folder />
          </IconButton>
          <IconButton>
            <Delete />
          </IconButton>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
            <FileUploaderSingle onFileUpload={handleFileUpload} /> {/* Oper onFileUpload */}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogClose} color="primary">
                Cancel
              </Button>
              <Button onClick={() => console.log("Upload file")} color="primary">
                Upload
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      ),
      header: "Action",
      enableColumnFilter: false,
    }),
  ];

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
      <Box sx={{ 
        width: "100%", 
        display: "flex",
        margin: "20px"
      }}>
      </Box>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={styles.tableTh}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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

    </Box>
  );
};

export default JamaahDetailTable;
