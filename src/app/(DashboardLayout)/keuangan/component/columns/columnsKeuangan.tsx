import ActionButton from "@/app/(DashboardLayout)/utilities/component/table/components/ActionButton";
import { KeuanganType } from "@/app/(DashboardLayout)/utilities/type";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";


const columnHelper = createColumnHelper<KeuanganType>();

export const columnsKeuangan: ColumnDef<KeuanganType, any>[] = [
  columnHelper.accessor("nama", {
    cell: (info) => info.getValue(),
    header: "Nama",
  }),
  columnHelper.accessor("jenisPaket.nama", {
    cell: (info) => info.getValue(),
    header: "Jenis Paket",
    enableColumnFilter: true,
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
  columnHelper.accessor("action", {
    cell: (info) => <ActionButton rowData={info.row.original} />,
    header: "Action",
    enableColumnFilter: false,
  }),
];
