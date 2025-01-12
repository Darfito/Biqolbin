

import { useRouter } from "next/router";
import { KeuanganProps } from "../../type"; // Sesuaikan dengan tipe data yang digunakan

export const useHandleAction = () => {
  const router = useRouter();

  const handleAction = (rowData: KeuanganProps) => {
    router.push(`/keuangan/${rowData.id}`);
  };

  return { handleAction };
};


