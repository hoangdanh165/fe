import {
    Box,
    Paper,
    Stack,
    Button,
    TextField,
    Typography,
    Link
  } from '@mui/material';
  import { useState, useRef } from 'react';
  import axios from '../services/axios';
  import paths from '../routes/paths';
  import { useNavigate } from 'react-router-dom';
  import logo from '/kienos-logo1.png';
  import { rootPaths } from '../routes/paths';
  import Image from '../components/base/Image';
  
  const FORGOT_PASSWORD_URL = '/api/v1/users/forgot-password/';
  
  const ForgotPassword = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [errors, setErrors] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(false); // Thêm trạng thái mới
    const errRef = useRef();
  
    const validateEmail = (email) => {
      const gmailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return gmailRegex.test(email);
    };
  
    const handleEmailChange = (e) => {
      const email = e.target.value;
      setEmail(email);
  
      if (!validateEmail(email)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: 'Email không đúng định dạng!',
        }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors; 
          return rest;
        });
      }
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      let newErrors = {};
  
      if (!email) {
        newErrors.email = 'Email không được để trống!';
      }
  
      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
  
      try {
        const response = await axios.post(FORGOT_PASSWORD_URL,
          JSON.stringify({ email }),
          {
            headers: { 'Content-Type': 'application/json' },
          }
        );
  
        setSuccessMsg('Email xác nhận đã được gửi, hãy kiểm tra hộp thư!');
        setEmail('');
        setErrMsg('');
        setIsSubmitted(true); 
  
      } catch (err) {
        if (!err?.response) {
          setErrMsg('Không có phản hồi từ máy chủ!');
        } else if (err.response?.status === 404) {
          setErrMsg('Người dùng này không tồn tại trong hệ thống!');
        } else {
          setErrMsg('Lỗi bất định!');
        }
        errRef.current.focus();
      }
    };
  
    return (
      <Box component="form" onSubmit={handleSubmit}>
        <Box component="figure" mb={5} mx="auto" textAlign="center">
          <Link href={rootPaths.homeRoot}>
            <Image src={logo} alt="kienos-logo" height={150} />
          </Link>          
          <Typography sx={{ fontSize: '1rem' }} textAlign="center" color="text.secondary">
            Điền email để đặt lại mật khẩu
          </Typography>
        </Box>
  
        <Paper
          sx={{
            py: 6,
            px: { xs: 5, sm: 7.5 },
            maxWidth: 500,
            mx: "auto"
          }}
        >
          <Stack justifyContent="center" gap={5}>
            {isSubmitted ? ( 
              <Typography color="success.main" textAlign="center" maxWidth={500}>
                Email xác nhận đã được gửi, vui lòng kiểm tra hộp thư của bạn!<br />
                Kiểm tra hộp thư Spam nếu không thấy email.
              </Typography>
            ) : (
              <>
                {errMsg && (
                  <Typography ref={errRef} color="error" aria-live="assertive">
                    {errMsg}
                  </Typography>
                )}
  
                {successMsg && (
                  <Typography color="success.main" textAlign="center">
                    {successMsg}
                  </Typography>
                )}
  
                <TextField
                  variant="filled"
                  label="Email"
                  onChange={handleEmailChange}
                  value={email}
                  type="email"
                  error={!!errors.email}
                  helperText={errors.email}
                  fullWidth
                  sx={{
                    '.MuiFilledInput-root': {
                      bgcolor: 'grey.A100',
                      ':hover': {
                        bgcolor: 'background.default',
                      },
                      ':focus': {
                        bgcolor: 'background.default',
                      },
                      ':focus-within': {
                        bgcolor: 'background.default',
                      },
                    },
                    borderRadius: 2,
                  }}
                />
  
                <Button
                  type="submit"
                  variant="contained"
                  size='small'
                  sx={{
                    fontWeight: 'fontWeightRegular',
                    py: 1.5
                  }}
                >
                  Tạo link xác nhận
                </Button>
  
                <Typography textAlign="center" variant="body2">
                  <Link href={paths.login} underline="none">
                    Quay lại đăng nhập
                  </Link>
                </Typography>
              </>
            )}
          </Stack>
        </Paper>
      </Box>
    );
  };
  
  export default ForgotPassword;
  