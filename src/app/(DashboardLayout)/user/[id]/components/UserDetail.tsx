"use client";

import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Breadcrumb from "@/app/(DashboardLayout)/utilities/component/breadcrumb/Breadcrumb";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/libs/supabase/client";
import FormDetail from "./FormDetail";
import { UserInterface } from "@/app/(DashboardLayout)/utilities/type";

interface UserDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const UserDetail = ({ id, breadcrumbLinks }: UserDetailProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [currentData, setCurrentData] = useState<UserInterface | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const supabase = createClient();

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (id && !currentData) {
        try {
          const { data, error } = await supabase
            .from("User")
            .select("*") // Get all necessary fields, not just 'id'
            .eq("id", id)
            .single(); // To get only one user based on the id

          if (error) {
            console.error("Error fetching user:", error);
          } else {
            setCurrentData(data); // Set fetched user data
          }
        } catch (err) {
          console.error("Error fetching data:", err);
        }
      }
    };

    fetchUserData();
  }, [id, currentData, supabase]);

  // Toggle the isEditing state
  const handleEditClick = () => {
    if (!isEditing) {
      setIsEditing(true); // Enter edit mode
    } else {
      setOpenDialog(true); // Open the dialog
    }
  };

   // Handle dialog actions
   const handleCancelEdit = () => {
    setIsEditing(false); // Exit edit mode
    setOpenDialog(false); // Close dialog
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); // Close dialog without changes
  };

  // Function to handle the "Back to List" button click
  const handleBackClick = () => {
    router.push("/user"); // Navigate to the user list
  };
  
  return (
    <>
      <Typography variant="h2" component="h1">
        User Detail
      </Typography>
      <Breadcrumb links={breadcrumbLinks} />
      <PageContainer title="User Detail">
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
          <FormDetail isEditing={isEditing} userData={currentData} />
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

export default UserDetail;
