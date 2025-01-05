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
import React, { SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { UserProps } from "@/app/(DashboardLayout)/utilities/type";
import { createClient } from "@/libs/supabase/client";
import FormDetail from "./FormDetail";

interface UserDetailProps {
  id: string;
  breadcrumbLinks: { label: string; href?: string }[];
}

const UserDetail = ({ id, breadcrumbLinks }: UserDetailProps) => {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [formData, setFormData] = useState({});
  const [currentData, setCurrentData] = useState<UserProps | null>(null);
  
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

  // Handle Submit data before dialog
  const handleSubmit = (data: SetStateAction<{}>) => {
    setFormData(data); // Save form data to state
    setOpenModal(true); // Open the modal for confirmation
  };

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

  // Open the confirmation modal
  const handleOpenModal = () => {
    if (!openModal) {
      setOpenModal(true); // Only open the modal if it's not already open
    }
  };

  // Close the confirmation modal
  const handleCloseModal = () => {
    if (openModal) {
      setOpenModal(false); // Close the modal if it's open
    }
  };

  const handleSaveChanges = () => {
    setIsSaving(true);
    console.log("Saving data...", formData); // Log the form data being saved
    setTimeout(() => {
      setIsSaving(false);
      setIsEditing(false); // Exit edit mode after saving
      setOpenModal(false); // Close the modal after saving
      console.log("Data successfully saved:", formData); // Log the saved data
      alert("Changes saved successfully!"); // Show success message
    }, 1000); // Simulate async operation
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
              Back to List
            </Button>
          </Box>

          <Box>
            <Button
              variant="contained"
              sx={{ color: "white", marginRight: "1rem" }}
              onClick={isEditing ? handleOpenModal : handleEditClick}
            >
              {isEditing ? "Save Changes" : "Edit Details"}
            </Button>
          </Box>
        </Box>

        <Box sx={{ marginTop: "2rem" }}>
          <FormDetail
            isEditing={isEditing}
            onSaveChanges={handleSubmit}
            userData={currentData} // Pass the fetched user data
          />
        </Box>
      </PageContainer>

      {/* Confirmation Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Confirm Save Changes</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to save these changes?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} variant="contained" color="error">
            Cancel
          </Button>
          <Button
            onClick={handleSaveChanges}
            variant="contained"
            sx={{ color: "white" }}
            disabled={isSaving} // Disable the button while saving
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default UserDetail;
