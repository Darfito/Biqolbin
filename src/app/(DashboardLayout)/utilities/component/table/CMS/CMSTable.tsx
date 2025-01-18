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

// Style Imports
import styles from "../../../../../styles/table.module.css";

// Data Imports
import TablePaginationComponent from "../../pagination/TablePaginationComponent";
import CustomTextField from "../../textField/TextField";
import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { PaketInterface } from "../../../type";
import { useRouter } from "next/navigation";
import { createClient } from "@/libs/supabase/client";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

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

const CMSTable = ({ data }: TableProps<PaketInterface>) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Untuk delete
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedNama, setSelectedNama] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "publish" | "unpublish" | "delete"
  >("publish");
  const [tableData, setTableData] = useState<PaketInterface[]>(data); // Local state to manage table data
  const router = useRouter();

  const handleDialogOpen = (id: number, type: "publish" | "unpublish") => {
    setSelectedId(id);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleDialogDeleteOpen = (id: number, paketNama: string) => {
    setSelectedId(id);
    setSelectedNama(paketNama);
    setOpenDeleteDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDeleteDialog(false);
    setSelectedId(null);
    setActionType("publish");
    setOpenDialog(false);
    setSelectedNama(null);
  };

  const handlePublishToggle = async (id: number, currentStatus: boolean) => {
    const supabase = createClient();

    try {
      const { data, error } = await supabase
        .from("Paket")
        .update({ publish: !currentStatus }) // Toggle the publish status
        .eq("id", id); // Match the row by its id

      if (error) {
        console.error("Error updating publish status:", error);
        toast.error("Failed to update publish status.");
        return; // Hentikan eksekusi jika ada error
      }

      console.log("Publish status updated successfully:", data);
      toast.success("Publish status updated successfully.");

      // Refresh halaman atau data
      // Solusi alternatif untuk client-side:
      // Fetch ulang data dari Supabase dan update state lokal
      const { data: updatedData, error: fetchError } = await supabase
        .from("Paket")
        .select("*");

      if (fetchError) {
        console.error("Error fetching updated data:", fetchError);
        toast.error("Failed to fetch updated data.");
        return;
      }

      setTableData(updatedData); // Update state dengan data terbaru
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDelete = async () => {
    if (!selectedId || !selectedNama) return;
  
    const supabase = createClient();
  
    try {
      // 1. Menghapus data dari tabel Paket
      const { error: paketError } = await supabase
        .from("Paket")
        .delete()
        .eq("id", selectedId);
      if (paketError) {
        console.error("Error deleting data:", paketError);
        toast.error("Failed to delete item.");
        return;
      }
  
      console.log("selectedNama:", selectedNama);
      
      // 2. Menghapus folder di Supabase Storage
      const { data: files, error: listError } = await supabase.storage
        .from("Paket") // Nama bucket
        .remove([`/${selectedNama}`]);
  
      if (listError) {
        console.error("Error listing files:", listError);
        toast.error("Failed to list files for deletion.");
        return;
      }
  
      if (files && files.length > 0) {
        const filePaths = files.map((file) => `Paket/${selectedNama}/${file.name}`); // Path lengkap file
        const { error: deleteError } = await supabase.storage
          .from("Paket") // Nama bucket
          .remove(filePaths); // Menghapus file berdasarkan path
  
        if (deleteError) {
          console.error("Error deleting files:", deleteError);
          toast.error("Failed to delete related files.");
          return;
        }
      }
  
      toast.success("Item deleted successfully.");
      
      // 3. Mengupdate data di tableData setelah item dihapus
      const updatedData = tableData.filter((item) => item.id !== selectedId);
      setTableData(updatedData);
  
      // Menutup dialog setelah penghapusan selesai
      handleDialogClose();
    } catch (err) {
      console.error("Unexpected error:", err);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedId || !actionType) return;

    const isPublishAction = actionType === "publish";
    await handlePublishToggle(selectedId, !isPublishAction); // Status kebalikannya
    handleDialogClose(); // Tutup dialog setelah selesai
  };

  const columnHelper = createColumnHelper<PaketInterface>();

  const handleNavigateToCMS = (rowData: any) => {
    const actionPath = `/cms/${rowData.id}`;
    console.log(`Navigating to: ${actionPath}`);
    // Jika menggunakan Next.js, gunakan router.push
    router.push(actionPath);
  };

  const columns = [
    columnHelper.accessor("nama", {
      id: "nama",
      cell: (info) => info.getValue(),
      header: "Nama Paket",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("namaMuthawif", {
      id: "namaMuthawif",
      cell: (info) => info.getValue(),
      header: "Nama Muthawif",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("jenis", {
      id: "jenis",
      cell: (info) => info.getValue(),
      header: "Jenis Paket",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("tglKeberangkatan", {
      id: "tglKeberangkatan",
      cell: (info) => info.getValue(),
      header: "Tanggal Keberangkatan",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("tglKepulangan", {
      id: "tglKepulangan",
      cell: (info) => info.getValue(),
      header: "Tanggal Kepulangan",
      enableColumnFilter: false,
    }),
    columnHelper.accessor("action", {
      cell: (info) => (
        <Box sx={{ display: "flex", gap: "0.5rem" }}>
          <Button
            variant="contained"
            onClick={() =>
              handleDialogOpen(
                info.row.original.id ?? 0,
                info.row.original.publish ? "unpublish" : "publish"
              )
            }
            sx={{
              color: "#fff",
              backgroundColor: info.row.original.publish ? "red" : "green",
            }}
          >
            {info.row.original.publish ? "Unpublish" : "Publish"}
          </Button>
          <Button
            onClick={() => handleNavigateToCMS(info.row.original)}
            variant="contained"
            className="text-white"
          >
            Detail
          </Button>
          <Button
            variant="contained"
            color="error"
            className="text-white"
            onClick={() =>
              handleDialogDeleteOpen(
                info.row.original.id ?? 0,
                info.row.original.nama
              )
            }
          >
            Delete
          </Button>
        </Box>
      ),
      header: "Action",
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
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Konfirmasi Aksi</DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === "publish"
              ? "Apakah Anda yakin ingin mempublikasikan konten ini?"
              : "Apakah Anda yakin ingin menutup konten ini?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
            sx={{ color: "#fff" }}
          >
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>
      {/* Dialog for Publish/Unpublish */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Konfirmasi Aksi</DialogTitle>
        <DialogContent>
          <Typography>
            {actionType === "publish"
              ? "Apakah Anda yakin ingin mempublikasikan konten ini?"
              : "Apakah Anda yakin ingin menutup konten ini?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            color="primary"
            sx={{ color: "#fff" }}
          >
            Konfirmasi
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete */}
      <Dialog open={openDeleteDialog} onClose={handleDialogClose}>
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menghapus item ini?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={handleDelete} // Memanggil handleDelete tanpa parameter karena sudah diset sebelumnya
            variant="contained"
            color="primary"
            sx={{ color: "#fff" }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CMSTable;
