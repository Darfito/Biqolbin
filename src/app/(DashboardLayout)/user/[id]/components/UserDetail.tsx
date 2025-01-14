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
  DialogTitle,
  Typography,
} from "@mui/material";
import { IconArrowLeft } from "@tabler/icons-react";
import React, { SetStateAction, useEffect, useState } from "react";
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
    }
  };

  // Function to handle the "Back to List" button click
  const handleBackClick = () => {
    router.push("/user"); // Navigate to the user list
  };

  // const handleSaveChanges = () => {
  //   setIsSaving(true);
  //   console.log("Saving data...", formData); // Log the form data being saved
  //   setTimeout(() => {
  //     setIsSaving(false);
  //     setIsEditing(false); // Exit edit mode after saving
  //     setOpenModal(false); // Close the modal after saving
  //     console.log("Data successfully saved:", formData); // Log the saved data
  //     alert("Changes saved successfully!"); // Show success message
  //   }, 1000); // Simulate async operation
  // };

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
              disabled={isEditing} // Disable button jika sedang menyunting
              startIcon={
                isEditing ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              } // Tambahkan CircularProgress jika sedang menyunting
            >
              {isEditing ? "Sedang Menyunting" : "Sunting"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail isEditing={isEditing} userData={currentData} />
        </Box>
      </PageContainer>
    </>
  );
};

export default UserDetail;
