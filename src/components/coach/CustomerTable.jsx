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

  const columns = [
    {
      field: "id",
      headerName: "ID",
      resizable: false,
      minWidth: 140,
    },
    {
      field: "full_name",
      headerName: "Họ Tên",
      resizable: false,
      flex: 1,
      minWidth: 200,
      renderCell: (params) => (
        <Typography variant="body1">
          {params.row.first_name} {params.row.last_name}
        </Typography>
      ),
    },
    {
      field: "address",
      headerName: "Địa chỉ",
      resizable: false,
      flex: 0.5,
      minWidth: 145,
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
        onClose={() => setOpenDrawer(false)}
        sx={{ width: 600 }}
      >
        <Box sx={{ width: 600, padding: 5 }}>
          <Typography
            variant="h6"
            gutterBottom
            sx={{ textAlign: "center", color: "primary.main" }}
          >
            Thông tin tài khoản
          </Typography>
          <Divider sx={{ margin: 3, borderColor: "primary.main" }} />
          {selectedUser && (
            <Stack
              direction="row"
              direction="column"
              alignItems="center"
              justifyContent="center"
              spacing={2}
              sx={{ mb: 7 }}
            >
              <Avatar
                src="https://placehold.co/100x100"
                sx={{ width: 100, height: 100 }}
              />
              <Typography variant="h6" gutterBottom sx={{ color: "white" }}>
                {" "}
                <strong>
                  {selectedUser.first_name} {selectedUser.last_name}
                </strong>
              </Typography>
            </Stack>
          )}

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
            <Tab label="Sessions" />
          </Tabs>

          <Box sx={{ p: 2 }}>
            {activeTab === 0 && selectedUser && (
              <>
                <Card
                  variant="outlined"
                  sx={{
                    minWidth: 275,
                    borderColor: "white",
                    minHeight: 200,
                    overflowY: "auto",
                    backgroundColor: "background.default",
                    borderRadius: 2,
                  }}
                >
                  <CardContent sx={{ padding: "20px" }}>
                    <Typography
                      variant="h6"
                      gutterBottom
                      sx={{ color: "white" }}
                    >
                      Họ Tên:{" "}
                      <strong>
                        {selectedUser.first_name} {selectedUser.last_name}
                      </strong>
                    </Typography>

                    {/* Address */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Địa chỉ:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{selectedUser.address}</strong>
                      </Typography>
                    </Box>

                    {/* Gender */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Giới tính:
                      </Typography>
                      <Typography variant="body1">
                        <strong>
                          {selectedUser.gender === 1 ? "Nam" : "Nữ"}
                        </strong>
                      </Typography>
                    </Box>

                    {/* Birthday */}
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "white" }}>
                        Ngày sinh:
                      </Typography>
                      <Typography variant="body1">
                        <strong>{selectedUser.birthday}</strong>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </>
            )}

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
                        <strong>{service.cost_per_session}</strong>
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
                        <strong>{service.start_date}</strong>
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
                        <strong>{service.session_duration}</strong>
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
                        <strong>{service.expire_date}</strong>
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
                        <strong>{service.validity_period}</strong>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}

            {activeTab === 2 &&
              selectedUser &&
              selectedUser.registered_nonptservices.map((service, index) => (
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
                        <strong>{service.start_date}</strong>
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
                        <strong>{service.expire_date}</strong>
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}

            {activeTab === 3 && (
              <Typography variant="body1">Sessions content here...</Typography>
            )}
          </Box>

          <Button
            onClick={() => setOpenDrawer(false)}
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
