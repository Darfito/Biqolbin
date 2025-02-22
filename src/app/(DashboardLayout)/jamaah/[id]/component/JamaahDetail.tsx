"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  Card,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import FormDetail from "./FormDetail";
import { useRouter } from "next/navigation";

import JamaahDetailTable from "@/app/(DashboardLayout)/utilities/component/table/JamaahDetailTable";
import {
  JamaahInterface,
  PaketInterface,
} from "@/app/(DashboardLayout)/utilities/type";

interface JamaahDetailProps {
  id: string;
  paketData: PaketInterface[];
  jamaahData: JamaahInterface;
  breadcrumbLinks: { label: string; href?: string }[];
}

const JamaahDetail = ({
  jamaahData,
  breadcrumbLinks,
}: JamaahDetailProps) => {
  const router = useRouter(); // Initialize useRouter
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle edit mode
  const [currentData, setCurrentData] = useState<JamaahInterface | null>(jamaahData); // State untuk menyimpan data jamaah
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const memoizedJenisDokumen = useMemo(
    () => currentData?.jenisDokumen || [],
    [currentData]
  );
  const memoizedPernikahan = useMemo(
    () => currentData?.pernikahan,
    [currentData]
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Jangan render apa-apa sampai komponen dimuat di klien
  }

  // Toggle the isEditing state
  const handleEditClick = () => {
    if (!isEditing) {
      setIsEditing(true); // Enter edit mode
    } else {
      setOpenDialog(true); // Open the dialog
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false); // Exit edit mode
    setOpenDialog(false); // Close dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog without changes
  };

  // Function to handle the "Kembali ke Daftar" button click
  const handleBackClick = () => {
    router.push("/jamaah"); // Navigate to /keuangan page
  };

  console.log("data jamaah detail ", currentData);

  return (
    <>
      <Typography variant="h2">
        Jamaah Detail
      </Typography>
      <Breadcrumb links={breadcrumbLinks} />
      <PageContainer title="Jamaah Detail">
        <Box
          sx={{
            marginTop: 3,
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Button
              variant="contained"
              color="secondary"
              sx={{ color: "white" }}
              startIcon={<IconArrowLeft />}
              onClick={handleBackClick}
            >
              Kembali ke Daftar
            </Button>
          </Box>

          <Box>
            <Button
              variant="contained"
              sx={{ color: "white", marginRight: "1rem", minWidth: "150px" }}
              onClick={handleEditClick}
            >
              {isEditing ? "Batal Menyunting" : "Sunting"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail
            isEditing={isEditing}
            setIsEditing={setIsEditing} 
            jamaahData={currentData}
          />
        </Box>

        <Box sx={{ marginTop: "2rem", backgroundColor: "#fff" }}>
          <Card sx={{ backgroundColor: "#fff" }}>
            <JamaahDetailTable
              data={memoizedJenisDokumen}
              perkawinan={memoizedPernikahan}
            />
          </Card>
        </Box>
      </PageContainer>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="cancel-edit-dialog-title"
        aria-describedby="cancel-edit-dialog-description"
      >
        <DialogTitle id="cancel-edit-dialog-title">
          Batalkan Penyuntingan
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-edit-dialog-description">
            Apakah Anda yakin ingin membatalkan mode penyuntingan? Perubahan
            yang belum disimpan akan hilang.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            sx={{ color: "white" }}
            variant="contained"
          >
            Tidak
          </Button>
          <Button
            onClick={handleCancelEdit}
            sx={{ color: "white" }}
            variant="contained"
            autoFocus
          >
            Ya, Batalkan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JamaahDetail;
