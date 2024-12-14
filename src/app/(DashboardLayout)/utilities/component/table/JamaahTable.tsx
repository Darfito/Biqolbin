"use client";

// React Imports
import { useEffect, useState } from "react";

import CardHeader from "@mui/material/CardHeader";
import TablePagination from "@mui/material/TablePagination";
import type { TextFieldProps } from "@mui/material/TextField";


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
import TablePaginationComponent from "../pagination/TablePaginationComponent";
import CustomTextField from "../textField/TextField";
import { ChevronRight } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  FormControl,
} from "@mui/material";




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
interface JamaahTableProps<T> {
  columns: ColumnDef<T, any>[];  // Kolom dinamis yang disesuaikan dengan tipe T
  data: T[];  // Data dinamis sesuai tipe T
}




const JamaahTable = <T,>({ columns, data }: JamaahTableProps<T>) => {
  // States
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");


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
      >
        <CardHeader
        sx={{ 
          paddingTop: 0
         }}
          action={
            <DebouncedInput
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
              placeholder="Search all columns..."
            />
          }
        />
      </Box>
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
                                asc: (
                                  <ChevronRight
                                    className="-rotate-90"
                                  />
                                ),
                                desc: (
                                  <ChevronRight
                                    className="rotate-90"
                                  />
                                ),
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
    </Box>
  );
};

export default JamaahTable;
