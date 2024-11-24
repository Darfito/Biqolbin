"use client";

// React Imports
import { useEffect, useMemo, useState } from "react";

// MUI Imports
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import TablePagination from "@mui/material/TablePagination";
import type { TextFieldProps } from "@mui/material/TextField";

import {IconInfoCircle} from "@tabler/icons-react"

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
  ColumnDef,
} from "@tanstack/react-table";
import type { RankingInfo } from "@tanstack/match-sorter-utils";


// Component Imports

// Style Imports
import styles from "../../../../styles/table.module.css";

// Data Imports
import defaultData, { KeuanganData } from "./data";
import TablePaginationComponent from "../pagination/TablePaginationComponent";
import CustomTextField from "../textField/TextField";
import { ChevronRight } from "@mui/icons-material";
import { Autocomplete, Box, Button, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import { KeuanganType } from "./type";

// Column Definitions
const columnHelper = createColumnHelper<KeuanganType>();

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

// A debounced input react component
const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;
} & TextFieldProps) => {
  // States
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

const Filter = ({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) => {
  // Vars
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  if (column.id === "status" || column.id === "metodePembayaran") {
    // Options for Status and Metode Pembayaran, including "Semua"
    const options = column.id === "status"
      ? ["Semua", "Belum Bayar", "Sedang Menyicil", "Sedang Menabung", "Lunas"]
      : ["Semua", "Cicilan", "Tunai", "Tabungan"];
  
    return (
      <FormControl variant="outlined" fullWidth>
        <Autocomplete
          value={columnFilterValue ?? "Semua"}  // Default to "Semua"
          onChange={(e, newValue) => column.setFilterValue(newValue)}
          options={options}
          renderInput={(params) => (
            <CustomTextField
              {...params}
              variant="outlined"
              fullWidth
            />
          )}
          isOptionEqualToValue={(option, value) => option === value} // Ensures correct matching
          disableClearable
        />
      </FormControl>
    );
  }
  

  return typeof firstValue === "number" ? (
    <div className="flex gap-x-2">
      <CustomTextField
        variant='outlined'
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
        placeholder={`Min ${
          column.getFacetedMinMaxValues()?.[0]
            ? `(${column.getFacetedMinMaxValues()?.[0]})`
            : ""
        }`}
      />
      <CustomTextField
        variant='outlined'
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
        placeholder={`Max ${
          column.getFacetedMinMaxValues()?.[1]
            ? `(${column.getFacetedMinMaxValues()?.[1]})`
            : ""
        }`}
      />
    </div>
  ) : (
    <CustomTextField
      variant='outlined'
      fullWidth
      sx={{ minInlineSize: 100 }}
      value={(columnFilterValue ?? "") as string}
      onChange={(e) => column.setFilterValue(e.target.value)}
      placeholder="Search..."
    />
  );
};

const KeuanganTable = () => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const [data, setData] = useState<KeuanganType[]>(() => KeuanganData); // Menggunakan KeuanganData sebagai default

  const handleAction = (rowData: KeuanganType) => {
    // Handle the action, e.g., open a modal or navigate to another page
    console.log("Perform action on:", rowData);
  };

  // Hooks
  const columns = useMemo<ColumnDef<KeuanganType, any>[]>(() => [
    columnHelper.accessor("nama", {
      cell: (info) => info.getValue(),
      header: "Nama",
    }),
    columnHelper.accessor("metodePembayaran", {
      cell: (info) => info.getValue(),
      header: "Metode Pembayaran",
    }),
    columnHelper.accessor("jumlahTagihan", {
      cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
      header: "Jumlah Tagihan",
    }),
    columnHelper.accessor("sisaTagihan", {
      cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
      header: "Sisa Tagihan",
    }),
    columnHelper.accessor("tanggalPembayaran", {
      cell: (info) => new Date(info.getValue()).toLocaleDateString("id-ID"),
      header: "Tanggal Pembayaran",
    }),
    columnHelper.accessor("status", {
      cell: (info) => info.getValue(),
      header: "Status",
    }),
    // Add Action column at the end
    columnHelper.accessor("action", {
      cell: (info) => (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <IconButton color="primary" onClick={() => handleAction(info.row.original)} // Action when the button is clicked
          >
            <IconInfoCircle /> {/* Replace IconInfoCircle with your desired icon */}
          </IconButton>
        </Box>
      ),
      header: "Action",
    }),
  ], []);
  

  const table = useReactTable({
    data,
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
    <Card
      sx={{
        marginY: "1rem",
        paddingY: "2rem",
      }}
    >
      <CardHeader
        action={
          <DebouncedInput
            value={globalFilter ?? ""}
            onChange={(value) => setGlobalFilter(String(value))}
            placeholder="Search all columns..."
          />
        }
      />
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
                            "cursor-pointer select-none": header.column.getCanSort(),
                          })}
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {header.column.getIsSorted() && (
                            {
                              asc: (
                                <ChevronRight
                                  fontSize="1.25rem"
                                  className="-rotate-90"
                                />
                              ),
                              desc: (
                                <ChevronRight
                                  fontSize="1.25rem"
                                  className="rotate-90"
                                />
                              ),
                            }[header.column.getIsSorted() as "asc" | "desc"]
                          )}
                        </div>
                        {header.column.getCanFilter() && <Filter column={header.column} table={table} />}
                        </>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          {table.getFilteredRowModel().rows.length === 0 ? (
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
    </Card>
  );
};


export default KeuanganTable;
