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
import { Autocomplete, Box, Chip, FormControl } from "@mui/material";
import { KeuanganInterface } from "../../type";
import ActionButton from "./components/ActionButton";
import {
  deleteStatusAktifAction,
  undoStatusAktifAction,
} from "@/app/(DashboardLayout)/keuangan/action";
import ConfirmDialog from "../dialog/ConfirmDialog";

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

  // Log untuk debugging
  console.log("row value:", row.getValue(columnId));
  console.log("filter value:", value);

  // Return true only if the full string matches exactly
  return itemRank.passed && row.getValue(columnId) === value;
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

  // Options for filtering based on column id
  const getColumnOptions = (columnId: string) => {
    switch (columnId) {
      case "statusPenjadwalan":
        return ["Belum Dijadwalkan", "Dijadwalkan", "Berangkat", "Selesai"];
      case "status":
        return [
          "Semua",
          "Belum Bayar",
          "Sedang Menyicil",
          "Sedang Menabung",
          "Lunas",
        ];
      case "metodePembayaran":
        return ["Semua", "Cicilan", "Tunai", "Tabungan"];
      case "jenisPaket.nama": // Ensure this matches exactly with the column id in the table
        return ["Semua", "Paket Regular 1", "Paket Regular 2", "Paket VIP 1"];
      default:
        return [];
    }
  };

  const options = getColumnOptions(column.id);

  if (options.length > 0) {
    return (
      <FormControl sx={{ paddingRight: "1rem" }} variant="outlined" fullWidth>
        <Autocomplete
          value={columnFilterValue ?? "Semua"} // Default to "Semua"
          onChange={(e, newValue) =>
            column.setFilterValue(newValue === "Semua" ? undefined : newValue)
          }
          options={options}
          renderInput={(params) => (
            <CustomTextField {...params} variant="outlined" fullWidth />
          )}
          isOptionEqualToValue={(option, value) => option === value}
          disableClearable
        />
      </FormControl>
    );
  }

  if (typeof firstValue === "number") {
    return (
      <div className="flex">
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

const KeuanganTable = ({ data }: TableProps<KeuanganInterface>) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [open, setOpen] = useState(false); // State untuk dialog
  const [openUndoDialog, setOpenUndoDialog] = useState(false); // Dialog untuk undo
  const [selectedRow, setSelectedRow] = useState<KeuanganInterface | null>(
    null
  ); // Data yang dipilih

  const handleCloseDialog = () => {
    setOpen(false); // Tutup dialog
    setSelectedRow(null); // Reset data
  };

  const handleCloseUndoDialog = () => {
    setOpenUndoDialog(false); // Tutup dialog
    setSelectedRow(null); // Reset data
  };

  const handleDelete = async () => {
    if (selectedRow) {
      const result = await deleteStatusAktifAction(selectedRow.id ?? 0); // Eksekusi delete
      if (result.success) {
        toast.success(`User with ID ${selectedRow.id} has been deleted.`);
      } else {
        toast.error(`Failed to delete user: ${result.error}`);
      }
      handleCloseUndoDialog(); // Tutup dialog setelah selesai
    }
  };
  const handleUndo = async () => {
    if (selectedRow) {
      const result = await undoStatusAktifAction(selectedRow.id ?? 0); // Eksekusi delete
      if (result.success) {
        toast.success(`User with ID ${selectedRow.id} has been restored.`);
      } else {
        toast.error(`Failed to restored user: ${result.error}`);
      }
      handleCloseDialog(); // Tutup dialog setelah selesai
    }
  };

  const columnHelper = createColumnHelper<KeuanganInterface>();

  const columns = [
    columnHelper.accessor("Jamaah.nama", {
      cell: (info) => info.getValue(),
      header: "Nama",
    }),
    columnHelper.accessor("Paket.nama", {
      cell: (info) => info.getValue(),
      header: "Nama Paket",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("Paket.jenis", {
      cell: (info) => info.getValue(),
      header: "Jenis Paket",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("metodePembayaran", {
      cell: (info) => info.getValue(),
      header: "Metode Pembayaran",
    }),
    columnHelper.accessor("statusPenjadwalan", {
      id: "statusPenjadwalan",
      cell: (info) => {
        const statusPenjadwalan = info.getValue();
        let chipColor = "";

        switch (statusPenjadwalan) {
          case "Berangkat":
            chipColor = "lightblue"; // Biru muda
            break;
          case "Selesai":
            chipColor = "green"; // Hijau
            break;
          case "Dijadwalkan":
            chipColor = "#F18B04"; // Warna khusus untuk Dijadwalkan
            break;
          case "Belum Dijadwalkan":
            chipColor = "red"; // Warna khusus untuk Belum Dijadwalkan
            break;
        }

        return (
          <Chip
            label={
              statusPenjadwalan === "Berangkat" ||
              statusPenjadwalan === "Selesai" ||
              statusPenjadwalan === "Dijadwalkan"
                ? statusPenjadwalan
                : "Belum Dijadwalkan"
            }
            sx={{
              backgroundColor: chipColor,
              color: "white", // Warna teks putih agar kontras
              fontWeight: "bold",
            }}
          />
        );
      },
      header: "Status Penjadwalan",
    }),
    columnHelper.accessor("status", {
      id: "status",
      cell: (info) => {
        const status = info.getValue();
        let chipColor = "";
        if (status === "Lunas") {
          chipColor = "#4CAF50";
        } else {
          chipColor = "#FF9800";
        }

        return (
          <Chip
            label={status}
            sx={{
              backgroundColor: chipColor,
              color: "white", // Warna teks putih agar kontras
              fontWeight: "bold",
            }}
          />
        );
      },
    }),
    columnHelper.accessor("totalTagihan", {
      cell: (info) => {
        const { totalTagihan = 0, totalTagihanBaru = null } = info.row.original;
    
        const displayedTagihan =
          totalTagihanBaru !== null && totalTagihanBaru !== 0
            ? totalTagihanBaru
            : totalTagihan;
    
        return `Rp ${displayedTagihan.toLocaleString()}`;
      },
      header: "Total Tagihan",
    }),
    columnHelper.accessor("sisaTagihan", {
      cell: (info) => `Rp ${info.getValue()?.toLocaleString()}`,
      header: "Sisa Tagihan",
    }),
    columnHelper.accessor("tenggatPembayaran", {
      cell: (info) => new Date(info.getValue()).toLocaleDateString("id-ID"),
      header: "Tenggat Pembayaran",
    }),
    columnHelper.display({
      id: "action",
      header: "Aksi",
      cell: (info) => {
        const handleOpenDialog = (rowData: KeuanganInterface) => {
          setSelectedRow(rowData); // Set data pengguna
          setOpen(true); // Buka dialog
        };
        const handleOpenUndoDialog = (rowData: KeuanganInterface) => {
          setSelectedRow(rowData); // Set data pengguna
          setOpenUndoDialog(true); // Buka dialog
        };

        return (
          <Box sx={{ display: "flex", justifyContent: "start" }}>
            {/* Tombol Edit */}
            <ActionButton
              rowData={info.row.original}
              actionPath={(rowData) => `/keuangan/${rowData.id}`} // Path dinamis berdasarkan ID Jamaah
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
        undo={false}
        description={`Apakah Anda yakin ingin menghapus item kuangan "${selectedRow?.id}"?`}
      />
      <ConfirmDialog
        open={openUndoDialog}
        onClose={handleCloseUndoDialog}
        onConfirm={handleUndo}
        undo={true}
        title="Konfirmasi Penghapusan"
        description={`Apakah Anda yakin ingin mengembalikkan item kuangan "${selectedRow?.id}"?`}
      />
    </Box>
  );
};

export default KeuanganTable;
