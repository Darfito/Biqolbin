import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { UserProps } from "../../utilities/type";
import ActionButton from "../../utilities/component/table/components/ActionButton";

const columnHelper = createColumnHelper<UserProps>();

export const columnsUser: ColumnDef<UserProps, any>[] = [
    columnHelper.accessor("nama", {
      id: "nama",
      cell: (info) => info.getValue(),
      header: "Nama",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("jenisKelamin", {
      id: "jenisKelamin",
      cell: (info) => info.getValue(),
      header: "Jenis Kelamin",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("noTelp", {
      id: "noTelp",
      cell: (info) => info.getValue(),
      header: "Nomor Telepon",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("role", {
      id: "role",
      cell: (info) => info.getValue(),
      header: "Jabatan",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("penempatan", {
      id: "penempatan",
      cell: (info) => info.getValue(),
      header: "Penempatan",
      enableColumnFilter: true,
    }),
    columnHelper.accessor("action", {
      cell: (info) => (
        <ActionButton
          rowData={info.row.original}
          actionPath={(rowData) => `/user/${rowData.id}`} // Path dinamis berdasarkan ID Jamaah
        />
      ),
      header: "Detail",
      enableColumnFilter: false,
    }),
  ];
