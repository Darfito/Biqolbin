// components/ActionButton.tsx
import React from "react";
import { useRouter } from "next/compat/router";
import { KeuanganType } from "../../../type";


interface ActionButtonProps {
  rowData: KeuanganType;
}

const ActionButton: React.FC<ActionButtonProps> = ({ rowData }) => {
  const router = useRouter();

  const handleAction = () => {
    router.push(`/keuangan/${rowData.id}`);
  };

  return <button onClick={handleAction}>View Details</button>;
};

export default ActionButton;
