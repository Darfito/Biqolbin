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

import {
  CicilanType,
  JamaahInterface,
  KeuanganInterface,
  PaketInterface,
  StatusType,
} from "@/app/(DashboardLayout)/utilities/type";
import {
  updateStatusLunas,
} from "../../action";
import KeuanganDetailTable from "@/app/(DashboardLayout)/utilities/component/table/KeuanganDetailTable";

interface KeuanganDetailProps {
  id: number;
  paketData: PaketInterface[];
  jamaahData: JamaahInterface[];
  breadcrumbLinks: { label: string; href?: string }[];
  keuanganData: KeuanganInterface | null;
  dataCicilan: CicilanType[];
  nextCicilanKe: number;
}

const KeuanganDetail = ({
  id,
  paketData,
  jamaahData,
  breadcrumbLinks,
  keuanganData,
  dataCicilan,
  nextCicilanKe,
}: KeuanganDetailProps) => {
  const router = useRouter(); // Initialize useRouter
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle edit mode
  const [currentData, setCurrentData] = useState<KeuanganInterface | null>(
    keuanganData
  ); // State untuk menyimpan data jamaah
  // const [dataCicilan, setDataCicilan] = useState<CicilanType[]>([]);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState<boolean>(false); // State untuk dialog konfirmasi
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Jangan render apa-apa sampai komponen dimuat di klien
  }
  // Ambil data berdasarkan ID

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

  const handleLunasClick = () => {
    setOpenConfirmDialog(true); // Open confirmation dialog
  };

  // Function to update status to Lunas
  const handleConfirmLunas = async () => {
    if (currentData?.id) {
      // Memastikan currentData dan id tidak undefined
      const response = await updateStatusLunas(currentData.id); // Function to update status to Lunas
      if (response.success) {
        setCurrentData((prevState) => {
          if (!prevState) return null; // Memastikan prevState tidak null sebelum update

          return {
            ...prevState, // Mengambil data sebelumnya
            status: StatusType.LUNAS, // Mengubah status menjadi "Lunas"
          };
        });
        setOpenConfirmDialog(false); // Close the dialog after confirmation
      } else {
        console.error("Failed to update status to Lunas");
      }
    }
  };

  console.log("dataCicilan: ", dataCicilan);
  console.log("currentData di keuangan Detail: ", currentData);

  return (
    <>
      <Typography variant="h2">
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
            {currentData?.status === "Lunas" ? (
              <Button
                variant="contained"
                disabled
                sx={{
                  backgroundColor: "#008000",
                  color: "white",
                  marginRight: "1rem",
                }}
              >
                Sudah Lunas
              </Button>
            ) : (
              <Button
                variant="contained"
                sx={{
                  backgroundColor: "#008000",
                  color: "white",
                  marginRight: "1rem",
                }}
                onClick={handleLunasClick}
              >
                {currentData?.status === "Sedang Menabung"
                  ? "Tandai Lunas"
                  : "Tandai Lunas"}
              </Button>
            )}
            <Button variant="contained" disabled sx={{ color: "white" }}>
              Invoice
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail
            isEditing={isEditing}
            keuanganData={currentData}
            paketData={paketData}
            jamaahData={jamaahData}
          />
        </Box>

        <Box sx={{ marginTop: "2rem", backgroundColor: "#fff" }}>
          <KeuanganDetailTable
            data={dataCicilan}
            cicilanKe={nextCicilanKe}
            keuanganId={id}
          />
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

      {/* Confirmation Modal */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="cancel-edit-dialog-title"
        aria-describedby="cancel-edit-dialog-description"
      >
        <DialogTitle id="cancel-edit-dialog-title">
          Konfirmasi Pembayaran Lunas
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="cancel-edit-dialog-description">
            Apakah Anda yakin ingin menandai status ini sebagai Lunas?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            sx={{ color: "white" }}
            variant="contained"
          >
            Tidak
          </Button>
          <Button
            onClick={handleConfirmLunas}
            sx={{ backgroundColor: "#008000", color: "white" }}
            variant="contained"
            autoFocus
          >
            Ya, Tandai Lunas
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default KeuanganDetail;
