"use client";

import React, { useState, FormEvent, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Stack,
  InputAdornment,
  IconButton,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { login, updatePassword } from "../login/action";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { createClient } from "@/libs/supabase/client";


interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const UpdatePassword = ({ title, subtitle, subtext }: loginType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password visibility
  const [error, setError] = useState(""); // State untuk menangani error

  const supabase = createClient();

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const token = params.get("access_token"); // Pastikan parameter yang sesuai
    const refreshToken = params.get("refresh_token");
  
    console.log("search", search);
  
    if (token && refreshToken) {
      supabase.auth.setSession({ access_token: token, refresh_token: refreshToken });
    }
  }, []);
  

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const response = await updatePassword(formData);

    if (!response.success) {
      setError(
        response.error || "Login failed. Please check your email and password."
      );
      toast.error(response.error || "Login failed. Please try again.");
    } else {
      setError(""); // Clear error if login is successful
      toast.success("Data Sudah Diperbarui!");
      window.location.href = "/authentication/login"; // Redirect to dashboard
    }
  };

  const handleClickShowPassword = () => setShowPassword(!showPassword); // Toggle function

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h3" mb={1}>
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
          <Box mt="25px">
            <Typography
              variant="subtitle1"
              fontWeight={600}
              component="label"
              htmlFor="password"
              mb="5px"
            >
              Password
            </Typography>
            <CustomTextField
              id="password"
              type={showPassword ? "text" : "password"} // Show text if password is visible
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e: {
                target: { value: React.SetStateAction<string> };
              }) => setPassword(e.target.value)}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Stack>

        {/* Menampilkan pesan error jika login gagal */}
        {error && (
          <Typography color="error" variant="body2">
            {error}
          </Typography>
        )}

        <Box
          sx={{
            my: 2,
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            sx={{ color: "white" }}
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default UpdatePassword;
