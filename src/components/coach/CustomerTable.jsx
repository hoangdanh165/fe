import { useMemo, useState } from "react";
import { useCustomerData } from "../../data/customer-data";
import IconifyIcon from "../base/IconifyIcon";
import CustomPagination from "../../components/common/CustomPagination";
import CustomNoResultsOverlay from "../../components/common/CustomNoResultsOverlay";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import {
  Stack,
  Avatar,
  Tooltip,
  Typography,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tabs,
  Tab,
  Box,
  Drawer,
  Divider,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";

import { DataGrid, GridActionsCellItem, useGridApiRef } from "@mui/x-data-grid";

const CustomerTable = ({ searchText }) => {
  const apiRef = useGridApiRef();
  const [reloadTrigger, setReloadTrigger] = useState(0);
  const { rows, loading, error } = useCustomerData(reloadTrigger);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState(0);

  const handleViewInfo = (userId) => {
    const user = rows.find((user) => user.id === userId);
    if (user) {
      setSelectedUser(user);
      setOpenDrawer(true);
    } else {
      console.error(`User with ID ${userId} not found`);
    }
  };
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  const handleCloseDrawer = () => {
    setOpenDrawer(false);
    setActiveTab(0);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      resizable: false,
      flex: 1,
      minWidth: 140,
      headerAlign: "center",
      renderCell: (params) => {
        console.log("Customer Profile in Row:", params.row.customer_profile); // Check if data is passed here
        return (
          <Typography variant="body1">
            {params.row.customer_profile
              .map((customer) => customer.id)
              .join(", ")}
          </Typography>
        );
      },
    },
    {
      field: "full_name",
      headerName: "Họ Tên",
      resizable: false,
      flex: 1,
      minWidth: 140,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <Typography variant="body1">
          {params.row.customer_profile
            .map((customer) => `${customer.first_name} ${customer.last_name}`)
            .join(", ")}
        </Typography>
      ),
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      resizable: false,
      flex: 1,
      minWidth: 200,
      headerAlign: "center",

      renderCell: (params) => (
        <Typography variant="body1">
          {params.row.customer_profile
            .map((customer) => customer.address)
            .join(", ")}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      resizable: false,
      flex: 1,
      minWidth: 80,
      getActions: (params) => {
        return [
          <Tooltip title="Xem" key={params.id}>
            <GridActionsCellItem
              icon={<IconifyIcon icon="fluent:edit-32-filled" />}
              label="Xem"
              onClick={() => handleViewInfo(params.id)} // Use params.id here
            />
          </Tooltip>,
        ];
      },
    },
  ];

  const visibleColumns = useMemo(
    () => columns.filter((column) => column.field !== "id"),
    [columns]
  );

  return (
    <>
      <DataGrid
        columns={visibleColumns}
        rows={rows}
        loading={loading}
        checkboxSelection
        disableColumnMenu
        disableRowSelectionOnClick
        initialState={{
          pagination: { paginationModel: { page: 0, pageSize: 4 } },
        }}
        slots={{
          loadingOverlay: CircularProgress,
          pagination: CustomPagination,
          noResultsOverlay: CustomNoResultsOverlay,
        }}
      />

      {/* Side Panel for Viewing User Info */}
      <Drawer
        anchor="right"
        open={openDrawer}
        onClose={handleCloseDrawer}
        sx={{ width: 650 }}
      >
        <Box sx={{ width: 650, padding: 5 }}>
          <IconButton
            onClick={handleCloseDrawer}
            sx={{
              position: "absolute",
              top: 10,
              left: 20,
              fontSize: '40px',
            }}
          >
            <IconifyIcon icon="eva:close-fill" />
          </IconButton>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            Thông tin tài khoản
          </Typography>
          <Divider sx={{ margin: 3, borderColor: "primary.main" }} />
          {selectedUser &&
            selectedUser.customer_profile.map((customer, index) => (
              <Stack
                key={customer.id || index}
                alignItems="center"
                sx={{ mb: 7 }}
              >
                <Avatar
                  src={
                    selectedUser.customer_profile.avatar ||
                    "https://placehold.co/100x100"
                  }
                  sx={{ width: 100, height: 100 }}
                />
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ color: "white", mt: 1 }}
                >
                  <strong>
                    {customer.first_name} {customer.last_name}
                  </strong>
                </Typography>
              </Stack>
            ))}

          {/* Tabs for navigation */}
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Tổng quan" />
            <Tab label="Gói PT" />
            <Tab label="Gói non-PT" />
            <Tab label="Mô tả" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {activeTab === 0 &&
              selectedUser &&
              selectedUser.customer_profile.map((customer, index) => (
                <Card
                  key={index}
                  variant="outlined"
                  sx={{
                    minWidth: 275,
                    borderColor: "white",
                    minHeight: 350,
                    backgroundColor: "background.default",
                    borderRadius: 2,
                    mb: 10,
                  }}
                >
                  <CardContent sx={{ padding: "20px" }}>
                    <Stack spacing={3}>
                      {" "}
                      {/* Stack for vertical alignment */}
                      <Typography
                        variant="h6"
                        gutterBottom
                        sx={{ color: "white" }}
                      >
                        Họ Tên:{" "}
                        <strong>
                          {customer.first_name} {customer.last_name}
                        </strong>
                      </Typography>
                      {/* Address */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Địa chỉ:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{customer.address}</strong>
                        </Typography>
                      </Box>
                      {/* Gender */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Giới tính:
                        </Typography>
                        <Typography variant="body1">
                          <strong>
                            {customer.gender === 1 ? "Nam" : "Nữ"}
                          </strong>
                        </Typography>
                      </Box>
                      {/* Birthday */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Ngày sinh:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{customer.birthday}</strong>
                        </Typography>
                      </Box>
                      {/* Height */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Chiều cao:
                        </Typography>
                        <Typography variant="body1">
                          <strong>
                            {customer.height !== null &&
                            customer.height !== undefined
                              ? `${customer.height} cm`
                              : "Chưa cập nhật"}
                          </strong>
                        </Typography>
                      </Box>
                      {/* Weight */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Cân nặng:
                        </Typography>
                        <Typography variant="body1">
                          <strong>
                            {customer.weight !== null &&
                            customer.weight !== undefined
                              ? `${customer.weight} kg`
                              : "Chưa cập nhật"}
                          </strong>
                        </Typography>
                      </Box>
                      {/* Workout Goal */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Mục tiêu tập luyện:
                        </Typography>
                        <Typography variant="body1">
                          <strong>
                            {customer.workout_goal !== null &&
                            customer.workout_goal !== undefined
                              ? customer.workout_goal
                              : "Chưa cập nhật"}
                          </strong>
                        </Typography>
                      </Box>
                      {/* Phone */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Số điện thoại:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{customer.phone}</strong>
                        </Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              ))}

            {activeTab === 1 &&
              selectedUser &&
              selectedUser.registered_ptservices.map((service, index) => (
                <Card
                  key={index} // Unique key for each card
                  variant="outlined"
                  sx={{
                    minWidth: 275,
                    borderColor: "white",
                    minHeight: 350,
                    backgroundColor: "background.default",
                    borderRadius: 2,
                    mb: 10,
                    mt: 10,
                  }}
                >
                  <CardContent sx={{ padding: "20px" }}>
                    <Typography
                      variant="h5"
                      component="div"
                      sx={{ color: "white" }}
                    >
                      {service.name}
                    </Typography>
                    <Divider sx={{ borderColor: "white" }} />
                    {/* Service Name */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Tên gói:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{service.name}</strong>
                      </Typography>
                    </Box>

                    {/* Service Cost */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Giá gói:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{service.cost_per_session}$</strong>
                      </Typography>
                    </Box>

                    {/* Start Date */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Ngày bắt đầu:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{selectedUser.start_date}</strong>
                      </Typography>
                    </Box>

                    {/* Number of Sessions */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Số buổi:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{service.number_of_session}</strong>
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Số buổi còn lại:
                      </Typography>
                      <Typography variant="body1">
                        <strong>
                          {service.number_of_session -
                            selectedUser.used_sessions}
                        </strong>
                      </Typography>
                    </Box>

                    {/* Session Duration */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Thời gian mỗi buổi:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{service.session_duration}p</strong>
                      </Typography>
                    </Box>

                    {/* Expire Date */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Ngày hết hạn:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{selectedUser.expire_date}</strong>
                      </Typography>
                    </Box>

                    {/* Validity Period */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Thời hạn gói:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{service.validity_period} ngày</strong>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}

            {activeTab === 2 &&
            selectedUser &&
            selectedUser.registered_nonptservices.length > 0
              ? selectedUser.registered_nonptservices.map((service, index) => (
                  <Card
                    key={index}
                    variant="outlined"
                    sx={{
                      minWidth: 275,
                      borderColor: "white",
                      minHeight: 350,
                      backgroundColor: "background.default",
                      borderRadius: 2,
                      mb: 10,
                      mt: 10,
                    }}
                  >
                    <CardContent sx={{ padding: "20px" }}>
                      <Typography
                        variant="h5"
                        component="div"
                        sx={{ color: "white" }}
                      >
                        {service.name}
                      </Typography>
                      <Divider sx={{ borderColor: "white" }} />

                      {/* Service Name */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Tên gói:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{service.name}</strong>
                        </Typography>
                      </Box>

                      {/* Service Cost per Month */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Giá theo tháng:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{service.cost_per_month}</strong>
                        </Typography>
                      </Box>

                      {/* Start Date */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Ngày bắt đầu:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{selectedUser.start_date}</strong>
                        </Typography>
                      </Box>

                      {/* Number of Months */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Số tháng:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{service.number_of_month}</strong>
                        </Typography>
                      </Box>

                      {/* Expire Date */}
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          mb: 1,
                        }}
                      >
                        <Typography variant="body1" sx={{ color: "white" }}>
                          Ngày hết hạn:
                        </Typography>
                        <Typography variant="body1">
                          <strong>{selectedUser.expire_date}</strong>
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))
              : activeTab === 2 && <Typography>Không có dữ liệu</Typography>}

            {activeTab === 3 && (
              <Typography variant="body1">Thêm nội dung mô tả...</Typography>
            )}
          </Box>

          <Button
            onClick={handleCloseDrawer}
            color="error"
            variant="contained"
            sx={{ mt: 2 }}
          >
            Đóng
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default CustomerTable;
