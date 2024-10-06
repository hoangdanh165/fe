import {
  Box,
  Link,
  Paper,
  Stack,
  Button,
  Divider,
  TextField,
  IconButton,
  Typography,
  InputAdornment,
} from '@mui/material';
import IconifyIcon from '../components/base/IconifyIcon';
import { useState, useRef, useEffect } from 'react';
import { useNavigate, Form } from 'react-router-dom';
import Image from '../components/base/Image';
import logoWithText from '/Logo-with-text.png';
import { rootPaths } from '../routes/paths';
import React from 'react';
import axios from '../services/axios';
const REGISTER_URL = '/api/v1/users/register/'

const SignUp = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errMsg, setErrMsg] = useState('');

  const userRef = useRef();
  const errRef = useRef();
  
  useEffect(() => {
      userRef.current?.focus();
  }, [])

  useEffect(() => {
      setErrMsg('');
  }, [phone, email, password])

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(JSON.stringify( {phone, email, password }));
    if (password !== confirmPassword) {
      alert("Mật khẩu và xác nhận mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axios.post(REGISTER_URL,
        JSON.stringify({ phone, email, password }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        }
    );
      if (response.ok) {
        navigate(rootPaths.homeRoot); 
      } else {
        const errorData = await response.json();
        alert(`Đăng ký thất bại: ${errorData.message}`);
      }
    } catch (err) {
        console.log(err)
        if (!err?.response) {
            setErrMsg('No Server Response');
        } else if (err.response?.status === 400) {
            setErrMsg('Missing Username or Password');
        } else if (err.response?.status === 401) {
            setErrMsg('Unauthorized');
        } else {
            setErrMsg('Login Failed');
        }
        errRef.current?.focus();
      }
    navigate(rootPaths.homeRoot);
  };

  const handleShowPassword = () => {
    setShowPassword(prev => !prev);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPassword(prev => !prev);
  };

  return (
    <>
    <Form>
    <Box component="figure" mb={5} mx="auto" textAlign="center">
        <Link href={rootPaths.homeRoot}>
          <Image src={logoWithText} alt="logo with text" height={60} />
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
            Create New Account
          </Typography>
          <Typography variant="h6" fontWeight={500} textAlign="center" color="text.primary">
            Have an account?{' '}
            <Link href="/auth/login" underline="none">
              Log In
            </Link>
          </Typography>
          <TextField
            variant="filled"
            label="Phone"
            ref={userRef}
            onChange={(e) => setPhone(e.target.value)}
            value={phone}
            type="text"
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
            label="Email"
            ref={userRef}
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="email"
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
            label="Password"
            ref={userRef}
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type={showPassword ? 'text' : 'password'}
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
                    onClick={handleShowPassword}
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
          <TextField
            variant="filled"
            label="Confirm Password"
            ref={userRef}
            onChange={(e) => setConfirmPassword(e.target.value)}
            value={confirmPassword}
            type={showConfirmPassword ? 'text' : 'password'}
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
                    onClick={handleShowConfirmPassword}
                    size="small"
                    edge="end"
                    sx={{
                      mr: 2,
                    }}
                  >
                    {showConfirmPassword ? (
                      <IconifyIcon icon="el:eye-open" color="text.secondary" />
                    ) : (
                      <IconifyIcon icon="el:eye-close" color="text.primary" />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            onClick={handleSubmit}
            sx={{
              fontWeight: 'fontWeightRegular',
            }}
          >
            Sign Up
          </Button>
          <Typography variant="body1" textAlign="center">
            By creating an account, you agree to our{' '}
            <Link href="#!" underline="none">
              Terms of Service
            </Link>
          </Typography>
          <Divider />
          
          
        </Stack>
      </Paper>
    </Form>
      
    </>
  );
};

export default SignUp;
