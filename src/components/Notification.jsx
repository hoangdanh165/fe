import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Box, Typography, List, ListItem, Button, CircularProgress } from '@mui/material';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosPrivate.get('/api/v1/notifications/');
        setNotifications(response.data.slice(0, 5)); // Giới hạn 5 thông báo
      } catch (error) {
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notificationId) => {
    try {
      await axiosPrivate.patch(`/api/v1/notifications/${notificationId}/`, { is_read: true });
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification.id === notificationId
            ? { ...notification, is_read: true }
            : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100px', // Chiều cao cố định cho khung
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: 'absolute', // Đặt vị trí tuyệt đối để thông báo hiển thị dưới chuông
        top: '100%', // Đặt vị trí ngay dưới chuông
        left: 0, // Căn lề trái
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: 1, // Giảm padding
        maxHeight: '300px', // Giảm chiều cao tối đa
        overflowY: 'auto',
        width: '250px', // Đặt chiều rộng cố định
        zIndex: 10, // Đảm bảo thông báo nằm trên các thành phần khác
        backgroundColor: '#272836',
        borderColor: '#272836'
      }}
    >
      <List sx={{ padding: 0 }}> {/* Xóa padding cho danh sách */}
        {notifications.map((notification) => (
          <ListItem key={notification.id} sx={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <Typography variant="body2" sx={{ color: 'white', marginLeft: 3, marginTop: 2}}>{notification.notification.message}</Typography>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleMarkAsRead(notification.id)}
              sx={{
                marginLeft: 1,
                fontSize: '0.6rem', // Giảm kích thước chữ
                padding: '2px 4px', // Giảm padding cho nút
              }}
            >
              Mark as read
            </Button>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Notification;
