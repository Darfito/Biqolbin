import ActionButton from "@/app/(DashboardLayout)/utilities/component/table/components/ActionButton";
import { JamaahProps } from "@/app/(DashboardLayout)/utilities/type";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";

const columnHelper = createColumnHelper<JamaahProps>();

export const columnsJamaah: ColumnDef<JamaahProps, any>[] = [
  // Kolom Nomor (No)
  // columnHelper.display({
  //   id: "no",
  //   header: "NO",
  //   cell: (info) => info.row.index + 1, // Index otomatis sesuai urutan data
  //   enableSorting: false,
  // }),

  // Kolom Nama
  columnHelper.accessor("nama", {
    id: "nama",
    cell: (info) => info.getValue(),
    header: "NAMA",
  }),

  // Kolom Paket
  columnHelper.accessor("jenisPaket.nama", {
    id: "jenisPaket",
    cell: (info) => info.getValue(),
    header: "PAKET",
  }),

  // Kolom No Telp
  columnHelper.accessor("noTelp", {
    id: "noTelp",
    cell: (info) => info.getValue(),
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

  // Kolom Status (Berangkat dan Selesai)
  columnHelper.accessor("status.status", {
    id: "status",
    cell: (info) => {
      const status = info.getValue();
      return status === "Berangkat" || status === "Selesai" ? status : "Dijadwalkan";
    },
    header: "Status",
  }),

  // Kolom Aksi
  columnHelper.display({
    id: "action",
    header: "ACTION",
    cell: (info) => (
      <ActionButton
        rowData={info.row.original}
        actionPath={(rowData) => `/jamaah/${rowData.id}`} // Path dinamis berdasarkan ID Jamaah
      />
    ),
    enableColumnFilter: false,
  }),
];
