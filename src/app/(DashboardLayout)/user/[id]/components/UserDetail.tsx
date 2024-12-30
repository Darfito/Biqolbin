"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UserProps } from "@/app/(DashboardLayout)/utilities/type";
import { userData } from "@/app/(DashboardLayout)/utilities/data";
import FormDetail from "./FormDetail";

interface UserDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const UserDetail = ({ id, breadcrumbLinks }: UserDetailProps) => {
  const router = useRouter(); // Initialize useRouter
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle edit mode
  const [openModal, setOpenModal] = useState<boolean>(false); // Modal state to confirm save
  const [isSaving, setIsSaving] = useState<boolean>(false); // State to check if saving is in progress
  const [formData, setFormData] = useState({});
  const [currentData, setCurrentData] = useState<UserProps | null>(null); // State untuk menyimpan data jamaah

  useEffect(() => {
    if (id && !currentData) {
      const foundUser = userData.find((item) => item.id === Number(id));
      setCurrentData(foundUser || null);
    }
  }, [id]); // Tambahkan dependency array yang tepat

  // Handle Submit data sebelum dialog
  const handleSubmit = (data: React.SetStateAction<{}>) => {
    setFormData(data); // Simpan data form ke state
    setOpenModal(true);
  };

  // Toggle the isEditing state
  const handleEditClick = () => {
    if (!isEditing) {
      setIsEditing(true); // Set isEditing hanya jika belum dalam mode edit
    }
  };

  // Function to handle the "Kembali ke Daftar" button click
  const handleBackClick = () => {
    router.push("/user"); // Navigate to /keuangan page
  };

  // Open the confirmation modal
  const handleOpenModal = () => {
    if (!openModal) {
      setOpenModal(true); // Hanya buka modal jika belum terbuka
    }
  };
  // Close the confirmation modal
  const handleCloseModal = () => {
    if (openModal) {
      setOpenModal(false); // Hanya tutup modal jika terbuka
    }
  };
  const handleSaveChanges = () => {
    setIsSaving(true);
    console.log("Menyimpan data...", formData); // Menampilkan data yang sedang disimpan
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false); // Disable edit mode setelah menyimpan
      setOpenModal(false); // Tutup modal setelah data disimpan
      console.log("Data berhasil disimpan:", formData); // Menampilkan data setelah disimpan
      alert("Perubahan berhasil disimpan!"); // Menampilkan pesan sukses
    }, 1000); // Simulasi operasi async
  };

  return (
    <>
      <Typography variant="h2" component="h1">
        User Detail
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
              sx={{ color: "white", marginRight: "1rem" }}
              onClick={isEditing ? handleOpenModal : handleEditClick}
            >
              {isEditing ? "Simpan Perubahan" : "Sunting Rincian"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail
            isEditing={isEditing}
            onSaveChanges={handleSubmit}
            userData={currentData}
          />
        </Box>

      </PageContainer>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Konfirmasi Simpan Perubahan</DialogTitle>
        <DialogContent>
          <Typography>
            Apakah Anda yakin ingin menyimpan perubahan ini?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            sx={{ color: "white" }}
            disabled={isSaving} // Disable the button while saving
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetail;
