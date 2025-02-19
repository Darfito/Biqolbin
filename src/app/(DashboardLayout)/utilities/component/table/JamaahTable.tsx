"use client";

// React Imports
import { useState } from "react";

import TablePagination from "@mui/material/TablePagination";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

// Third-party Imports
import classnames from "classnames";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { rankItem } from "@tanstack/match-sorter-utils";
import type {
  Column,
  Table,
  ColumnFiltersState,
  FilterFn,
} from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";

// Component Imports

// Style Imports
import styles from "../../../../styles/table.module.css";

// Data Imports
import TablePaginationComponent from "../pagination/TablePaginationComponent";
import CustomTextField from "../textField/TextField";
import { ChevronRight } from "@mui/icons-material";
import { Box, Chip, Link } from "@mui/material";
import { JamaahInterface } from "../../type";
import ActionButton from "./components/ActionButton";
import {
  deleteJamaahAction,
  deleteStatusAktifAction,
  undoDeleteStatusAktifAction,
} from "@/app/(DashboardLayout)/jamaah/action";
import ConfirmDialog from "../dialog/ConfirmDialog";
import dayjs from "dayjs";

declare module "@tanstack/table-core" {
  interface FilterFns {
    fuzzy: FilterFn<unknown>;
  }
  interface FilterMeta {
    itemRank: RankingInfo;
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value);

  // Store the itemRank info
  addMeta({
    itemRank,
  });

  // Return if the item should be filtered in/out
  return itemRank.passed;
};

const Filter = ({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) => {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  if (typeof firstValue === "number") {
    return (
      <div className="flex gap-x-2">
        <CustomTextField
          variant="outlined"
          fullWidth
          type="number"
          sx={{ minInlineSize: 100, maxInlineSize: 125 }}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              e.target.value,
              old?.[1],
            ])
          }
          placeholder={`Min`}
        />
        <CustomTextField
          variant="outlined"
          fullWidth
          type="number"
          sx={{ minInlineSize: 100, maxInlineSize: 125 }}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(e) =>
            column.setFilterValue((old: [number, number]) => [
              old?.[0],
              e.target.value,
            ])
          }
          placeholder={`Max`}
        />
      </div>
    );
  }

  return (
    <CustomTextField
      variant="outlined"
      fullWidth
      sx={{ minInlineSize: 100 }}
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
    />
  );
};

// Mendeklarasikan interface dengan tipe generik T
interface TableProps<T> {
  data: T[]; // Data dinamis sesuai tipe T
}

