"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import { Box, Button, Card, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import FormDetail from "./FormDetail";
import { useRouter } from "next/navigation";

import jamaahData from "../../data";
import { columnsJamaah } from "../../component/columns/columnsJamaah";
import { JamaahProps } from "@/app/(DashboardLayout)/utilities/type";
import JamaahDetailTable from "@/app/(DashboardLayout)/utilities/component/table/JamaahDetailTable";



interface JamaahDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const JamaahDetail = ({ id, breadcrumbLinks }: JamaahDetailProps) => {
  const router = useRouter(); // Initialize useRouter
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to toggle edit mode
  const [openModal, setOpenModal] = useState<boolean>(false); // Modal state to confirm save
  const [isSaving, setIsSaving] = useState<boolean>(false); // State to check if saving is in progress
  const [formData, setFormData] = useState({});
  const [currentData, setCurrentData] = useState<JamaahProps | null>(null); // State untuk menyimpan data jamaah

  useEffect(() => {
    if (id) {
      // Cari data jamaah berdasarkan ID
      const foundJamaah = jamaahData.find((item) => item.id === Number(id));
      setCurrentData(foundJamaah || null); // Set data ke state
    }
  }, [id]);




// Handle Submit data sebelum dialog
const handleSubmit = (data: React.SetStateAction<{}>) => {
  setFormData(data); // Simpan data form ke state
  setOpenModal(true);
};

    // Toggle the isEditing state
    const handleEditClick = () => {
      setIsEditing(!isEditing); // Toggle edit mode
    };


  // Function to handle the "Kembali ke Daftar" button click
  const handleBackClick = () => {
    router.push("/jamaah"); // Navigate to /keuangan page
  };

    // Open the confirmation modal
    const handleOpenModal = () => {
      setOpenModal(true);
    };
  
    // Close the confirmation modal
    const handleCloseModal = () => {
      setOpenModal(false);
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
      <Breadcrumb links={breadcrumbLinks} />
      <Typography variant="h2" component="h1" mb={3}>
        Detail
      </Typography>
      <PageContainer title="Keuangan Detail">
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
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
            <Button variant="contained" disabled sx={{ color: "white" }}>
              Telah Lunas
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail isEditing={isEditing} onSaveChanges={handleSubmit} jamaahData={currentData}/>
        </Box>

        <Box sx={{ marginTop: "2rem" , backgroundColor:"#fff" }}>
        <Card sx={{ backgroundColor:"#fff" }}>
        {/* <JamaahDetailTable columns={columnsJamaah} data={jamaahData} /> */}
        </Card>

        </Box>
      </PageContainer>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Konfirmasi Simpan Perubahan</DialogTitle>
        <DialogContent>
          <Typography>Apakah Anda yakin ingin menyimpan perubahan ini?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="error">
            Batal
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"sx={{ color: "white" }}
            disabled={isSaving} // Disable the button while saving
          >
            {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </DialogActions>
      </Dialog>


    </>
  );
};

export default JamaahDetail;
