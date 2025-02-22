"use client";

// React Imports
import { useEffect, useState } from "react";

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
import styles from "../../../../styles/table.module.css";

// Data Imports
import TablePaginationComponent from "../pagination/TablePaginationComponent";
import CustomTextField from "../textField/TextField";
import { ChevronRight } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import { PaketInterface } from "../../type";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import {
  deleteStatusAktifPaketAction,
  publishCMSAction,
  undoDeleteStatusAktifPaketAction,
  verificationCMSAction,
} from "@/app/(DashboardLayout)/cms/action";
import { IconArrowBackUp, IconCheck, IconEditCircle, IconEye, IconEyeOff, IconInfoCircle, IconTrash, IconX } from "@tabler/icons-react";

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
  roleUser: string;
}

const CMSTable = ({ data, roleUser }: TableProps<PaketInterface>) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [openVerificationDialog, setOpenVerificationDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // Untuk delete
  const [openUndoDialog, setOpenUndoDialog] = useState(false); // Untuk delete
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [selectedNama, setSelectedNama] = useState<string | null>(null);
  const [actionType, setActionType] = useState<
    "publish" | "unpublish" | "delete"
  >("publish");
  const [verificationStatus, setVerificationStatus] = useState<
    "Verifikasi" | "Ditolak"
  >("Verifikasi");
  const [tableData, setTableData] = useState<PaketInterface[]>(data); // Local state to manage table data
  const router = useRouter();

  console.log("Table data:", tableData);

  const allowedRoles = ["Admin", "Superadmin", "Marketing"];

  // Sync local state with parent data
  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleDialogOpen = (id: number, type: "publish" | "unpublish") => {
    setSelectedId(id);
    setActionType(type);
    setOpenDialog(true);
  };

  const handleVerificationStatusChange = (
    id: number,
    status: "Verifikasi" | "Ditolak"
  ) => {
    setSelectedId(id);
    setVerificationStatus(status);
    setOpenVerificationDialog(true);
  };

  const handleDialogCloseVerification = () => {
    setOpenVerificationDialog(false);
    setSelectedId(null);
    setVerificationStatus("Verifikasi");
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

  const handleUndoOpen = (id: number, paketNama: string) => {
    setSelectedId(id);
    setSelectedNama(paketNama);
    setOpenUndoDialog(true);
  };

  const handleUndoClose = () => {
    setOpenUndoDialog(false);
    setSelectedId(null);
    setActionType("publish");
    setOpenDialog(false);
    setSelectedNama(null);
  };

  const handlePublishToggle = async (id: number, currentStatus: boolean) => {
    try {
      const result = await publishCMSAction(id, currentStatus);

      if (result) {
        toast.success("Status Publikasi diperbarui.");
      } else {
        toast.error("Failed to update publish status.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleVerificationToggle = async (
    id: number,
    currentStatus: boolean
  ) => {
    try {
      const result = await verificationCMSAction(id, currentStatus);

      if (result) {
        toast.success("Status Verifikasi diperbarui.");
      } else {
        toast.error("Failed to update verification status.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const result = await deleteStatusAktifPaketAction(id);

      if (result) {
        toast.success("Paket successfully deactivated.");
      } else {
        toast.error("Failed to deactivate Paket.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleUndo = async (id: number) => {
    try {
      const result = await undoDeleteStatusAktifPaketAction(id);

      if (result) {
        toast.success("Paket successfully activated.");
      } else {
        toast.error("Failed to activate Paket.");
      }
    } catch (error) {
      console.error("Unexpected error:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  const handleSaveChanges = async () => {
    if (!selectedId || !actionType) return;

    const isPublishAction = actionType === "publish";
    await handlePublishToggle(selectedId, !isPublishAction); // Status kebalikannya
    handleDialogClose(); // Tutup dialog setelah selesai
  };

  const handleSaveChangesVerification = async () => {
    if (!selectedId || !verificationStatus) return;

    const isVerifiedAction = verificationStatus === "Verifikasi";
    await handleVerificationToggle(selectedId, !isVerifiedAction); // Status kebalikannya
    handleDialogCloseVerification(); // Tutup dialog setelah selesai
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
    ...(allowedRoles.includes(roleUser) || roleUser === "Divisi General Affair"
    ? [
        columnHelper.accessor("action", {
          cell: (info) => (
            <Box sx={{ display: "flex", gap: "0.5rem" }}>
              {roleUser === "Divisi General Affair" ? (
                <Tooltip title="Detail" arrow>
                  <IconButton
                    onClick={() => handleNavigateToCMS(info.row.original)}
                    sx={{ color: "inherit" }}
                  >
                    <IconEye size={20} />
                  </IconButton>
                </Tooltip>
              ) : (
                <>
                  {roleUser === "Superadmin" && (
                    <Tooltip
                      title={
                        info.row.original.statusVerifikasi
                          ? "Ditolak"
                          : "Verifikasi"
                      }
                      arrow
                    >
                      <IconButton
                        onClick={() =>
                          handleVerificationStatusChange(
                            info.row.original.id ?? 0,
                            info.row.original.statusVerifikasi
                              ? "Ditolak"
                              : "Verifikasi"
                          )
                        }
                        sx={{
                          color: "#fff",
                          backgroundColor: info.row.original.statusVerifikasi
                            ? "red"
                            : "green",
                        }}
                      >
                        {info.row.original.statusVerifikasi ? (
                          <IconX size={20} />
                        ) : (
                          <IconCheck size={20} />
                        )}
                      </IconButton>
                    </Tooltip>
                  )}
  
                  <Tooltip
                    title={info.row.original.publish ? "Unpublish" : "Publish"}
                    arrow
                  >
                    {/* Bungkus dengan <span> karena IconButton yang disabled tidak memicu tooltip */}
                    <span>
                      <IconButton
                        onClick={() =>
                          handleDialogOpen(
                            info.row.original.id ?? 0,
                            info.row.original.publish ? "unpublish" : "publish"
                          )
                        }
                        sx={{
                          color: "#fff",
                          backgroundColor: info.row.original.publish
                            ? "red"
                            : "green",
                        }}
                        disabled={!info.row.original.statusVerifikasi}
                      >
                        {info.row.original.publish ? (
                          <IconEyeOff size={20} />
                        ) : (
                          <IconEye size={20} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
  
                  <Tooltip title="Detail" arrow>
                    <IconButton
                      onClick={() => handleNavigateToCMS(info.row.original)}
                      sx={{ color: "inherit" }}
                    >
                      <IconEditCircle size={20} color="#FFC107" />
                    </IconButton>
                  </Tooltip>
  
                  {info.row.original.statusAktif ? (
                    <Tooltip title="Delete" arrow>
                      <IconButton
                        onClick={() =>
                          handleDialogDeleteOpen(
                            info.row.original.id ?? 0,
                            info.row.original.nama
                          )
                        }
                        color="error"
                      >
                        <IconTrash size={20} />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <Tooltip title="Undo" arrow>
                      <IconButton
                        onClick={() =>
                          handleUndoOpen(
                            info.row.original.id ?? 0,
                            info.row.original.nama
                          )
                        }
                        color="primary"
                      >
                        <IconArrowBackUp size={20} />
                      </IconButton>
                    </Tooltip>
                  )}
                </>
              )}
            </Box>
          ),
          header: "Aksi",
          enableColumnFilter: false,
        }),
      ]
    : []),
  
  
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
      {/* Dialog for verifikasi dan ditolak */}
      <Dialog
        open={openVerificationDialog}
        onClose={handleDialogCloseVerification}
      >
        <DialogTitle>Konfirmasi Aksi</DialogTitle>
        <DialogContent>
          <Typography>
            {verificationStatus === "Verifikasi"
              ? "Apakah Anda yakin ingin memverifikasi konten ini?"
              : "Apakah Anda yakin ingin menolak konten ini?"}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDialogCloseVerification}
            variant="contained"
            color="error"
          >
            Batal
          </Button>
          <Button
            onClick={handleSaveChangesVerification}
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
          <Typography>Apakah Anda yakin ingin menghapus item ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={() => handleDelete(selectedId || 0)} // Memanggil handleDelete tanpa parameter karena sudah diset sebelumnya
            variant="contained"
            color="primary"
            sx={{ color: "#fff" }}
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog for Delete */}
      <Dialog open={openUndoDialog} onClose={handleUndoClose}>
        <DialogTitle>Konfirmasi Undo</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin mengembalikan item ini?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUndoClose} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={() => handleUndo(selectedId || 0)} // Memanggil handleDelete tanpa parameter karena sudah diset sebelumnya
            variant="contained"
            color="primary"
            sx={{ color: "#fff" }}
          >
            Kembalikan
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CMSTable;
