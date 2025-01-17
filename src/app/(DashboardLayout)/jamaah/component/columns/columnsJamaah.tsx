import ActionButton from "@/app/(DashboardLayout)/utilities/component/table/components/ActionButton";
import { JamaahInterface } from "@/app/(DashboardLayout)/utilities/type";
import { Chip } from "@mui/material";
import { createColumnHelper, ColumnDef } from "@tanstack/react-table";

const columnHelper = createColumnHelper<JamaahInterface>();

export const columnsJamaah: ColumnDef<JamaahInterface, any>[] = [

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
  columnHelper.accessor("status", {
    id: "status",
    cell: (info) => {
      const status = info.getValue();
      let chipColor = "";
  
      switch (status) {
        case "Berangkat":
          chipColor = "lightblue"; // Biru muda
          break;
        case "Selesai":
          chipColor = "green"; // Hijau
          break;
        default:
          chipColor = "#F18B04"; // Warna khusus untuk Dijadwalkan
          break;
      }
  
      return (
        <Chip
          label={status === "Berangkat" || status === "Selesai" ? status : "Dijadwalkan"}
          sx={{
            backgroundColor: chipColor,
            color: "white", // Warna teks putih agar kontras
            fontWeight: "bold",
          }}
        />
      );
    },
    header: "Status",
  }),
  

  // Kolom Aksi
  columnHelper.display({
    id: "action",
    header: "Detail",
    cell: (info) => (
      <ActionButton
        rowData={info.row.original}
        actionPath={(rowData) => `/jamaah/${rowData.id}`} // Path dinamis berdasarkan ID Jamaah
      />
    ),
    enableColumnFilter: false,
  }),
];
