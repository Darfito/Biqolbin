'use client';

import React, { useState, FormEvent } from "react";
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
import { login } from "../login/action";
import { toast } from "react-toastify"; // Pastikan toast diinstal
import Link from "next/link";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State untuk toggle password visibility
  const [error, setError] = useState(""); // State untuk menangani error

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);
  
    const response = await login(formData);
  
    if (!response.success) {
      setError(response.error || "Login failed. Please check your email and password.");
      toast.error(response.error || "Login failed. Please try again.");
    } else {
      setError(""); // Clear error if login is successful
      toast.success("Login successful!");
      window.location.href = "/dashboard"; // Redirect to dashboard
    }
  };
  

  const handleClickShowPassword = () => setShowPassword(!showPassword); // Toggle function

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
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
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEmail(e.target.value)}
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
              onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setPassword(e.target.value)}
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
        {error && <Typography color="error" variant="body2">{error}</Typography>}

        <Box sx={{ my: 2, display: "flex", justifyContent: "center", flexDirection: "column", gap: 2 }}>
          <Button
            sx={{ color: "white" }}
            variant="contained"
            size="large"
            fullWidth
            type="submit"
          >
            Sign In
          </Button>
          <Typography
            component={Link}
            href="/authentication/forgot-password"
            fontWeight="500"
            sx={{
              textDecoration: "none",
              color: "primary.main",
            }}
            >Lupa Password?</Typography>
        </Box>
      </form>

      {subtitle}
    </>
  );
};

export default AuthLogin;


            {/* <Stack
              justifyContent="space-between"
              direction="row"
              alignItems="center"
              my={2}
            >
              <FormGroup>
                <FormControlLabel
                  control={<Checkbox defaultChecked />}
                  label="Remember this Device"
                />
              </FormGroup>
              <Typography
                component={Link}
                href="/"
                fontWeight="500"
                sx={{
                  textDecoration: "none",
                  color: "primary.main",
                }}
              >
                Forgot Password ?
              </Typography>
            </Stack> */}