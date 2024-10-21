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
  Grid,
  InputAdornment,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";


const COACH_PROFILE = "/api/v1/coach-profiles/";
const CUSTOMER_PROFILE = "/api/v1/customer-profiles/";

const UserProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [error, setError] = useState("");


  const [profile, setProfile] = useState({
    phone: '',
    avatar: '',
    avatarPreview: '',

    id: '',
    first_name: '',
    last_name: '',
    address: '',
    gender: null,
    birthday: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/users/info/");
        if (response.data.profile !== null && response.data.avatar_url !== null && response.data.phone !== null) {
          setProfile({
            avatar: response.data.avatar_url,
            phone: response.data.phone,
  
            id: response.data.profile.id,
            first_name: response.data.profile.first_name,
            last_name: response.data.profile.last_name,
            address: response.data.profile.address,
            gender: response.data.profile.gender,
            birthday: response.data.profile.birthday
              ? new Date(response.data.profile.birthday)
              : null,
            height: response.data.profile.height,
            weight: response.data.profile.weight,
          });
        }
        
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchProfile();
  }, [axiosPrivate]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleDateChange = (date) => {
    setProfile({
      ...profile,
      birthday: date,
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({
        ...profile,
        avatar: file, 
        avatarPreview: URL.createObjectURL(file), 
      });

      const reader = new FileReader();
      reader.onload = (event) => {
        setProfile((prev) => ({
          ...prev,
          avatarPreview: event.target.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); 

    if (!profile.avatar) {
      setError("Vui lòng thêm ảnh đại diện!");
      return; 
    }
    const formData = new FormData(); 

    console.log(profile.avatar);
    let phone = profile.phone;
   
    if (!profile.id) {
      if (phone.length < 9 || phone.length > 10) {
        setError("Vui lòng điền số điện thoại hợp lệ!");
        return; 
      }
  
      if (phone.length === 10 && phone.startsWith('0')) {
          phone = '+84' + phone.slice(1); 
      } else if (phone.length === 9) {
          phone = '+84' + phone; 
      } 
    }
    
    formData.append("avatar_url", profile.avatar); 
    formData.append("phone", phone);
    formData.append("first_name", profile.first_name);
    formData.append("last_name", profile.last_name);
    formData.append("address", profile.address);
    formData.append("gender", profile.gender);
    formData.append("birthday", profile.birthday.toISOString().split("T")[0]);
    formData.append("height", profile.height);
    formData.append("weight", profile.weight);

    if (!profile.id) {
      if (auth.role === "coach") {
        try {
          const response = await axiosPrivate.post(
            COACH_PROFILE,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", 
              },
            }
          );
  
          setSuccessMessage("Thêm hồ sơ thành công!");
          
          setTimeout(() => {
            window.location.reload();
          }, 500); 
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      } 
      else {
        try {
          const response = await axiosPrivate.post(
            CUSTOMER_PROFILE, {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            address: profile.address,
            gender: profile.gender,
            birthday: profile.birthday
              ? profile.birthday.toISOString().split("T")[0]
              : null,
            avatar: profile.avatar,
          });
  
          console.log("Profile updated:", response.data);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
    } else {
      if (auth.role === "coach") {
        try {
          const response = await axiosPrivate.patch(
            `${COACH_PROFILE}${profile.id}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data", 
              },
            }
          );
  
          setError("Cập nhật hồ sơ thành công!");
          
          setTimeout(() => {
            window.location.reload();
          }, 500); 
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      } 
      else {
        try {
          const response = await axiosPrivate.patch(
            `${CUSTOMER_PROFILE}${profile.id}/`,
            {
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            address: profile.address,
            gender: profile.gender,
            birthday: profile.birthday
              ? profile.birthday.toISOString().split("T")[0]
              : null,
            avatar: profile.avatar,
          });
  
          console.log("Profile updated:", response.data);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
    }
    
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Hồ sơ cá nhân
      </Typography>
      {error && <Typography color="error">{error}</Typography>} 
      <form onSubmit={handleSubmit}>
        <Box sx={{ mt: 3 }}>
          <Stack spacing={3}>
            <Stack spacing={3} alignItems="center" mb={3}>
              <Avatar
                alt="User Avatar"
                src={profile.avatarPreview || profile.avatar}
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
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ"
                  name="first_name"
                  value={profile?.first_name || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  name="last_name"
                  value={profile?.last_name || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={profile?.address || ''}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={profile.phone ? profile.phone.replace("+84", "") : ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: <InputAdornment position="end">+84</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={profile?.gender || ''}
                    onChange={handleChange}
                    name="gender"
                    required
                  >
                    <MenuItem value={0}>Nữ</MenuItem>
                    <MenuItem value={1}>Nam</MenuItem>
                    <MenuItem value={2}>Giới tính khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Ngày sinh"
                    value={profile?.birthday || null}
                    onChange={handleDateChange}
                    renderInput={(params) => (
                      <TextField fullWidth {...params} />
                    )}
                    required
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Chiều cao"
                  name="height"
                  value={profile?.height || null}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">cm</InputAdornment>, 
                  }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Cân nặng"
                  name="weight"
                  value={profile?.weight || null}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: <InputAdornment position="end">kg</InputAdornment>, 
                  }}
                />
              </Grid>
            </Grid>

            <Button variant="contained" color="primary" type="submit" 
              sx={{ marginTop: 5, width: 300, alignSelf: 'center'}}
            >
              Lưu
            </Button>
          </Stack>
        </Box>
      </form>
    </Container>
  );
};

export default UserProfile;
