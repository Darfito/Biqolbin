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
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, CardHeader, TablePagination } from "@mui/material";
import { Delete, Edit, Folder, UploadFile } from "@mui/icons-material";
import { RankingInfo, rankItem } from "@tanstack/match-sorter-utils";

// Component Imports
import CustomTextField from "../textField/TextField";
import TablePaginationComponent from "../pagination/TablePaginationComponent";

// Style Imports
import styles from "../../../../styles/table.module.css";

// Type Imports
import { CicilanType, JenisDokumen } from "../../type";
import FileUploaderSingle from "../uploader/FileUploaderSingle";

const fuzzyFilter = (row: { getValue: (arg0: any) => any; }, columnId: any, value: string, addMeta: (arg0: { itemRank: RankingInfo; }) => void) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <CustomTextField
      variant="outlined"
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  );
};

interface JamaahDetailProps<T> {
  data: T[];
  perkawinan?: boolean;
}


const JamaahDetailTable = ({ data, perkawinan }: JamaahDetailProps<JenisDokumen>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleDialogOpen = () => setOpenDialog(true);
  const handleDialogClose = () => setOpenDialog(false);


  const handleAddCicilan = () => {
    setEditData(null); // Reset data cicilan
    setOpenFormCicilan(true); // Buka dialog
  };


  // Filter data "Buku Nikah" hanya jika perkawinan bernilai true
  const filteredData = data.filter(
    (dokumen) =>
      dokumen.namaDokumen !== "Buku Nikah" || perkawinan
  );
  

  const columnHelper = createColumnHelper<JenisDokumen>();


  const columns = [
    columnHelper.accessor("namaDokumen", {
      id: "namaDokumen",
      cell: (info) => info.getValue(),
      header: "Jenis Dokumen",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("lampiran", {
      cell: (info) => (
        <Box sx={{ display: "flex", justifyContent: "start" }}>
          <IconButton>
            <Folder />
          </IconButton>
        </Box> 
      ),
      header: "Lampiran",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("action", {
      cell: (info) => (
        <Box sx={{ display: "flex", justifyContent: "start" }}>
          <IconButton onClick={handleDialogOpen}>
            <UploadFile />
          </IconButton>
          <IconButton>
            <Edit />
          </IconButton>
          <IconButton>
            <Delete />
          </IconButton>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
            <FileUploaderSingle />
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
      <Button
        sx={{ color: "#fff", minWidth: "150px" }}
        variant="contained"
        onClick={handleAddCicilan}
      >
        Tambah
      </Button>
      </Box>
      <CardHeader
        sx={{ paddingTop: 0 }}
        action={
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value: any) => setGlobalFilter(String(value))}
            placeholder="Search all columns..."
          />
        }
      />
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
