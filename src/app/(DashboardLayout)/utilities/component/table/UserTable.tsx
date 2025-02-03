"use client";

// React Imports
import { useState } from "react";

import TablePagination from "@mui/material/TablePagination";

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
import {
  Box,
} from "@mui/material";

import ActionButton from "./components/ActionButton";
import { deleteUserAction } from "@/app/(DashboardLayout)/user/action";
import ConfirmDialog from "../dialog/ConfirmDialog";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { UserInterface } from "../../type";

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
  data: T[];
}

const UserTable = ({ data }: TableProps<UserInterface>) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [open, setOpen] = useState(false); // State untuk dialog
  const [selectedRow, setSelectedRow] = useState<UserInterface | null>(null); // Data yang dipilih
  const [tableData, setTableData] = useState<UserInterface[]>(data); // Local state to manage table data

  const columnHelper = createColumnHelper<UserInterface>();

  const handleCloseDialog = () => {
    setOpen(false); // Tutup dialog
    setSelectedRow(null); // Reset data
  };

  const handleDelete = async () => {
    if (selectedRow) {
      const result = await deleteUserAction(selectedRow?.id!); // Eksekusi delete
      if (result.success) {
        toast.success(`User with ID ${selectedRow.id} has been deleted.`);
      } else {
        toast.error(`Failed to delete user: ${result.error}`);
      }
      handleCloseDialog(); // Tutup dialog setelah selesai
    }
  };

  const columns = [
    columnHelper.accessor("nama", {
      id: "nama",
      cell: (info) => info.getValue(),
      header: "Nama",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("jenisKelamin", {
      id: "jenisKelamin",
      cell: (info) => info.getValue(),
      header: "Jenis Kelamin",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("noTelp", {
      id: "noTelp",
      cell: (info) => info.getValue(),
      header: "Nomor Telepon",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("role", {
      id: "role",
      cell: (info) => info.getValue(),
      header: "Jabatan",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("penempatan", {
      id: "penempatan",
      cell: (info) => info.getValue(),
      header: "Penempatan",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("action", {
      cell: (info) => {
        const handleOpenDialog = (rowData: UserInterface) => {
          setSelectedRow(rowData); // Set data pengguna
          setOpen(true); // Buka dialog
        };


        return (
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            {/* Tombol Edit */}
            <ActionButton
              rowData={info.row.original}
              actionPath={(rowData) => `/user/${rowData.id}`} // Path dinamis berdasarkan ID User
            />

            {/* Tombol Delete */}
            <ActionButton
              rowData={info.row.original}
              mode="delete"
              onDelete={() => handleOpenDialog(info.row.original)} // Buka dialog konfirmasi
            />
          </Box>
        );
      },
      header: "Aksi",
      enableColumnFilter: false,
    }),
  ];

  const table = useReactTable({
    data: tableData || [], // Pastikan data selalu berupa array.
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
      {/* Dialog Konfirmasi */}
      <ConfirmDialog
        open={open}
        onClose={handleCloseDialog}
        onConfirm={handleDelete}
        title="Konfirmasi Penghapusan"
        description={`Apakah Anda yakin ingin menghapus pengguna "${selectedRow?.nama}"?`} undo={false}      />
    </Box>
  );
};

export default UserTable;
