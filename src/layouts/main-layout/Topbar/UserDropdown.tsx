import {
  Avatar,
  Button,
  Tooltip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import IconifyIcon from "../../../components/base/IconifyIcon";
import { useState, MouseEvent, useCallback, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import useLogout from "../../../hooks/useLogout";
import React from "react";
import useAuth from "../../../hooks/useAuth";
import paths from "../../../routes/paths";

const UserDropdown = (): ReactElement => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);
  const logout = useLogout();
  const navigate = useNavigate();
  const { auth, setAuth } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const profile = auth?.avatar;

  const handleUserClick = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setIsOpen(false);
    localStorage.removeItem("isLoggedIn");
    setAuth(null);
    logout();
    navigate("/auth/login", { replace: true });
  }, [logout, navigate, setAuth]);

  const handleProfileClick = useCallback(() => {
    setIsOpen(false);
    navigate(paths.profile);
  }, [navigate]);
  console.log(auth?.fullName);
  return (
    <>
      <Button
        color="inherit"
        variant="text"
        id="account-dropdown-menu"
        aria-controls={menuOpen ? "account-dropdown-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? "true" : undefined}
        onClick={handleUserClick}
        disableRipple
        sx={{
          borderRadius: 2,
          gap: 3.75,
          px: { xs: 0, sm: 0.625 },
          py: 0.625,
          "&:hover": {
            bgcolor: "transparent",
          },
        }}
      >
        <Tooltip title="Thành viên" arrow placement="bottom">
          <Avatar src={profile} sx={{ width: 44, height: 44 }} />
        </Tooltip>
        <IconifyIcon
          color="common.white"
          icon="mingcute:down-fill"
          width={22.5}
          height={22.5}
          sx={(theme) => ({
            transform: menuOpen ? `rotate(180deg)` : `rotate(0deg)`,
            transition: theme.transitions.create("all", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.short,
            }),
          })}
        />
      </Button>
      {isOpen && (
        <Stack
          sx={{
            position: "absolute",
            top: "90px",
            right: 30,
            backgroundColor: "#272836",
            padding: 5,
            borderRadius: 2,
            boxShadow: 3,
            width: "300px",
          }}
        >
          <Stack
            direction="row"
            spacing={2}
            alignItems="center"
            sx={{ marginBottom: 5 }}
          >
            <Avatar
              src={auth?.avatar}
              sx={{ width: 44, height: 44, marginRight: 3 }}
            />
            <Typography
              variant="body1"
              sx={{ color: "white", fontWeight: "bold" }}
            >
              {auth?.fullName} {" "} ({auth?.role === 'coach' ? "HLV" : "Khác"})
            </Typography>
          </Stack>

          <Button
            onClick={handleProfileClick}
            fullWidth
            sx={{
              marginTop: 2,
              color: "white",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#5e5e5e",
              },
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 3,
            }}
          >
            <IconButton color="inherit">
              <AccountCircleIcon />
            </IconButton>
            <Typography sx={{ marginLeft: 1 }}>Xem Hồ Sơ</Typography>
          </Button>

          <Button
            onClick={handleLogout}
            fullWidth
            sx={{
              marginTop: 1,
              color: "white",
              backgroundColor: "transparent",
              "&:hover": {
                backgroundColor: "#5e5e5e",
              },
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
            }}
          >
            <IconButton color="inherit">
              <ExitToAppIcon />
            </IconButton>
            <Typography sx={{ marginLeft: 1 }}>Đăng Xuất</Typography>
          </Button>
        </Stack>
      )}
    </>
  );
};

export default UserDropdown;
