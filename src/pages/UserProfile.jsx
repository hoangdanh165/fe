import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Typography,
  Container,
  Box,
  Stack,
  Avatar,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import axios from "axios";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const UserProfile = () => {
  const axiosPrivate = useAxiosPrivate();

  // Initialize profile state
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    gender: "",
    birthday: null,
    avatar: "",
  });

  // Fetch user profile data when the component mounts
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get(
          "/api/v1/users/info"
        );
        console.log(response.data);
        setProfile({
          firstName: response.data.first_name,
          lastName: response.data.last_name,
          phone: response.data.phone,
          address: response.data.address,
          gender: response.data.gender,
          birthday: response.data.birthday
            ? new Date(response.data.birthday)
            : null,
          // avatar: response.data.avatar, 
        });
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [axiosPrivate]);

  // Function to handle form changes
  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  // Function to handle gender change
  const handleGenderChange = (e) => {
    setProfile({
      ...profile,
      gender: e.target.value,
    });
  };

  // Function to handle birthday change
  const handleDateChange = (date) => {
    setProfile({
      ...profile,
      birthday: date,
    });
  };

  // Function to handle avatar upload and preview
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile({
          ...profile,
          avatar: event.target.result, // Save the base64 image data
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to update the profile data
      const response = await axiosPrivate.put("/api/v1/customer-profiles", {
        first_name: profile.firstName,
        last_name: profile.lastName,
        phone: profile.phone,
        address: profile.address,
        gender: profile.gender,
        birthday: profile.birthday
          ? profile.birthday.toISOString().split("T")[0]
          : null, // Format the date as YYYY-MM-DD
        avatar: profile.avatar, // This should be handled in the backend as base64 or a file upload
      });

      console.log("Profile updated:", response.data);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Profile Management
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 3 }}>
          <Stack spacing={3}>
            {/* Avatar Section */}
            <Stack spacing={3} alignItems="center" mb={3}>
              <Avatar
                alt="User Avatar"
                src={profile.avatar}
                sx={{ width: 120, height: 120 }}
              />
              <label htmlFor="avatar-upload">
                <input
                  accept="image/*"
                  id="avatar-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleAvatarChange}
                />
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="span"
                >
                  <PhotoCamera />
                </IconButton>
              </label>
            </Stack>

            {/* First Name */}
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              required
            />

            {/* Last Name */}
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              required
            />

            {/* Phone */}
            <TextField
              fullWidth
              label="Phone"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              required
            />

            {/* Address */}
            <TextField
              fullWidth
              label="Address"
              name="address"
              value={profile.address}
              onChange={handleChange}
              required
            />

            {/* Gender */}
            <FormControl fullWidth>
              <InputLabel>Gender</InputLabel>
              <Select
                value={profile.gender}
                onChange={handleGenderChange}
                name="gender"
                required
              >
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="other">Other</MenuItem>
              </Select>
            </FormControl>

            {/* Birthday */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Birthday"
                value={profile.birthday}
                onChange={handleDateChange}
                renderInput={(params) => <TextField fullWidth {...params} />}
                required
              />
            </LocalizationProvider>

            {/* Save Button */}
            <Button variant="contained" color="primary" type="submit" fullWidth>
              Save Profile
            </Button>
          </Stack>
        </Box>
      </form>
    </Container>
  );
};

export default UserProfile;
