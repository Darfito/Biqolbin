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
  Table,
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
import { CicilanType } from "../../type";
import FileUploaderSingle from "../uploader/FileUploaderSingle";
import FormCicilan from "@/app/(DashboardLayout)/keuangan/[id]/component/FormCicilan";




interface DebouncedInputProps {
  value: string 
  onChange: (value: string) => void;
  debounce?: number;
  placeholder?: string; // Tambahkan properti placeholder
}

const fuzzyFilter = (row: { getValue: (arg0: any) => any; }, columnId: any, value: string, addMeta: (arg0: { itemRank: RankingInfo; }) => void) => {
  const itemRank = rankItem(row.getValue(columnId), value);
  addMeta({ itemRank });
  return itemRank.passed;
};
// A debounced input react component
const DebouncedInput: React.FC<DebouncedInputProps> = ({
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

interface KeuanganDetailProps<T> {
  data: T[];
  cicilanKe: number
}

interface EditCicilanFormProps {
  onClose: () => void;
}



const KeuanganDetailTable = ({ data, cicilanKe }: KeuanganDetailProps<CicilanType>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
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

  const handleAddCicilan = () => {
    setEditData(null); // Reset data cicilan
    setOpenFormCicilan(true); // Buka dialog
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
    columnHelper.accessor("jumlahCicilan", {
      id: "jumlahCicilan",
      cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
      header: "Jumlah Cicilan",
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
      cell: (info) => (
        <Box sx={{ display: "flex", justifyContent: "start" }}>
          <IconButton onClick={handleDialogOpen}>
            <UploadFile />
          </IconButton>
          <IconButton onClick={() => handleOpenFormCicilan(info.row.original)}>
            <Edit />
          </IconButton>
          <IconButton>
            <Delete />
          </IconButton>

          <Dialog open={openDialog} onClose={handleDialogClose}>
            <DialogTitle>Upload File</DialogTitle>
            <DialogContent>
            <FileUploaderSingle onFileUpload={handleFileUpload}/>
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
    data: data || [],
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

      {/* Form Cicilan Dialog */}
      {openFormCicilan && (
        <FormCicilan
          open={openFormCicilan}
          handleClose={handleCloseFormCicilan}
          initialData={editData}
          currentCicilanKe={cicilanKe}
          />
      )}
    </Box>
  );
};

export default KeuanganDetailTable;
