

import { useRouter } from "next/router";
import { KeuanganInterface } from "../../type"; // Sesuaikan dengan tipe data yang digunakan

export const useHandleAction = () => {
  const router = useRouter();

  const handleAction = (rowData: KeuanganInterface) => {
    router.push(`/keuangan/${rowData.id}`);
  };

  return { handleAction };
};


