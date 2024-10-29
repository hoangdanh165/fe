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
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  Stack,
  Avatar,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import NotificationService from "../services/notification";


const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(0);
  const [nextUrl, setNextUrl] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [selectedNotificationId, setSelectedNotificationId] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axiosPrivate.get("/api/v1/notifications/");
        setNotifications(response.data.results);
        setNextUrl(response.data.next);
      } catch (error) {
        console.error("Error fetching notifications:", error);
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

  const handleAcceptCustomer = async (selectedNotification) => {
    if (!selectedNotification) return;
    const confirmAccept = window.confirm("Bạn có chắc chắn muốn chấp nhận khách hàng này?");
    if (!confirmAccept) return;
    
  
    const customerContracts = selectedNotification.customer.customer_contracts_pt;
    if (customerContracts.length === 0) {
      console.error("Không có thông tin hợp đồng cho khách hàng.");
      return;
    }
  
    const contractToUpdate = customerContracts[0];
  
    try {
      const response = await axiosPrivate.patch(`/api/v1/contracts/${contractToUpdate.id}/`, {
        coach: selectedNotification.customer.coachId,
      });
      
      if (response.status === 200) {
        await NotificationService.createNotification(
          axiosPrivate,
          selectedNotification.customer.customer_user_id,
          `Dựa vào phản hồi của bạn, huấn luyện viên của bạn đã được đổi. Vui lòng kiểm tra HLV mới. 
          Nếu có vấn đề gì xảy ra, hãy liên hệ với chúng tôi để được giúp đỡ.`
        );
      }
      handleMarkAsRead(selectedNotificationId); 
      handleCloseDialog(); 
    } catch (error) {
      console.error("Lỗi khi cập nhật hợp đồng:", error);
    }
  };

  const handleViewDetail = (notification) => {
    if (notification.notification.extra_data === null) {
      handleMarkAsRead(notification.id); 
    }
    else {
      setSelectedNotification(notification.notification.extra_data);
      setSelectedNotificationId(notification.id);
      setIsDialogOpen(true);
    }
    
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedNotification(null);
    setSelectedNotificationId(null);
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
    <Box>
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
          sx={{
            color: "white",
            fontSize: "1rem",
            marginLeft: 2,
            marginBottom: 1,
          }}
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
                      color: "#bbb",
                      marginLeft: 2,
                      marginTop: 2,
                    }}
                  >
                    Đã xem
                  </Typography>
                ) : (
                  <Button
                    onClick={() => handleViewDetail(notification)}
                    sx={{
                      marginLeft: 2,
                      minWidth: "auto",
                      padding: 0,
                      backgroundColor: "transparent",
                      "&:hover": {
                        backgroundColor: "transparent",
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
      <Dialog open={isDialogOpen} onClose={handleCloseDialog} maxWidth="sm">
        <DialogTitle sx={{ textAlign: "center", color: "white", marginTop: 4 }}>
          THÔNG TIN KHÁCH HÀNG
        </DialogTitle>
        <DialogContent sx={{ color: "white", padding: 10 }}>
          {selectedNotification?.customer && (
            <Stack spacing={2}>
              <Avatar
                src={selectedNotification.customer?.avatar ?? ""}
                alt={`${selectedNotification.customer?.first_name ?? ""} ${
                  selectedNotification.customer?.last_name ?? ""
                }`}
                sx={{
                  width: 80,
                  height: 80,
                  border: "2px solid white",
                  alignSelf: "center",
                }}
              />

              <Typography variant="h6" sx={{ alignSelf: "center" }}>
                {selectedNotification.customer?.first_name ?? ""}{" "}
                {selectedNotification.customer?.last_name ?? ""}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  fontSize: "0.875rem",
                  color: "rgba(128, 128, 128, 0.8)",
                  alignSelf: "center",
                }}
              >
                {selectedNotification.customer?.email ?? "Chưa có email"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "0.875rem",
                  color: "rgba(128, 128, 128, 0.8)",
                  alignSelf: "center",
                }}
              >
                {selectedNotification.customer?.phone ?? "Chưa có SĐT"}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontSize: "0.875rem",
                  color: "rgba(128, 128, 128, 0.8)",
                  alignSelf: "center",
                }}
              >
                {selectedNotification.customer?.address ?? "Chưa có địa chỉ"}
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: "white", alignSelf: "left" }}
              >
                Thông tin cá nhân
                <span style={{ color: "white", fontStyle: "italic" }}></span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "white", marginLeft: 7 }}
              >
                Giới tính:{" "}
                <span style={{ color: "wheat" }}>
                  {selectedNotification.customer?.gender != null
                    ? `${
                        selectedNotification.customer.gender === 0
                          ? "Nữ"
                          : selectedNotification.customer.gender === 1
                          ? "Nam"
                          : "Khác"
                      }`
                    : "Chưa điền"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "white", marginLeft: 7 }}
              >
                Ngày sinh:{" "}
                <span style={{ color: "wheat" }}>
                  {selectedNotification.customer?.birthday ?? "Chưa điền"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "white", marginLeft: 7 }}
              >
                Chiều cao:{" "}
                <span style={{ color: "wheat" }}>
                  {selectedNotification.customer?.height != null
                    ? `${selectedNotification.customer.height} cm`
                    : "Chưa điền"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "white", marginLeft: 7 }}
              >
                Cân nặng:{" "}
                <span style={{ color: "wheat" }}>
                  {selectedNotification.customer?.weight != null
                    ? `${selectedNotification.customer.weight} kg`
                    : "Chưa điền"}
                </span>
              </Typography>
              <Typography
                variant="body1"
                sx={{ color: "white", marginLeft: 7 }}
              >
                Tỷ lệ mỡ:{" "}
                <span style={{ color: "wheat" }}>
                  {selectedNotification.customer?.body_fat != null
                    ? `${selectedNotification.customer.body_fat} %`
                    : "Chưa điền"}
                </span>
              </Typography>

              <Typography
                variant="h6"
                sx={{ color: "white", alignSelf: "left", marginTop: 5 }}
              >
                Thông tin gói tập
              </Typography>

              {selectedNotification.customer.customer_contracts_pt.length >
              0 ? (
                selectedNotification.customer.customer_contracts_pt.map(
                  (contract) => (
                    <Stack key={contract.id} spacing={1} sx={{ marginLeft: 7 }}>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Tên gói:{" "}
                        <span style={{ color: "wheat" }}>
                          {contract.ptservice.name}
                        </span>
                      </Typography>
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Thời hạn:{" "}
                        <span style={{ color: "wheat" }}>
                          {contract.start_date} - {contract.expire_date}
                        </span>
                      </Typography>
                      
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Đã sử dụng:{" "}
                        <span style={{ color: "wheat" }}>
                          {contract.used_sessions} / {contract.ptservice.number_of_session} buổi
                        </span>
                      </Typography>
                    </Stack>
                  )
                )
              ) : (
                <Typography
                  variant="body1"
                  sx={{ color: "white", marginLeft: 2 }}
                >
                  Không có thông tin gói tập.
                </Typography>
              )}
            </Stack>
          )}
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleCloseDialog}
            color="error"
            sx={{
              alignSelf: "center",
              width: "100px",
              height: "40px",
              margin: 4,
            }}
          >
            Đóng
          </Button>
          <Button
            onClick={() => handleAcceptCustomer(selectedNotification)}
            color="success"
            sx={{
              alignSelf: "center",
              width: "150px",
              height: "40px",
              margin: 4,
            }}
          >
            Chấp nhận
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Notification;
