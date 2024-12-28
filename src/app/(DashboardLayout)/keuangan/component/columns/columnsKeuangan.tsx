import ActionButton from "@/app/(DashboardLayout)/utilities/component/table/components/ActionButton";
import { KeuanganProps } from "@/app/(DashboardLayout)/utilities/type";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";


const columnHelper = createColumnHelper<KeuanganProps>();

export const columnsKeuangan: ColumnDef<KeuanganProps, any>[] = [
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
  columnHelper.accessor("totalTagihan", {
    cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
    header: "Total Tagihan",
  }),
  columnHelper.accessor("sisaTagihan", {
    cell: (info) => `Rp ${info.getValue().toLocaleString()}`,
    header: "Sisa Tagihan",
  }),
  columnHelper.accessor("tenggatPembayaran", {
    cell: (info) => new Date(info.getValue()).toLocaleDateString("id-ID"),
    header: "Tenggat Pembayaran",
  }),
  columnHelper.accessor("status", {
    cell: (info) => info.getValue(),
    header: "Status",
  }),
  columnHelper.accessor("action", {
    cell: (info) => (
      <ActionButton
        rowData={info.row.original}
        actionPath={(rowData) => `/keuangan/${rowData.id}`} // Path dinamis berdasarkan ID Jamaah
      />
    ),
    header: "Detail",
    enableColumnFilter: false,
  }),
];
