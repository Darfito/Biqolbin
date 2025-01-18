"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import FormDetail from "./FormDetail";
import { useRouter } from "next/navigation";

import jamaahData from "../../data";
import JamaahDetailTable from "@/app/(DashboardLayout)/utilities/component/table/JamaahDetailTable";
import { JamaahInterface, PaketInterface } from "@/app/(DashboardLayout)/utilities/type";
import { createClient } from "@/libs/supabase/client";
import { getJamaahDataById } from "../../action";


interface JamaahDetailProps {
  id: string;
  paketData: PaketInterface[]
  breadcrumbLinks: { label: string; href?: string }[];
}

const JamaahDetail = ({ id,paketData, breadcrumbLinks }: JamaahDetailProps) => {
  const router = useRouter(); // Initialize useRouter
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle edit mode
  const [currentData, setCurrentData] = useState<JamaahInterface | null>(null); // State untuk menyimpan data jamaah
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  
  // Ambil data berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      const data = await getJamaahDataById(id);
      if (data) setCurrentData(data);
    };

    fetchData();
  }, [id]);

  const memoizedJenisDokumen = useMemo(() => currentData?.jenisDokumen || [], [currentData]);
  const memoizedPernikahan = useMemo(() => currentData?.pernikahan, [currentData]);

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

  console.log("data jamaah detail ",currentData);


  return (
    <>
      <Typography variant="h2" component="h1" >
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
            jamaahData={currentData} paketData={paketData}          />
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
        <DialogTitle id="cancel-edit-dialog-title">Batalkan Penyuntingan</DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-edit-dialog-description">
            Apakah Anda yakin ingin membatalkan mode penyuntingan? Perubahan yang belum disimpan akan hilang.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} sx={{ color: "white" }} variant="contained">
            Tidak
          </Button>
          <Button onClick={handleCancelEdit} sx={{ color: "white" }} variant="contained" autoFocus>
            Ya, Batalkan
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default JamaahDetail;
