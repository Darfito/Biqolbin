

import { useRouter } from "next/router";
import { KeuanganType } from "../../type"; // Sesuaikan dengan tipe data yang digunakan

export const useHandleAction = () => {
  const router = useRouter();

  const handleAction = (rowData: KeuanganType) => {
    router.push(`/keuangan/${rowData.id}`);
  };

  return { handleAction };
};
