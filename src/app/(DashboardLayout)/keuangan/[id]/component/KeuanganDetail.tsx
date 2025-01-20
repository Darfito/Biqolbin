"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import FormDetail from "./FormDetail";
import { useRouter } from "next/navigation";

import { JamaahInterface, KeuanganInterface, PaketInterface } from "@/app/(DashboardLayout)/utilities/type";
import { getKeuanganByIdAction } from "../../action";

interface KeuanganDetailProps {
  id: number;
  paketData: PaketInterface[]
  jamaahData: JamaahInterface[]
  breadcrumbLinks: { label: string; href?: string }[];
}

const KeuanganDetail = ({ id,paketData, jamaahData, breadcrumbLinks }: KeuanganDetailProps) => {
  const router = useRouter(); // Initialize useRouter
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle edit mode
  const [currentData, setCurrentData] = useState<KeuanganInterface | null>(
    null
  ); // State untuk menyimpan data jamaah
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  // Ambil data berdasarkan ID
  useEffect(() => {
    const fetchData = async () => {
      const data = await getKeuanganByIdAction(id);
      if (data) setCurrentData(data);
    };

    fetchData();
  }, [id]);

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
    router.push("/keuangan"); // Navigate to /keuangan page
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        Detail
      </Typography>
      <Breadcrumb links={breadcrumbLinks} />
      <PageContainer title="Keuangan Detail">
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
            <Button
              variant="contained"
              disabled
              sx={{ color: "white", marginRight: "1rem" }}
            >
              Telah Lunas
            </Button>
            <Button variant="contained" disabled sx={{ color: "white" }}>
              Invoice
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail
            isEditing={isEditing}
            keuanganData={currentData} paketData={paketData} jamaahData={jamaahData}          />
        </Box>

        <Box sx={{ marginTop: "2rem", backgroundColor: "#fff" }}>
          {/* <KeuanganDetailTable data={currentData} cicilanKe={nextCicilanKe} /> */}
        </Box>
      </PageContainer>

      {/* Confirmation Modal */}
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

export default KeuanganDetail;
