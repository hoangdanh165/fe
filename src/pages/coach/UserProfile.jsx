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
  Tooltip,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFnsV3";
import { LocalizationProvider } from "@mui/x-date-pickers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useAuth from "../../hooks/useAuth";

const COACH_PROFILE = "/api/v1/coach-profiles/";
const CUSTOMER_PROFILE = "/api/v1/customer-profiles/";

const UserProfile = () => {
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const [error, setError] = useState("");

  const [profile, setProfile] = useState({
    phone: "",
    email: "",
    email_verified: "",
    avatar: "",
    avatarPreview: "",

    id: "",
    first_name: "",
    last_name: "",
    address: "",
    gender: null,
    birthday: "",

    height: null,
    weight: null,

    body_fat: null,
    musle_mass: null,

    goal_weight: null,
    goal_muscle_mass: null,
    goal_body_fat: null,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/users/info/");
        if (
          response.data.profile !== null &&
          response.data.avatar_url !== null &&
          response.data.phone !== null
        ) {
          setProfile({
            avatar: response.data.avatar_url,
            phone: response.data.phone,
            email: response.data.email,
            email_verified: response.data.email_verified,

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
            body_fat: response.data.profile.body_fat,
            musle_mass: response.data.profile.muscle_mass,

            goal_weight: response.data.profile.workout_goal?.weight,
            goal_muscle_mass: response.data.profile.workout_goal?.muscle_mass,
            goal_body_fat: response.data.profile.workout_goal?.body_fat,
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

  const handleVerifyEmail = async () => {
    const email = profile.email;
    
    try {
      const response = await axiosPrivate.post("/api/v1/users/send-verification-email/", {
        email: email,
      });
  
      if (response.status === 200) {
        alert("Email xác minh đã được gửi. Vui lòng kiểm tra hộp thư của bạn!");
      }

    } catch (error) {
      console.error("Error sending verification email:", error);
      alert("Có lỗi xảy ra trong quá trình gửi email xác minh. Vui lòng thử lại.");
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

      if (phone.length === 10 && phone.startsWith("0")) {
        phone = "+84" + phone.slice(1);
      } else if (phone.length === 9) {
        phone = "+84" + phone;
      }
    }

    formData.append("avatar_url", profile.avatar);
    formData.append("phone", profile.phone);
    formData.append("email", profile.email);
    formData.append("first_name", profile.first_name);
    formData.append("last_name", profile.last_name);
    formData.append("address", profile.address);
    formData.append("gender", profile.gender);
    formData.append("birthday", profile.birthday.toISOString().split("T")[0]);
    formData.append("height", profile.height);
    formData.append("weight", profile.weight);

    if (auth.role === "coach") {
      if (!profile.id) {
        try {
          const response = await axiosPrivate.post(COACH_PROFILE, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          alert("Thêm hồ sơ thành công!");
          setTimeout(() => {
            window.location.reload();
          }, 10);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      } else {
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

          alert("Cập nhật hồ sơ thành công!");
          setTimeout(() => {
            window.location.reload();
          }, 10);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
    } else {
      if (!profile.id) {
        formData.append("goal_weight", 55);
        formData.append("goal_muscle_mass", 15);
        formData.append("goal_body_fat", 25);

        try {
          const response = await axiosPrivate.post(CUSTOMER_PROFILE, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          console.log("Profile updated:", response.data);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      } else {
        try {
          const response = await axiosPrivate.patch(
            `${CUSTOMER_PROFILE}${profile.id}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Profile updated:", response.data);
        } catch (error) {
          console.error("Error updating profile:", error);
        }
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" sx={{ color: "white" }} gutterBottom>
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
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Họ"
                  name="first_name"
                  value={profile?.first_name || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Tên"
                  name="last_name"
                  value={profile?.last_name || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Địa chỉ"
                  name="address"
                  value={profile?.address || ""}
                  onChange={handleChange}
                  required
                />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={7}>
                <TextField
                  fullWidth
                  label="Email"
                  name="email"
                  value={profile?.email || ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <Tooltip
                          title={
                            profile?.email_verified ? (
                              <div style={{ fontSize: "1rem" }}>
                                  <span>Đã xác minh</span>
                                </div>
                            ) : (
                              <>
                                <div style={{ fontSize: "1rem" }}>
                                  <span>Hãy</span>
                                  <button
                                    style={{
                                      backgroundColor: "transparent",
                                      border: "none",
                                      color: "wheat",
                                      cursor: "pointer",
                                      padding: "0 5px",
                                      fontSize: "1.1rem",
                                      fontWeight: "bold",
                                    }}
                                    onClick={() => handleVerifyEmail()}
                                  >
                                    xác minh
                                  </button>
                                  <span>email của bạn</span>
                                </div>
                              </>
                            )
                          }
                        >
                          {profile?.email_verified ? (
                            <CheckCircleIcon color="success" />
                          ) : (
                            <CancelIcon color="error" />
                          )}
                        </Tooltip>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  fullWidth
                  label="Số điện thoại"
                  name="phone"
                  value={profile.phone ? profile.phone.replace("+84", "") : ""}
                  onChange={handleChange}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="end">+84</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3}>
              <Grid item xs={4}>
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
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <InputLabel>Giới tính</InputLabel>
                  <Select
                    value={profile?.gender ?? ""}
                    onChange={handleChange}
                    name="gender"
                    required
                    sx={{
                      marginTop: 1,
                    }}
                  >
                    <MenuItem value={0}>Nữ</MenuItem>
                    <MenuItem value={1}>Nam</MenuItem>
                    <MenuItem value={2}>Giới tính khác</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label="Chiều cao"
                  name="height"
                  value={profile?.height || null}
                  onChange={handleChange}
                  required
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">cm</InputAdornment>
                    ),
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
                    endAdornment: (
                      <InputAdornment position="end">kg</InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>

            <Button
              variant="contained"
              color="primary"
              type="submit"
              sx={{ marginTop: 5, width: 300, alignSelf: "center" }}
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
