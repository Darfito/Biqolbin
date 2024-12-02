import { createColumnHelper, ColumnDef } from "@tanstack/react-table";
import { CicilanType, KeuanganType } from "../../type";
import ActionButton from "./components/ActionButton";
import { Box, IconButton } from "@mui/material";
import { Delete, Edit, Folder, UploadFile } from "@mui/icons-material";


const columnHelper = createColumnHelper<KeuanganType>();

export const columnsKeuangan: ColumnDef<KeuanganType, any>[] = [
  columnHelper.accessor("nama", {
    cell: (info) => info.getValue(),
    header: "Nama",
  }),
  columnHelper.accessor("jenisPaket.nama", {
    cell: (info) => info.getValue(),
    header: "Jenis Paket",
    enableColumnFilter: true, // Explicitly enable filtering
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
      console.log('info',info.row.original),
      <ActionButton rowData={info.row.original} />
    ),
    header: "Action",
    enableColumnFilter: false,
  }),
];

const columnDetail = createColumnHelper<CicilanType>();

export const columnsKeuanganDetail: ColumnDef<CicilanType, any>[] = [
  columnDetail.accessor("cicilanKe", {
    cell: (info) => info.getValue(),
    header: "Cicilan Ke",
    enableColumnFilter: false,
  }),
  columnDetail.accessor("tanggalPembayaran", {
    cell: (info) => new Date(info.getValue()).toLocaleDateString("id-ID"),
    header: "Tanggal Bayar",
    enableColumnFilter: false,
  }),
  columnDetail.accessor("nominalCicilan", {
    cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
    header: "Nominal Cicilan",
    enableColumnFilter: false,
  }),
  columnDetail.accessor("jumlahCicilan", {
    cell: (info) => info.getValue(),
    header: "Jumlah Cicilan",
    enableColumnFilter: false,
  }),
  columnDetail.accessor("lampiran", {
    cell: (info) => (
      <IconButton
        onClick={() => {
          const fileUrl = info.getValue(); // Pastikan nilai lampiran berisi URL file
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
  columnDetail.accessor("action", {
    cell: (info) => (
    <Box sx={{ display: "flex", justifyContent: "start" }}>
      <IconButton>
        <UploadFile />
      </IconButton>
      <IconButton>
        <Edit />
      </IconButton>
      <IconButton>
        <Delete />
      </IconButton>
      
    </Box>
    ),
    header: "Action",
    enableColumnFilter: false,
  }),
]
