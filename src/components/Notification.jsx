import React, { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import {
  Box,
  Typography,
  List,
  ListItem,
  Button,
  Tabs,
  Tab,
  Tooltip,
} from "@mui/material";
import { Visibility } from "@mui/icons-material"; 


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(0); 
  const [nextUrl, setNextUrl] = useState(null); 
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/notifications/");
        setNotifications(response.data.results);
        setNextUrl(response.data.next);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosPrivate.patch(`/api/v1/notifications/${notificationId}/`, {
        is_read: true,
      });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleLoadMore = async () => {
    if (nextUrl) {
      try {
        const response = await axiosPrivate.get(nextUrl);

        if (tab === 1) {
          const newNotifications = response.data.results.filter(
            (notification) => !notification.is_read
          );
          setNotifications((prev) => [...prev, ...newNotifications]); 
        } else {
          setNotifications((prev) => [...prev, ...response.data.results]); 
        }

        setNextUrl(response.data.next); 
      } catch (error) {
        console.error("Error loading more notifications:", error);
      }
    }
  };

  const handleTabChange = (event, newValue) => {
    setTab(newValue); 
  };

  const filteredNotifications =
    tab === 1
      ? notifications.filter((notification) => !notification.is_read)
      : notifications;

  const timeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 31536000); 
    if (interval >= 1) return `${interval} năm trước`;

    interval = Math.floor(seconds / 2592000); 
    if (interval >= 1) return `${interval} tháng trước`;

    interval = Math.floor(seconds / 86400); 
    if (interval >= 1) return `${interval} ngày trước`;

    interval = Math.floor(seconds / 3600); 
    if (interval >= 1) return `${interval} giờ trước`;

    interval = Math.floor(seconds / 60); 
    if (interval >= 1) return `${interval} phút trước`;

    return `${seconds} giây trước`; 
  };

  return (
    <Box
      sx={{
        position: "absolute", 
        top: "100%", 
        left: 0, 
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: 1, 
        maxHeight: "400px", 
        overflowY: "auto",
        width: "300px",
        zIndex: 10, 
        backgroundColor: "#272836",
        borderColor: "#272836",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          textAlign: "left",
          marginLeft: 3,
          marginTop: 1,
          fontWeight: "bold",
        }}
      >
        Thông báo
      </Typography>

      <Tabs value={tab} onChange={handleTabChange} sx={{ marginBottom: 2 }}>
        <Tab label="Tất cả" sx={{ color: "#fff", textTransform: "none" }} />
        <Tab label="Chưa đọc" sx={{ color: "#fff", textTransform: "none" }} />
      </Tabs>

      <Typography
        variant="body2"
        sx={{ color: "white", fontSize: "1rem", marginLeft: 2, marginBottom: 1 }}
      >
        Trước đó
      </Typography>

      <List sx={{ padding: 0 }}>
        {" "}
        {filteredNotifications.map((notification) => (
          <ListItem
            key={notification.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              padding: "4px 0",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                marginRight: 1,
                marginLeft: 1,
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  maxWidth: "230px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                <Tooltip title={notification.notification.message} arrow>
                  <Typography
                    variant="body2"
                    sx={{
                      color: notification.is_read ? "#bbb" : "#fff", 
                      marginLeft: 3,
                      marginTop: 2,
                      whiteSpace: "normal",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {notification.notification.message}
                  </Typography>
                </Tooltip>
                
                <Typography
                  variant="body2"
                  sx={{ color: "#bbb", marginLeft: 3, marginTop: 1 }}
                >
                  {timeAgo(notification.create_date)}
                </Typography>
              </Box>
              {notification.is_read ? (
              <Typography 
                variant="body2" 
                sx={{ 
                  color: '#bbb', 
                  marginLeft: 2, 
                  marginTop: 2 
                }}
              >
                Đã xem
              </Typography>
              ) : (
              <Button
                onClick={() => handleMarkAsRead(notification.id)} 
                sx={{
                  marginLeft: 2,
                  minWidth: "auto", 
                  padding: 0,
                  backgroundColor: 'transparent',
                  '&:hover': {
                    backgroundColor: 'transparent',
                  },
                }}
              >
                <Visibility sx={{ color: "#fff" }} />
              </Button>
              )}
            </Box>
          </ListItem>
        ))}
      </List>

      {nextUrl && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
          <Button
            variant="contained"
            onClick={handleLoadMore}
            fullWidth
            sx={{
              color: "#fff",
              backgroundColor: "#4a4a65",
              textTransform: "none",
              fontSize: "0.8rem",
              marginTop: 2,
            }}
          >
            Xem các thông báo trước đó
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default Notification;
