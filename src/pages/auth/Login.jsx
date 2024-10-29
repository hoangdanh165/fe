import {
  Box,
  Link,
  Paper,
  Stack,
  Button,
  Divider,
  Checkbox,
  FormGroup,
  TextField,
  Typography,
  FormControlLabel,
  InputAdornment,
  IconButton,

} from '@mui/material';
import IconifyIcon from '../../components/base/IconifyIcon';
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, Form } from 'react-router-dom';
import { rootPaths } from '../../routes/paths';
import Image from '../../components/base/Image';
import logo from '/kienos-logo1.png'
import React from 'react';
import axios from '../../services/axios';
import useAuth from '../../hooks/useAuth';
const LOGIN_URL = 'api/v1/users/log-in/'
import paths from '../../routes/paths';

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const { setAuth, persist, setPersist } = useAuth();

  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  
  const userRef = useRef();
  const errRef = useRef();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');
  const [errors, setErrors] = useState({});


  useEffect(() => {
      userRef.current.focus();
  }, [])

  useEffect(() => {
      setErrMsg('');
  }, [email, password])

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

      if (!password) {
        newErrors.password = 'Mật khẩu không được để trống!';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return; 
      }
      try {
        const response = await axios.post(LOGIN_URL,
            JSON.stringify({ email, password }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            }
        );
        
        const accessToken = response?.data?.accessToken;
        const role = response?.data?.role;
        const status = response?.data?.status;
        const avatar = response?.data?.avatar;

        setAuth({ email, role, status, accessToken, avatar });

        setEmail('');
        setPassword('');
        
        if (role === 'admin') {
          navigate(paths.accounts); 
        } else if (role === 'coach') {
          navigate(paths.profile);  
        } else if (role === 'sale') {
          navigate(paths.profile);  
        } 
        else {
          navigate(from, { replace: true });
        }
        
    } catch (err) {
      console.log(err);
      if (!err?.response) {
        setErrMsg("Không có phản hồi từ máy chủ!");
      } else if (err.response?.status === 400) {
        setErrMsg("Vui lòng điền email và mật khẩu!");
      } else if (err.response?.status === 401) {
        setErrMsg("Tài khoản hoặc mật khẩu không đúng!");
        console.log("401 Error: ", err.response); // Log the exact 401 error

      } else {
        setErrMsg("Đăng nhập thất bại!");
      }
      errRef.current.focus();
    }
  };

  const handleClickShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  const togglePersist = () => {
    setPersist(prev => !prev);
  }

  useEffect(() => {
    localStorage.setItem("persist", persist);
  }, [persist]);

  return (
    <>
      <Form>
        <Box component="figure" mb={5} mx="auto" textAlign="center">
          <Link href={import.meta.env.VITE_HOMEPAGE_URL}>
            <Image src={logo} alt="kienos-logo" height={160} />
          </Link>
        </Box>
        <Paper
          sx={{
            py: 6,
            px: { xs: 5, sm: 7.5 },
          }}
        >
          <Stack justifyContent="center" gap={5}>
            <Typography variant="h3" textAlign="center" color="text.secondary">
              Đăng nhập
            </Typography>
            <Typography
              variant="h6"
              fontWeight={500}
              textAlign="center"
              color="text.primary"
            >
              Chưa có tài khoản?{" "}
              <Link href="/auth/sign-up" underline="none">
                Đăng ký
              </Link>
            </Typography>
            <p
              ref={errRef}
              className={errMsg ? "errmsg" : "offscreen"}
              aria-live="assertive"
            >
              {errMsg}
            </p>

          <TextField
            variant="filled"
            ref={userRef}
            onChange={handleEmailChange}
            value={email}
            label="Email"
            type="email"
            error={!!errors.email} 
            helperText={errors.email} 
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
          <TextField
            variant="filled"
            label="Mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? 'text' : 'password'}
            error={!!errors.password} 
            helperText={errors.password} 
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
          
          InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    size="small"
                    edge="end"
                    sx={{
                      mr: 2,
                    }}
                  >
                    {showPassword ? (
                      <IconifyIcon icon="el:eye-open" color="text.secondary" />
                    ) : (
                      <IconifyIcon icon="el:eye-close" color="text.primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            />
            <FormGroup sx={{ ml: 1, width: "fit-content" }}>
              <FormControlLabel
                control={
                  <Checkbox checked={persist} onChange={togglePersist} />
                }
                label="Ghi nhớ đăng nhập"
                sx={{
                  color: "text.secondary",
                }}
              />
            </FormGroup>
            <Button
              onClick={handleSubmit}
              sx={{
                fontWeight: "fontWeightRegular",
              }}
            >
              Đăng nhập
            </Button>
            <Link
              href={paths.forgot_password}
              textAlign="center"
              underline="none"
              sx={{ color: "text.secondary", mt: 2 }}
            >
              Quên mật khẩu?
            </Link>
            <Divider />
          </Stack>
        </Paper>
      </Form>
    </>
  );
};

export default Login;