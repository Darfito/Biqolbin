// components/ActionButton.tsx
import React from "react";
import { useRouter } from "next/navigation";
import { KeuanganType } from "../../../type";
import { Box, IconButton } from "@mui/material";
import { IconInfoCircle } from "@tabler/icons-react";

interface ActionButtonProps {
  rowData: KeuanganType;
}

const ActionButton: React.FC<ActionButtonProps> = ({ rowData }) => {
  const router = useRouter();

  const handleAction = () => {
    router.push(`/keuangan/${rowData.id}`);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <IconButton
          color="primary"
          onClick={handleAction} // Action when the button is clicked
        >
          <IconInfoCircle />
        </IconButton>
      </Box>
    </>
  );
};

export default ActionButton;