const JamaahTable = ({ data }: TableProps<JamaahInterface>) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Dialog untuk delete
  const [openUndoDialog, setOpenUndoDialog] = useState(false); // Dialog untuk undo
  const [selectedRow, setSelectedRow] = useState<JamaahInterface | null>(null); // Data yang dipilih

  console.log("Data di JamaahTable:", data);

  const handleCloseDialog = () => {
    setOpenDeleteDialog(false); // Tutup dialog
    setSelectedRow(null); // Reset data
  };

  const handleCloseUndoDialog = () => {
    setOpenUndoDialog(false); // Tutup dialog
    setSelectedRow(null); // Reset data
  };

  const handleDelete = async () => {
    if (selectedRow) {
      const result = await deleteStatusAktifAction(selectedRow.id ?? ""); // Eksekusi delete
      if (result.success) {
        toast.success(`User with ID ${selectedRow.id} has been deleted.`);
      } else {
        toast.error(`Failed to delete user: ${result.error}`);
      }
      handleCloseDialog(); // Tutup dialog setelah selesai
    }
  };

  const handleUndo = async () => {
    if (selectedRow) {
      console.log("Attempting to restore user with ID:", selectedRow.id); // Add this log
      const result = await undoDeleteStatusAktifAction(selectedRow.id ?? "");
      console.log("Restore result:", result); // Add this log to see the full response
      if (result.success) {
        toast.success(`User with ID ${selectedRow.id} has been restored.`);
      } else {
        console.error("Restore error details:", result); // Add this log
        toast.error(`Failed to restore user: ${result.error}`);
      }
      handleCloseUndoDialog();
    }
  };

  const columnHelper = createColumnHelper<JamaahInterface>();

  const columns = [
    // Kolom Nama
    columnHelper.accessor("nama", {
      id: "nama",
      cell: (info) => info.getValue(),
      header: "NAMA",
    }),

    columnHelper.accessor("NIK", {
      id: "NIK",
      cell: (info) => info.getValue(),
      header: "NIK",
    }),

    // Kolom No Telp

    columnHelper.accessor("noTelp", {
      id: "noTelp",
      cell: (info) => {
        const phoneNumber = info.getValue(); // Dapatkan nomor telepon dari data
        const formattedNumber = phoneNumber.replace(/^0/, "62"); // Ubah awalan "0" ke "62"
        const waLink = `https://wa.me/${formattedNumber}`; // Buat tautan WhatsApp

        return (
          <Link
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              textDecoration: "none",
              color: "#f18b04", // Warna khas WhatsApp
              fontWeight: "bold",
              "&:hover": {
                textDecoration: "underline",
                color: "#f18b04", // Warna lebih gelap saat hover
              },
            }}
          >
            {phoneNumber}
          </Link>
        );
      },
      header: "NO TELP",
    }),

    // Kolom Email
    columnHelper.accessor("email", {
      id: "email",
      cell: (info) => info.getValue(),
      header: "EMAIL",
    }),

    // Kolom Jenis Kelamin
    columnHelper.accessor("jenisKelamin", {
      id: "jenisKelamin",
      cell: (info) => info.getValue(),
      header: "JENIS KELAMIN",
    }),

    columnHelper.accessor("created_at", {
      id: "created_at",
      cell: (info) => dayjs(info.getValue()).format("YYYY-MM-DD"),
      header: "Tanggal Daftar",
    }),
    // Kolom Aksi
    columnHelper.display({
      id: "action",
      header: "Aksi",
      cell: (info) => {
        const handleOpenDialog = (rowData: JamaahInterface) => {
          setSelectedRow(rowData); // Set data pengguna
          setOpenDeleteDialog(true); // Buka dialog
        };

        const handleOpenUndoDialog = (rowData: JamaahInterface) => {
          setSelectedRow(rowData); // Set data pengguna
          setOpenUndoDialog(true); // Buka dialog
        };

        return (
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            {/* Tombol Edit */}
            <ActionButton
              rowData={info.row.original}
              actionPath={(rowData) => `/jamaah/${rowData.id}`} // Path dinamis berdasarkan ID User
            />
            {info.row.original.statusAktif ? (
              <ActionButton
                rowData={info.row.original}
                mode="delete"
                onDelete={() => handleOpenDialog(info.row.original)} // Buka dialog konfirmasi
              />
            ) : (
              <ActionButton
                rowData={info.row.original}
                mode="undo"
                onUndo={() => handleOpenUndoDialog(info.row.original)} // Buka dialog konfirmasi
              />
            )}
          </Box>
        );
      },
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: data || [], // Pastikan data selalu berupa array.
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
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  return (
    <Box
      sx={{
        paddingX: "1rem",
      }}
    >
      <Box
        sx={{
          width: "100%",
        }}
      ></Box>
      <div className="overflow-x-auto">
        <table className={styles.table}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th key={header.id} className={styles.tableTh}>
                      {header.isPlaceholder ? null : (
                        <>
                          <div
                            className={classnames({
                              "flex items-center": header.column.getIsSorted(),
                              "cursor-pointer select-none":
                                header.column.getCanSort(),
                            })}
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {header.column.getIsSorted() &&
                              {
                                asc: <ChevronRight className="-rotate-90" />,
                                desc: <ChevronRight className="rotate-90" />,
                              }[header.column.getIsSorted() as "asc" | "desc"]}
                          </div>
                          {header.column.getCanFilter() && (
                            <Filter column={header.column} table={table} />
                          )}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel()?.rows?.length === 0 ? (
            <tbody>
              <tr>
                <td
                  colSpan={table.getVisibleFlatColumns().length}
                  className="text-center"
                >
                  No data available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className={styles.tableTbody}>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td style={{ paddingRight: "1rem" }} key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box
        sx={{
          marginTop: "1rem",
          paddingX: "1rem",
        }}
      >
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
      {/* Dialog Konfirmasi Delete */}
      <ConfirmDialog
        open={openDeleteDialog}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title="Konfirmasi Penghapusan"
        undo={false}
        description={`Apakah Anda yakin ingin menghapus jamaah "${selectedRow?.nama}"?`}
      />
      {/* Dialog Konfirmasi Undo */}
      <ConfirmDialog
        open={openUndoDialog}
        onClose={handleCloseUndoDialog}
        onConfirm={handleUndo}
        title="Konfirmasi Undo"
        undo={true}
        description={`Apakah Anda yakin ingin mengembalikkan jamaah "${selectedRow?.nama}"?`}
      />
    </Box>
  );
};

export default JamaahTable;
