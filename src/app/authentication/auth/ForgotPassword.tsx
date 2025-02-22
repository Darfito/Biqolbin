"use client";

import React, { useState, FormEvent } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
} from "@mui/material";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { forgotPassword, login } from "../login/action";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[] | string;
  subtext?: JSX.Element | JSX.Element[];
}

const ForgotPassword = ({ title, subtitle, subtext }: loginType) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // State untuk menangani error

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", email);

    const response = await forgotPassword(formData);

    console.log("Response data:", response);
    if (response.success) {
      toast.success(`Email berhasil dikirim ke ${email}`);
    }
    if (!response.success) {
      setError(
        response.error || "Login failed. Please check your email."
      );
      toast.error(response.error || "Login failed. Please try again.");
    } 
  };

  return (
    <>

      {title ? (
        <Typography fontWeight="700" variant="body1" mb={1} textAlign="center">
          {title}
        </Typography>
      ) : null}

      {subtext}

      <form onSubmit={handleSubmit}>
        <Stack>
          <Box>
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="email"
              mb="5px"
            >
              Email
            </Typography>
            <CustomTextField
              id="email"
              type="email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setEmail(e.target.value)}
              required
            />
          </Box>
        </Stack>

        {/* Menampilkan pesan error jika login gagal */}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box sx={{ my: 2 }}>
          <Button
            sx={{ color: "white" }}
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Kirim
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default ForgotPassword;
